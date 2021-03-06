import React, {Component} from 'react';
import 'react-native-gesture-handler'
import {NavigationContainer } from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {View,} from 'react-native'

import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import AddStoryScreen from './components/main/AddStory'
import StoryScreen from './components/main/Story'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'
import MessageLobby from './components/main/MessageLobby';
import MessageScreen from './components/main/Message'
import SearchScreen from './components/main/Search'
import AddProfileScreen from './components/main/AddProfile'
import NewPrifileScreen from './components/main/NewProfile'
import PhotoScreen from './components/Photo'
//header 변역
import { Root, Spinner, Text } from "native-base";
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
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
  async componentDidMount(){
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
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
        <View style={{flex : 1, justifyContent : 'center', alignItems:'center'}}>
          <Text>Now Loading...</Text>
          <Spinner/>
        </View>
      )
    }
    if(!loggedIn){
      return (
        <Root>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Register">            
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
            <Stack.Screen name="Login" component={LoginScreen} navigtaion={this.props.navigation} options={{headerShown:false}}/>
          </Stack.Navigator>
        </NavigationContainer>
        </Root>
      );
    }
    return(
      <Provider store = {store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={MainScreen} navigtaion={this.props.navigation} options={{headerShown:false}}/>
              <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation} options={{headerShown:false}}/>
              <Stack.Screen name="AddStory" component={AddStoryScreen} navigation={this.props.navigation} options={{headerShown:false}}/>
              <Stack.Screen name="NewProfile" component={NewPrifileScreen} navigation={this.props.navigation} options ={{headerShown:false}}/>
              <Stack.Screen name="AddProfile" component={AddProfileScreen} navigation={this.props.navigation} options={{headerShown:false}}/>
              <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation} options={{headerShown:false}}/>
              <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation} options={{headerShown:false}}/>
              <Stack.Screen name="MessageLobby" component={MessageLobby} navigation={this.props.navigation} options={{headerShown:false}}/>
              <Stack.Screen name="Message" component={MessageScreen} navigation={this.props.navigation} options={{headerShown:false}}/>
              <Stack.Screen name="Story" component={StoryScreen} navigation = {this.props.navigation} options={{headerShown: false}}/>
              <Stack.Screen name="Photo" component={PhotoScreen} navigation = {this.props.navigation} options={{headerShown: false}}/>
              <Stack.Screen name="Search" component={SearchScreen} navigation={this.props.navigation} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
      </Provider>
    )
  }
}

export default App

