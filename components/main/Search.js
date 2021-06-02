import React, {useState}from 'react'
import { Image, Text, TextInput, FlatList, TouchableOpacity,StyleSheet} from 'react-native'
import {Container,Header,Left,Right,Icon,Button} from 'native-base'
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
            <Left>
            <Image
            source={insta_logo}
            />
            </Left>
            <Right>
                <Button transparent
                    onPress={()=>{                                    
                    props.navigation.navigate('Search')
                }}>
                <Icon name='search' style={{color:'black'}}/>
                </Button>
                <Button transparent>
                <Icon name='heart' style={{color:'black'}}/>
                </Button>
                <Button transparent>
                <Icon name='ellipsis-horizontal-outline' style={{color:'black'}}/>
                </Button>
          </Right>
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