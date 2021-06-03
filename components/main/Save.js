import React,{useState} from 'react'
import {TextInput, Text,Image} from 'react-native'
import {Container,Content,Button} from 'native-base'
import firebase from 'firebase/app'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Save(props, {navigation}) {
    // console.log(props.route.params.image)
    //text 입력을 위한 hook 사용
    const [caption, setCaption] = useState("")
    const [buttonState, setButtonState] = useState(true)
    const uploadImage= async () =>{
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        //console.log(childPath)
        setButtonState(false);
        const response = await fetch(uri)
        const blob = await response.blob();
        //firebase-storage에 random한 id로 data 저장
        const task = firebase.storage().ref().child(childPath).put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }
        const taskError = snapshot => {
            console.log(snapshot)
        }
        task.on("state_changed", taskProgress,taskError,taskCompleted);
    }

    const savePostData = (downloadURL) => {
        firebase.firestore().collection('posts').doc(firebase.auth().currentUser.uid)
        .collection("userPosts")
        .add({
            downloadURL,
            caption,
            creation : firebase.firestore.FieldValue.serverTimestamp()
        }).then((function (){
            props.navigation.popToTop()
        }))
    }
    return (
        <Container>            
            <Content contentContainerStyle={{flex:1}}>
                <Image source={{uri:props.route.params.image}} style={{flex:1}}/>
                <TextInput
                placeholder="Write a Caption . . ."
                onChangeText={(caption) => setCaption(caption)}
                />
                {buttonState ?
                <Button full info
                onPress={()=> {
                    uploadImage();
                    }}>
                <Text>Save</Text>
                </Button> : 
                <Button disabled full>
                    <Text>Save</Text></Button>}
                
            </Content>
        </Container>
        // <View style={{flex:1}}>
        //     <Image source={{uri:props.route.params.image}}/>
        //     <TextInput
        //         placeholder="Write a Caption . . ."
        //         onChangeText={(caption) => setCaption(caption)}
        //     />
        //     <Button title="Save" onPress={()=> uploadImage()}/>
        // </View>
    )
}
