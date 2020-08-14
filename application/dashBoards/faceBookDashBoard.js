import React, { Component } from 'react';
import { View, Text, BackHandler, StatusBar, Alert, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../dashBoards/dashBoardStyles';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginManager} from 'react-native-fbsdk';


class FacebookDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
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
                        text: "Logout", onPress: () => this.SignOut()
                    }
                ],
                { cancelable: false }
            );
            return true;
        });
        AsyncStorage.getItem('firebaseUserCredential').then((user) => {
            let user_data = JSON.parse(user);
            this.setState({
                user: user_data,
                loggedIn: true
            });
        });
    }

    componentWillUnmount() {
        AsyncStorage.removeItem('firebaseUserCredential');
    }

    SignOut = async () => {
        try {
            await LoginManager.logOut();
            this.setState({ user: null, loggedIn: false });
            Actions.login();
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor={'#59ABE3'}
                    barStyle="light-content"
                />
                <View style={{ flex: 1 }}>
                {this.state.loggedIn &&
                        <View style={styles.container}>
                            <View style={styles.dp}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: this.state.user && this.state.user.photoURL }}
                                />
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={styles.title1}>Name</Text>
                                <Text style={styles.message}>{this.state.user && this.state.user.displayName}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={styles.title1}>Email</Text>
                                <Text style={styles.message}>{this.state.user && this.state.user.email}</Text>
                            </View>
                            <View style={styles.detailContainer}>
                                <Text style={styles.title1}>ID</Text>
                                <Text style={styles.message}>{this.state.user && this.state.user.uid}</Text>
                            </View>
                            <TouchableOpacity style={styles.googleSignOutButton} onPress={() => this.SignOut()}>
                                <Text>logout</Text>
                            </TouchableOpacity>
                        </View>}
                </View>
            </View>
        );
    }
}

export default FacebookDashBoard;
