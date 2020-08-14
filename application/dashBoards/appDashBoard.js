import React, { Component } from 'react';
import { View, Text, BackHandler, StatusBar, Alert, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../dashBoards/dashBoardStyles';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';

class AppDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
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
                        text: "Logout", onPress: () => this.logout()
                    }
                ],
                { cancelable: false }
            );
            return true;
        });
        AsyncStorage.getItem('createdUser').then((user) => {
            let user_data = JSON.parse(user);
            this.setState({
                user: user_data,
                loaded: true
            });
        });
    }

    componentWillUnmount() {
        AsyncStorage.removeItem('createdUser');
    }

    logout() {
        auth().signOut().then(() => Actions.login())
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor={'#59ABE3'}
                    barStyle="light-content"
                />
                <View style={styles.title}>
                    <Image source={require('../images/logo.png')} style={styles.image} />
                </View>
                {this.state.user &&
                    <View style={styles.container}>
                        <View style={styles.detailContainer} >
                            <Text style={{ textAlign: 'center' }} >{this.state.user.email}</Text>
                        </View>
                        <TouchableOpacity style={styles.googleSignOutButton} onPress={() => this.logout()}>
                            <Text>logout</Text>
                        </TouchableOpacity>
                    </View>}
            </View>
        );
    }
}

export default AppDashBoard;