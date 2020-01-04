import React, { Component } from "react";
import { Text, View, Image, StyleSheet, Dimensions, ImageBackground } from "react-native";

const images = {
	water: require('../assets/water.png'),
	fire: require('../assets/fire.png'),
	earth: require('../assets/earth.png')
}

export default class GameCard extends Component {
  render() {
    return (
      <View
        style={{
          width: 100,
          height: 150,
          borderWidth: 2,
          borderRadius: 5,
          justifyContent: "center",
          backgroundColor: this.props.color || "white"
        }}
      >
        <ImageBackground source={images[this.props.type]} style={{ flex: 1, margin: 5}}>
          <Text>{this.props.type}</Text>
        </ImageBackground>
        <View
          style={{
            position: "absolute",
            top: -15,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              backgroundColor: "white",
              borderRadius: 50,
              borderWidth: 2,
              width: 30,
              height: 30,
              textAlign: "center",
              textAlignVertical: "center"
            }}
          >
            {this.props.power}
          </Text>
        </View>
      </View>
    );
  }
}
