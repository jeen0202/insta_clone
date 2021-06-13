import React, { Component,useState } from 'react'
import {View, TextInput,StyleSheet, Button, } from 'react-native'
import {Text, Content,Toast,Input, Spinner} from 'native-base'
import firebase from 'firebase'

export default function Login(props,{navigation}){
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [onLogin,setOnLogin] = useState(false)

    const onSignin=() =>{        
        firebase.auth().signInWithEmailAndPassword(email,password)
        .then((result) => {
            //console.log(result)
        })
        .catch((error) => {
            Toast.show({
                text: error.toString(),
                buttonText: 'Okay',
            })
            //console.log(error)
        })
    }

    if(onLogin === true){
        return(
            <Content contentContainerStyle={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text>Conneting...</Text>
                <Spinner/>
            </Content>
        )
    }
    return(
        
        <Content contentContainerStyle={styles.container}>
        <View style={styles.loginForm}>
            <Text
            style={
                {fontSize:30,fontWeight:'bold',textAlign:'center'}}
                >Instagram</Text>
            {/* <TextInput
                style={styles.inputText}
                placeholder="이메일 주소"
                onChangeText={(email) => setEmail({ email })}
            /> */}
            <Input
                style={styles.inputText}
                placeholder="이메일 주소"
                value={email}
                onChangeText={(text) => setEmail(text)}/>
                <Input
                style={styles.inputText}
                placeholder="비밀번호"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}/>
            {/* <TextInput
            style={styles.inputText}
                placeholder="비밀번호"
                secureTextEntry={true} //보안기능
                onChangeText={(password) => setPassword({ password })}
            /> */}
            <Button
                onPress={() => {
                    setOnLogin(true)
                    onSignin()}}
                title = "로그인"/>
            
        </View>
        <View style={styles.registerBox}>
        <Text>계정이 없으신가요?</Text>
        <Text
        style={{color:'#6495ED'}}
        onPress={() => props.navigation.navigate("Register")}
        > 가입하기</Text>
    </View>
    </Content>        
    )
}
// class Login extends Component {
//     constructor(props){
//         super(props);

//         this.state = {
//             email : '',
//             password : '',                      
//         }
//         this.onSignUp = this.onSignin.bind(this)
//     }
//     //firebase를 사용한 Login
//     onSignin(){
//         const {email, password} = this.state;
//         firebase.auth().signInWithEmailAndPassword(email,password)
//         .then((result) => {
//             //console.log(result)
//         })
//         .catch((error) => {
//             Toast.show({
//                 text: error.toString(),
//                 buttonText: 'Okay',
//             })
//             //console.log(error)
//         })
//     }
//     render() {
//         return (
//             <Content contentContainerStyle={styles.container}>
//                 <View style={styles.loginForm}>
//                     <Text
//                     style={
//                         {fontSize:30,fontWeight:'bold',textAlign:'center'}}
//                         >Instagram</Text>
//                     <TextInput
//                         style={styles.inputText}
//                         placeholder="이메일 주소"
//                         onChangeText={(email) => this.setState({ email })}
//                     />
//                     <TextInput
//                     style={styles.inputText}
//                         placeholder="비밀번호"
//                         secureTextEntry={true} //보안기능
//                         onChangeText={(password) => this.setState({ password })}
//                     />
//                     <Button
//                         onPress={() => this.onSignUp()}
//                         title = "로그인"/>
                         
                   
                        
                    
//                 </View>
//                 <View style={styles.registerBox}>
//                 <Text>계정이 없으신가요?</Text>
//                 <Text
//                 style={{color:'#6495ED'}}
//                 onPress={() => this.props.navigation.navigate("Register")}
//                 > 가입하기</Text>
//             </View>
//             </Content>
//         )
//     }
// }

const styles = StyleSheet.create({
    container:{ 
        flex:1,
        marginBottom: 44, 
        minHeight: 700,       
        justifyContent: "center",
        alignItems: "center",
             
        
    },
    loginForm:{
        flex : 2/5,        
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
// export default Login
