import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';

const config = require('../config.json');
import axios from 'axios';

axios.defaults.withCredentials = true;

export default class Register extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      password2: '',
      isLoading: false,
    };

    this.register = this.register.bind(this);
  }

  register() {
    if (this.state.isLoading == true) return;
    if (this.state.password !== this.state.password2) {
      Alert.alert('Password not match!');
      return;
    }
    if (this.state.username.length < 3) {
      Alert.alert('Username too short!');
      return;
    }
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!reg.test(this.state.email)){
      Alert.alert('Email address is not valid!');
      return;
    }
    this.setState({ isLoading: true });
    axios
      .post(config.server + '/register', {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
      })
      .then(response => {
        this.setState({ isLoading: false });
        this.props.navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
        this.setState({ isLoading: false });
        alert('Could not Register, an error occured!');
      });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={styles.logo}>H-Travel</Text>
        <Text style={styles.loginText}>Register</Text>
        <View style={styles.inputView}>
          <TextInput
            autoCapitalize={'none'}
            style={styles.inputText}
            placeholder="Email..."
            placeholderTextColor="#003f5c"
            value={this.state.email}
            onChangeText={text => this.setState({ email: text })}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this.secondTextInput.focus();
            }}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            ref={input => {
              this.secondTextInput = input;
            }}
            autoCapitalize={'none'}
            style={styles.inputText}
            placeholder="Username..."
            placeholderTextColor="#003f5c"
            value={this.state.username}
            onChangeText={text => this.setState({ username: text })}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this.thirdTextInput.focus();
            }}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            ref={input => {
              this.thirdTextInput = input;
            }}
            autoCapitalize={'none'}
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            value={this.state.password}
            onChangeText={text => this.setState({ password: text })}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              this.fourthTextInput.focus();
            }}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            ref={input => {
              this.fourthTextInput = input;
            }}
            autoCapitalize={'none'}
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            value={this.state.password2}
            onChangeText={text => this.setState({ password2: text })}
            onSubmitEditing={this.register}
            blurOnSubmit={true}
          />
        </View>
        {this.state.isLoading ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={this.register}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#fb5b5a',
    marginBottom: 30,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#465881',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'white',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#fb5b5a',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  registerText: {
    color: 'white',
  },
  loginText: {
    color: 'white',
    marginBottom: 30,
  },
});
