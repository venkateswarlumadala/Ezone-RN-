import React, { Component } from 'react';
import { View, Text, BackHandler, StatusBar, Alert, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../dashBoards/dashBoardStyles';
import AsyncStorage from '@react-native-community/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';

class GoogleDashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pushData: [],
            loaded: false,
            loggedIn: false,
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
                        text: "Logout", onPress: () => this.signOut()
                    }
                ],
                { cancelable: false }
            );
            return true;
        });
        AsyncStorage.getItem('userInfo').then((user) => {
            let user_data = JSON.parse(user);
            this.setState({
                user: user_data,
                loaded: true,
                loggedIn: true
            });
        });
        this.getCurrentUserInfo();
        GoogleSignin.configure(
            {
                androidClientId: '92494933613-3lj7nks8gvto2adoh82u081kinfsfqks.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            });
    }

    componentWillUnmount() {
        AsyncStorage.removeItem('userInfo');
        this.getCurrentUserInfo();
        GoogleSignin.configure(
            {
                androidClientId: '92494933613-3lj7nks8gvto2adoh82u081kinfsfqks.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            });
    }

    getCurrentUserInfo = async () => {
        try {
            const userInfo = await GoogleSignin.signInSilently();
            this.setState({ userInfo });
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                this.setState({ loggedIn: false });
            } else {
                this.setState({ loggedIn: false });
            }
        }
    };

    signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
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
                    {this.state.loggedIn && <View>
                        <View style={styles.dp}>
                            <Image
                                style={styles.image}
                                source={{ uri: this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.photo }}
                            />
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={styles.title1}>Name</Text>
                            <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.name}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={styles.title1}>Email</Text>
                            <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.email}</Text>
                        </View>
                        <View style={styles.detailContainer}>
                            <Text style={styles.title1}>ID</Text>
                            <Text style={styles.message}>{this.state.userInfo && this.state.userInfo.user && this.state.userInfo.user.id}</Text>
                        </View>
                    </View>}
                    {this.state.loggedIn &&
                        <View>
                            <TouchableOpacity style={styles.googleSignOutButton} onPress={this.signOut}>
                                <Text style={styles.signInButtonColor} >logout</Text>
                            </TouchableOpacity>
                        </View>}
                </View>
            </View>
        );
    }
}

export default GoogleDashBoard;
