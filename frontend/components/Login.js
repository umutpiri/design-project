import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const config = require('../config.json');
import axios from 'axios';

axios.defaults.withCredentials = true;

export default class Login extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoading: false,
    };
    this.login = this.login.bind(this);
  }

  login() {
    if(this.state.isLoading == true)
      return;
    this.setState({isLoading: true});
    axios
      .post(config.server + '/login', {
        username: this.state.username,
        password: this.state.password,
      })
      .then(response => {
        this.setState({ isLoading: false });
        this.props.navigation.replace('MainMenu', {user: response.data});
      })
      .catch(error => {
        this.setState({ isLoading: false });
        console.log(error);
        alert('Could not login, check your credintials');
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>H-Travel</Text>
        <View style={styles.inputView}>
          <TextInput
            autoCapitalize={'none'}
            style={styles.inputText}
            placeholder="Username..."
            placeholderTextColor="#003f5c"
            value={this.state.username}
            onChangeText={text => this.setState({ username: text })}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            autoCapitalize={'none'}
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            value={this.state.password}
            onChangeText={text => this.setState({ password: text })}
            onSubmitEditing={this.login}
          />
        </View>
        {this.state.isLoading ? (
          <ActivityIndicator size='large' color='#fb5b5a'/>
        ) : (
          <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.loginBtn} onPress={this.login}>
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 15, paddingBottom: 10, paddingTop: 10 }}
              onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={styles.loginText}>Signup</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    marginBottom: 40,
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
  loginText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
