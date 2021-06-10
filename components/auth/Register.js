import React, { Component } from 'react'
import { View, Button, TextInput, StyleSheet } from 'react-native'
import {Text,Content,Toast} from 'native-base'
import firebase from 'firebase'

export class Register extends Component {
    constructor(props){
        super(props);

        this.state = {
            email : '',
            password : '',
            name : '',            
        }
        this.onSignUp = this.onSignUp.bind(this)
    }
    //firebase를 사용한 register 기능
    //firestore에 firebase 인증기능을 통해 생성된 uid로 구분되는 document 생성
    onSignUp(){
        const {email, password, name} = this.state;
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .then((result) => {
            firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
                name,
                email,
                follower:0,
                following:0,
            })
            //console.log(result)
        })
        .catch((error) => {
            Toast.show({
                text: error.toString(),
                buttonText: 'Okay',
            })
        })
    }
    render() {
        return (            
            <Content contentContainerStyle={styles.container}>
            <View style = {styles.buttonBox}>
                <Text
                style={
                    {fontSize:30,fontWeight:'bold',textAlign:'center'}}
                    >Instagram</Text>
                <Text
                style={{
                    marginTop: 5,
                    marginBottom:10,
                    fontSize:20,
                    textAlign:'center',
                    color: 'lightgrey',
                    fontWeight:'bold',
                }}
                >친구들의 사진과 동영상을 보려면 가입하세요</Text>
                <TextInput style={styles.inputText}
                        placeholder="사용자이름"
                        onChangeText={(name) => this.setState({ name })}
                    />
                    <TextInput style={styles.inputText}
                        placeholder="이메일 주소"
                        onChangeText={(email) => this.setState({ email })}
                    />
                    <TextInput style={styles.inputText}
                        placeholder="비밀번호"
                        secureTextEntry={true} //보안기능
                        onChangeText={(password) => this.setState({ password })}
                    />
                <Button
                    onPress={() => this.onSignUp()}
                    title = "회원가입"
                />
            </View>
            <View style={styles.loginBox}>
                <Text>이미 계정이 있으신가요?</Text>
                <Text
                style={{color:'#6495ED'}}
                onPress={() => this.props.navigation.navigate("Login")}
                >  Login</Text>
            </View>  
        </Content>            
        )
    }
}

const styles = StyleSheet.create({
    container:{    
        flex:1,   
        marginBottom:44,        
        minHeight: 900,        
        justifyContent: 'center',
        alignItems : 'center',                
    },
    buttonBox :{
        flex : 1/2,       
        maxWidth:300,
        padding: 10,                     
        backgroundColor: 'white',
        justifyContent: 'space-evenly',
        alignItems : 'stretch',        
        marginBottom : 10,
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderStyle: 'solid'
        //border: 1px solid #dbdbdb;        
    },
    loginBox :{
        marginTop: 10,
        paddingVertical: 10,   
        alignItems : 'stretch',            
        width: 300,
        justifyContent: 'center',
        alignItems : 'stretch',
        backgroundColor: 'white',
        flexDirection:'row',        
        paddingHorizontal:10,
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderStyle: 'solid',
        marginBottom: 10,
    },
    inputText :{
        flex:1/8,
        fontSize:15,
        paddingLeft:8,
        paddingTop: 9,
        paddingBottom: 7,        
        marginVertical : 5,
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderStyle: 'solid'
                    
    }    
})

export default Register
//alignItems : 'stretch',            
//maxWidth:300,
//justifyContent: 'center',
//alignItems : 'stretch',
//backgroundColor: 'white',
//flexDirection:'row',
//maxWidth : 300,
//paddingHorizontal:10,