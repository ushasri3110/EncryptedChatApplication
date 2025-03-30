import { BASE_API_URL } from "../../config/Api";
import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGES } from "./ActionType";


export const createMessage = (messageData) => async (dispatch) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/messages/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${messageData.jwt}`
            },
            body: JSON.stringify(messageData.data)
        });

        const resData = await response.json();
        dispatch({ type: CREATE_NEW_MESSAGE, payload: resData });
    }
    catch (e) {
        throw new Error('Failed to create chat');
    }
};

export const getAllMessages = (messageData) => async (dispatch) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/messages/chat/${messageData.chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${messageData.jwt}`
            }
        });
        const resData = await response.json();
        dispatch({ type: GET_ALL_MESSAGES, payload: resData });
    }
    catch (e) {
        throw new Error('Failed to fetch messages');
    }
};
