import React,{useState,useEffect} from 'react'
import {View,StyleSheet} from 'react-native'
import {Container,Text,Header,Footer,Content,Item,Right,List,ListItem,Icon, Button, Input} from 'native-base'

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
                    <ListItem noBorder>                        
                            <Icon name='person-outline'/>
                            <Text style={styles.messageBox}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>                        
                    </ListItem>
                    <ListItem noBorder style={{justifyContent:'flex-end'}}>
                            <Text style={styles.messageBox}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
                            <Icon name='person-outline'/>
                    </ListItem>
                </List>
            </Content>            
                <Item rounded>
                <Input placeholder="Rounded Text"/>
                <Button transparent>
                    <Text>Send</Text>
                </Button>
                </Item>            
        </Container>
    )
}

const styles = StyleSheet.create({
    container : {
        flex :1,
    },
    header:{
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    messageBox:{
        margin:5,
        paddingLeft:20,
        maxWidth:250,
        borderWidth:1,
        borderColor:'lightgrey',
        borderRadius:40,
    }
})

export default connect()(Message);