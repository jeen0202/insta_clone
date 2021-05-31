import React,{useState, useEffect} from 'react'
import {View, Text, Image,FlatList, Button, TextInput} from 'react-native'
import {Container,Content,Card,CardItem, Body} from 'native-base'


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
        // console.log(props.route.params.downloadURL)
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
            .get()
            .then((snapshot)=> {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return {id, ...data}
                })
                matchUserToComment(comments);               
            })
            setPostId(props.route.params.postId)
        }else{
            matchUserToComment(comments);
        }
    },[props.route.params.postId, props.users])
    const onCommentSend = () => {
        firebase.firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection('comments')
        .add({
            creator : firebase.auth().currentUser.uid,
            text,
        })
    }

    return (
        <Container>
            <Content>
            <Card>                
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
                        <Text>    {item.text}</Text>
                    </CardItem>
                )}
            />
                      
            <View>
                <TextInput
                    placeholder='comment...'
                    onChangeText={(text) => setText(text)}/>
                <Button
                    onPress={() => onCommentSend()}
                    title = "Send"/>                    
            </View>
            </Card>
            </Content>
        </Container>
    )
}

const mapStateToProps = (store) => ({
    users : store.usersState.users
})
const mapDispatchtoProps = (dispatch) => bindActionCreators({fetchUsersData},dispatch)

export default connect(mapStateToProps,mapDispatchtoProps)(Comment)