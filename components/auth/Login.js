import React, { Component } from 'react'
import {Text, View, Button, TextInput,StyleSheet } from 'react-native'
import firebase from 'firebase'

export class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            email : '',
            password : '',                      
        }
        this.onSignUp = this.onSignin.bind(this)
    }
    //firebase를 사용한 Login
    onSignin(){
        const {email, password} = this.state;
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.loginForm}>
                    <Text
                    style={
                        {fontSize:30,fontWeight:'bold',textAlign:'center'}}
                        >Instagram</Text>
                    <TextInput
                        style={styles.inputText}
                        placeholder="email"
                        onChangeText={(email) => this.setState({ email })}
                    />
                    <TextInput
                    style={styles.inputText}
                        placeholder="password"
                        secureTextEntry={true} //보안기능
                        onChangeText={(password) => this.setState({ password })}
                    />

                    <Button
                        onPress={() => this.onSignUp()}
                        title = "Sign in"
                    />
                </View>
                <View style={styles.registerBox}>
                <Text>계정이 없으신가요?</Text>
                <Text
                style={{color:'#6495ED'}}
                onPress={() => this.props.navigation.navigate("Register")}
                > 가입하기</Text>
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{ 
        marginBottom: 44, 
        minHeight: 600,       
        justifyContent: "center",
        alignItems: "center",
             
        
    },
    loginForm:{
        flex : 3/5,        
        width : 300,                
        paddingHorizontal: 10,
        justifyContent: 'space-evenly',
        alignItems : 'stretch',
        paddingTop : 10,
        paddingBottom : 10,
        marginBottom : 10,
        backgroundColor: 'white',
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderStyle: 'solid', 
    },
    registerBox :{
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
export default Login
