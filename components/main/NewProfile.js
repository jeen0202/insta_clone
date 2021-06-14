import React, {useState, useEffect} from 'react'
import {StyleSheet,View, Image, FlatList, TouchableOpacity,Alert} from 'react-native'
import {Container,Header, Content,Left,Right,Text, Input,Icon,Button, Thumbnail,Form,Item,Label} from 'native-base'
import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'

export default function NewProfile(props) {
    const [user, setUser] = useState(props.route.params.user);
    const [name, setName] = useState(user.name)
    const [desc, setDesc] = useState(user.desc) 
    
    const setProfile = ()=> {
        firebase.firestore().
        collection('users').
        doc(firebase.auth().currentUser.uid)
        .update({name: name, desc:desc})
        .then(()=>{
            props.navigation.pop(1)
        })
    }
    const addProfile = () => {
        Alert.alert(
            "프로필 사진 수정",
            "프로필 사진을 수정하시겠습니까?",
            [
                {
                    text: "OK",
                    onPress: ()=>props.navigation.navigate("AddProfile")
                },
                {
                    text:"CANCLE",
                    style : "cancle",              
                }           
            ],
            { cancelable : false}
        );
    }
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
                        onPress={()=>setProfile()}>
                    <Icon style={{color:'black'}} name='check' type='AntDesign'/>
                    </Button>
                </Right>
            </Header>
                <Content contentContainerStyle={{flex:1,justifyContent:'center',marginBottom:50}}>
                <View>
                    <Thumbnail large
                        style={{alignSelf:'center'}}
                        source={{uri:user.profileURL}}/>
                    <Button transparent
                        onPress={()=>addProfile()}
                        style={{alignSelf:'center'}}>
                        <Text style={{fontWeight:'bold'}}>프로필 사진 수정</Text>
                    </Button>
                </View>        
                <Form>              
                    <Item floatingLabel>
                        <Label>이름</Label>
                        <Input                 
                        value={name}                                 
                        onChangeText={(text) => setName(text)}/>
                    </Item>
                    <Item floatingLabel>
                        <Label>소개</Label>
                        <Input
                        value={desc}
                        onChangeText={(text) => setDesc(text)}/>
                    </Item>
                </Form>               
                </Content>                      
        </Container>
    )
}

