import React,{useState,useEffect} from 'react'
import {View,StyleSheet,FlatList} from 'react-native'
import {Container,Text,Header,Footer,Content,Item,Right,List,ListItem,Icon, Button, Input} from 'native-base'
import firebase from 'firebase'
require('firebase/firestore')
import moment from 'moment'

import {fetchUserMessages} from '../../redux/actions/index.js'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'


function Message(props){
    const [messages, setMessages] = useState([])
    const [sendMes, setSendMes] = useState([])
    const [resMes, setResMes] = useState([])    
    const [text, setText] = useState("")
      
    
    useEffect(()=>{
        //console.log("Effect")
        const getResMessages = async () =>{
            try{
                await firebase.firestore()
                .collection("users")
                .doc(props.route.params.selectedUid)
                .collection("sendMessages")
                .where('id','==',firebase.auth().currentUser.uid)        
                .get()
                .then((snapshot) => {
                    let resMes = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return{id, ...data}
                    })
                    if(!snapshot.metadata.hasPendingWrites){                                                           
                    setResMes(resMes); 
                    }                  
                })                
                
            }catch(err){
                console.error("resErr",err)
            }           
            }        
        getResMessages();
        //getSendMessages();                  
        //console.log("Messages",messages)
    },[]) 

    useEffect(()=>{
        const getSendMessages = async ()=> {
            try{
                await firebase.firestore() 
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("sendMessages")
                .where('id','==',props.route.params.selectedUid)        
                .onSnapshot((snapshot) => {
                    let sendMes = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return{id, ...data}
                    })
                    if(!snapshot.metadata.hasPendingWrites){                                    
                        setSendMes(sendMes); 
                    }
                })               
            }catch(err){
                console.error("sendErr",err)
            }
            }            
            getSendMessages()        
    },[])

    useEffect(()=>{
        let newMessages = [...sendMes,...resMes]        
        //if(newMessages.length>0){
            newMessages.sort((a,b)=>{return a.creation.seconds-b.creation.seconds})
            setMessages(newMessages)
        //}                                                             
        
    },[resMes,sendMes])


    const makeSendMassage = async (creation) => {
        await firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('sendMessages')
        .add({
            id : props.route.params.selectedUid,
            message : text,
            creation : creation
        }).then(
            console.log("make send complete")
        )
    }
    const makeResMessage = async (creation) => {
        await firebase.firestore()
        .collection('users')
        .doc(props.route.params.selectedUid)
        .collection('resMessages')
        .add({
            id: firebase.auth().currentUser.uid,
            message : text,
            creation : creation
        }).then(
            console.log('make res complete')
        )
    }
    const sendMessage = ()=>{
        
        if(text!==""){      
        const creation = firebase.firestore.FieldValue.serverTimestamp()
        makeSendMassage(creation)
        makeResMessage(creation)                      
        //props.navigation.replace('Message',{            
        //    selectedUser:props.route.params.selectedUser,
        //    selectedUid:props.route.params.selectedUid
        //})        
    }                    
    }
   /* if(!Loaded.send || !Loaded.res){
        return (
            <Container style={{flex : 1, justifyContent : 'center',alignItems:'center'}}>
                <Text>Loading...</Text>
            </Container>
        )
    }else{*/
    return (        
        <Container>
            <Header style={styles.header}>
                <Button transparent
                    onPress={()=>{
                        props.navigation.pop(1)
                    }}>
                    <Icon name="arrow-back" style={{color:'black'}}></Icon>
                </Button>                                
                <Icon name='person-circle-outline'/>
                <Text style={{fontWeight:'bold',fontSize:20,marginLeft:5,}}>
                    {props.route.params.selectedUser}
                </Text>                
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
                <List style={{flex:1}}>                                            
                <FlatList
                    numColumns={1}
                    data={messages}
                    extraData={messages}                    
                    keyExtractor={(item, index) => {
                        return index.toString();
                    }}
                    ListEmptyComponent={                                           
                        <Text note style={{flex:1,fontSize:20,textAlign:'center', marginTop:'80%'}}
                            >No Messages</Text>
                    }                
                    renderItem={({item, index})=>(
                    item.id!==props.route.params.selectedUid ? 
                    <ListItem noBorder key={index}>                        
                        <Icon name='person-outline'/>
                        <Text style={styles.messageBox}>{item.message}</Text>                        
                        <Text note>{`${moment(item.creation.toDate()).format('MM/DD [\n] HH:mm')}`}</Text>
                    </ListItem>
                    :
                    <ListItem noBorder style={{justifyContent:'flex-end'}}>
                            <Text note>{`${moment(item.creation.toDate()).format('MM/DD [\n] HH:mm')}`}</Text>
                            <Text style={styles.myMessageBox}>{item.message}</Text>
                            <Icon name='person-outline'/>
                    </ListItem>                    
                    )}
                />                 
                </List>
                {/*<List>
                    <ListItem noBorder>                        
                            <Icon name='person-outline'/>
                            <Text style={styles.messageBox}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>                        
                            <Text note>13:15</Text>
                    </ListItem>
                    <ListItem noBorder style={{justifyContent:'flex-end'}}>
                            <Text note>13:16</Text>
                            <Text style={styles.myMessageBox}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
                            <Icon name='person-outline'/>
                    </ListItem>
                </List>*/}
                        
                <Item rounded>
                <Input onChangeText={(text)=> setText(text)}
                 value={text} 
                placeholder="메시지를 입력하세요"
                />                           
                <Button transparent
                    onPress={()=> {sendMessage(); setText("")}}>
                    <Text>Send</Text>
                </Button>
                </Item>            
                
        </Container>
    )    
}

const styles = StyleSheet.create({
    container : {
        flex :1,
    },
    header:{
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    messageBox:{
        padding:10,
        margin:5,        
        maxWidth:250,
        borderWidth:1,
        borderColor:'lightgrey',
        borderRadius:40,
    },
    myMessageBox:{
        padding:10,
        margin:5,        
        maxWidth:250,
        borderWidth:1,
        borderColor:'lightgrey',
        borderRadius:40,
        backgroundColor:'whitesmoke',               
    },
})

const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
    messages : store.userState.messages
})
const mapDispatchtoProps = (dispatch) => bindActionCreators({fetchUserMessages},dispatch)
export default connect(mapStatetoProps,mapDispatchtoProps)(Message);