import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
} from 'react-native';
import axios from 'axios';
import Card from './Card';

var config = require('../config.json');

export default class GalleryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Gallery',
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isLoading: true,
    };
  }

  componentDidMount(){
    axios.get(config.server +"/image/getAll").then(res => {
      console.log(res);
      this.setState({images: res.data.reverse(), isLoading: false});
    }).catch(err => console.log(err));
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ScrollView
            contentComponentStyle={{ justifyContent: 'center', flex: 1 }}>
            <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row' }}>
              <FlatList
                contentContainerStyle={styles.grid}
                data={this.state.images}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Card
                    url={item.url}
                    place={item.place}
                    correctness={item.score > 0.3}
                  />
                )}
              />
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  grid: { justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }
});