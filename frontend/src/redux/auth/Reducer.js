import { LOGIN, REGISTER, REQ_USER, SEARCH_USER, UPDATE_USER } from "./ActionType"

const intialValue={
    signup:null,
    signin:null,
    reqUser:null,
    searchUser:[],
    updatedUser:null
}

const AuthReducer=(state=intialValue,{type,payload})=>{
    if (type===REGISTER){
        return {...state,signup:payload.jwt}
    }
    else if (type===LOGIN){
        return {...state, signin:payload.jwt}
    }
    else if (type===REQ_USER){
        return {...state, reqUser:payload}
    }
    else if (type===SEARCH_USER){
        return {...state, searchUser:payload}
    }
    else if (type===UPDATE_USER){
        return {...state, updatedUser:payload}
    }
    return state;
}
export default AuthReducer;