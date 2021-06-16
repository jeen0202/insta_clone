import React from 'react'
import {connect} from 'react-redux'
import {StyleSheet} from 'react-native'
import { Container, Content, Text } from 'native-base'
function Story(props) {

    return (
        <Container style={{flex:1}}>
            <Content contentContainerStyle={styles.content}>
                <Text>Story Screen</Text>
                <Text>Seleted Index is {props.route.params.selectedIndex}</Text>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    content:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})
const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
    following: store.userState.following,        
    usersFollowingLoaded : store.usersState.usersFollowingLoaded,
})

export default connect(mapStatetoProps,null)(Story);