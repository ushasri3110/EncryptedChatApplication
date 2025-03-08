import { BASE_API_URL } from "../../config/Api"
import { LOGIN, LOGOUT, REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER } from "./ActionType";

export const register = (data) => async (dispatch) => {
    try {
        const response = await fetch(`${BASE_API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData=await response.json();
        if (resData.jwt){
            localStorage.setItem('jwt', resData.jwt)
        }
        dispatch({type: REGISTER, payload: resData})
    }
    catch (e) {
        throw new Error('Failed to register')
    }
}

export const login = (data) => async (dispatch) => {
    try {
        const response = await fetch(`${BASE_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const resData=await response.json();
        if (resData.jwt){
            localStorage.setItem('jwt', resData.jwt)
        }
        // console.log(resData);
        dispatch({type: LOGIN, payload: resData})
    }
    catch (e) {
        // console.log(e);
        throw new Error('Failed to register')
    }
}

export const currentUser = (jwt) => async (dispatch) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/users/getUserProfile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${jwt}`
            }
        })
        const resData=await response.json();
        // console.log("profile",resData);
        dispatch({type: REQ_USER, payload: resData})
    }
    catch (e) {
        // console.log(e);
        throw new Error('Failed to register')
    }
}

export const searchUser = (data) => async (dispatch) => {
    try {
        const response = await fetch(`${BASE_API_URL}/api/users/findUsers/${data.query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${data.jwt}`
            }
        })
        const resData=await response.json();
        // console.log(resData);
        dispatch({type: SEARCH_USER, payload: resData})
    }
    catch (e) {
        // console.log(e);
        throw new Error('Failed to register')
    }
}

export const updateUser = (updateData) => async (dispatch) => {
    try {
        console.log(updateData)
        const response = await fetch(`${BASE_API_URL}/api/users/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${updateData.jwt}`
            },
            body: JSON.stringify(updateData.data),
        })
        const resData=await response.json();
        console.log(resData);
        dispatch({type: UPDATE_USER, payload: resData})
    }
    catch (e) {
        // console.log(e);
        throw new Error('Failed to register')
    }
}

export const logout=()=>async(dispatch)=>{
    localStorage.removeItem('jwt')
    dispatch({type: LOGOUT, payload: null})
    dispatch({type:REQ_USER,payload: null})
}