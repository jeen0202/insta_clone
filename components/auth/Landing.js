import React from 'react'
import {Text, View, Button,TextInput,StyleSheet} from 'react-native'
export default function Landing({navigation}) {
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
                    color: 'gray',
                }}
                >친구들의 사진과 동영상을 보려면 가입하세요</Text>
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
                title = "Register"
                onPress={() => navigation.navigate("Register")} />
            </View>
            <View style={styles.loginBox}>
                <Text>이미 계정이 있으신가요?</Text>
                <Text
                style={{color:'#6495ED'}}
                onPress={() => navigation.navigate("Login")}
                >  Login</Text>
                {/*<Button
                style={{fontSize:10,}}            
                title = "Login"
                onPress={() => navigation.navigate("Login")} />
                 */}
            </View>
  
        </View>
        
    )
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
        borderColor:'black',        
    },
    loginBox :{        
        maxWidth:300,
        justifyContent: 'center',
        alignItems : 'stretch',
        flexDirection:'row'
    },
    inputText :{
        flex:1,
        fontSize:26,               
    } 
})