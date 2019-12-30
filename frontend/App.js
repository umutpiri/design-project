import * as React from "react";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Button,
    FlatList
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import Card from "./components/Card";

// You can import from local files
import AssetExample from "./components/AssetExample";

// or any pure javascript modules available in npm
//import { Card } from 'react-native-paper';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import io from "socket.io-client";
/*
let serverEndpoints = {
  login: 'https://hucard-backend.herokuapp.com/login',
  game: 'https://hucard-backend.herokuapp.com',
};
*/
//Buna bir çözüm bulmaya çalışıcam, şimdilik yorum satırı kullanalım. TODO
let serverEndpoints = {
    login: "http://192.168.1.31:8383/login",
    game: "http://192.168.1.31:8383"
};

axios.defaults.withCredentials = true;

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state={
          match: null
        }
        this.socket = io(serverEndpoints["game"]);
    }

    componentDidMount() {
        this.socket.on("connect", () => {
            console.log("Connected");
        });
        this.socket.on("disconnect", () => {
            console.log("Disconnected");
        });
        this.socket.on("event", event => {
            console.log(event);
        });
        this.socket.on("joined queue", () => {
            console.log("joined queue");
        });
        this.socket.on("match found", match => {
            this.setState({ match: match });
        });
    }

    enterQueue() {
        this.socket.emit("enter queue");
    }

    logout() {
        delete axios.defaults.headers.common["Authorization"];
        this.props.navigation.navigate("Login");
    }

    renderGame() {
        if (this.state.match) {
            return (
                <FlatList
                    horizontal={true}
                    data={this.state.match.hand}
                    keyExtractor={(item, index) => (index + 10).toString()}
                    renderItem={({item}) => (
                      <Card type={item.type} color={item.color} power={item.power}></Card>
                    )}
                ></FlatList>
            );
        } else {
            return (
                <View>
                    <Text>Loading</Text>
                </View>
            );
        }
    }

    render() {
        return (
            <View>
                <Text>Game main page</Text>
                <Button title="Enter Queue" onPress={() => this.enterQueue()} />
                <Button title="logout" onPress={() => this.logout()} />
                {this.renderGame()}
            </View>
        );
    }
}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "umut",
            password: "password"
        };
    }
    render() {
        const { navigate } = this.props.navigation;
        var onLoginSubmit = () => {
            axios
                .post(serverEndpoints["login"], {
                    username: this.state.username,
                    password: this.state.password
                })
                .then(response => {
                    if (response.status === 401) {
                        throw new Error("Auth faild");
                    }

                    console.log("Logged in");
                    navigate("Game");
                })
                .catch(error => {
                    console.log(error);
                    alert("Could not login, check your credintials");
                });
        };
        return (
            <View>
                <TextInput
                    placeholder="username"
                    style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                    value={this.state.username}
                    onChangeText={text => {
                        this.setState({ username: text });
                    }}
                />
                <TextInput
                    placeholder="password"
                    secureTextEntry={true}
                    style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                    value={this.state.password}
                    onChangeText={text => {
                        this.setState({ password: text });
                    }}
                />
                <Button title="Login" onPress={() => onLoginSubmit()} />
            </View>
        );
    }
}

const MainNavigator = createStackNavigator({
    Login: { screen: Login },
    Game: { screen: Game }
});

const App = createAppContainer(MainNavigator);

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#ecf0f1",
        padding: 8
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    }
});
