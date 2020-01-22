import React from "react";
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator
} from "react-native";
import axios from "axios";
import PlaceCard from "./PlaceCard";

var config = require("../config.json");

export default class GalleryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Gallery",
      headerRight: <View />
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isLoading: true
    };
  }

  componentDidMount() {
    axios
      .get(config.server + "/api/getAll")
      .then(res => {
        //console.log(res);
        this.setState({ images: res.data.reverse(), isLoading: false });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (!this.state.isLoading) {
      return (
        <View style={styles.container}>
          <View style={{ backgroundColor: "#465881", alignItems: "center" }}>
            <Text style={{ textAlign: "center", color: "white" }}>
              You have visited {this.state.images.length} places
            </Text>
          </View>
          <FlatList
            style={{ flex: 1 }}
            numColumns={2}
            horizontal={false}
            contentContainerStyle={styles.grid}
            data={this.state.images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <PlaceCard url={item.url} place={item.place} />
            )}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            style={{
              position: "absolute",
              bottom: 0,
              top: 0,
              left: 0,
              right: 0
            }}
            size={100}
            color="#fb5b5a"
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003f5c"
  },
  grid: { alignItems: "center", paddingVertical: 10 }
});
