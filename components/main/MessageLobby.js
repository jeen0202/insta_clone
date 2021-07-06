import React,{useEffect,useState} from 'react'
import { StyleSheet,FlatList,View } from 'react-native'
import { Container,Header,Right,Left,Icon,Text,Button,Card, CardItem, Thumbnail } from 'native-base'
import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

function MessageLobby(props) {
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])     
    useEffect(()=>{        
        const getResMessages = async () =>{
            try{            
                await firebase.firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("resMessages")
                .orderBy("creation","desc")                      
                .onSnapshot((snapshot) => {
                    let resMes = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return{id, ...data}
                    })              
                    if(!snapshot.metadata.hasPendingWrites){ 
                        resMes.filter((item, i) =>{
                            return(
                                resMes.findIndex((item2,j)=>{
                                    return item.id === item2.id;
                                }) === i
                            )
                        })      
                        setMessages(resMes)                       
                    }                  
                })}catch(err){
                    console.error("sendErr",err)
                }                      
            }
            getResMessages();
            console.log(users)
    },[])
    useEffect(()=>{
        const getUsers = async (id) => {
            try{                        
            await firebase.firestore()
            .collection("users")
            .doc(id)
            .onSnapshot((snapshot) => {
                if(snapshot.exists){
                    let user = snapshot.data();
                    user.id = snapshot.id;                                               
                    setUsers(users => [...users,user])
                                          
                }
            })  }catch(err){
                console.error("sendErr",err)
            }                         
    }
    messages.forEach((element)=>{
        getUsers(element.id)
    })
    },[messages])    
    return (
        <Container style={styles.container}>
            <Header style={styles.header}>
            <Left style={{flexDirection:'row', alignItems:'center'}}>
            <Button transparent
            onPress={()=>props.navigation.navigate("Feed")}>
                <Icon name="arrowleft" type="AntDesign" style={{color:'black'}}/>
            </Button>
            <Text style={{fontWeight:'bold',fontSize:17}}>{props.currentUser.name}</Text>
            <Icon name='caret-down' type='FontAwesome' style={{paddingLeft:10,fontSize:14}}/>           
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
            <View style={{flex:1}}>            
            <FlatList
            numColumns={1}
            horizontal={false}
            data={messages}
            
            extraData={users}                       
            keyExtractor={(item,index) => index.toString()}
            ListEmptyComponent={                                           
                <Text note style={{flex:1,fontSize:20,textAlign:'center', marginTop:'80%'}}
                    >No Messages</Text>
            }
            renderItem={({item,index})=>(
                <Card>
                    <TouchableWithoutFeedback
                    style={{flexDirection:'row'}}
                    onPress={()=>props.navigation.navigate('Message',{selectedUser: users[index].name, selectedUid: item.id})}>
                    <CardItem>
                        <Thumbnail small
                        source={users[index].profileURL !== undefined?{uri:users[index].profileURL}
                            :require('../../assets/default_Profile.png')}/>
                    </CardItem>
                    <CardItem style={{flexDirection:'column',alignItems:'flex-start'}}>
                    <Text>{users[index].name}</Text>                              
                    <Text note>{item.message}</Text>
                    </CardItem>
                    </TouchableWithoutFeedback> 
                </Card>   
            )}>            
            </FlatList>            
            </View>          
        </Container>
    )
}
const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
    users : store.usersState.users,
    following: store.userState.following
})

export default connect(mapStatetoProps,null)(MessageLobby);

const styles = StyleSheet.create({
    container : {
        flex : 1,                
    },
    header:{
        alignItems:'center',
        justifyContent:'flex-start',        
        backgroundColor:'white'
    },
    containerInfo:{
        margin :20,
        paddingTop:10,
    },
    containerGallery:{
        flex:1
    },
    containerImage: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    },
    button : {                              
        flex:1, justifyContent:'center', height:30, marginHorizontal:10, marginTop:10     
    }

})