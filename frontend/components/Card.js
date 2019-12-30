import React, {Component} from "react";
import { Text, View } from 'react-native';

export default class Card extends Component{
    render(){
        return (
        <View style={{width: 50, height: 100}}>
            <Text>{this.props.type}</Text>
            <Text>{this.props.power}</Text>
            <Text>{this.props.color}</Text>
        </View>);
    }
}

