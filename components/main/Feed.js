import React, {useState, useEffect} from 'react'
import {StyleSheet,View,  Image, FlatList, } from 'react-native'

import { Container,Card, CardItem, Text,Thumbnail, Body, Left, Right, Icon,Button } from 'native-base';

import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'

 function Feed(props) {
    const [posts, setPosts] = useState([]);

    useEffect(()=>{       
        if(props.usersFollowingLoaded == props.following.length && props.following.length !== 0){
            props.feed.sort(function(x,y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed); 
        }       
        //console.log(posts)
    },[props.usersFollowingLoaded, props.feed])
    //useEffect에 parameter를 줘서 해당 parameter가 변할떄만 작동

    const onLikePress = (uid,postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")    
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }
    const onDisLikePress = (uid, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")    
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

    return (
        <Container style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({item})=>(                        
                        <Card style={styles.containerImage}>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={{uri: 'image URL'}}/>
                                    <Body>                                                                                               
                                        <Text>{item.user.name}</Text>       
                                        <Text note >{`${item.creation.toDate()}`}</Text> 
                                    </Body>                                                               
                                </Left>
                                <Right>
                                    <Button transparent>
                                        <Icon name="ellipsis-horizontal-outline"/>
                                    </Button>
                                </Right>
                            </CardItem>
                            <CardItem cardBody>
                                    <Image style={styles.image}                            
                                        source={{uri : item.downloadURL}}
                                    />
                            </CardItem>
                            <CardItem>
                                {/* <Text
                                    onPress={()=>
                                    props.navigation.navigate('Comment',{postId: item.id, uid: item.user.uid})
                                    }>View Comments...</Text> */}
                                    {item.currentUserLike ? 
                                    (
                                        <Button transparent                                
                                        onPress={() => onDisLikePress(item.user.uid,item.id)}>
                                            <Icon name='heart'/>
                                        </Button>
                                    ):
                                    (
                                        <Button transparent
                                        onPress={() => onLikePress(item.user.uid,item.id)}>
                                            <Icon name='heart-outline'/>                                    
                                        </Button>
                                        // <Button
                                        // title="Like"
                                        // onPress={() => onLikePress(item.user.uid,item.id)}/>
                                    )
                                }
                                <Button transparent
                                onPress={()=>
                                    props.navigation.navigate('Comment',{postId: item.id, uid: item.user.uid})
                                    }>
                                    <Icon name ='chatbubble-outline'/>
                                </Button>
                            </CardItem>
                        </Card>
                    )}
                />
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,                
    },
    containerInfo:{
        margin :20,
    },
    containerGallery:{
        flex:1,
        backgroundColor:'white'
    },
    containerImage: {
        flex: 1/3,        
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    },
    imageheader: {
        flex : 1,                
        fontWeight:'bold',       
    },
    imageDate:{
        flex:1,
        paddingBottom:10,
    },
    imagefooter : {
        flexDirection: 'row',
        justifyContent:'space-between'
    }
})

const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
    following: store.userState.following,
    feed : store.usersState.feed,
    usersFollowingLoaded : store.usersState.usersFollowingLoaded,
})

export default connect(mapStatetoProps,null)(Feed);