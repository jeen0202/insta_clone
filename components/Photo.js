import React,{Component} from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import AddFeedScreen from './main/Add'
import AddStoryScreen from './main/AddStory'

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
    return null
}
function Photo(props) {
    return (
        <Tab.Navigator initialRouteName="AddFeed" labeled={true} barStyle={{backgroundColor: 'black'}}
        screenOptions={{
        tabBarColor:'white'            
        }}>
            <Tab.Screen name="피드" component={AddFeedScreen} navigation={props.navigation}
            />
            <Tab.Screen name="스토리" component={AddStoryScreen} navigation={props.navigation}
            />
        </Tab.Navigator>
    )
}

const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
})
export default connect(mapStatetoProps,null)(Photo);