import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground
} from "react-native";

const images = {
  water: require("../assets/water.png"),
  fire: require("../assets/fire.png"),
	earth: require("../assets/earth.png"),
	cardBack: require("../assets/h-card-back.png")
};

export default class GameCard extends Component {
  render() {
		if(this.props.cardState === "empty"){
			return (<View style={{width: 100, height: 150, borderWidth: 2, borderRadius: 5, backgroundColor: '#ccc'}}></View>);
		}
		else if(this.props.cardState === "unknown"){
			return(<View style={{width: 100, height: 150, borderWidth: 2, borderRadius: 5, backgroundColor: '#000'}}>
				<Image
          style={{
            flex: 1,
            margin: 5,
            width: undefined,
            height: undefined,
            overflow: "hidden",
            borderRadius: 5,
            backgroundColor: '#000'
          }}
          source={images.cardBack}
        ></Image>
			</View>)
		}
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
        <Image
          style={{
            flex: 1,
            margin: 5,
            width: undefined,
            height: undefined,
            overflow: "hidden",
            borderRadius: 5
          }}
          source={images[this.props.type]}
        ></Image>

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
              borderRadius: 15,
              borderWidth: 2,
              width: 30,
              height: 30,
              textAlign: "center",
              textAlignVertical: "center",
              overflow: 'hidden'
            }}
          >
            {this.props.power}
          </Text>
        </View>
      </View>
    );
  }
}
