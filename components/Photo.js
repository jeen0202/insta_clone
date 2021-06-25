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
        <Tab.Navigator initialRouteName="AddFeed" labeled={false} barStyle={{backgroundColor: 'white'}}>
            <Tab.Screen name="AddFeed" component={AddFeedScreen} navigation={props.navigation}
            options={{
                tabBarLabel : "Feed"
            }}/>
            <Tab.Screen name="AddStory" component={AddStoryScreen} navigation={props.navigation}
            options={{
                tabBarLabel : "Story"
            }}/>
        </Tab.Navigator>
    )
}

const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
})

export default connect(mapStatetoProps,null)(Photo);