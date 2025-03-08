import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT } from "./ActionType"

const initialState={
    chats:null,
    createdGroup:null,
    createdChat:null
}
const ChatReducer=(store=initialState,{type,payload})=>{
    if (type===CREATE_CHAT){
        return {...store,createChat:payload}
    }
    else if (type===CREATE_GROUP){
        return {...store, createdGroup:payload}
    }
    else if (type===GET_USERS_CHAT){
        return {...store, chats:payload}
    }
    return store;
}

export default ChatReducer;