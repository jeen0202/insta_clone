import React,{useState,useEffect,useRef} from 'react'
import {connect} from 'react-redux'
import {StyleSheet,FlatList,Image,View,TouchableWithoutFeedback,Dimensions,Animated} from 'react-native'
import { Container,Header, Content, Text, Thumbnail,} from 'native-base'

const {width,height} = Dimensions.get('window');
function Story(props) {      
    const [selectedIndex, setSelectedIndex] = useState(props.route.params.selectedIndex)
    const [users, setUsers] = useState([])
    const [images, setImages] = useState([])    
    const [seconds,setSeconds] = useState(3)

    const refContainer = useRef(null);
    
    useEffect(()=>{                     
        props.feed.sort(function(x,y) {
            return y.creation - x.creation;
        })        
        //console.log(props.feed)
        //console.log(props.following)   
        //`${moment(item.creation.toDate()).format('YY년MM월DD일 HH:mm')}`     
        const makeImageArray= (feed,following) => {
            let images = []
            let users = []                     
            for(let i=0;i<following.length;i++){
                for(let j=0;j<feed.length;j++){
                    if(feed[j].user.uid === following[i]){
                        //console.log(feed[j].user.uid,feed[j].creation.toDate());
                        images[i]=feed[j].downloadURL;
                        users[i]=feed[j].user;                                                                   
                        break;
                    }                             
                }                
            }
            //console.log(users);
            setUsers(users)
            setImages(images)            
        }
        makeImageArray(props.feed, props.following)
        setSelectedIndex(parseInt(props.route.params.selectedIndex))
        //console.log(images)
    },[props.feed,props.following])
    
    useEffect(() => {
        const countdown = setInterval(() => {
            if(seconds > 0) {
                setSeconds(seconds -1);
            }else{                
                toNext(selectedIndex);                
            }
        },1000);
        return ()=>clearInterval(countdown);
    },[seconds])
    const toNext = (index) => {                   
        if(index< images.length-1){
            setSelectedIndex(index+1);
            setSeconds(3);
            //console.log(selectedIndex);            
            refContainer.current.scrollToIndex({animated: true, index:index+1});
        }else{
            props.navigation.pop(1)
        }
    }    
    return (
        <Container style={{flex:1,backgroundColor:'black'}}>
            <Header>                          
                {/*<View style={styles.progressBar}>
                <Thumbnail source={{uri:users.profileURL!==undefined?users.profileURL:require('../../assets/default_Profile.png')}}/>  
                    <Text>{seconds <10 ? `0${seconds}` : seconds}</Text>
                   <Animated.View style={[styles.absoluteFill],{backgroundColor: "#8BED4F", width: '50%'}}/>
                    </View>  */}          
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
    usersFollowingLoaded : store.usersState.usersFollowingLoaded,
})

export default connect(mapStatetoProps,null)(Story);