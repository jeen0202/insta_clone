import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'
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
            <View>
                <TextInput
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    placeholder="password"
                    secureTextEntry={true} //보안기능
                    onChangeText={(password) => this.setState({ password })}
                />

                <Button
                    onPress={() => this.onSignUp()}
                    title = "Sign in"
                />
            </View>
        )
    }
}

export default Login
