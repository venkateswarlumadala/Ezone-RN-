import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import FrameWork from './application/frameWork';

export default class EZone extends Component {
  render() {
    return (
      <FrameWork />
    );
  }
}


AppRegistry.registerComponent('EZone', () => EZone);