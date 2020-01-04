import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import Constants from 'expo-constants';

const config = require('../config.json');
import axios from 'axios';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import io from 'socket.io-client';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.socket = io(config.server);
  }

  componentDidMount() {
    this.socket.on('connection', () => {
      console.log('Connected');
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });
    this.socket.on('event', event => {
      console.log(event);
    });
  }
  render() {
    return (
      <View>
        <Text>Game main page</Text>
      </View>
    );
  }
}