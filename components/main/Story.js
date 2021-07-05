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
    const [milliSeconds,setMilliSeconds] = useState(0)
    const [progress,setProgress] = useState(0)

    const refContainer = useRef(null);
    const imageRef = useRef(null);    
    useEffect(()=>{
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
        for(let i =0;i<props.stories.length;i++){                     
            props.stories[i][1].sort(function(x,y) {            
                return y.creation - x.creation;
            })      
        }
       props.stories.sort(function(x,y){
           return y[1][0].creation - x[1][0].creation
       })
        makeArrays(props.stories)            
        setSelectedIndex(parseInt(props.route.params.selectedIndex))        
    },[props.stories])  

    useEffect(()=>{
        let count = props.stories[selectedIndex][1].length        
        const countdown = setInterval(() => {
            setMilliSeconds(milliSeconds+1) 
            if(milliSeconds>5)
                setProgress(progress+(0.011/count))            
            if(milliSeconds>0 && milliSeconds%200 ===0){                
                if(selectedPic!==count-1){                    
                    toNextPic(selectedPic)
                }
                else{                    
                    toNext(selectedIndex)                   
                }               
            }            
        },10);
        return ()=>clearInterval(countdown)   
    },[milliSeconds])

    const toNextPic = (index) => {
        let interval = 1/(props.stories[selectedIndex][1].length)
        setProgress(interval*(index+1))
        setMilliSeconds(0)        
        setSelectedPic(index+1);
        imageRef.current.scrollToIndex({animated: false, index:index+1})        
    }
    const toNext = (index) => {
        setProgress(0);
        setSelectedPic(0);
        setMilliSeconds(0);                   
        if(index< images.length-1){ 
            setSelectedIndex(index+1);                                                      
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
                    <FlatList
                    ref={imageRef}
                    data={images[selectedIndex]}                    
                    numColumns={1}
                    initialNumToRender={10}
                    scrollEnabled={false}
                    keyExtractor={(item,index)=> index.toString()}
                    renderItem={({item,index}) => (
                        <TouchableWithoutFeedback            
                        style={{flex:1,justifyContent:'center'}}                   
                        onPress={()=>{                                                                                  
                            if(selectedPic<images[selectedIndex].length-1){                                                                                              
                                toNextPic(selectedPic)
                            }else
                            toNext(selectedIndex)}}>
                        <View style={{flex:1,width,height}}>                                      
                            <Image                    
                                style={styles.image}                
                                source={{uri:images[selectedIndex][selectedPic].downloadURL}} /> 
                        </View>
                        </TouchableWithoutFeedback>)}
                    />                
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