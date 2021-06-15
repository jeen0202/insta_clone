import React, {useState,} from 'react'
import {StyleSheet,View,Alert} from 'react-native'
import {Container,Header,Footer, Content,Left,Right,Text,
        Input,Icon,Button, Thumbnail,Form,Item,Label} from 'native-base'
import firebase from 'firebase'
require('firebase/firestore')

export default function NewProfile(props) {
    const [user, setUser] = useState(props.route.params.user);
    const [name, setName] = useState(user.name)
    const [desc, setDesc] = useState(user.desc)
    const [home, setHome] = useState(user.home) 
    
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
            <Header noShadow style={{
        alignItems:'center',
        justifyContent:'flex-start',        
        backgroundColor:'white'
        }}>
                <Left style={{flexDirection:'row', justifyContent:'center',alignItems:'center',}}>
                    <Button transparent
                        onPress={()=>{
                            props.navigation.pop(1)}}>
                        <Icon style={{color:'black'}} name='close' type='AntDesign'/>
                    </Button>
                    <Text style={{fontSize:20,fontWeight:'bold'}}>프로필 편집</Text>
                </Left>
                <Right>
                    <Button transparent
                        onPress={()=>setProfile()}>
                    <Icon style={{color:'#4d8fd0',fontWeight:'bold',fontSize:30}} name='check' type='AntDesign'/>
                    </Button>
                </Right>
            </Header>
                <Content contentContainerStyle={{flex:1}}>
                <View>
                    <Thumbnail large
                        style={{alignSelf:'center'}}
                        source={{uri:user.profileURL}}/>
                    <Button transparent
                        onPress={()=>addProfile()}
                        style={{alignSelf:'center'}}>
                        <Text style={{color:'#4d8fd0',fontSize:17,}}>프로필 사진 변경</Text>
                    </Button>
                </View>        
                <Form style={{marginBottom:10}}>              
                    <Item floatingLabel>
                        <Label floatBack={5}>이름</Label>
                        <Input                 
                        value={name}                                 
                        onChangeText={(text) => setName(text)}/>
                    </Item>
                    <Item floatingLabel>
                        <Label floatBack={5}>웹사이트</Label>
                        <Input
                        value={home}
                        onChangeText={(text) => setHome(text)}/>
                    </Item>
                    <Item floatingLabel>
                        <Label floatBack={5}>소개</Label>
                        <Input
                        value={desc}
                        onChangeText={(text) => setDesc(text)}/>
                    </Item>
                </Form>
                <Form>
                    <Item>
                        <Button transparent>
                        <Text style={{color:'#4d8fd0',}}>프로페셔널 계정으로 전환</Text>
                        </Button>
                    </Item>
                    <Item>
                    <Button transparent>
                        <Text style={{color:'#4d8fd0',}}>개인 정보 설정</Text>
                        </Button>
                    </Item>
                </Form>           
                </Content>                      
        </Container>
    )
}

