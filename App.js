import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {StackNavigator} from 'react-navigation'
import MainScreen from './components/MainScreen'

export default function App() {
  return (    
      <AppStackNavigator/> 
  );
}

const AppStackNavigator = StackNavigator({
  Main:{
    screen: MainScreen
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
