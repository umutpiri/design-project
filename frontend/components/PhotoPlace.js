import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker, Button } from 'react-native';
import { Constants } from 'expo';
import axios from 'axios';

var config = require('../config.json');

export default class App extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Select Place',
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      place: 'Anıtkabir',
      places: [
        { place: 'Anıtkabir', type: 'earth'}
      ],
    };
  }

  componentDidMount() {
    axios
      .get(config.server + '/image/getPlaces')
      .then(res => {
        console.log(res);
        this.setState({ places: res.data });
      })
      .catch(err => console.log(err));
  }

  goCamera() {
    this.props.navigation.navigate('CameraScreen', { place: this.state.place });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>Please, define your place.</Text>
        <Picker
          style={{ width: 300 }}
          selectedValue={this.state.place}
          onValueChange={lang => this.setState({ place: lang })}>
          {this.state.places.map( item => (
            <Picker.Item label = {item.place} value = {item.place}> </Picker.Item>
          ) )}
        </Picker>
        <Button title="Camera" onPress={() => this.goCamera()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //addingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
