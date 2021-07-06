import React from 'react'
import { StyleSheet } from 'react-native'
import { Container,Header,Right,Left,Icon,Text,Button } from 'native-base'
import {connect} from 'react-redux'

function MessageLobby(props) {

    return (
        <Container>
            <Header style={styles.header}>
            <Left style={{flexDirection:'row', alignItems:'center'}}>
            <Button transparent
            onPress={()=>props.navigation.navigate("Feed")}>
                <Icon name="arrowleft" type="AntDesign" style={{color:'black'}}/>
            </Button>
            <Text style={{fontWeight:'bold',fontSize:17}}>{props.currentUser.name}</Text>
            <Icon name='caret-down' type='FontAwesome' style={{paddingLeft:10,fontSize:14}}/>           
            </Left>
            <Right style={{flexDirection:'row', alignItems:'center'}}>
                <Button transparent
                    onPress={()=>{                                    
                    props.navigation.navigate('Search')
                }}>
                <Icon name='search' style={{color:'black',paddingRight:10, fontSize:23}}/>
                </Button>                
                <Button transparent>
                <Icon name='dots-vertical' type='MaterialCommunityIcons' style={{color:'black', fontSize:23}}/>
                </Button>
          </Right>
            </Header>
            <Text>Message Lobby!</Text>
        </Container>
    )
}
const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
    posts: store.userState.posts,
    feed : store.usersState.feed,
    following: store.userState.following
})

export default connect(mapStatetoProps,null)(MessageLobby);

const styles = StyleSheet.create({
    container : {
        flex : 1,                
    },
    header:{
        alignItems:'center',
        justifyContent:'flex-start',        
        backgroundColor:'white'
    },
    containerInfo:{
        margin :20,
        paddingTop:10,
    },
    containerGallery:{
        flex:1
    },
    containerImage: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    },
    button : {                              
        flex:1, justifyContent:'center', height:30, marginHorizontal:10, marginTop:10     
    }

})