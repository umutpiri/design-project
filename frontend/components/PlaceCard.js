import React, {Component} from "react";
import { Text, View, Image ,StyleSheet, Dimensions} from 'react-native';

export default class PlaceCard extends Component {
  render() {
    var screenWidth = Dimensions.get('window').width;
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-evenly',
          margin: 10,
          width: screenWidth / 2.3,
          height: screenWidth / 2,
          backgroundColor: '#465881',
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 10
        }}>
        <Text style={{fontWeight: 'bold', color: 'white'}}>{this.props.place}</Text>
        <Image
          style={{ width: screenWidth / 2.8, height: screenWidth/2.8, borderRadius: 10, overflow: 'hidden' }}
          source={{ uri: this.props.url }}
        />
        
      </View>
    );
  }
}
