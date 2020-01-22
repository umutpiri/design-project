import React, {Component} from "react";
import { Text, View, Image ,StyleSheet, Dimensions} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';

export default class PlaceCard extends Component {
  constructor(props){
    super(props);
    this.state={uri: 'umut'};
  }

  async compressImage(uri){
    const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [],
        {
          compress: 0.3,
        }
      );
    console.log(manipResult);
    this.setState({uri: manipResult.uri});
  }

  componentDidMount(){
    this.compressImage(this.props.url);
  }

  render() {
    var screenWidth = Dimensions.get('window').width;
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-evenly',
          margin: 5,
          marginBottom: 8,
          width: screenWidth / 2.20,
          height: screenWidth / 1.90,
          backgroundColor: '#465881',
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 10
        }}>
        <Text style={{fontWeight: 'bold', color: 'white', textAlign: 'center'}}>{this.props.place}</Text>
        <Image
          style={{ width: screenWidth / 2.70, height: screenWidth/2.70, borderRadius: 10, overflow: 'hidden' }}
          source={{ uri: this.state.uri}}
          resizeMode="cover"
        />
        
      </View>
    );
  }
}
