import React,{useState, useEffect} from 'react'
import {View,  Image,FlatList, Button, TextInput} from 'react-native'
import {Container,Text,CardItem,Item} from 'native-base'
import moment from 'moment'

import firebase from 'firebase'
require('firebase/firestore')

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {fetchUsersData} from '../../redux/actions/index'

function Comment(props) {
    const [comments, setComments ] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")
    const [downloadURL,setDownloadURL] =useState(props.route.params.downloadURL) 
    useEffect( () => {
        function matchUserToComment(comments){
            for(let i=0;i<comments.length;i++){
                if(comments[i].hasOwnProperty ('user')){
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].creator)
                if(user == undefined){
                    props.fetchUsersData(comments[i].creator, false)
                }else{
                    comments[i].user = user;
                }
            }                     
            setComments(comments)
                                  
        }        
            if(props.route.params.postId !== postId){
                firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .doc(props.route.params.postId)
                .collection('comments')                
                .onSnapshot((snapshot)=> {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id
                        return {id, ...data}
                    })
                    if(!snapshot.metadata.hasPendingWrites)                    
                    matchUserToComment(comments);               
                })
                setPostId(props.route.params.postId)
            }else{
                matchUserToComment(comments);
            }

          
          
    },[props.route.params.postId, props.users,text])
    const onCommentSend = () => {
        firebase.firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection('comments')
        .add({
            creation : firebase.firestore.FieldValue.serverTimestamp(),
            creator : firebase.auth().currentUser.uid,
            text,            
        })
        .then(
            setText('')) 
    }     
    return (
        <Container>            
            <Image
                    style={{
                        aspectRatio: 1/1}}
                    source={{uri:downloadURL}}/>            
                <FlatList                    
                    numColumns = {1}
                    horizontal= {false}
                    data={comments}
                    renderItem={({item}) => (                        
                        <CardItem style={{flex:1/3,}}>                            
                            {item.user !== undefined ? 
                            <Text style={{fontWeight:"bold",}}>
                                {item.user.name}
                            </Text>
                            :null}
                            <Text> {item.text}</Text>                            
                            <Text note style={{fontSize:10}}>  {`${moment(item.creation.toDate()).format('MM월DD일 HH:mm')}`}</Text>                            
                        </CardItem>                        
                    )}
                />                 
            <View>
                <TextInput
                    placeholder='comment...'
                    value = {text}
                    onChangeText={(text) => setText(text)}/>
                {text!==''? 
                    <Button
                    onPress={() => onCommentSend()}
                    title = "Send"/>:
                    <Button disabled                    
                    title = "Send"/>}                    
            </View>                           
        </Container>
    )
}

const mapStateToProps = (store) => ({
    users : store.usersState.users
})
const mapDispatchtoProps = (dispatch) => bindActionCreators({fetchUsersData},dispatch)

export default connect(mapStateToProps,mapDispatchtoProps)(Comment)