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
} from 'react-native';

const config = require('../config.json');
import GameCard from './GameCard';
import axios from 'axios';

import io from 'socket.io-client';

const images = {
  water: require('../assets/water.png'),
  fire: require('../assets/fire.png'),
  earth: require('../assets/earth.png'),
};

const TIME_DURATION = 10;
const DOT_OFFSET = 17;

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
      cards: [
        {
          color: 'red',
          power: 5,
          type: 'water',
        },
        {
          color: 'blue',
          power: 2,
          type: 'fire',
        },
        {
          color: 'blue',
          power: 2,
          type: 'earth',
        },
      ],
      opponent: 'guestuser18574',
      opponentCard: {
        color: 'purple',
        power: 1,
        type: 'fire',
      },
      opponentCardState: 'empty',
      playedCard: {
        color: 'red',
        power: 2,
        type: 'fire',
      },
      playerCardState: 'empty',
      playerPoints: [[], [], []],
      opponentPoints: [[], [], []]
    };
    this.socket = io(config.server);
  }

  componentDidMount() {
    this.socket.on('connection', () => {
      console.log('Connected');
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });
    this.socket.on('update cards', cards => {
      console.log('KARTLAR GELDİİ');
      console.log(cards);
      this.setState({ cards: cards });
    });
    this.socket.on('enter match', opponent => {
      console.log(opponent);
      this.setState({ opponent: opponent});
      this.enterMatch();
    });
    this.socket.on('unknown card played', () => {
      this.setState({ opponentCardState: 'unknown' });
    });
    this.socket.on('fight result', data => {
      console.log(data);
      if(data.winner.card === undefined || data.loser.card === undefined){
        console.log("boş kartlar");
        if(this.socket.id === data.winner.socketId){
          this.setState({playerPoints: data.winner.points, opponentPoints: data.loser.points});
        }else{
          this.setState({playerPoints: data.loser.points, opponentPoints: data.winner.points});
        }
      }else if (this.socket.id === data.winner.socketId) {
        // this client is winner
        this.setState({
          playerPoints: data.winner.points,
          opponentPoints: data.loser.points,
          opponentCard: data.loser.card,
          opponentCardState: 'played',
        });
      } else {
        // this client is loser
        this.setState({
          opponentPoints: data.winner.points,
          playerPoints: data.loser.points,
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
          opponentCard: {}
        });
        console.log('fight finished');
      }, 3000);
    });
    this.socket.on("end match", (winId, reason, amount) => {
      var title;
      var message = reason;
      if(winId == "tie"){
        title = "TIE";
      }else if(winId === this.socket.id){
        title = "YOU WON "+amount.toString()+" COINS";
      }else{
        title = "YOU LOSE";
      }
      //setTimeout(() => this.setState({gameState: GAME_STATES.FINISH}), 1000);
      Alert.alert(title, message, [

                {
                  text: 'OK',
                  onPress: () => {
                    this.setState({gameState: GAME_STATES.QUEUE})
                  },
                },
              ],
              { cancelable: false });
      setTimeout(() => {
        this.setState({
          playerPoints: [[],[], []],
          opponentPoints: [[],[], []],
          playedCard: {},
          opponentCard: {},
          playerCardState: 'empty',
          opponentCardState: 'empty',
        });
        console.log('fight finished');
      }, 3000);
    })
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
        <View style={{ flexDirection: 'row' }}>
          <Text>Waiting for opponent...</Text>
          <Button onPress={() => this.leaveQueue()} title="Exit Queue" />
        </View>
      );
    } else {
      return <Button onPress={() => this.enterQueue()} title="Enter Queue" />;
    }
  }

  playCard(index) {
    if(this.state.playerCardState !== 'played'){
      var cards = this.state.cards;
      var current = cards[index];
      cards.splice(index, 1);
      console.log(current);
      this.setState({
        cards: cards,
        playedCard: current,
        playerCardState: 'played',
      });
      console.log('PLAYED ULANNN');
      this.socket.emit('play card', index);
    }
  }

  renderScreen() {
    if (this.state.gameState === GAME_STATES.QUEUE) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.renderQueue()}
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
              backgroundColor: '#D5D4D4',
            }}>
            <View style={{ width: 50, height: 50 }} />
            <Text>{this.state.opponent}</Text>
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
                    overflow: 'hidden',
                    zIndex: 10,
                  }}
                  source={images.fire}
                />
                {this.state.playerPoints[0].map((item, index) => (
                  <View
                  key = {index.toString()}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor: item,
                    translateY: DOT_OFFSET + DOT_OFFSET*index,
                    zIndex: 9-index,
                  }}
                />
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
                    zIndex: 10,
                  }}
                  source={images.water}
                />
                {this.state.playerPoints[1].map((item, index) => (
                  <View
                  key = {index.toString()}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor: item,
                    translateY: DOT_OFFSET + DOT_OFFSET*index,
                    zIndex: 9-index,
                  }}
                />
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
                    zIndex: 10,
                  }}
                  source={images.earth}
                />
                {this.state.playerPoints[2].map((item, index) => (
                  <View
                  key = {index.toString()}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor: item,
                    translateY: DOT_OFFSET + DOT_OFFSET*index,
                    zIndex: 9-index,
                  }}
                />
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
                  marginBottom: 3,
                  marginLeft: 4,
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    overflow: 'hidden',
                    zIndex: 10,
                  }}
                  source={images.earth}
                />
                {this.state.opponentPoints[2].map((item, index) => (
                  <View
                  key = {index.toString()}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor: item,
                    translateY: -DOT_OFFSET - DOT_OFFSET*index,
                    zIndex: 9-index,
                  }}
                />
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginBottom: 3,
                  marginLeft: 4,
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    overflow: 'hidden',
                    zIndex: 10,
                  }}
                  source={images.water}
                />
                {this.state.opponentPoints[1].map((item, index) => (
                  <View
                  key = {index.toString()}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor: item,
                    translateY: -DOT_OFFSET - DOT_OFFSET*index,
                    zIndex: 9-index,
                  }}
                />
                ))}
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  marginBottom: 3,
                  marginLeft: 4,
                }}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    overflow: 'hidden',
                    zIndex: 10,
                  }}
                  source={images.fire}
                />
                {this.state.opponentPoints[0].map((item, index) => (
                  <View
                  key = {index.toString()}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor: item,
                    translateY: -DOT_OFFSET - DOT_OFFSET*index,
                    zIndex: 9-index,
                  }}
                />
                ))}
              </View>
            </View>
          </ImageBackground>
          <View style={{ height: 200, backgroundColor: '#AEADAD' }}>
            <FlatList
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: '#D5D4D4',
                marginVertical: 10,
              }}
              horizontal={true}
              onPress={item => console.log(item)}
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
        <View style={{ height: StatusBar.currentHeight }} />
        {this.renderScreen()}
      </View>
    );
  }
}
