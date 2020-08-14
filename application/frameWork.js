import React, { Component } from 'react';
import { Scene, Router, Actions } from 'react-native-router-flux';
import Loading from './components/loading';
import LandingPage from './routing/landingPage/landingPage';
import SignUp from './routing/signupPage/signupPage';
import Login from './routing/loginPage/loginPage';
import ForgetPassword from './components/forgetPassword'
import AppDashBoard from './dashBoards/appDashBoard';
import FacebookDashBoard from './dashBoards/faceBookDashBoard';
import GoogleDashBoard from './dashBoards/googleDashBoard';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

export default class FrameWork extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loader: true,
            errors: ''
        }
    }

    componentDidMount() {
        this.authListener()
    }

    componentWillUnmount() {
        this.authListener()
    }

    authListener = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                if (user && user.emailVerified) {
                    this.setState({ loader: false })
                    Actions.push(AppDashBoard)
                } else {
                    this.setState({ errors: "Please verify Account details" })
                }
            } else {
                this.setState({ loader: false })
                Actions.push(Login)
            }
        });
    };


    render() {
        return (
            this.state.loader ? <Loading /> :
                <Router>
                    <Scene key="root">
                        <Scene key="landing" component={LandingPage} title="Landing" type="replace" hideNavBar initial={true} />
                        <Scene key="signUp" component={SignUp} title="SignUp" type="replace" hideNavBar />
                        <Scene key="login" component={Login} title="Login" type="replace" hideNavBar />
                        <Scene key="forgetPassword" component={ForgetPassword} title="ForgetPassword" type="replace" hideNavBar />
                        <Scene key="appDashBoard" component={AppDashBoard} title="App" type="replace" hideNavBar />
                        <Scene key="facebookDashBoard" component={FacebookDashBoard} title="FacebookDashBoard" type="replace" hideNavBar />
                        <Scene key="googleDashBoard" component={GoogleDashBoard} title="GoogleDashBoard" type="replace" hideNavBar />
                    </Scene>
                </Router>
        );

    }
}