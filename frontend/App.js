import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import Constants from 'expo-constants';

import Login  from './components/Login';
import Game  from './components/Game';
import CameraScreen from './components/CameraScreen';
import GalleryScreen from './components/GalleryScreen';
import MainMenu from './components/MainMenu';
import PhotoPlace from './components/PhotoPlace';

import { Card } from 'react-native-paper';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import io from 'socket.io-client';

const config = require('./config.json');

const MainNavigator = createStackNavigator({
  Game: { screen: Game },
  Login: { screen: Login },
  
  CameraScreen: { screen: CameraScreen },
  GalleryScreen: {screen: GalleryScreen},
  MainMenu: {screen: MainMenu},
  PhotoPlace: {screen: PhotoPlace},
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