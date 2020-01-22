import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  StatusBar,
  ImageBackground,
  FlatList,
  Image,
  BackHandler,
  Alert,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

const config = require('../config.json');
import GameCard from './GameCard';
import PointBall from './PointBall';
import axios from 'axios';

import io from 'socket.io-client';

const images = {
  water: require('../assets/water.png'),
  fire: require('../assets/fire.png'),
  earth: require('../assets/earth.png'),
};

const TIME_DURATION = 10;
const DOT_OFFSET = 17;

const TYPE_OFFSETS = {
  fire: 2,
  water: 36,
  earth: 70,
};

const GAME_STATES = {
  QUEUE: 0,
  GAME: 1,
  FINISH: 2,
};

export default class Game extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      gameState: GAME_STATES.QUEUE,
      queueEntered: false,
      cards: [],
      opponent: 'guestuser18574',
      opponentCard: {},
      opponentCardState: 'empty',
      playedCard: {},
      playerCardState: 'empty',
      playerPoints: [[], [], []],
      opponentPoints: [[], [], []],
      winnerBallV: new Animated.Value(170),
      isWinner: false,
      winnerType: 'fire',
      winnerColor: 'red',
      isAnimation: false,
      title: '',
      message: '',
      amount: 0,
    };
    this.socket = io(config.server);
  }

  playAnimation(isWinner, type, color, newPoints) {
    var index = Math.floor(TYPE_OFFSETS[type] / 30);
    var points = isWinner ? this.state.playerPoints : this.state.opponentPoints;
    var length = points[index].length;
    //console.log(color);
    //console.log(index);
    //console.log(points[index]);
    if (!points[index].includes(color)) {
      this.setState(
        {
          isWinner,
          winnerType: type,
          winnerColor: color,
          isAnimation: true,
          winnerBallV: new Animated.Value(170),
        },
        () => {
          Animated.timing(this.state.winnerBallV, {
            toValue: 35 + 30 * length,
            duration: 2000,
            easing: Easing.bounce,
          }).start(() => {
            this.setState({
              isAnimation: false,
              playerPoints: newPoints.playerPoints,
              opponentPoints: newPoints.opponentPoints,
            });
          });
        }
      );
    }
  }

  componentDidMount() {
    this.socket.on('connection', () => {
      console.log('Connected');
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });
    this.socket.on('update cards', cards => {
      this.setState({ cards: cards });
    });
    this.socket.on('enter match', opponent => {
      this.setState({ opponent: opponent });
      this.enterMatch();
    });
    this.socket.on('unknown card played', () => {
      this.setState({ opponentCardState: 'unknown' });
    });
    this.socket.on('fight result', data => {
      if (data.winner.card === undefined || data.loser.card === undefined) {
        if (data.winner.card === undefined && data.loser.card === undefined) {
          // both cards are empty it is a tie
        } else if (this.socket.id === data.winner.socketId) {
          // opponent not played a card
          this.playAnimation(
            true,
            data.winner.card.type,
            data.winner.card.color,
            {
              playerPoints: data.winner.points,
              opponentPoints: data.loser.points,
            }
          );
        } else {
          // player not played a card
          if (!data.tied)
            this.playAnimation(
              false,
              data.winner.card.type,
              data.winner.card.color,
              {
                playerPoints: data.loser.points,
                opponentPoints: data.winner.points,
              }
            );
        }
      } else if (this.socket.id === data.winner.socketId) {
        // this client is winner
        if (!data.tied)
          this.playAnimation(
            true,
            data.winner.card.type,
            data.winner.card.color,
            {
              playerPoints: data.winner.points,
              opponentPoints: data.loser.points,
            }
          );
        this.setState({
          opponentCard: data.loser.card,
          opponentCardState: 'played',
        });
      } else {
        // this client is loser
        if (!data.tied)
          this.playAnimation(
            false,
            data.winner.card.type,
            data.winner.card.color,
            {
              playerPoints: data.loser.points,
              opponentPoints: data.winner.points,
            }
          );
        this.setState({
          opponentCard: data.winner.card,
          opponentCardState: 'played',
        });
      }
      setTimeout(() => {
        this.socket.emit('request cards update');
        this.setState({
          playerCardState: 'empty',
          opponentCardState: 'empty',
          playedCard: {},
          opponentCard: {},
        });
      }, 3000);
    });
    this.socket.on('end match', (winId, reason, amount) => {
      var title;
      var message = reason;
      var wonAmount = 0;
      if (winId == 'tie') {
        title = 'TIE';
        wonAmount = amount;
        this.props.navigation.state.params.wonCoins(amount);
      } else if (winId === this.socket.id) {
        title = 'YOU WON';
        wonAmount = amount;
        this.props.navigation.state.params.wonCoins(amount);
      } else {
        title = 'YOU LOST';
      }
      //setTimeout(() => this.setState({gameState: GAME_STATES.FINISH}), 1000);
      setTimeout(() => {
        this.setState({ title: title, message: message, amount: wonAmount });
      }, 3000);
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  enterQueue() {
    this.setState({ queueEntered: true });
    this.socket.emit('enter queue');
  }

  leaveQueue() {
    this.setState({ queueEntered: false });
    this.socket.emit('leave queue');
  }

  enterMatch() {
    this.setState({ gameState: GAME_STATES.GAME, queueEntered: false });
  }

  renderQueue() {
    if (this.state.queueEntered) {
      return (
        <>
          <TouchableOpacity
            style={{
              width: '80%',
              backgroundColor: '#fb5b5a',
              borderRadius: 25,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 40,
              marginBottom: 10,
            }}
            onPress={() => this.leaveQueue()}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Leave Queue
            </Text>
          </TouchableOpacity>
          <Text style={{ marginBottom: 20, color: 'white' }}>
            Waiting for opponent...
          </Text>
        </>
      );
    } else {
      return (
        <TouchableOpacity
          style={{
            width: '80%',
            backgroundColor: '#fb5b5a',
            borderRadius: 25,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 40,
            marginBottom: 50,
          }}
          onPress={() => this.enterQueue()}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Enter Queue
          </Text>
        </TouchableOpacity>
      );
    }
  }

  exitMatch() {
    Alert.alert(
      'Exit match',
      'Are you sure to exit match ?',
      [
        {
          text: 'Yes',
          onPress: () => {
            //exit match
            this.socket.disconnect();
            this.props.navigation.goBack();
          },
        },
        {
          text: 'No',
          onPress: () => {
            //stay in the match
          },
        },
      ],
      { cancelable: true }
    );
  }

  playCard(index) {
    if (this.state.playerCardState !== 'played') {
      var cards = this.state.cards;
      var current = cards[index];
      cards.splice(index, 1);
      //console.log(current);
      this.setState({
        cards: cards,
        playedCard: current,
        playerCardState: 'played',
      });
      //console.log('PLAYED');
      this.socket.emit('play card', index);
    }
  }

  renderScreen() {
    const winnerStyle = {
      bottom: this.state.winnerBallV,
      left: TYPE_OFFSETS[this.state.winnerType],
    };
    const lostStyle = {
      top: this.state.winnerBallV,
      right: TYPE_OFFSETS[this.state.winnerType],
    };
    if (this.state.gameState === GAME_STATES.QUEUE) {
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#005780',
              height: 55,
              shadowOffset: { width: 10, height: 10 },
              shadowColor: 'black',
              shadowOpacity: 1.0,
            }}>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.props.navigation.goBack()}>
              <MaterialCommunityIcons
                name="arrow-left"
                style={{ color: '#fff', fontSize: 30 }}
              />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
              HU-Card
            </Text>
            <View style={{ width: 50, height: 50 }} />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#003f5c',
            }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Image
                  source={images.fire}
                  resizeMode={'cover'}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 55,
                    overflow: 'hidden',
                  }}
                />
                <FontAwesome
                  name="chevron-right"
                  style={{
                    color: '#fff',
                    fontSize: 25,
                    textAlignVertical: 'center',
                    marginHorizontal: 7,
                  }}
                />
                <Image
                  source={images.earth}
                  resizeMode={'cover'}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 55,
                    overflow: 'hidden',
                  }}
                />
                <FontAwesome
                  name="chevron-right"
                  style={{
                    color: '#fff',
                    fontSize: 25,
                    textAlignVertical: 'center',
                    marginHorizontal: 7,
                  }}
                />
                <Image
                  source={images.water}
                  resizeMode={'cover'}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 55,
                    overflow: 'hidden',
                  }}
                />
                <FontAwesome
                  name="chevron-right"
                  style={{
                    color: '#fff',
                    fontSize: 25,
                    textAlignVertical: 'center',
                    marginHorizontal: 7,
                  }}
                />
                <Image
                  source={images.fire}
                  resizeMode={'cover'}
                  style={{
                    width: 55,
                    height: 55,
                    borderRadius: 55,
                    overflow: 'hidden',
                  }}
                />
              </View>
              <Text style={{ color: 'white' }}>Fire beats Earth</Text>
              <Text style={{ color: 'white' }}>Earth beats Water</Text>
              <Text style={{ color: 'white' }}>Water beats Fire</Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <Text style={{ color: 'white', fontSize: 25, marginBottom: 7 }}>
                  Winning Condition
                </Text>
                <Text
                  style={{
                    color: 'white',
                    marginBottom: 10,
                    textAlign: 'center',
                  }}>
                  Who makes the first triplet horizontal or vertical wins the
                  match.
                </Text>

                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View />
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#465881',
                      padding: 7,
                      borderRadius: 10,
                    }}>
                    <PointBall item={'orange'} />
                    <PointBall item={'red'} />
                    <PointBall item={'green'} />
                  </View>
                  <View
                    style={{
                      backgroundColor: '#465881',
                      padding: 7,
                      borderRadius: 10,
                    }}>
                    <PointBall item={'orange'} />
                    <PointBall item={'red'} />
                    <PointBall item={'green'} />
                  </View>
                  <View />
                </View>
                <Text
                  style={{ color: 'white', marginTop: 7, textAlign: 'center' }}>
                  *You can't win twice with cards of same type and color.{' '}
                </Text>
              </View>
            </View>
            {this.renderQueue()}
          </View>
        </View>
      );
    } else if (this.state.gameState === GAME_STATES.GAME) {
      return (
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#005780',
            }}>
            <TouchableOpacity
              style={{
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.exitMatch()}>
              <MaterialCommunityIcons
                name="arrow-left"
                style={{ color: '#fff', fontSize: 30 }}
              />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {this.state.opponent}
            </Text>
            <View style={{ width: 50, height: 50 }} />
          </View>
          <ImageBackground
            source={require('../assets/background.jpg')}
            style={{
              flex: 1,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <View style={{ alignItems: 'center' }}>
              <GameCard
                cardState={this.state.opponentCardState}
                color={this.state.opponentCard.color}
                power={this.state.opponentCard.power}
                type={this.state.opponentCard.type}
              />
            </View>
            <View style={{ alignItems: 'center' }}>
              <GameCard
                cardState={this.state.playerCardState}
                color={this.state.playedCard.color}
                power={this.state.playedCard.power}
                type={this.state.playedCard.type}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                left: 2,
                bottom: 2,
              }}>
              <View
                style={{
                  flexDirection: 'column-reverse',
                  marginBottom: 3,
                  marginRight: 4,
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    borderColor: 'white',
                    overflow: 'hidden',
                  }}
                  source={images.fire}
                  ref={playerFire => {
                    this.playerFire = playerFire;
                  }}
                />
                {this.state.playerPoints[0].map((item, index) => (
                  <PointBall key={index.toString()} item={item} index={index} />
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'column-reverse',
                  marginBottom: 3,
                  marginRight: 4,
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    overflow: 'hidden',
                  }}
                  source={images.water}
                />
                {this.state.playerPoints[1].map((item, index) => (
                  <PointBall key={index.toString()} item={item} index={index} />
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'column-reverse',
                  marginBottom: 3,
                  marginRight: 4,
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    overflow: 'hidden',
                  }}
                  source={images.earth}
                />
                {this.state.playerPoints[2].map((item, index) => (
                  <PointBall key={index.toString()} item={item} index={index} />
                ))}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                right: 2,
                top: 2,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: 3,
                  marginLeft: 4,
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    overflow: 'hidden',
                  }}
                  source={images.earth}
                />
                {this.state.opponentPoints[2].map((item, index) => (
                  <PointBall key={index.toString()} item={item} index={index} />
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: 3,
                  marginLeft: 4,
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    overflow: 'hidden',
                  }}
                  source={images.water}
                />
                {this.state.opponentPoints[1].map((item, index) => (
                  <PointBall key={index.toString()} item={item} index={index} />
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: 3,
                  marginLeft: 4,
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    overflow: 'hidden',
                  }}
                  source={images.fire}
                  ref={oppFire => {
                    this.oppFire = oppFire;
                  }}
                />
                {this.state.opponentPoints[0].map((item, index) => (
                  <PointBall key={index.toString()} item={item} index={index} />
                ))}
              </View>
            </View>
            {this.state.isAnimation ? (
              <Animated.View
                style={[
                  {
                    width: 30,
                    height: 30,
                    backgroundColor: this.state.winnerColor,
                    borderRadius: 150,
                    borderWidth: 2,
                    borderColor: 'white',
                    position: 'absolute',
                  },
                  this.state.isWinner ? winnerStyle : lostStyle,
                ]}
              />
            ) : null}
          </ImageBackground>
          <View style={{ height: 200, backgroundColor: '#003f5c' }}>
            <FlatList
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: '#005780',
                marginVertical: 10,
              }}
              horizontal={true}
              data={this.state.cards}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={{ paddingTop: 15 }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.playCard(index)}>
                    <GameCard
                      color={item.color}
                      type={item.type}
                      power={item.power}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      );
    } else if (this.state.gameState === GAME_STATES.FINISH) {
      return (
        <View>
          <Text>FINISH</Text>
        </View>
      );
    } else {
      return <View>blank</View>;
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: StatusBar.currentHeight || 18 }} />
        {this.renderScreen()}
        {this.state.title !== '' ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              this.setState({
                title: '',
                message: '',
                gameState: GAME_STATES.QUEUE,
                playerPoints: [[], [], []],
                opponentPoints: [[], [], []],
                playedCard: {},
                opponentCard: {},
                playerCardState: 'empty',
                opponentCardState: 'empty',
              })
            }
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              width: '100%',
              height: '100%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 30, color: 'white' }}>
              {this.state.title}
            </Text>
            <Text style={{ fontSize: 20, color: 'white', margin: 15 }}>
              {this.state.message}
            </Text>
            {this.state.amount !== 0 ? (
              <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                <Text style={{ fontSize: 20, color: 'white' }}>
                  +{this.state.amount}
                </Text>
                <FontAwesome
                  name="bitcoin"
                  style={{
                    color: '#fff',
                    fontSize: 20,
                    textAlignVertical: 'center',
                    marginLeft: 7,
                  }}
                />
              </View>
            ) : null}
            <Text style={{ color: 'white' }}>Click to continue...</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}
