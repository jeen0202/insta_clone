import React, {useState, useEffect} from 'react'
import {StyleSheet,View, Image, FlatList, } from 'react-native'
import {Container,Header,Left,Right,Text, Icon,Button, Thumbnail} from 'native-base'
import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'
import insta_logo from '../../assets/insta_logo.png'

 function Profile(props) {
     const [userPosts, setUserPosts] = useState([])
     const [user, setUser] = useState(null);
     const [following, setFollowing] = useState(false)
    useEffect(()=>{
        const { currentUser, posts} = props;
        //console.log({ currentUser, posts})

        if(props.route.params.uid === firebase.auth().currentUser.uid){
            setUser(currentUser)
            setUserPosts(posts)
        }else{
            firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    setUser(snapshot.data())                    
                }else{
                    console.log('does not exist')
                }
            })
            firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation", "asc") // postdata 정렬
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                })                
                setUserPosts(posts)
            })                        
        }
        //선택된 사용자를 follow했는지 확인
        if(props.following.indexOf(props.route.params.uid) >-1){
            setFollowing(true)
        }else{
            setFollowing(false)
        }
    },[props.route.params.uid, props.following,props.currentUser])
    //useEffect에 parameter를 줘서 해당 parameter가 변할떄만 작동

    let followFlag = false;

    const followCheck = () => {
        if(followFlag){
            return followFlag;
        }else{
            followFlag= true;
            return false;
        }
    }
    const onFollow = () => {
        firebase.firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .update({follower:firebase.firestore.FieldValue.increment(1)})

        firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update({following:firebase.firestore.FieldValue.increment(1)})

        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})

    }
    const onUnfollow = () => {
        firebase.firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .update({follower:firebase.firestore.FieldValue.increment(-1)})

        firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update({following:firebase.firestore.FieldValue.increment(-1)})

        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .delete()
           

    }
    const onLogout = () => {
        firebase.auth().signOut();
    }
    const goMessage = () => {
        props.navigation.navigate("Message",{
            selectedUid:props.route.params.uid,
            selectedUser:user.name,
        })
    }
    if(user === null){
        return <View/>
    }
     const {currentUser, posts} = props
    // console.log({currentUser, posts})
    return (
        <Container style={styles.container}>            
            <Header style={styles.header}>
            <Left style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{fontWeight:'bold',fontSize:17}}>{user.name}</Text>
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
                <Icon name='user-plus' type='Feather' style={{color:'black',paddingRight:10, fontSize:23}}/>
                </Button>
                <Button transparent>
                <Icon name='dots-vertical' type='MaterialCommunityIcons' style={{color:'black', fontSize:23}}/>
                </Button>
          </Right>
            </Header>
            <View style = {styles.containerInfo}>
                <View style={{flexDirection:'row'}}>
                    <View>
                        <Thumbnail source={require('../../assets/default_Profile.png')}/> 
                    </View>
                    <View style={{flex:3}}>                        
                        <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                            <View style={{alignItems:'center'}}>
                                <Text style={{fontSize:17,fontWeight:'bold'}}>{userPosts.length}</Text>
                                <Text style={{fontSize:12,color:'gray'}}>게시물</Text>
                            </View>                                                
                            <View style={{alignItems:'center'}}>
                                <Text style={{fontSize:17,fontWeight:'bold'}}>{user.follower}</Text>
                                <Text style={{fontSize:12,color:'gray'}}>팔로워</Text>
                            </View>  
                            <View style={{alignItems:'center'}}>
                                <Text style={{fontSize:17,fontWeight:'bold'}}>{user.following}</Text>
                                <Text style={{fontSize:12,color:'gray'}}>팔로잉</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Button bordered dark
                            style={styles.button}>
                                <Text>프로필 수정</Text>                                
                            </Button>                            
                        </View>
                        {props.route.params.uid !== firebase.auth().currentUser.uid ?(
                    <View style={{flexDirection:'row'}}>
                        {following? (
                            <Button full bordered dark
                                style={styles.button} 
                                onPress={()=> {
                                    if(followCheck())
                                        return;
                                    onUnfollow()}}>
                            <Text>Following</Text>
                            </Button>
                        ):(
                            <Button full bordered dark
                            style={styles.button}                                
                                onPress={()=> {
                                    if(followCheck())
                                        return;
                                    onFollow()}}>
                                <Text>Follow</Text>
                            </Button>                           
                        )}
                        <Button full bordered dark
                        style={styles.button}
                        onPress={()=> goMessage()}>
                            <Text>Messages</Text>
                        </Button>
                    </View>
                    ) :
                    <View style={{flexDirection:'row'}}> 
                    <Button full bordered dark
                        style = {styles.button}                    
                        onPress={()=> onLogout()}>
                        <Text>Logout</Text>
                        </Button>
                    </View>}
                        
                    </View>
                </View>
                <View style={{paddingHorizontal:10, paddingVertical:10}}>
                    <Text style={{fontWeight:'bold'}}>{user.name}</Text>
                    <Text> React-Native로</Text>
                    <Text> Instagram UI 따라하기!!!</Text>
                </View>                
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    windowSize={2}
                    renderItem={({item})=>(
                        <View style={styles.containerImage}>
                        <Image style={styles.image}
                            source={{uri : item.downloadURL}}
                        />
                        </View>
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

const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
    posts: store.userState.posts,
    feed : store.usersState.feed,
    following: store.userState.following
})

export default connect(mapStatetoProps,null)(Profile);