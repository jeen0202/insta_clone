import React, {useState}from 'react'
import { Image, Text, TextInput, FlatList, TouchableOpacity,StyleSheet} from 'react-native'
import {Container,Header,Left,Right,Icon,Input,Button,Item,Thumbnail} from 'native-base'
import insta_logo from '../../assets/insta_logo.png'
import firebase from 'firebase'
require('firebase/firestore')
export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        let result =[]
        const offset = search+"\uF7FF";
        firebase.firestore()
        .collection('users')        
        .get()
        .then((snapshot)=>{
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;                
                return{id, ...data}
            })
            result = users.filter ((el) => {
                return (search.toString().toLowerCase() <=el.name.toString().toLowerCase()  && el.name.toString().toLowerCase() <= (search.toString().toLowerCase()+"\uF7FF"))          
            });
            setUsers(result); 
        })
    }
    return (
        <Container>
            <Header style={styles.header}>
            <Left style={{flexDirection:'row',alignItems:'center'}}>
            <Button transparent
            onPress={()=>props.navigation.navigate("Feed")}>
                <Icon name="arrowleft" type="AntDesign" style={{color:'black'}}/>
            </Button>
            <Image
            source={insta_logo}
            />
            </Left>
            <Right style={{flexDirection:'row', alignItems:'center'}}>
                <Button transparent
                    onPress={()=>{                                    
                    props.navigation.navigate('Search')
                }}>
                <Icon name='search' style={{color:'black',paddingRight:10, fontSize:23}}/>
                </Button>                
                <Button transparent>
                <Icon name='dots-vertical' type='MaterialCommunityIcons' style={{color:'black', fontSize:23}}/>
                </Button>
            </Right>
            </Header>
            <Header searchBar rounded style={{backgroundColor:'white'}}>
                <Item style={{backgroundColor:'#F3F3F3'}}>
                    <Icon name="ios-search" />
                    <Input placeholder="Search" 
                    autoCapitalize="none"
                    onChangeText={(search) => fetchUsers(search)}/>                    
                </Item>
                <Button transparent>
                    <Text>Search</Text>
                </Button>
            </Header>
            {/* <TextInput
                style={{padding:10,fontSize:15}} 
                placeholder="Type Here..."
                onChangeText={(search)=>fetchUsers(search)}/> */}

            <FlatList
                style={{marginLeft:10}}
                numColumns={1}
                horizontal={false}
                data={users}                
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={{padding:5, flexDirection:'row', alignItems:'center'}}
                        onPress={() => props.navigation.navigate("Profile",{uid: item.id})}>
                        <Thumbnail small                                                                  
                            source={item.profileURL!==undefined?
                            {uri:item.profileURL}
                            :require('../../assets/default_Profile.png')}/>                      
                        <Text style={{fontSize:15,padding:5}}>{item.name}</Text>
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