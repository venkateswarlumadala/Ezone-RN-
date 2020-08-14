import React, { Component } from 'react';
import { View, Text, BackHandler, StatusBar, Image, TextInput, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../loginPage/loginStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            eyeIcon: 'eye-slash',
            errors: [],
            isPasswordShow: true,
            loading: false,
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.landing();
            return true;
        });
        GoogleSignin.configure(
            {
                androidClientId: '92494933613-3lj7nks8gvto2adoh82u081kinfsfqks.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            });
    }


    componentWillUnmount() {
        GoogleSignin.configure(
            {
                androidClientId: '92494933613-3lj7nks8gvto2adoh82u081kinfsfqks.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            });
    }


    isFormValid = ({ email, password }) => {
        let errors = [];
        let error
        if (email.length > 0 && password.length > 0) {
            return true
        } else {
            error = { message: "Please enter valid email and password" }
            this.setState({ errors: errors.concat(error) })
        }
    }


    submit = () => {
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true })
            let error;
            let errors = [];
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                    firebase.auth().onAuthStateChanged((createdUser) => {
                        AsyncStorage.setItem('createdUser', JSON.stringify(createdUser));
                        if (createdUser) {
                            if (createdUser && createdUser.emailVerified) {
                                console.log('User account created & signed in!');
                                Actions.appDashBoard()
                            } else {
                                error = { message: "Please verify Account details" }
                                this.setState({ errors: errors.concat(error) })
                            }
                        } else {
                            Actions.login()
                        }
                    })
                })
                .catch(err => {
                    this.setState({ errors: this.state.errors.concat(err), loading: false })
                })
        }
    }


    displayErrors = errors => errors.map((error, i) => <Text key={i} style={{ textAlign: 'center' }}>{error.message}</Text>);

    handleInputErrors = (errors, InputType) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(InputType)
        ) ?
            "input-error" : "";
    }

    async Facebooklogin() {
        try {
            const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
            if (result.isCancelled) {
                throw new Error("User cancelled request");
            }
            console.log(
                `Login success with permissions: ${result.grantedPermissions.toString()}`
            );
            const data = await AccessToken.getCurrentAccessToken();
            if (!data) {
                throw new Error("Something went wrong obtaining the users access token");
            }
            const facebookCredential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
            return firebase.auth().signInWithCredential(facebookCredential)
                .then((firebaseUserCredential) => {
                    AsyncStorage.setItem('firebaseUserCredential', JSON.stringify(firebaseUserCredential.user.toJSON()));
                    Actions.facebookDashBoard()
                }).catch(error => {
                    console.log(error);
                });
        } catch (e) {
            console.error(e);
        }
    }

    loginWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signIn().then((userInfo) => {
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo.user));
                Actions.googleDashBoard();
            });
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log("user cancelled the login flow");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log("operation (f.e. sign in) is in progress already");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log("play services not available or outdated");
            } else {
                console.log("some other error happened");
            }
        }
    };

    render() {
        const { errors } = this.state
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor={styles.defaultColor}
                    barStyle="light-content"
                />
                <View style={styles.title}>
                    <Image source={require('../../images/logo.png')} style={styles.image} />
                    <Text style={styles.text1}>LOGIN</Text>
                </View>
                <View style={styles.customLoginView}>
                    <View style={styles.itemStyle}>
                        <MaterialIcons style={styles.iconSpace} size={20} name="email" />
                        <TextInput style={`s ${this.handleInputErrors(errors, "email")}`, styles.textBoxStyle} placeholder="Email" keyboardType={"email-address"} onChangeText={(text) => this.setState({ email: text })} />
                    </View>
                    <View style={styles.itemStyle}>
                        <MaterialCommunityIcons style={styles.iconSpace} size={20} name="shield-key" />
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput style={`s ${this.handleInputErrors(errors, "password")}`, styles.textBoxStyle} placeholder="Password" secureTextEntry={this.state.isPasswordShow} onChangeText={(text) => this.setState({ password: text })} />
                            <Icon style={styles.iconSpace} size={20} name={this.state.eyeIcon} onPress={() => this.setState({ eyeIcon: this.state.eyeIcon === 'eye-slash' ? 'eye' : 'eye-slash', isPasswordShow: !this.state.isPasswordShow })} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.signInButton} onPress={() => this.submit()} >
                        <Text style={styles.signInButtonColor} >Sign in</Text>
                    </TouchableOpacity>
                    <View style={styles.orContainer}>
                        <Text style={{ fontSize: 18 }}>or</Text>
                    </View>
                    <View style={styles.socialIconsView}>
                        <TouchableOpacity style={styles.fbLoginButton} onPress={this.Facebooklogin}>
                            <Icon name="facebook" color="white" size={30} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.googleLoginButton} onPress={() => this.loginWithGoogle()}>
                            <Icon name="google" color="white" size={30} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.extraContainer}>
                        <TouchableOpacity onPress={() => Actions.signUp()}>
                            <Text style={styles.extrasTextStyle}>Create an account</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Actions.forgetPassword()}>
                            <Text style={styles.extrasTextStyle}>Forgot password ? </Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.errors.length > 0 && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorTextStyle}>Error: {this.displayErrors(errors)}</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    }
}

export default LoginPage;