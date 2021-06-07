import React,{useState,useEffect} from 'react'
import {View,StyleSheet} from 'react-native'
import {Container,Text,Header,Footer,Content,Item,Right,List,ListItem,Icon, Button, Input} from 'native-base'
import firebase from 'firebase'
require('firebase/firestore')

import {fetchUserMessages} from '../../redux/actions/index.js'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'


function Message(props){
    const [messages, setMessages] = useState([])
    const [sendMes, setSendMes] = useState([])
    const [resMes, setResMes] = useState([])    
    const [text, setText] = useState("")
    const [isLoaded,setIsLoaded] = useState(false)    
    useEffect(()=>{
        props.fetchUserMessages(props.route.params.selectedUid)
        console.log("Effect")
        if(props.messages!== undefined){
            setMessages(props.messages)
            console.log("Messages",messages)
        }
    
    },[props.route.params.selectedUid,messages])     
    const getMessages = async () =>{
        await firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("resMessages")
        .where('id','==',props.route.params.selectedUid)        
        .get()
        .then((snapshot) => {
            let resMes = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return{id, ...data}
            })                                       
            setResMes(resMes);                   
        })
        await firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("sendMessages")
        .where('id','==',props.route.params.selectedUid)        
        .get()
        .then((snapshot) => {
            let sendMes = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return{id, ...data}
            })            
            setSendMes(sendMes);                          
        })
        let newMessages = [...sendMes,...resMes]
        newMessages.sort((a,b)=>{return a.creation.seconds-b.creation.seconds})
        if(newMessages.length!==0){            
        setMessages(newMessages)
        setIsLoaded(true)                                          
        }                      
    }
     
    const sendMessage = ()=>{       
        const creation = firebase.firestore.FieldValue.serverTimestamp()
        firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .collection('sendMessages')
        .add({
            id : props.route.params.selectedUid,
            message : text,
            creation : creation
        })

        firebase.firestore()
        .collection('users')
        .doc(props.route.params.selectedUid)
        .collection('resMessages')
        .add({
            id: firebase.auth().currentUser.uid,
            message : text,
            creation : creation
        })
        .then(
            getMessages()
        )
    }
    const checkMessage= () => {          
        console.log(isLoaded)      
        console.log(messages)
    }
    
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
            <Content>
                <List>
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
                </List>
            </Content>            
                <Item rounded>
                <Input onChangeText={(text)=> setText(text)} placeholder="메시지를 입력하세요"/>
                <Button transparent
                    onPress={()=> checkMessage()}>
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
        margin:5,
        paddingLeft:20,
        maxWidth:250,
        borderWidth:1,
        borderColor:'lightgrey',
        borderRadius:40,
    },
    myMessageBox:{
        margin:5,
        paddingLeft:20,
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