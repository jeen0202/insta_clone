import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import 'react-native-gesture-handler'
import {NavigationContainer } from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'

import {View, Text } from 'react-native'
//firebase 사용
import firebase from 'firebase/app'; //기존 firebase => firbase/app
//redux 사용
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))
//firbase console에서 config 복붙
const firebaseConfig = {
  apiKey: "AIzaSyDdJmkm74EDyksSyfKuGdvCkhebsLEmm90",
  authDomain: "insta-clone-f4cda.firebaseapp.com",
  projectId: "insta-clone-f4cda",
  storageBucket: "insta-clone-f4cda.appspot.com",
  messagingSenderId: "650587959480",
  appId: "1:650587959480:web:5b1e88d74d5865d507444d",
  measurementId: "G-MF4KN4LSC4"
};
//firebase 초기화
if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}
const Stack = createStackNavigator(); 

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded : false,

    }
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(((user)=> {
      if(!user){
        this.setState({
          loggedIn : false,
          loaded : true,
        })
      }else{
        this.setState({
          loggedIn : true,
          loaded : true,
        })
      }
    }))
  }
  render() {
    const { loggedIn, loaded } = this.state
    if(!loaded){
      return(
        <View style={{flex : 1, justifyContent : 'center'}}>
          <Text>Loading...</Text>
        </View>
      )
    }
    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen}         
            options={{headerShow : false}}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return(
      <Provider store = {store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={MainScreen}         
              options={{headerShow : false}}/>
        </Stack.Navigator>
      </NavigationContainer>
      </Provider>
    )
  }
}

export default App

