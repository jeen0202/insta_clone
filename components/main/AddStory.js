import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image} from 'react-native';
import {Content, Button,Text} from 'native-base'
import { Camera } from 'expo-camera';
//갤러리에서 사진을 불러오기 위한 package
import * as ImagePicker from 'expo-image-picker';
//firebase 저장을 위한
import firebase from 'firebase/app'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function App({navigation}) {
    
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);    
    const [camera,setCamera] = useState(null);
    const [image,setImage] = useState(null);
    const [isShooted,setIsShooted] = useState(false)

    useEffect(() => {
    (async () => {
        const cameraStatus = await Camera.requestPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');

        const galleyStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleyStatus.status === 'granted');

    })();
    }, []);

    //사진촬영을 위한 함수 정의
    const takePicture = async () => {
        if(camera){
            const data = await camera.takePictureAsync(null);
            setImage(data.uri)
            setIsShooted(true)            
        }
    }
    //갤러리에서 사진을 가져오기위한 함수
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 1,
        });
    
       // console.log(result);
    
        if (!result.cancelled) {
          setImage(result.uri);
          setIsShooted(true)
        }
      };

    const uploadImage= async () =>{
      const uri = props.route.params.image;
      const childPath = `story/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`        
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

    if (hasCameraPermission === null||hasGalleryPermission === null) {
    return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
    }
  return (
    <Content contentContainerStyle={styles.container}>
        {isShooted?
        <View style={styles.CameraContainer}>
        {image && <Image source = {{uri: image}} style={{flex:1}}/>}
        </View> 
        :
        <View style={styles.CameraContainer}>
        <Camera
        ref={ref => setCamera(ref)} 
        style={styles.fixedRatio} 
        type={type} 
        ratio={'16:9'}/>
        </View> }
        {isShooted ?
        <View>
          <Button full transparent
          onPress={()=> setIsShooted(false)}>
            <Text>다시촬영하기</Text>
          </Button>
          <Button full transparent
          onPress={()=> pickImage()}>
            <Text>사진첩에서 불러오기</Text>
          </Button>
          <Button full transparent
          onPress={() => navigation.navigate('SaveStory',{image})}>
            <Text>저장하기</Text>
          </Button>
        </View> :
        <View>
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
    <Button full transparent
     onPress={()=> pickImage()}>
    <Text>사진첩에서 불러오기</Text>
    </Button>
    </View> }  
    </Content>
  );
}

const styles = StyleSheet.create({
    CameraContainer:{
        flex : 1,
        flexDirection : 'row'        
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