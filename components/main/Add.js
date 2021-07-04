import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image} from 'react-native';
import {Content, Button,Text,Icon} from 'native-base'
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
//갤러리에서 사진을 불러오기 위한 package
import * as ImagePicker from 'expo-image-picker';

export default function App({navigation}) {
    //카메라 사용 권한 확인
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const isFocused = useIsFocused();
    //카메라 접근
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
          aspect: [1, 1],
          quality: 1,
        });
    
       // console.log(result);
    
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
  return (
    <Content contentContainerStyle={styles.container}>      
        {isShooted?
        <View style={styles.CameraContainer}>
        {image && <Image source = {{uri: image}} style={{flex:1,aspectRatio:1}}/>}
        </View> 
        :
        <View style={styles.CameraContainer}>
        { isFocused && <Camera
        ref={ref => setCamera(ref)} 
        style={styles.fixedRatio} 
        type={type} 
        ratio={'1:1'}/>
        }
        </View> }
        {isShooted ?
        <View style={{position: 'absolute',flexDirection:'row',top:0}}>
        <Button transparent
        onPress={()=> setIsShooted(false)}>
          <Icon name="x" type="Feather" style={{fontSize:30,color:'white'}}/>
        </Button>          
        <Button  transparent
        onPress={() => navigation.navigate('Save',{image})}>
        <Icon name="arrow-collapse-down" type="MaterialCommunityIcons" 
        style={{fontSize:30, color:'white',marginLeft:"55%"}}/>
        </Button>
        </View>
        :
        <View style={{position: 'absolute',flexDirection:'row',bottom:10}}>
              <Button transparent style={{marginRight:30}}
                onPress={()=> pickImage()}>
              <Icon name="photo" type="FontAwesome" style={{fontSize:20,color:'white'}}/>
              </Button>          
              <Button rounded style={{marginHorizontal:85,backgroundColor:'white',bottom:20}}
              onPress={() => takePicture()}>
                <Icon name="camera" type="Feather" style={{fontSize:40,color:'black'}}/> 
              </Button>  
              <Button transparent style={{marginLeft:30}}
              onPress={() => {
                  setType(
                  type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
              }}>
                <Icon name="ios-camera-reverse-outline" type="Ionicons" style={{fontSize:30,color:'white'}}/>            
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
        aspectRatio : 1
    },
  container: {
    flex: 1,
    backgroundColor:'black'
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