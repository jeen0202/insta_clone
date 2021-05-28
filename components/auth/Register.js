import React, { Component } from 'react'
import { View, Button,Text, TextInput, StyleSheet } from 'react-native'
import firebase from 'firebase'
import { BottomTabBar } from '@react-navigation/bottom-tabs';

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
            })
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    render() {
        return (            
            <View style={styles.container}>
            <View style = {styles.buttonBox}>
                <Text
                style={
                    {fontSize:30,fontWeight:'bold',textAlign:'center'}}
                    >Instagram</Text>
                <Text
                style={{
                    marginTop: 5,
                    marginBottom:'10%',
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
                    title = "Sign Up"
                />
            </View>
            <View style={styles.loginBox}>
                <Text>이미 계정이 있으신가요?</Text>
                <Text
                style={{color:'#6495ED'}}
                onPress={() => this.props.navigation.navigate("Login")}
                >  Login</Text>
            </View>  
        </View>            
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex : 4/5,        
        justifyContent: 'center',
        alignItems : 'center',                
    },
    buttonBox :{
        flex : 1/2,
        paddingHorizontal:10,
        maxWidth:300,                     
        backgroundColor: 'white',
        justifyContent: 'center',        
        borderStyle:'solid',
        alignItems : 'stretch',
        borderColor: '#dbdbdb',
        borderWidth: '1px',
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
        borderWidth: '1px',
        borderStyle: 'solid',
        marginBottom: '10px',
    },
    inputText :{
        flex:1,
        fontSize:15,
        paddingLeft:"8px",
        paddingTop: "9px",
        paddingBottom: '7px',        
        marginVertical : '5px',
        borderColor: '#dbdbdb',
        borderWidth: '1px',
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