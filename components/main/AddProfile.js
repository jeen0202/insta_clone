import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image} from 'react-native';
import {Content,Footer,FooterTab, Button,Text} from 'native-base'
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase/app'
require('firebase/firestore')
require("firebase/firebase-storage")


export default function AddProfile(props,{navigation}) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [camera,setCamera] = useState(null);
    const [image,setImage] = useState(null);
    const [isShooted,setIsShooted] = useState(false)
    const [mode,setMode] = useState("gallery")
    const [user,setUser] = useState([]);

    useEffect(() => {
        const {currentUser} = props;
        setUser(currentUser);        
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
        const childPath = `profiles/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`       
        const response = await fetch(uri)
        const blob = await response.blob();
        //firebase-storage에 random한 id로 data 저장
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

        firebase.firestore().
        collection('posts').
        doc(firebase.auth().currentUser.uid)
        .collection("Profile")
        .set({
            downloadURL
        }).then((function (){
            props.navigation.pop(1)
        }))
    }

    if (hasCameraPermission === null||hasGalleryPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    
    return(
        <Content contentContainerStyle={styles.container}>            
            {isShooted?                
                <View style={styles.CameraContainer}>                
                {image && <Image source = {{uri: image}} style={{flex:1}}/>}                
                <View>
                {mode==="gallery" ?
                <Button full transparent
                onPress={()=> pickImage()}>
                    <Text>다른 사진 불러오기</Text>
                </Button>:
                <Button full transparent
                 onPress={()=> setIsShooted(false)}>
                     <Text>다시촬영하기</Text>
                 </Button>                
                }
               <Button full transparent
                onPress={() => {
                    set
                    uploadProfile()
                    }}>
                    <Text>저장하기</Text>
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
                        <Text>촬영</Text>  
                    </Button>  
                    <Button full transparent
                        onPress={() => {
                        setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                        }}>
                        <Text>카메라 전환</Text>            
                    </Button>
                    </View>}                        
                </View>
            }
            <Footer>
                <FooterTab>
                    <Button full onPress={()=> pickImage()}>
                        <Text>갤러리</Text>
                    </Button>
                    <Button full onPress={()=> {
                        setIsShooted(false);
                        setMode("cam");}}>
                        <Text>사진</Text>
                    </Button>
                    {/* 내 게시글중에 선택하여 프로필사진으로 만드는 기능 추가 예정 */}
                </FooterTab>
            </Footer>
        </Content>
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