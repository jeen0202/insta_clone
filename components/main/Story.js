import React,{useState,useEffect,useRef} from 'react'
import {connect} from 'react-redux'
import {StyleSheet,FlatList,Image,View,TouchableWithoutFeedback,Dimensions} from 'react-native'
import { Container,Header,Left,Right,Button, Text,Icon, Thumbnail} from 'native-base'
import {ProgressBar} from 'react-native-paper'

const {width,height} = Dimensions.get('window');
function Story(props) {      
    const [selectedIndex, setSelectedIndex] = useState(props.route.params.selectedIndex)
    const [users, setUsers] = useState([])
    const [images, setImages] = useState([])    
    const [seconds,setSeconds] = useState(3)
    const [milliSeconds,setMilliSeconds] = useState(200)
    const [progress,setProgress] = useState(0)

    const refContainer = useRef(null);    
    useEffect(()=>{                     
        props.feed.sort(function(x,y) {
            return y.creation - x.creation;
        })
        props.stories.sort(function(x,y) {
            return y.creation - x.creation;
        })       
        //console.log(props.stories)
        const makeArrays= (stories,following) => {
            let images = []
            let users = []                                
            for(let i=0;i<following.length;i++){
                for(let j=0;j<stories.length;j++){
                    if(stories[j].user.uid === following[i]){
                        users[i]=stories[j].user;
                        images[i]=stories[j].downloadURL;                                                                                                                  
                        break;
                    }                             
                }                
            }
            console.log({users,images})
            setUsers(users)
            setImages(images)            
        }

        makeArrays(props.stories, props.following)        
        setSelectedIndex(parseInt(props.route.params.selectedIndex))        
    },[props.stories,props.following])
  
/*
    useEffect(() => {
        const countdown = setInterval(() => {
            if(seconds > 0) {
                
                setSeconds(seconds -1);
            }else{                             
                //toNext(selectedIndex);                
            }
        },1000);

        return ()=>clearInterval(countdown);
    },[seconds])
*/
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
                {/*<View style={styles.progressBar}>
                <Thumbnail source={{uri:users.profileURL!==undefined?users.profileURL:require('../../assets/default_Profile.png')}}/>  
                    <Text>{seconds <10 ? `0${seconds}` : seconds}</Text>
                   <Animated.View style={[styles.absoluteFill],{backgroundColor: "#8BED4F", width: '50%'}}/>
                    </View>  */}          
                    
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
                source={{uri:item}} /> 
              </View>
            </TouchableWithoutFeedback>
            )}            
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