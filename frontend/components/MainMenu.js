import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';

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

  goPlaceDefine() {
    this.props.navigation.navigate('PhotoPlace');
  }

  goDeck() {
    this.props.navigation.navigate('Deck');
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.loginBtn} onPress={() => this.goGame()}>
          <Text style={styles.loginText}>Game</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => this.goDeck()}>
          <Text style={styles.loginText}>Deck</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => this.goGallery()}>
          <Text style={styles.loginText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => this.goCamera()}>
          <Text style={styles.loginText}>Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
});
