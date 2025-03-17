import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import AuthReducer from "./auth/Reducer";
import ChatReducer from "./chat/Reducer";
import MessageReducer from "./message/Reducer";

const rootReducer=combineReducers({
    auth:AuthReducer,
    chat:ChatReducer,
    message:MessageReducer
})

export const store=legacy_createStore(rootReducer,applyMiddleware(thunk))