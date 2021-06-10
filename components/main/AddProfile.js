import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image} from 'react-native';
import {Content,Header, Button,Text} from 'native-base'
import { Camera } from 'expo-camera';
//갤러리에서 사진을 불러오기 위한 package
import * as ImagePicker from 'expo-image-picker';

export default function App({navigation}) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const [camera,setCamera] = useState(null);
    const [image,setImage] = useState(null);
    const [isShooted,setIsShooted] = useState(false)
    const [cameraOn,setCameraOn] = useState(false)

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

    if (hasCameraPermission === null||hasGalleryPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    
    return(
        <Content contentContainerStyle={styles.container}>
            <Header>
                <Button full transparent onPress={()=> pickImage()}>
                        <Text>갤러리</Text>
                    </Button>
                    <Button full transparent onPress={()=> setCameraOn(true)}>
                        <Text>사진</Text>
                    </Button>
            </Header>
            {isShooted?
                <View style={styles.CameraContainer}>
                {image && <Image source = {{uri: image}} style={{flex:1}}/>}
                <View>
                <Button full transparent
                onPress={()=> setIsShooted(false)}>
                    <Text>다시촬영하기</Text>
                </Button>
                <Button full transparent
                onPress={()=> pickImage()}>
                    <Text>갤러리에서 불러오기</Text>
                </Button>
                <Button full transparent
                onPress={() => {}}>
                    <Text>저장하기</Text>
                </Button>
                </View>
                </View>                
                :
                <View style={styles.CameraContainer}>
                    {cameraOn &&  <View style={styles.CameraContainer}>
                    <Camera
                    ref={ref => setCamera(ref)} 
                    style={styles.fixedRatio} 
                    type={type} 
                    ratio={'16:9'}/>
                    </View>}                        
                </View>
            }
        </Content>
    )
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