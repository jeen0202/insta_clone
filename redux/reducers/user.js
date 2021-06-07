import {CLEAR_DATA, USER_POST_STATE_CHANGE, USER_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE,USER_MESSAGES_STATE_CHANGE } from "../constants"

const initState = {
    currentUser : null,
    posts : [],
    following : [],
    messages : [],
}

export const user = (state = initState, action) => {
    switch(action.type){
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POST_STATE_CHANGE:
            return {
                ...state,
                posts : action.posts
            }
        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following : action.following
            }
        case USER_MESSAGES_STATE_CHANGE:
            return {
                ...state,
                messages : action.messages
            }
        case CLEAR_DATA:
            return initState               
        default:
            return state;
    }
    
}