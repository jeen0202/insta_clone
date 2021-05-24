import React, { Component } from 'react'
import {View, Text } from 'react-native'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUser} from '../redux/actions/index'

import FeedScreen from './main/Feed'
//bottom tab 사용
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

export class Main extends Component {
    componentDidMount(){
        this.props.fetchUser();
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
            <Tab.Navigator>
                <Tab.Screen name="Feed" component={FeedScreen} />                
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
const mapDispatchtoProps = (dispatch) => bindActionCreators({fetchUser},dispatch)

export default connect(mapStateToProps,mapDispatchtoProps)(Main)
