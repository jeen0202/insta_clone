import React,{useState,useEffect} from 'react'
import {View, Text, Image,StyleSheet} from 'react-native'
import {Container,Header,Content,Left,Right,Body,List,ListItem,Icon, Button, Thumbnail} from 'native-base'

import firebase from 'firebase'
require('firebase/firestore')

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUsersData} from '../../redux/actions/index'
import insta_logo from '../../assets/insta_logo.png'


function Message(props){
    const [messages, setMessages] = useState([])    
    const [text, setText] = useState("")   
    
    return (
        <Container>
            <Header style={styles.header}>
                <Button transparent
                    onPress={()=>{
                        props.navigation.pop(1)
                    }}>
                    <Icon name="arrow-back" style={{color:'black'}}></Icon>
                </Button>                                
                <Icon name='person-circle-outline'/>
                <Text style={{fontWeight:'bold',fontSize:20,marginLeft:5,}}>
                    {props.route.params.selectedUser}
                </Text>                
                <Right>
                    <Button transparent
                        onPress={()=>{                                    
                        props.navigation.navigate('Search')
                    }}>
                    <Icon name='search' style={{color:'black'}}/>
                    </Button>
                    <Button transparent>
                    <Icon name='heart' style={{color:'black'}}/>
                    </Button>
                    <Button transparent>
                    <Icon name='ellipsis-horizontal-outline' style={{color:'black'}}/>
                    </Button>
                </Right>
            </Header>
            <Content>
                <List>
                    <ListItem avatar>
                        <Left>
                            <Icon name='person-outline'/>
                        </Left>
                        <Body>
                            <Text style={{fontWeight:'bold'}}>hello</Text>
                        </Body>
                    </ListItem>
                </List>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    container : {
        flex :1,
    },
    header:{
        alignItems:'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
})

export default connect()(Message);