import React,{useEffect,useState} from 'react'
import { StyleSheet,FlatList,View } from 'react-native'
import { Container,Header,Right,Left,Icon,Text,Button,Card, CardItem, Thumbnail } from 'native-base'
import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'

function MessageLobby(props) {
    const [Messages, setMessages] = useState([])
    useEffect(()=>{
        //console.log(props.following)
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
                        setMessages(resMes)
                            // resMes.forEach(item => {
                            //     props.following.forEach(data =>{
                            //         if(data===item.id)
                            //         console.log(item)
                            //     })                    
                                
                            // });
                    }                  
                })                
                
            }catch(err){
                console.error("resErr",err)
            }           
            }
            getResMessages();
    })
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
            data={Messages}            
            keyExtractor={(item,index) => index.toString()}
            renderItem={({item,index})=>(
                <Card style={{flexDirection:'row'}}>
                    <CardItem>
                        <Thumbnail small
                        source={require('../../assets/default_Profile.png')}/>
                    </CardItem>
                    <CardItem style={{flexDirection:'column',alignItems:'flex-start'}}>
                    <Text>{item.id}</Text>                              
                    <Text note>{item.message}</Text>
                    </CardItem> 
                </Card>   
            )}>            
            </FlatList> 
            </View>          
        </Container>
    )
}
const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
    posts: store.userState.posts,
    feed : store.usersState.feed,
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