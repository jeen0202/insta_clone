import React,{useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {StyleSheet} from 'react-native'
import moment from 'moment'
import { Container, Content, Text } from 'native-base'
function Story(props) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [images, setImages] = useState([])
    useEffect(()=>{
        props.feed.sort(function(x,y) {
            return y.creation - x.creation;
        })
        setSelectedIndex(props.route.params.selectedIndex)
        //console.log(props.feed)
        //console.log(props.following)   
        //`${moment(item.creation.toDate()).format('YY년MM월DD일 HH:mm')}`     
        const makeImageArray= (feed,following) => {
            for(let i=0;i<following.length;i++){
                for(let j=0;j<feed.length;j++){
                    if(feed[j].user.uid === following[i]){
                        console.log(feed[j].user.uid,feed[j].creation.toDate());                        
                        break;
                    }
                             
                }
                
            }
        }
        makeImageArray(props.feed, props.following)
        
    },[props.route.params.selectedIndex])
    return (
        <Container style={{flex:1}}>
            <Content contentContainerStyle={styles.content}>
                <Text>Story Screen</Text>
                <Text>Seleted Index is {selectedIndex}</Text>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    content:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})
const mapStatetoProps = (store) => ({
    currentUser : store.userState.currentUser,
    following: store.userState.following,
    feed : store.usersState.feed,        
    usersFollowingLoaded : store.usersState.usersFollowingLoaded,
})

export default connect(mapStatetoProps,null)(Story);