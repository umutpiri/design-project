import React from 'react';
import { Text, View, StyleSheet, TextInput, Button, Dimensions } from 'react-native';

const config = require('../config.json');
import axios from 'axios';

axios.defaults.withCredentials = true;

export default class Login extends React.Component {
  static navigationOptions = {
    headerShown: false
  };
  constructor(props) {
    super(props);
    this.state = {
      username: 'umut',
      password: 'password',
      isLoading: false
    };
  }
  render() {
    const { navigate } = this.props.navigation;
    var onLoginSubmit = () => {
      axios
        .post(config.server + '/login', {
          username: this.state.username,
          password: this.state.password,
        })
        .then(response => {
          if (response.status === 401) {
            throw new Error('Auth faild');
          }

          console.log('Logged in');
          navigate('MainMenu');
        })
        .catch(error => {
          console.log(error);
          alert('Could not login, check your credintials');
        });
    };
    return (
      <View>
        <View style={{ height: 50 }} />
        <Text style={{ fontWeight: 'bold', textAlign: "center", color:'green', margin :5, fontSize: 35}}>HU- CARD</Text>
        <TextInput
          placeholder="username"
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 3 }}
          value={this.state.username}
          onChangeText={text => {
            this.setState({ username: text });
          }}
        />
        <View style={{ height: 10 }} />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 3 }}
          value={this.state.password}
          onChangeText={text => {
            this.setState({ password: text });
          }}
        />
        <View style={{ height: 10 }} />
        <View style={{margin: 10}}>
          <Button title="Login" onPress={() => onLoginSubmit()} />
        </View>
      </View>
    );
  }
}
