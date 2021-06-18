import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {StyleSheet,FlatList,Image,View,TouchableOpacity,Dimensions,Animated} from 'react-native'
import { Container,Header, Content, Text,} from 'native-base'

const {width,height} = Dimensions.get('window');
function Story(props) {      
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [images, setImages] = useState([])
    
    useEffect(()=>{                     
        props.feed.sort(function(x,y) {
            return y.creation - x.creation;
        })        
        //console.log(props.feed)
        //console.log(props.following)   
        //`${moment(item.creation.toDate()).format('YY년MM월DD일 HH:mm')}`     
        const makeImageArray= (feed,following) => {
            let images = []
            for(let i=0;i<following.length;i++){
                for(let j=0;j<feed.length;j++){
                    if(feed[j].user.uid === following[i]){
                        //console.log(feed[j].user.uid,feed[j].creation.toDate());
                        images[i]=feed[j].downloadURL;                                              
                        break;
                    }                             
                }                
            }
            setImages(images)
        }
        makeImageArray(props.feed, props.following)
       
        //console.log(images)
    },[props.feed,props.following])
    useEffect(()=>{
        setSelectedIndex(parseInt(props.route.params.selectedIndex))
        console.log(selectedIndex)   
    },[selectedIndex,props.route.params.selectedIndex])
    
    const toNext = () => {
        if(selectedIndex < images.length){
            setSelectedIndex(selectedIndex++);
        }else{
            props.navigation.pop(1)
        }
    }    
    return (
        <Container style={{flex:1,backgroundColor:'black'}}>
            <Header transparent>
                <View style={styles.progressBar}>
                    <Animated.View style={[styles.absoluteFill],{backgroundColor: "#8BED4F", width: '50%'}}/>
                </View>            
            </Header>            
            <FlatList                        
            //initialScrollIndex={selectedIndex}                                                
            pagingEnabled={true}                    
            showsHorizontalScrollIndicator={false}            
            //legacyImplementation={false}
            disableIntervalMomentum={true}
            numColumns={1}
            initialNumToRender={10}
            horizontal={false}
            keyExtractor={(item,index)=> index.toString()}
            data={images}            
            renderItem={({item,index}) => (
            <TouchableOpacity
            style={{flex:1,justifyContent:'center'}}
            onPress={()=>{
                console.log(index)
            }}> 
              <View style={{flex:1,width,height}}>
                <Image 
                style={styles.image}                
                source={{uri:item}} /> 
              </View>
            </TouchableOpacity>
            )}/>            
        </Container>
    )
}

const styles = StyleSheet.create({
    content:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    image: {
        flex:1,        
        height:'100%',
        width:'100%',
        resizeMode:'contain',

    },
    progressBar: {
        height: 20,
        width: '100%',
        backgroundColor: 'white',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 5
    },
    absoluteFill : {
        position:'absolute',        
        left: 0,
        right: 0,
        top: 0,
        bottom: 0    
    }
})
const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
    following: store.userState.following,
    feed : store.usersState.feed,        
    usersFollowingLoaded : store.usersState.usersFollowingLoaded,
})

export default connect(mapStatetoProps,null)(Story);