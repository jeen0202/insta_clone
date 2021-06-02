import React, {useState, useEffect} from 'react'
import {StyleSheet,View, Text, Image, FlatList, Button } from 'react-native'
import {Container,Header} from 'native-base'
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
    },[props.route.params.uid, props.following])
    //useEffect에 parameter를 줘서 해당 parameter가 변할떄만 작동

    const onFollow = () => {
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})        
    }
    const onUnfollow = () => {
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
    if(user === null){
        return <View/>
    }
     const {currentUser, posts} = props
    // console.log({currentUser, posts})
    return (
        <Container style={styles.container}>
            <Header style={styles.header}>
            <Image
            source={insta_logo}
            />
            </Header>     
            <View style = {styles.containerInfo}>           
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
                {props.route.params.uid !== firebase.auth().currentUser.uid ?(
                    <View>
                        {following? (
                            <Button
                                title="Following"
                                onPress={()=> onUnfollow()}
                            />
                        ):(
                            <Button
                                title="Follow"
                                onPress={()=> onFollow()}
                            />                            
                        )}
                    </View>
                    ) : 
                    <Button
                        title="Logout"
                        onPress={()=> onLogout()}
                        />}
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
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
    }
})

const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStatetoProps,null)(Profile);