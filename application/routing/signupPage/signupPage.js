import React, { Component } from 'react';
import { View, Text, BackHandler, Alert, ScrollView, StatusBar, Image, TextInput, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../signupPage/signupStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import '@react-native-firebase/database';


class SignupPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Username: '',
            phoneNumber: '',
            email: '',
            password: '',
            confirmPassword: '',
            eyeIcon: 'eye-slash',
            eye: 'eye-slash',
            errorMessage: null,
            errors: [],
            loading: false,
            isPasswordShow: true,
            isVisible: true,
            ezoneUser: firebase.database().ref("User Details")
        };
    }


    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.landing();
            return true;
        });
    }


    isFormEmpty = ({ Username, email, password, confirmPassword }) => {
        return !Username.length || !email.length || !password.length || !confirmPassword.length
    }


    passwordMatch = ({ password, confirmPassword }) => {
        if (password.length < 6 || confirmPassword.length < 6) {
            return false
        }
        else if (password !== confirmPassword) {
            return false
        }
        else {
            return true
        }
    }


    isFormVaildate = () => {
        let errors = [];
        let error;
        if (!this.isFormEmpty(this.state)) {
            error = { message: "Please fill all the details" }
            this.setState({ errors: errors.concat(error) })
            return false
        }
        else if (!this.passwordMatch(this.state)) {
            error = { message: "Password is Invalid" }
            this.setState({ errors: errors.concat(error) })
            return false
        }
        else {
            return true
        }
    }


    handleSignUp = () => {
        if (this.isFormVaildate()) {
            this.setState({ errors: [], loading: true })
            auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser);
                    this.saveUserData(createdUser);
                })
                .then(() => {
                    auth().currentUser.sendEmailVerification()
                        .then(alt => {
                            Alert.alert("verification link has sent to your mail please verify the account")
                            this.setState({ loading: true })
                            Actions.login()
                        })
                })
                .catch(err => {
                    this.setState({ errors: this.state.errors.concat(err), loading: false })
                })
        }
    }


    saveUserData = (createdUser) => {
        return this.state.ezoneUser.child(createdUser.user.uid).set({
            Username: this.state.Username,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        })
    }


    handleInputErrors = (errors, InputType) => {
        return errors.some(error =>
            error.message.toLowerCase().includes(InputType)
        ) ?
            "input-error" : "";
    }


    displayErrors = errors => errors.map((error, i) => <Text key={i} style={{ textAlign: 'center' }}>{error.message}</Text>);


    render() {
        const { errors } = this.state
        return (
            <View style={styles.container}>
                <ScrollView >
                    <StatusBar backgroundColor={styles.defaultColor} barStyle="light-content" />
                    <View style={styles.title}>
                        <Image source={require('../../images/logo.png')} style={styles.image} />
                        <Text style={styles.text1}>SIGN UP</Text>
                    </View>
                    <View style={styles.customLoginView}>
                        <View style={styles.itemStyle}>
                            <Icon style={styles.iconSpace} size={20} name="user" />
                            <TextInput style={`${this.handleInputErrors(errors, "name")}`, styles.textBoxStyle} placeholder="Username" placeholderTextColor="#788082" keyboardType={"default"} onChangeText={(text) => this.setState({ username: text })} />
                        </View>
                        <View style={styles.itemStyle}>
                            <MaterialIcons style={styles.iconSpace} size={20} name="smartphone" />
                            <TextInput style={`${this.handleInputErrors(errors, "phone")}`, styles.textBoxStyle} placeholder="Phonenumber" placeholderTextColor="#788082" keyboardType={"phone-pad"} onChangeText={(text) => this.setState({ phoneNumber: text.replace(/[^0-9]/g, '') })} />
                        </View>
                        <View style={styles.itemStyle}>
                            <MaterialIcons style={styles.iconSpace} size={20} name="email" />
                            <TextInput style={`${this.handleInputErrors(errors, "email")}`, styles.textBoxStyle} placeholder="Email" placeholderTextColor="#788082" keyboardType={"email-address"} onChangeText={(text) => this.setState({ email: text })} />
                        </View>
                        <View style={styles.itemStyle}>
                            <MaterialCommunityIcons style={styles.iconSpace} size={20} name="shield-key" />
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput style={`${this.handleInputErrors(errors, "password")}`, styles.textBoxStyle} placeholder="Password" placeholderTextColor="#788082" secureTextEntry={this.state.isPasswordShow} onChangeText={(text) => this.setState({ password: text })} />
                                <Icon style={styles.iconSpace} size={20} name={this.state.eyeIcon} onPress={() => this.setState({ eyeIcon: this.state.eyeIcon === 'eye-slash' ? 'eye' : 'eye-slash', isPasswordShow: !this.state.isPasswordShow })} />
                            </View>
                        </View>
                        <View style={styles.itemStyle}>
                            <MaterialCommunityIcons style={styles.iconSpace} size={20} name="shield-key" />
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput style={`${this.handleInputErrors(errors, "confirmPassword")}`, styles.textBoxStyle} placeholder="Confirm Password" placeholderTextColor="#788082" secureTextEntry={this.state.isVisible} onChangeText={(text) => this.setState({ confirmPassword: text })} />
                                <Icon style={styles.iconSpace} size={20} name={this.state.eye} onPress={() => this.setState({ eye: this.state.eye === 'eye-slash' ? 'eye' : 'eye-slash', isVisible: !this.state.isVisible })} />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.signInButton} onPress={() => this.handleSignUp()} >
                            <Text style={styles.signInButtonColor} >SignUp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Actions.login()}>
                            <Text style={styles.extrasTextStyle}>Already have an account? Login</Text>
                        </TouchableOpacity>
                        {this.state.errors.length > 0 && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorTextStyle}>Error: {this.displayErrors(errors)}</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        )
    }
}


export default SignupPage;