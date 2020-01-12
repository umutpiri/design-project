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

import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

var config = require('../config.json');

export default class ShopItem extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Cards',
      headerRight: <View />,
    };
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  
  /**
   * type
   * color
   * power
   * price
   */
  render() {
    return (
      <View style={styles.container}>
      <GameCard cardState={this.props.type == "Random" ? "unknown" : null} type={this.props.type} color={this.props.color == "random" ? "black" : this.props.color} power={this.props.power} />
      <View>
        <Text style={{color: 'white'}}>Color: {this.props.color}</Text>
        <Text style={{color: 'white'}}>Type: {this.props.type}</Text>
        <Text style={{color: 'white'}}>Power: {this.props.power}</Text>
        <View style={{marginTop: 20, flexDirection: 'row'}}>
        <Text style={{color: 'white', fontSize: 25}}>{this.props.price}</Text>
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
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    backgroundColor: '#465881',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
