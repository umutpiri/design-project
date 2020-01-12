import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';

import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

export default class MainMenu extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Main Menu',
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.getParam('user', {}),
    };
  }

  wonCoins = data => {
    console.log("yeni data geldi");
    console.log(data);
    var user = this.state.user;
    user['coin'] += data;
    this.setState({user: user});
  }

  spendCoins = data => {
    console.log(data);
    var user = this.state.user;
    user['coin'] -= data;
    this.setState({user: user});
  }

  goGame() {
    this.props.navigation.navigate('Game', {
       wonCoins: this.wonCoins 
    });
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

  goShop(){
    this.props.navigation.navigate('Shop', {
       spendCoins: this.spendCoins 
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 10,
            flexDirection: 'row',
            borderBottomColor: 'white',
            borderBottomWidth: 2,
            paddingLeft: 8,
          }}>
          <Text style={{ color: 'white', fontSize: 20 }}>
            {this.state.user.coin}
          </Text>
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
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 10,
            flexDirection: 'row',
            borderBottomColor: 'white',
            borderBottomWidth: 2,
            paddingRight: 8,
          }}>
          <FontAwesome
            name="user"
            style={{
              color: '#fff',
              fontSize: 20,
              textAlignVertical: 'center',
              marginRight: 7,
            }}
          />
          <Text style={{ color: 'white', fontSize: 20 }}>
            {this.state.user.username}
          </Text>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={() => this.goGame()}>
          <Text style={styles.loginText}>Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => this.goDeck()}>
          <Text style={styles.loginText}>Deck</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => this.goShop()}>
          <Text style={styles.loginText}>Shop</Text>
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
