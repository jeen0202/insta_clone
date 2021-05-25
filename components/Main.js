import React, { Component } from 'react'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUser, fetchUserPosts} from '../redux/actions/index'

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
//bottom tab 사용
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
    return(null)
}
export class Main extends Component {
    componentDidMount(){
        this.props.fetchUser();
        this.props.fetchUserPosts();        
    }
    render() {
        // const {currentUser} = this.props;
        // console.log(currentUser);
        // if(currentUser==undefined){
        //     return(
        //         <View></View>
        //     )
        // }
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen name="Feed" component={FeedScreen}
                options={{
                    tabBarIcon : ({color, size}) => (
                        <MaterialCommunityIcons name ="home" color = {color} size = {26}/>
                    ),                    
                }} />
                <Tab.Screen name="Search" component={SearchScreen}
                options={{
                    tabBarIcon : ({color, size}) => (
                        <MaterialCommunityIcons name ="magnify" color = {color} size = {26}/>
                    ),                    
                }} />
                <Tab.Screen name="AddContainer" component={EmptyScreen}
                listeners= {({ navigation}) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Add")
                    }
                })}
                options={{
                    tabBarIcon : ({color, size}) => (
                        <MaterialCommunityIcons name ="plus-box" color = {color} size = {26}/>
                    ),                    
                }} />
                <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    tabBarIcon : ({color, size}) => (
                        <MaterialCommunityIcons name ="account-circle" color = {color} size = {26}/>
                    ),                    
                }} />                
          </Tab.Navigator>
            // <View style={{flex : 1, justifyContent : 'center'}}>
            //     <Text>{currentUser.name} is Logged In</Text>
            // </View>
        )
    }
}
const mapStateToProps = (store) => ({
    currentUser : store.userState.currentUser
})
const mapDispatchtoProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts},dispatch)

export default connect(mapStateToProps,mapDispatchtoProps)(Main)
