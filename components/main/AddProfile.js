import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image} from 'react-native';
import {Content,Footer,FooterTab, Button,Text,Spinner, Container} from 'native-base'
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase/app'
require('firebase/firestore')
require("firebase/firebase-storage")


export default function AddProfile({navigation}) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera,setCamera] = useState(null);
    const [image,setImage] = useState(null);
    const [isShooted,setIsShooted] = useState(false)
    const [mode,setMode] = useState("gallery")
    const [onSave,setOnSave] = useState(false)

    useEffect(() => {       
        (async () => {
            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
    
            const galleyStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleyStatus.status === 'granted');
    
        })();
        }, []);

    const takePicture = async () => {
        if(camera){
            const data = await camera.takePictureAsync(null);
            setImage(data.uri)
            setIsShooted(true)            
        }
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        }); 
        if (!result.cancelled) {
          setImage(result.uri);
          setIsShooted(true)
        }
      };
      const uploadProfile= async () =>{
        const uri = image;
        const childPath = `profiles/${firebase.auth().currentUser.uid}`       
        const response = await fetch(uri)
        const blob = await response.blob();
        //firebase-storage??? random??? id??? data ??????
        if(firebase.auth().currentUser.profileURL!==undefined){
            firebase.storage().ref().child(childPath)
            .delete()
            .then(()=>{
                console.log("clear profile!!")
            }).catch((error)=>{
                console.error(error)
            })
        }
        const task = firebase.storage().ref().child(childPath).put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                saveProfileData(snapshot);
                console.log(snapshot)
            })
        }
        const taskError = snapshot => {
            console.log(snapshot)
        }
        task.on("state_changed", taskProgress,taskError,taskCompleted);
    }
    const saveProfileData = (downloadURL) => {
        firebase.firestore().
        collection('users').
        doc(firebase.auth().currentUser.uid)
        .update({profileURL:downloadURL})
        .then(()=>{
            navigation.pop(1)
        })
    }

    if (hasCameraPermission === null||hasGalleryPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    
    return(
        <Container>
        {onSave? 
        <Spinner style={{flex:1}}/>:
        <Content contentContainerStyle={styles.container}>                    
            {isShooted?                                
                <View style={styles.CameraContainer}>                
                {image && <Image source = {{uri: image}} style={{flex:1}}/>}                
                <View>
                {mode==="gallery" ?
                <Button full transparent
                onPress={()=> pickImage()}>
                    <Text>?????? ?????? ????????????</Text>
                </Button>:
                <Button full transparent
                 onPress={()=> setIsShooted(false)}>
                     <Text>??????????????????</Text>
                 </Button>                
                }
               <Button full transparent 
               disabled={onSave?true:false}              
                onPress={() => {
                    setOnSave(true);
                    uploadProfile()
                    }}>
                    <Text>????????????</Text>
                </Button>
                </View>
                </View>                               
                :                
                <View style={styles.CameraContainer}>
                    {mode==="cam" &&  <View style={styles.CameraContainer}>
                    <Camera
                    ref={ref => setCamera(ref)} 
                    style={styles.fixedRatio} 
                    type={type} 
                    ratio={'16:9'}/>
                    <Button full transparent
                            onPress={() => takePicture()}>
                        <Text>??????</Text>  
                    </Button>  
                    <Button full transparent
                        onPress={() => {
                        setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                        }}>
                        <Text>????????? ??????</Text>            
                    </Button>
                    </View>}                        
                </View>
            }
            <Footer>
                <FooterTab>
                    <Button full onPress={()=> pickImage()}>
                        <Text>?????????</Text>
                    </Button>
                    <Button full onPress={()=> {
                        setIsShooted(false);
                        setMode("cam");}}>
                        <Text>??????</Text>
                    </Button>
                    {/* ??? ??????????????? ???????????? ????????????????????? ????????? ?????? ?????? ?????? */}
                </FooterTab>
            </Footer>
        </Content>
        }
        </Container>
    )
}

const styles = StyleSheet.create({
    CameraContainer:{
        flex : 1,
               
    },
    fixedRatio : {
        flex : 1,
        //aspectRatio : 1
    },
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});