import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import GameCard from './GameCard';

var config = require('../config.json');

export default class Deck extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Cards',
      headerRight: <View />,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      isLoading: true,
      card1: {},
      card2: {},
      combinable: false,
      waiting: false,
      combinedCard: {},
    };
  }

  componentDidMount() {
    axios
      .get(config.server + '/api/cards')
      .then(res => {
        console.log(res);
        this.setState({ cards: res.data, isLoading: false });
      })
      .catch(err => console.log(err));
  }

  checkConsistency() {
    if (
      this.state.card1.color === undefined ||
      this.state.card2.color === undefined
    )
      return false;
    return (
      this.state.card1.color === this.state.card2.color &&
      this.state.card1.type === this.state.card2.type &&
      this.state.card1.power === this.state.card2.power
    );
  }

  cardPressed(index) {
    console.log(index);
    if (this.state.combinedCard.color) return;
    if (
      this.state.card1.color === undefined ||
      this.state.card2.color === undefined
    ) {
      console.log('UNDEFINED VAR İŞTE');
      var newCards = [...this.state.cards];
      var selectedCard = this.state.cards[index];
      newCards[index]['invisible'] = true;
      console.log(selectedCard);
      this.state.cards.splice(index, 1);
      if (this.state.card1.color === undefined) {
        this.setState({ card1: selectedCard, cards: newCards }, () => {
          if (this.checkConsistency()) {
            this.setState({ combinable: true });
          }
        });
      } else if (this.state.card2.color === undefined) {
        this.setState({ card2: selectedCard, cards: newCards }, () => {
          if (this.checkConsistency()) {
            this.setState({ combinable: true });
          }
        });
      }
    }
  }

  combineCards() {
    if (this.state.card1.id === undefined || this.state.card2.id === undefined)
      return;
    this.setState({ waiting: true });
    axios
      .post(config.server + '/api/combineCards', {
        card1Id: this.state.card1.id,
        card2Id: this.state.card2.id,
      })
      .then(res => {
        console.log(res);
        this.setState({ waiting: false, combinedCard: res.data });
      })
      .catch(err => {
        console.log(err);
        this.setState({ waiting: false });
      });
  }

  findCardById(id) {
    for (var i = 0; i < this.state.cards.length; i++) {
      if (this.state.cards[i].id === id) return i;
    }
    return -1;
  }

  refresh() {
    if (this.state.isLoading) return;
    this.setState({ isLoading: true });
    axios
      .get(config.server + '/api/cards')
      .then(res => {
        console.log(res);
        this.setState({
          cards: res.data,
          card1: {},
          card2: {},
          combinable: false,
          combinedCard: {},
          isLoading: false,
        });
      })
      .catch(err => console.log(err));
  }

  renderCombine() {
    if (this.state.combinedCard.color) {
      return (
        <TouchableOpacity activeOpacity={1} onPress={() => this.refresh()}>
          <GameCard
            color={this.state.combinedCard.color}
            type={this.state.combinedCard.type}
            power={this.state.combinedCard.power}
          />
          <Text style={{ color: 'white' }}>Click to continue...</Text>
        </TouchableOpacity>
      );
    }
    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (this.state.card1.color) {
              var cardId = this.state.card1.id;
              var cardIndex = this.findCardById(cardId);
              if (cardIndex == -1) return;
              var newCards = [...this.state.cards];
              newCards[cardIndex]['invisible'] = null;
              this.setState({
                cards: newCards,
                card1: {},
                combinable: false,
              });
            }
          }}>
          <GameCard
            color={this.state.card1.color}
            type={this.state.card1.type}
            power={this.state.card1.power}
          />
        </TouchableOpacity>
        {this.state.waiting ? (
          <ActivityIndicator size="large" color="#fb5b5a" />
        ) : (
          <TouchableOpacity
            disabled={!this.state.combinable}
            onPress={() => this.combineCards()}
            style={{
              backgroundColor: this.state.combinable ? '#fb5b5a' : '#ccc',
              borderRadius: 50,
              height: 40,
              paddingHorizontal: 10,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>
              Combine
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (this.state.card2.color) {
              var cardId = this.state.card2.id;
              var cardIndex = this.findCardById(cardId);
              if (cardIndex == -1) return;
              var newCards = [...this.state.cards];
              newCards[cardIndex]['invisible'] = null;
              this.setState({
                cards: newCards,
                card2: {},
                combinable: false,
              });
            }
          }}>
          <GameCard
            color={this.state.card2.color}
            type={this.state.card2.type}
            power={this.state.card2.power}
          />
        </TouchableOpacity>
      </>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 10,
            paddingTop: 20,
            justifyContent: 'space-around',
            alignItems: 'center',
            backgroundColor: '#465881',
          }}>
          {this.renderCombine()}
        </View>
        <ScrollView
          contentComponentStyle={{ justifyContent: 'center', flex: 1 }}>
          <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row' }}>
            <FlatList
              contentContainerStyle={styles.grid}
              data={this.state.cards}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                if (item.invisible) return <></>;
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{ paddingTop: 15, marginHorizontal: 5 }}
                    onPress={() => this.cardPressed(index)}>
                    <GameCard
                      color={item.color}
                      type={item.type}
                      power={item.power}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </ScrollView>
        {this.state.isLoading ? (
          <ActivityIndicator
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: 0,
              right: 0
            }}
            size={100}
            color="#fb5b5a"
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
  },
  grid: { justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' },
});
