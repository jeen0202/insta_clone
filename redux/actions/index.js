import firebase from 'firebase'
import {CLEAR_DATA,USER_POST_STATE_CHANGE, USER_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, USER_MESSAGES_STATE_CHANGE} from '../constants/index'
require('firebase/firestore')

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser(){
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){                    
                    dispatch({type : USER_STATE_CHANGE, currentUser : snapshot.data()})
                }else{
                    console.log('does not exist')
                }
            })
    })
}

export function fetchUserPosts(){
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc") // postdata 정렬
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                })                
                dispatch({type: USER_POST_STATE_CHANGE, posts})
            })
    })
}

export function fetchUserFollowing(){
    return ((dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {                    
                    const id = doc.id;
                    return id
                })                
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, following});
                for(let i = 0; i < following.length; i++){
                    dispatch(fetchUsersData(following[i], true));
                }
            })
    })
}
export function fetchUserMessages(uid){
    let resMes,sendMes,messages
    return ((dispatch) => {
        firebase.firestore()
        .collection("users")
        .doc(uid)
        .collection("sendMessages")
        .where('id','==',firebase.auth().currentUser.uid)        
        .get()
        .then((snapshot) => {                            
                resMes = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                })            
                //messages= [...sendMes||[], ...resMes||[]]            
                //messages.sort((a,b)=>{return a.creation.seconds-b.creation.seconds})            
                //console.log("sendmessages",messages)            
                //dispatch({type: USER_MESSAGES_STATE_CHANGE, messages})                                          
        })
        firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("sendMessages")
        .where('id','==',uid)        
        .get()
        .then((snapshot) => {            
           sendMes = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return{id, ...data}                
            })
            if(sendMes!== [] && resMes !== []){
            messages= [...sendMes||[], ...resMes||[]]            
            messages.sort((a,b)=>{return a.creation.seconds-b.creation.seconds})
            }            
            console.log("resmessages",messages)            
            dispatch({type: USER_MESSAGES_STATE_CHANGE, messages})                  
                     
        })        
        //    messages= [...sendMes||[], ...resMes||[]]            
        //    messages.sort((a,b)=>{return a.creation.seconds-b.creation.seconds})            
        //    console.log("messages",messages)            
        //    dispatch({type: USER_MESSAGES_STATE_CHANGE, messages})
            
        
    })
}
export function fetchUsersData(uid, getPosts) {
    return ((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid)

        if(!found){
            firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    let user = snapshot.data();
                    user.uid = snapshot.id;                    
                    dispatch({type : USERS_DATA_STATE_CHANGE, user});                    
                }else{
                    console.log('does not exist')
                }
            })
            if(getPosts){
                dispatch(fetchUsersFollowingPosts(uid));
            }            
        }
    })
}
//synchronous임에 유의
export function fetchUsersFollowingPosts(uid){
    return ((dispatch, getState) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {

                //const uid = snapshot.query.EP.path.segments[1];
                const uid = snapshot.docs[0].ref.path.split('/')[1]                
                //console.log({snapshot, uid});
                const user = getState().usersState.users.find(el => el.uid === uid)
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data, user}                    
                })            
               // console.log(posts)
               for(let i =0; i< posts.length;i++){
                   dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
               }    
                dispatch({type: USERS_POSTS_STATE_CHANGE, posts,uid})
               // console.log(getState())
            })
    })
}

export function fetchUsersFollowingLikes(uid, postId){
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")    
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {                
                const postId = snapshot.ref.path.split('/')[3]
                //const postId = snapshot.ZE.path.segments[3];
                let currentUserLike = false;
                if(snapshot.exists){
                    currentUserLike = true;
                }
                dispatch({type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike});
              
            })
    })
}