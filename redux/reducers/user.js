const initState = {
    currentUser : null,
}

export const user = (state = initState, action) => {
    return {
        ...state,
        currentUser: action.currentUser
    }
}