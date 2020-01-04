import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import axios from 'axios';
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

var config = require('../config.json');

export default class CameraScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Photo',
    };
  };

  constructor(props){
    super(props);

    this.onCameraReady = this.onCameraReady.bind(this);
  }

  state = {
    hasPermission: null,
    hasLocation: null,
    previewUri: null,
    loading: false
  };

  async componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    // Camera roll Permission
    if (Platform.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });

    // Location Permission
    let { locationStatus } = await Permissions.askAsync(Permissions.LOCATION);
    this.setState({hasLocation: locationStatus === 'granted'});
  };

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({skipProcessing: true});
      console.log(photo);
      this.setState({ previewUri: photo.uri });
      let data = new FormData();
      let location = await Location.getCurrentPositionAsync({});
      var locationData = {longitude: location.coords.longitude, latitude: location.coords.latitude}
      console.log(locationData);
      data.append('location', JSON.stringify(locationData));
      /*const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [],
        {
          compress: 0.5,
        }
      );
      console.log(manipResult);*/
      await data.append('file', {
        uri: photo.uri,
        type: 'image/jpeg', // or photo.type
        name: 'photo.jpg',
      });
      axios
        .post(config.server + '/image/upload', data)
        .then(res => {
          console.log(res);
          if (res.status === 400) {
            Alert.alert(
              'Wrong',
              'it is not a photo of place',
              [
                {
                  text: 'Try Again',
                  onPress: () => this.setState({previewUri: null}),
                },
                {
                  text: 'Menu',
                  onPress: () => this.props.navigation.navigate('MainMenu'),
                },
              ],
              { cancelable: false }
            );
          } else {
            console.log(res);
            Alert.alert(
              'Congratulations',
              'You won a card from ' + res.data,
              [
                {
                  text: 'OK',
                  onPress: () => this.props.navigation.navigate('MainMenu'),
                },
              ],
              { cancelable: false }
            );
          }
        })
        .catch(err => Alert.alert(
          'Wrong',
          'it is not a photo of place',
          [
            {
              text: 'Try Again',
              onPress: () => this.setState({previewUri: null}),
            },
            {
              text: 'Menu',
              onPress: () => this.props.navigation.navigate('MainMenu'),
            },
          ],
          { cancelable: false }
        ));
    }
  };

  async onCameraReady(){
    var sizes = await this.camera.getAvailablePictureSizesAsync("4:3");
    console.log(sizes);
    if (sizes && sizes.length && sizes.length > 0)
    this.camera.pictureSize = sizes[0];
  }

  renderCamera(){
    if(this.state.loading)
      return(<View style={{flex: 1}}></View>);
    else
      return(
        <Camera
            style={{ flex: 1 }}
            onCameraReady={this.onCameraReady}
            ratio="4:3"
            type={this.state.cameraType}
            ref={ref => {
              this.camera = ref;
            }}
          />
      );
  }

  render() {
    const { hasPermission, hasLocation } = this.state;
    if (hasPermission === null || hasLocation === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {!this.state.previewUri ? this.renderCamera() : <Image style={{flex: 1}} source={{uri: this.state.previewUri}}/>}
          <View
            style={{
              height: 100,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {!this.state.previewUri ? (
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                onPress={() => this.takePicture()}>
                <FontAwesome
                  name="camera"
                  style={{ color: '#000', fontSize: 40, marginBottom: 10 }}
                />
              </TouchableOpacity>
            ) : (
              <ActivityIndicator
                style={{
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                size="small"
                color="#00ff00"
              />
            )}
          </View>
        </View>
      );
    }
  }
}
