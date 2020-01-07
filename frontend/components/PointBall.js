import React from 'react';
import { View } from 'react-native';

const DOT_OFFSET = 17;

export default class PointBall extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[{
          width: this.props.size || 30,
          height: this.props.size || 30,
          borderRadius: this.props.size || 30,
          borderColor: 'white',
          borderWidth: 2,
          backgroundColor: this.props.item,
          zIndex: this.props.index ? 9 - this.props.index : 10,
        }, {...this.props.style}]}
      />
    );
  }
}
