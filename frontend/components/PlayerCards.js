import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import axios from 'axios';
import GameCard from './GameCard';

var config = require('../config.json');

export default class PlayerCards extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Cards',
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      isLoading: true,
    };
  }

  componentDidMount(){
    axios.get(config.server +"/image/cards").then(res => {
      console.log(res);
      this.setState({cards: res.data, isLoading: false});
    }).catch(err => console.log(err));
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ScrollView
            contentComponentStyle={{ justifyContent: 'center', flex: 1 }}>
            <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row' }}>
              <FlatList
                contentContainerStyle={styles.grid}
                data={this.state.cards}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={{paddingTop: 15, marginHorizontal: 5}}>
                  <GameCard
                    color={item.color}
                    type={item.type}
                    power = {item.power}
                  />
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  grid: { justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }
});