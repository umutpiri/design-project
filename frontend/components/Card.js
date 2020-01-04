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
          width: screenWidth / 2.6,
          height: screenWidth / 2.3,
          backgroundColor: this.props.correctness ? 'green' : 'red',
          borderRadius: 10
        }}>
        <Image
          style={{ width: screenWidth / 3.3, height: screenWidth/3.3 }}
          source={{ uri: this.props.url }}
        />
        <Text>{this.props.place}</Text>
      </View>
    );
  }
}
