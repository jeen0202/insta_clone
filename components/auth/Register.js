import React, { Component } from 'react'
import { View, Button, TextInput, StyleSheet } from 'react-native'
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
                <TextInput style={styles.inputText}
                    placeholder="name"
                    onChangeText={(name) => this.setState({ name })}
                />
                <TextInput style={styles.inputText}
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput style={styles.inputText}
                    placeholder="password"
                    secureTextEntry={true} //보안기능
                    onChangeText={(password) => this.setState({ password })}
                />
                <Button
                    onPress={() => this.onSignUp()}
                    title = "Sign Up"
                />
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex:1,        
        justifyContent:'center',
        alignSelf:'center',       
        
              
    },
    inputText :{
        flex:1/10,
        fontSize:26,
               
    }    
})

export default Register
