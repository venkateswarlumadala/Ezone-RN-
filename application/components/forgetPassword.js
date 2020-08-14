import React, { Component } from 'react';
import { View, Text, BackHandler, Alert, StatusBar, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

export default class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errors: [],
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.login();
            return true;
        });
    }

    isFormValid = ({ email }) => {
        let errors = [];
        let error
        if (email.length > 0) {
            return true
        } else {
            error = { message: "Please enter valid user email" }
            this.setState({ errors: errors.concat(error) })
        }
    }

    forgetPassword = () => {
        this.setState({ errors: [] })
        if (this.isFormValid(this.state)) {
            firebase.auth().sendPasswordResetEmail(this.state.email)
                .then(() => {
                    Alert.alert("An email has been sent to reset your password")
                    setTimeout(() => {
                        Actions.login()
                    }, 500)
                })
                .catch(err => {
                    this.setState({ errors: this.state.errors.concat(err), loading: false })
                })
        }

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
                <StatusBar backgroundColor={'#59ABE3'} barStyle="light-content" />
                <View style={styles.title}>
                    <Image source={require('../images/logo.png')} style={styles.image} />
                    <Text style={styles.text1}>Forget Password</Text>
                </View>
                <View style={styles.customLoginView}>
                    <View style={styles.itemStyle}>
                        <MaterialIcons style={styles.iconSpace} size={20} name="email" />
                        <TextInput style={`s ${this.handleInputErrors(errors, "email")}`, styles.textBoxStyle} placeholder="Email" placeholderTextColor="#788082" keyboardType={"email-address"} onChangeText={(text) => this.setState({ email: text })} />
                    </View>
                    <TouchableOpacity style={styles.signInButton} onPress={() => this.forgetPassword()} >
                        <Text style={styles.signInButtonColor} >Submit</Text>
                    </TouchableOpacity>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 100,
        height: 100
    },
    text1: {
        color: '#6fcce8',
        fontSize: 30
    },
    customLoginView: {
        flex: 1,
        margin: 10
    },
    itemStyle: {
        flexDirection: 'row',
        margin: 10,
        borderWidth: 1,
        borderColor: '#6b736b',
        borderRadius: 10
    },
    iconSpace: {
        margin: 10,
        alignSelf: 'center',
        color: '#b189e8'
    },
    textBoxStyle: {
        width: '80%',
        fontSize: 16
    },
    signInButton: {
        margin: 15,
        width: 175,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
        backgroundColor: '#6fcce8',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#6fcce8'
    },
    signInButtonColor: {
        color: 'white',
        fontSize: 18
    },
    errorContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -200,
        marginBottom: 20,
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 2,
        backgroundColor: '#d62d20',
        borderColor: '#d62d20',
        borderRadius: 5
    },
    errorTextStyle: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: '400'
    }
})
