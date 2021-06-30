import {CLEAR_DATA, USERS_DATA_STATE_CHANGE,USERS_POSTS_STATE_CHANGE,USERS_LIKES_STATE_CHANGE,USERS_STORIES_STATE_CHANGE  } from "../constants"


const initState = {
    users : [],
    feed: [],
    stories: [],
    usersFollowingLoaded : 0,
}

export const users = (state = initState, action) => {
    switch(action.type){
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users : [...state.users, action.user]
            }
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                usersFollowingLoaded : state.usersFollowingLoaded +1,
                feed : [...state.feed, ...action.posts]
            } 
        case USERS_LIKES_STATE_CHANGE:
            return{
                ...state,
                feed : state.feed.map(post => post.id == action.postId ?
                    {...post, currentUserLike: action.currentUserLike}:
                    post)
            }
        case USERS_STORIES_STATE_CHANGE:
            return{
                ...state,
                stories : [...state.stories, action.result]
            }
            case CLEAR_DATA:
                return initState         
        default:
            return state;
    }
    
}