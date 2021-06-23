import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image,Dimensions} from 'react-native';
import {Container,Content, Button,Text,Icon,Spinner} from 'native-base'
import { Camera } from 'expo-camera';
//갤러리에서 사진을 불러오기 위한 package
import * as ImagePicker from 'expo-image-picker';
//firebase 저장을 위한
import firebase from 'firebase/app'
require("firebase/firestore")
require("firebase/firebase-storage")

const {width,height} = Dimensions.get('window');
// const height = Math.round((width * 9) / 16);
const screenRatio = height / width
export default function App({navigation}) {
    
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);    
    const [camera,setCamera] = useState(null);
    const [image,setImage] = useState(null);
    const [isShooted,setIsShooted] = useState(false)
    const [onSave, setOnSave] = useState(false)

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
    const savePostData = (downloadURL) => {
        firebase.firestore().collection('posts').doc(firebase.auth().currentUser.uid)
        .collection("userStories")
        .add({
            downloadURL,            
            creation : firebase.firestore.FieldValue.serverTimestamp()
        }).then((function (){
            navigation.navigate("Feed")
        }))
    }
    const uploadImage= async () =>{
      const uri = image;
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
              console.log("Upload Success...\nWrite DB...")
              savePostData(snapshot);              
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
    <Container>
      {onSave ?
        //Upload시작시
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontWeight:'bold'}}>Uploading...</Text>
          <Spinner/>
        </View>
      :
        //기본 Layout
        <Content contentContainerStyle={styles.container}>
        {isShooted?
          //이미지 선택 이후
          <Container style={{flex:1}}>
            <View style={styles.CameraContainer}>
            {image && <Image source = {{uri: image}} style={{flex:1}}/>}
            </View>
            <View style={{position: 'absolute',flexDirection:'row',top:0}}>
            <Button transparent
            onPress={()=> setIsShooted(false)}>
              <Icon name="x" type="Feather" style={{fontSize:30,color:'white'}}/>
            </Button>          
            <Button  transparent
            onPress={() => {
              uploadImage()
              setOnSave(true);              
            }}>
            <Icon name="arrow-collapse-down" type="MaterialCommunityIcons" 
            style={{fontSize:30, color:'white',marginLeft:"50%"}}/>
            </Button>
            </View>
          </Container>         
        :
          //기본 Layout
          <Container>
            <View style={styles.CameraContainer}>
              <Camera
              ref={ref => setCamera(ref)} 
              style={styles.fixedRatio} 
              type={type} 
              ratio={'16:9'}/>
            </View>
            <View style={{position: 'absolute',flexDirection:'row',bottom:30}}>
              <Button transparent style={{marginRight:30}}
                onPress={()=> pickImage()}>
              <Icon name="photo" type="FontAwesome" style={{fontSize:30,color:'white'}}/>
              </Button>          
              <Button rounded style={{marginHorizontal:70,backgroundColor:'white'}}
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
                <Icon name="ios-camera-reverse-outline" type="Ionicons" style={{fontSize:40,color:'white'}}/>            
              </Button>
            </View>
          </Container>
        }
      </Content>
      }
    </Container>
  );
}

const styles = StyleSheet.create({
    CameraContainer:{
        flex : 1,
        flexDirection : 'row'        
    },
    fixedRatio : {
        flex : 1,
        width:'100%',
        height:height,             
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