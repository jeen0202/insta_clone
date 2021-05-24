import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image} from 'react-native';
import { Camera } from 'expo-camera';
//갤러리에서 사진을 불러오기 위한 package
import * as ImagePicker from 'expo-image-picker';

export default function App() {
    //카메라 사용 권한 확인
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    //카메라 접근
    const [camera,setCamera] = useState(null);
    const [image,setImage] = useState(null);

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
        }
    }

    if (hasCameraPermission === null||hasGalleryPermission === null) {
    return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
    }
  return (
    <View style={styles.container}>
        <View style={styles.CameraContainer}>
        <Camera
        ref={ref => setCamera(ref)} 
        style={styles.fixedRatio} 
        type={type} 
        ratio={'1:1'}/>
        </View>        
        <Button                     
            title= "Flip Image"
            onPress={() => {
                setType(
                type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
            }}>            
        </Button>
        <Button title = "Take Picture" onPress={() => takePicture()}/>
        {image && <Image source = {{uri: image}} style={{flex:1}}/>}        
    </View>
  );
}

const styles = StyleSheet.create({
    CameraContainer:{
        flex : 1,
        flexDirection : 'row'        
    },
    fixedRatio : {
        flex : 1,
        aspectRatio : 1
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


<View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.text}> Flip </Text>
          </Button>
        </View>