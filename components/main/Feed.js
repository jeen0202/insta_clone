import React, {useState, useEffect} from 'react'
import {StyleSheet,View, Image, FlatList,TouchableOpacity} from 'react-native'
import moment from 'moment'
import insta_logo from '../../assets/insta_logo.png'
import { Container,Header,Card, Thumbnail, CardItem, Text, Body, Left, Right, Icon,Button} from 'native-base';

import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'

 function Feed(props) {
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);

    useEffect(()=>{       
        if(props.usersFollowingLoaded == props.following.length && props.following.length !== 0){
            props.feed.sort(function(x,y) {
                return y.creation - x.creation;
            })
            // props.stories.sort(function(x,y){
            //     return y.creation - x.creation
            // })
            setPosts(props.feed);
        }       
        //console.log(posts)        
    },[props.usersFollowingLoaded])
    useEffect(()=> {
       if(props.usersFollowingLoaded == props.following.length && props.following.length !== 0){
            for(let i =0;i<props.stories.length;i++){                     
                props.stories[i][1].sort(function(x,y) {            
                    return y.creation - x.creation;
                })      
            }
           props.stories.sort(function(x,y){
               return y[1][0].creation - x[1][0].creation
           })
    
            setStories(props.stories); 
        }      
    },[props.stories])
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
            <Header style={styles.header}>
                <Left>
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
                {/*
                기존 우상단 아이콘 
                <Right>
                    <Button transparent
                        onPress={()=>{                                    
                        props.navigation.navigate('Search')
                    }}>
                    <Icon name='search' style={{color:'black'}}/>
                    </Button>
                    <Button transparent>
                    <Icon name='heart-outline' style={{color:'black'}}/>
                    </Button>
                    <Button transparent>
                    <Icon name='ellipsis-horizontal-outline' style={{color:'black'}}/>
                    </Button>
                </Right> */}
            </Header>                  
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    windowSize={2}
                    ListHeaderComponent={
                        <View style={{height:100}}>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:7}}>
                                <Text style={{fontWeight:'bold'}}>Stories</Text>
                                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}
                                onPress={()=>props.navigation.navigate('Story',{selectedIndex:0})}>
                                    <Icon name="md-play"></Icon>
                                    <Text style={{fontWeight:'bold'}}>Watch All</Text>
                                </TouchableOpacity>
                            </View>
                            {props.stories.length>0?                            
                            <View style={{flex:3}}>                                                                
                                <FlatList
                                contentContainerstyle={{
                                    alignItems:'center',
                                    paddingStart:5,
                                    paddingEnd:5}}
                                horizontal={true}
                                data={stories}                               
                                keyExtractor={(item,index)=> index.toString()}                                
                                renderItem={({item,index}) =>(
                                    item.length>0?                                    
                                    <TouchableOpacity
                                    onPress={()=>{
                                    props.navigation.navigate('Story',{selectedIndex:index})
                                    }}>
                                    <Thumbnail                                    
                                    style={{marginHorizontal: 5, borderColor:'pink',borderWidth:2}} 
                                    source={
                                        item[0].profileURL!==undefined?
                                        {uri:item[0].profileURL}:
                                        require('../../assets/default_Profile.png')
                                        }/>
                                    <Text style={{fontSize:10,alignSelf:'center',fontWeight:'bold'}}>{item[0].name}</Text>                                                                      
                                    </TouchableOpacity>:<Text>{index}</Text>
                                )}                                
                                >
                                </FlatList>
                            </View>
                            :
                            <View style={{flex:1,alignItems:'center',justifyContent:"center"}}>
                            <Text note>No story....</Text>
                            </View>
                            }
                        </View>
                    }
                    renderItem={({item})=>(                        
                        <Card style={styles.containerImage}>
                            <CardItem>
                                <Left>                                    
                                <Thumbnail                                      
                                    source={item.user.profileURL!==undefined?
                                        {uri:item.user.profileURL}
                                        :require('../../assets/default_Profile.png')}/> 
                                    <Body>                                                                                               
                                        <Text>{item.user.name}</Text>       
                                        <Text note >{`${moment(item.creation.toDate()).format('YY년MM월DD일 HH:mm')}`}</Text> 
                                    </Body>                                                               
                                </Left>
                                <Right>
                                    <Button transparent>
                                        <Icon name="ellipsis-horizontal-outline" style={{color:'black'}}/>
                                    </Button>
                                </Right>
                            </CardItem>
                            <CardItem cardBody>
                                    <Image style={styles.image}                            
                                        source={{uri : item.downloadURL}}
                                    />
                            </CardItem>
                            <CardItem>
                                    {item.currentUserLike ? 
                                    (
                                        <Button transparent                                
                                        onPress={() => onDisLikePress(item.user.uid,item.id)}>
                                            <Icon name='heart' style={{color:'red'}}/>
                                        </Button>
                                    ):
                                    (
                                        <Button transparent
                                        onPress={() => onLikePress(item.user.uid,item.id)}>
                                            <Icon name='heart-outline' style={{color:'black'}}/>                                    
                                        </Button>
                                    )
                                }
                                <Button transparent
                                onPress={()=>{                                    
                                    props.navigation.navigate('Comment',{postId: item.id, uid: item.user.uid, downloadURL: item.downloadURL})
                                }}>
                                    <Icon name ='chatbubble-ellipses-outline' style={{color:'black'}}/>
                                </Button>
                                <Button transparent
                                onPress={()=>{                                                                    
                                    props.navigation.navigate('Message',{selectedUser: item.user.name, selectedUid: item.user.uid})                                    
                                }}>
                                    <Icon name = 'paper-plane-outline' style={{color:'black'}}/>
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
    header:{
        backgroundColor:'white'
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
    stories : store.usersState.stories,
    users : store.usersState.users,    
    usersFollowingLoaded : store.usersState.usersFollowingLoaded,
})

export default connect(mapStatetoProps,null)(Feed);