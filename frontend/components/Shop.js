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
import ShopItem from './ShopItem';

var config = require('../config.json');

const colors = ['purple', 'red', 'orange', 'blue', 'green'];

export default class Shop extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Shop',
      headerRight: <View />,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      boughtCard: {},
    };
  }

  buyCard(card) {
    axios
      .post(config.server + '/api/buyCard', card)
      .then(res => {
        if (res.data === 'Not Enough Coin') {
          alert(res.data);
        } else {
          this.props.navigation.state.params.spendCoins(card.price);
          this.setState({ boughtCard: res.data });
        }
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {}
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              this.buyCard({
                type: 'fire',
                power: 1,
                color: colors[Math.floor(Math.random() * 5)],
                price: 100,
              })
            }
            style={{ flex: 1, margin: 5, marginTop: 10 }}>
            <ShopItem type={'fire'} color={'random'} power={1} price={100} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              this.buyCard({
                type: 'water',
                power: 1,
                color: colors[Math.floor(Math.random() * 5)],
                price: 100,
              })
            }
            style={{ flex: 1, margin: 5 }}>
            <ShopItem type={'water'} color={'random'} power={1} price={100} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              this.buyCard({
                type: 'earth',
                power: 1,
                color: colors[Math.floor(Math.random() * 5)],
                price: 100,
              })
            }
            style={{ flex: 1, margin: 5 }}>
            <ShopItem type={'earth'} color={'random'} power={1} price={100} />
          </TouchableOpacity>
        </ScrollView>
        {this.state.boughtCard.color ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setState({ boughtCard: {} })}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              width: '100%',
              height: '100%',
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <GameCard type={this.state.boughtCard.type} color={this.state.boughtCard.color} power={this.state.boughtCard.power} />
            <Text style={{ color: 'white' }}>Click to continue...</Text>
          </TouchableOpacity>
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
});
