import React, {useState, useEffect} from 'react'
import {StyleSheet,View, Image, FlatList, TouchableOpacity,Alert,TouchableWithoutFeedback} from 'react-native'
import {Container,Header,Left,Right,Text, Icon,Button, Thumbnail} from 'native-base'
import firebase from 'firebase'
require('firebase/firestore')
import {connect} from 'react-redux'

 function Profile(props) {
    const createThreeoButtonAlert = () =>
    Alert.alert(
        "프로필 사진 수정",
        "프로필 사진을 수정하시겠습니까?",
        [
            {
                text: "OK",
                onPress: ()=>props.navigation.navigate("AddProfile")
            },
            {
                text:"CANCLE",
                style : "cancle",              
            }           
        ],
        { cancelable : false}
    );
    const createTwoButtonAlert = (id,downloadURL) => Alert.alert(
        "피드 삭제",
        "해당 피드를 삭제하시겠습니까?",
        [
            {
                text: "피드 삭제",
                onPress : () => DeleteFeed(id,downloadURL)
            },
            {
                text: "취소",
                style : "cancle",
            }
        ],
        {cancelable: false}
    )
     const [userPosts, setUserPosts] = useState([])
     const [user, setUser] = useState(null);
     const [following, setFollowing] = useState(false)     
    useEffect(()=>{
        const { currentUser, posts,} = props;       

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
    },[props.route.params.uid, props.feed,props.following,props.currentUser])
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
    const DeleteFeed = (id,downloadURL) => {
        DeleteStorage(downloadURL);
        firebase.firestore()
        .collection('posts')
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(id)
        .delete()
    }
    const DeleteStorage = async (uri) => {
        firebase.storage()
        .refFromURL(uri).delete()
    }
    if(user === null){
        return <View/>
    }
     
    return (
        <Container style={styles.container}>            
            <Header style={styles.header}>
            <Left style={{flexDirection:'row', alignItems:'center'}}>
            <Button transparent
            onPress={()=>props.navigation.navigate("Feed")}>
                <Icon name="arrowleft" type="AntDesign" style={{color:'black'}}/>
            </Button>
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
                <Icon name='dots-vertical' type='MaterialCommunityIcons' style={{color:'black', fontSize:23}}/>
                </Button>
          </Right>
            </Header>
            <View style = {styles.containerInfo}>
                <View style={{flexDirection:'row'}}>
                {props.route.params.uid === firebase.auth().currentUser.uid ?                
                    <TouchableOpacity
                    onPress={()=>createThreeoButtonAlert()}>
                        <Thumbnail 
                        source={user.profileURL!==undefined?
                        {uri:user.profileURL}
                        :require('../../assets/default_Profile.png')}/> 
                    </TouchableOpacity>
                    :
                    <Thumbnail 
                        source={user.profileURL!==undefined?
                        {uri:user.profileURL}
                        :require('../../assets/default_Profile.png')}/> 
                    }
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
                        {props.route.params.uid === firebase.auth().currentUser.uid ? 
                        <View style={{flexDirection:'row'}}>
                            <Button bordered dark
                            style={styles.button}
                            onPress={()=>{
                                props.navigation.navigate("NewProfile",{user:currentUser})                               
                                }}>
                                <Text>프로필 수정</Text>                                
                            </Button>                            
                        </View>: <View></View>}
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
                    <Text>{user.desc}</Text>                    
                </View>                
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    windowSize={2}
                    renderItem={({item})=>(
                        <TouchableWithoutFeedback style={styles.containerImage} 
                        onPress={()=>{                                                                                      
                            props.navigation.navigate('Comment',{postId: item.id, uid: props.route.params.uid, downloadURL: item.downloadURL})
                        }}
                        onLongPress={()=>{
                            props.route.params.uid === firebase.auth().currentUser.uid ?                            
                            createTwoButtonAlert(item.id,item.downloadURL)
                            :null}}>                            
                            <Image style={styles.image}                            
                                source={{uri : item.downloadURL}}
                            />                            
                        </TouchableWithoutFeedback>
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