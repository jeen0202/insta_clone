import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {StyleSheet} from 'react-native'
import { Container, Content, Text } from 'native-base'
function Story(props) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(()=>{
        setSelectedIndex(props.route.params.selectedIndex)
    },[props.route.params.selectedIndex])
    return (
        <Container style={{flex:1}}>
            <Content contentContainerStyle={styles.content}>
                <Text>Story Screen</Text>
                <Text>Seleted Index is {selectedIndex}</Text>
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