import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import Constants from 'expo-constants';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import io from 'socket.io-client';

let serverEndpoints = {
  login: 'http://192.168.1.31:8383/login',
  game: 'http://192.168.1.31:8383',
};
//Buna bir çözüm bulmaya çalışıcam, şimdilik yorum satırı kullanalım. TODO
/*let serverEndpoints = {
  login: 'http://192.168.0.77:8383/login',
  game: 'http://192.168.0.77:8383',
};*/

class Game extends React.Component {
  constructor(props){
    super(props);
   this.socket = io(serverEndpoints['game']);
  }

  componentDidMount(){
    this.socket.on("connect",() => {
      console.log("Connected");
     });
    this.socket.on("disconnect",() => {
      console.log("Disconnected");
     });
     this.socket.on("event", (event)=>{
       console.log(event);
     });
     this.socket.on("joined queue", () => {
       console.log("joined queue")
     })
  }

  enterQueue() {
    this.socket.emit("enter queue");
    console.log("queue entered")
  }

  render() {
    return (
      <View>
        <Text>Game main page</Text>
        <Button title="Enter Queue" onPress={() => this.enterQueue()} />
      </View>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.username = '';
    this.password = '';
  }
  render() {
    const { navigate } = this.props.navigation;
    var onLoginSubmit = () => {
      fetch(serverEndpoints['login'], {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then(response => {
          if (response.status === 401) {
            throw new Error('Auth faild');
          }

          console.log('Logged in');
          navigate('Game');
        })
        .catch(error => {
          alert('Could not login, check your credintials');
        });
    };
    return (
      <View>
        <TextInput
          placeholder="username"
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => {
            this.username = text;
          }}
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => {
            this.password = text;
          }}
        />
        <Button title="Login" onPress={() => onLoginSubmit()} />
      </View>
    );
  }
}

const MainNavigator = createStackNavigator({
  Login: { screen: Login },
  Game: { screen: Game },
});

const App = createAppContainer(MainNavigator);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
