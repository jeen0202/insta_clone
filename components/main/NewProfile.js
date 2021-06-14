import React, {useState, useEffect} from 'react'
import {StyleSheet,View, Image, FlatList, TouchableOpacity,Alert} from 'react-native'
import {Container,Header,Left,Right,Text, Icon,Button, Thumbnail} from 'native-base'
import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'

export default function NewProfile(props) {
    const [user, setUser] = useState(null);
        useEffect(()=>{            
            //setUser(props.route.params.user)
        })
    return(
        <Container>
            <Header style={{
        alignItems:'center',
        justifyContent:'flex-start',        
        backgroundColor:'white'}}>
                <Left style={{flexDirection:'row', justifyContent:'center',alignItems:'center',}}>
                    <Button transparent
                        onPress={()=>{
                            props.navigation.pop(1)}}>
                        <Icon style={{color:'black'}} name='close' type='AntDesign'/>
                    </Button>
                    <Text style={{fontSize:17,fontWeight:'bold'}}>프로필 편집</Text>
                </Left>
                <Right>
                    <Button transparent
                        onPress={()=>{

                        }}>
                    <Icon style={{color:'black'}} name='check' type='AntDesign'/>
                    </Button>
                </Right>
            </Header>            
        </Container>
    )
}

