import React,{useState,useEffect,useRef} from 'react'
import {connect} from 'react-redux'
import {StyleSheet,FlatList,Image,View,TouchableWithoutFeedback,Dimensions} from 'react-native'
import { Container,Header,Left,Right,Button, Text,Icon, Thumbnail} from 'native-base'
import {ProgressBar} from 'react-native-paper'

const {width,height} = Dimensions.get('window');
function Story(props) {      
    const [selectedIndex, setSelectedIndex] = useState(props.route.params.selectedIndex)
    const [selectedPic, setSelectedPic] = useState(0)
    const [users, setUsers] = useState([])
    const [images, setImages] = useState([])    
    const [stories, setStories] = useState([])
    const [milliSeconds,setMilliSeconds] = useState(200)
    const [progress,setProgress] = useState(0)

    const refContainer = useRef(null);    
    useEffect(()=>{
         for(let i =0;i<props.stories.length;i++){                     
         props.stories[i][1].sort(function(x,y) {            
             return y.creation - x.creation;
         })      
         }
        const makeArrays= (stories) => {
            let images = []
            let users = []                                        
            for(let i=0;i<stories.length;i++){
                users[i]=stories[i][0];
                images[i]=stories[i][1]; 
            }
            setUsers(users)
            setImages(images)            
        }

        makeArrays(props.stories)        
        setSelectedIndex(parseInt(props.route.params.selectedIndex))        
    },[props.stories])  

    useEffect(()=>{
        const countdown = setInterval(() => {
            if(milliSeconds > 0) {
                setMilliSeconds(milliSeconds-1)
                if(milliSeconds<195)
                setProgress(progress+0.011)                
            }else{ 
               toNext(selectedIndex);                                
            }
        },10);
        return ()=>clearInterval(countdown)   
    },[milliSeconds])

    const toNextPic = () => {
        if(selectedPic < images[selectedIndex].length-1){
            setSelectedPic(selectedPic+1)            
        }else{
            toNext(selectedIndex)
        }
    }
    const toNext = (index) => {                   
        if(index< images.length-1){
            setProgress(0); 
            setSelectedIndex(index+1);
            //setSeconds(3);
            setMilliSeconds(200);                                  
            refContainer.current.scrollToIndex({animated: true, index:index+1});
        }else{
            props.navigation.navigate("Feed")
        }
    }
    if(images.length<1)
    //예외처리 필요
        return <View/>    
    return (
        <Container style={{flex:1}}>
            <Header transparent style={{ marginTop:20,flexDirection:'column'}}>
                <View>
                    <ProgressBar progress={progress} color={'gray'} />               
                </View>
                <View style={{flex:1,flexDirection:'row'}}>
                {users[selectedIndex]!==undefined ?
                <Left style={{justifyContent:'space-around',flexDirection:'row',alignItems:'center'}}>
                    <Thumbnail small                                      
                    source={users[selectedIndex].profileURL!==undefined?
                    {uri:users[selectedIndex].profileURL}
                    :require('../../assets/default_Profile.png')}/>
                    <Text>{users[selectedIndex].name}</Text>
                </Left> 
                : null}
                <Right>
                <Button transparent>
                <Icon name='dots-vertical' type='MaterialCommunityIcons' style={{color:'black', fontSize:23}}/>
                </Button>
                </Right> 
                </View>
            </Header>
            <FlatList
            ref={refContainer}
            getItemLayout={(data, index) => (
                {length: width, offset: width * index, index}  
            )}                        
            initialScrollIndex={selectedIndex}                                           
            pagingEnabled={true}                    
            showsHorizontalScrollIndicator={false}
            disableIntervalMomentum={true}
            numColumns={1}
            initialNumToRender={10}
            horizontal={true}
            scrollEnabled={false}
            keyExtractor={(item,index)=> index.toString()}
            data={images}                 
            renderItem={({item,index}) => (
            <TouchableWithoutFeedback            
            style={{flex:1,justifyContent:'center'}}                   
            onPress={()=>toNext(index)}> 
                <View style={{flex:1,width,height}}>                
                    <Image 
                    style={styles.image}                
                    source={{uri:item[0].downloadURL}} /> 
                </View>
            </TouchableWithoutFeedback>)}            
            />            
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
    stories : store.usersState.stories,        
    usersFollowingLoaded : store.usersState.usersFollowingLoaded,
})

export default connect(mapStatetoProps,null)(Story);