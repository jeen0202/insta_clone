import React, {useState}from 'react'
import { Image, Text, TextInput, FlatList, TouchableOpacity,StyleSheet} from 'react-native'
import {Container,Header} from 'native-base'
import insta_logo from '../../assets/insta_logo.png'
import firebase from 'firebase'
require('firebase/firestore')
export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        const offset = search+"\uF7FF";
        firebase.firestore()
        .collection('users')
        .where('name','>=',search)
        .where('name', '<=',offset )
        .get()
        .then((snapshot)=>{
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;                
                return{id, ...data}
            })
            setUsers(users); 
        })
    }
    return (
        <Container>
            <Header style={styles.header}>
            <Image
            source={insta_logo}
            />
            </Header> 
            <TextInput 
                placeholder="Type Here..."
                onChangeText={(search)=>fetchUsers(search)}/>

            <FlatList
                style={{marginLeft:10}}
                numColumns={1}
                horizontal={false}
                data={users}                
                renderItem={({item}) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile",{uid: item.id})}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                    
                )}
            />
        </Container>
    )
}
const styles = StyleSheet.create({
    container : {
        flex : 1,                
    },
    header:{
        alignItems:'center',
        justifyContent:'flex-start',        
        backgroundColor:'white'
    }
});