import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler'
import {NavigationContainer } from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register';

//firebase 사용
import firebase from 'firebase/app'; //기존 firebase => firbase/app
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
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen}         
        options={{headerShow : false}}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

