import React, { Component } from 'react';
import { View, Text, BackHandler, StatusBar, Alert, Image, TouchableOpacity } from 'react-native';
import styles from '../landingPage/landingStyles';
import Permissions from '../../components/permissions'
import SpleshScreen from '../../components/splashscreen'
import { Actions } from 'react-native-router-flux';

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                "EXIT",
                "Are you sure you want to Exit?",
                [
                    {
                        text: "Cancel",
                        onPress: () => {
                            console.log("Cancel Pressed");
                        },
                        style: "cancel"
                    },
                    {
                        text: "Exit",
                        onPress: () => BackHandler.exitApp()
                    }
                ],
                { cancelable: false }
            );
            return true;
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <SpleshScreen />
                <Permissions />
                <StatusBar
                    backgroundColor={styles.defaultColor}
                    barStyle="light-content"
                />
                <View style={styles.title}>
                    <Image source={require('../../images/logo.png')} style={styles.image} />
                    <Text style={styles.text1}>Ezone</Text>
                </View>
                <TouchableOpacity style={styles.titleText} onPress={() => Actions.signUp()}>
                    <Text style={styles.text}>Get Started</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default LandingPage;