import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import SplashScreen from 'react-native-smart-splash-screen';

export default class SpleshScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        SplashScreen.close({
            animationType: SplashScreen.animationType.scale,
            duration: 2000,
            delay: 200,
        });
    }


    render() {
        return (
            <View>
                <StatusBar
                    backgroundColor={'#59ABE3'}
                    barStyle="light-content"
                />
            </View>
        );
    }
}
