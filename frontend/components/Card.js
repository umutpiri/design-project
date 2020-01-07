import React, {Component} from "react";
import { Text, View, Image ,StyleSheet, Dimensions} from 'react-native';

export default class Card extends Component {
  render() {
    var screenWidth = Dimensions.get('window').width;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 10,
          width: screenWidth / 2.3,
          height: screenWidth / 2,
          backgroundColor: '#ccc',
          borderRadius: 10
        }}>
        <Image
          style={{ width: screenWidth / 3, height: screenWidth/3 }}
          source={{ uri: this.props.url }}
        />
        <Text style={{fontWeight: 'bold'}}>{this.props.place}</Text>
      </View>
    );
  }
}
