import React, { Component } from 'react';
import { View, PermissionsAndroid } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from 'react-native-geolocation-service';

export async function request_location_runtime_permission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Employement Zone Location Permission',
                'message': 'Employement Zone App needs access to your location '
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            if (Platform.OS === 'android') {
                RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
                    .then(data => {
                        console.log('Location Permission Granted.')
                        Geolocation.getCurrentPosition(
                            (position) => {
                                console.log(position.coords.latitude, position.coords.longitude)
                            },
                            (error) => {
                                console.log(error.code, error.message);
                            },
                            { enableHighAccuracy: true }
                        );
                    }).catch(err => {
                        console.log('Location Permission Not Granted.')
                    });
            }
        }
        else {
            console.log('Location Permission Not Granted.')
        }
    } catch (err) {
        console.warn(err)
    }
}

export async function requestContactsPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                title: "Employement Zone App Contacts Permission",
                message:
                    "Employement Zone App needs access to your contacts " +
                    "so you can use contacts in app."
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the contacts");
        } else {
            console.log("Contacts permission denied");
        }
    } catch (err) {
        console.warn(err)
    }
}

export default class Permissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        request_location_runtime_permission();
        setTimeout(() => {
            requestContactsPermission();
        }, 800);
    }

    componentWillUnmount() {
        request_location_runtime_permission();
        setTimeout(() => {
            requestContactsPermission();
        }, 800);
    }

    render() {
        return (
            <View>
            </View>
        );
    }
}


