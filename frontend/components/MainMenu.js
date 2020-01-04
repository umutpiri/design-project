import React from 'react';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';

export default class MainMenu extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Main Menu',
    };
  };

  goGame() {
    this.props.navigation.navigate('Game');
  }

  goGallery() {
    this.props.navigation.navigate('GalleryScreen');
  }

  goCamera() {
    this.props.navigation.navigate('CameraScreen');
  }

  goPlaceDefine(){
    this.props.navigation.navigate('PhotoPlace');
  }

  render() {
    return (
      <View style={styles.MainContainer}>
        <Button style={styles.SeparatorLine} title="Game" onPress={() => this.goGame()} />
        <View style={{height: 20}}/>
        <Button style={styles.SeparatorLine} title="Gallery" onPress={() => this.goGallery()} />
        <View style={{height: 20}}/>
        <Button style={styles.SeparatorLine} title="Camera" onPress={() => this.goCamera()} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    margin: 6,
  },
  SeparatorLine: {
    backgroundColor: '#fff',
    width: 1,
    height: 40,
    margin: 6,
  },
});