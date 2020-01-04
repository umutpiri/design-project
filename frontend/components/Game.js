import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  StatusBar,
	ImageBackground,
	FlatList
} from "react-native";

const config = require("../config.json");
import GameCard from "./GameCard";
import axios from "axios";

import io from "socket.io-client";

const GAME_STATES = {
  QUEUE: 0,
  GAME: 1,
  FINISH: 2
};

export default class Game extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  constructor(props) {
    super(props);
    this.state = {
      gameState: GAME_STATES.GAME,
      queueEntered: false,
      cards: [
        {
          color: "red",
          power: 5,
          type: "water"
        },
        {
          color: "blue",
          power: 2,
          type: "fire"
        },
        {
          color: "blue",
          power: 2,
          type: "earth"
        }
      ],
      opponent: "UMUT",
      opponentCard: {
        color: "purple",
        power: 1,
        type: "fire"
      },
      playedCard: {
        color: "red",
        power: 2,
        type: "fire"
      }
    };
    this.socket = io(config.server);
  }

  componentDidMount() {
    this.socket.on("connection", () => {
      console.log("Connected");
    });
    this.socket.on("disconnect", () => {
      console.log("Disconnected");
    });
    this.socket.on("update cards", cards => {
      console.log(cards);
    });
    this.socket.on("enter match", opponent => {
      console.log(opponent);
      this.setState({ opponent: opponent });
      this.enterMatch();
    });
  }

  enterQueue() {
    this.setState({ queueEntered: true });
    this.socket.emit("enter queue");
  }

  leaveQueue() {
    this.setState({ queueEntered: false });
    this.socket.emit("leave queue");
  }

  enterMatch() {
    this.setState({ gameState: GAME_STATES.GAME });
  }

  renderQueue() {
    if (this.state.queueEntered) {
      return (
        <View style={{ flexDirection: "row" }}>
          <Text>Waiting for opponent...</Text>
          <Button onPress={() => this.leaveQueue()} title="Exit Queue"></Button>
        </View>
      );
    } else {
      return (
        <Button onPress={() => this.enterQueue()} title="Enter Queue"></Button>
      );
    }
  }

  renderScreen() {
    if (this.state.gameState === GAME_STATES.QUEUE) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.renderQueue()}
        </View>
      );
    } else if (this.state.gameState === GAME_STATES.GAME) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', backgroundColor: "#D5D4D4" }}>
						<View style={{width: 50, height: 50}}></View>
            <Text>{this.state.opponent}</Text>
						<View style={{width: 50, height: 50}}></View>
          </View>
          <ImageBackground
            source={require("../assets/background.jpg")}
            style={{
              flex: 1,
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            <View style={{ alignItems: "center" }}>
              <GameCard
                color={this.state.opponentCard.color}
                power={this.state.opponentCard.power}
                type={this.state.opponentCard.type}
              ></GameCard>
            </View>
            <View style={{ alignItems: "center" }}>
              <GameCard
                color={this.state.opponentCard.color}
                power={this.state.opponentCard.power}
                type={this.state.opponentCard.type}
              ></GameCard>
            </View>
          </ImageBackground>
          <View style={{ height: 200, backgroundColor: '#AEADAD' }}>
            <FlatList
              contentContainerStyle={{
                flex: 1,
                justifyContent: "space-around",
                alignItems: "center",
								backgroundColor: "#D5D4D4",
								marginVertical: 10
              }}
              horizontal={true}
              data={this.state.cards}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ paddingTop: 15 }}>
                  <GameCard
                    color={item.color}
                    type={item.type}
                    power={item.power}
                  ></GameCard>
                </View>
              )}
            />
          </View>
        </View>
      );
    } else if (this.state.gameState === GAME_STATES.FINISH) {
      return (
        <View>
          <Text>FINISH</Text>
        </View>
      );
    } else {
      return <View>blank</View>;
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: StatusBar.currentHeight }}></View>
        {this.renderScreen()}
      </View>
    );
  }
}
