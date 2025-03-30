import { BASE_API_URL } from "../../config/Api";
import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT } from "./ActionType";

export const createChat=(chatData)=>async(dispatch)=>{
    try {
        console.log(chatData)
        const response = await fetch(`${BASE_API_URL}/api/chats/createSingleChat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${chatData.jwt}`
            },
            body: JSON.stringify(chatData.userId)
        })
        const resData=await response.json();
        console.log(resData);
        dispatch({type: CREATE_CHAT, payload: resData})
        dispatch(getUserChats(chatData.jwt))
    }
    catch (e) {
        // console.log(e);
        throw new Error('Failed to create chat')
    }
}

export const createGroupChat=(chatData)=>async(dispatch)=>{
    try {
        console.log(chatData)
        const response = await fetch(`${BASE_API_URL}/api/chats/createGroupChat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${chatData.jwt}`
            },
            body: JSON.stringify(chatData.data)
        })
        const resData=await response.json();
        console.log(resData);
        dispatch({type: CREATE_GROUP, payload: resData})
        dispatch(getUserChats(chatData.jwt))
    }
    catch (e) {
        // console.log(e);
        throw new Error('Failed to create chat')
    }
}

export const getUserChats=(jwt)=>async(dispatch)=>{
    try {
        const response = await fetch(`${BASE_API_URL}/api/chats/findAllChats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${jwt}`
            }
        })
        const resData=await response.json();
        // console.log(resData);
        dispatch({type: GET_USERS_CHAT, payload: resData})
    }
    catch (e) {
        // console.log(e);
        throw new Error('Failed to get chat')
    }
}