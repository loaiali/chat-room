// import socketMiddleware from "./socketMiddleware";
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'

import authReducer from "../features/auth/authReducer";
import roomsReducer from '../features/roomsList/reducer';
import chatReducer from '../features/chatRoom/reducer';
import socketMiddleware from "./socketMiddleware";

export const reducers = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    rooms: roomsReducer,
})

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
}
const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(persistedReducer, applyMiddleware(thunk, socketMiddleware()))
// const store = createStore(persistedReducer, applyMiddleware(socketMiddleware(), thunk))
// const store = createStore(persistedReducer, applyMiddleware(socketMiddleware))
// const store = createStore(persistedReducer, applyMiddleware(thunk))
export default store
export const persistor = persistStore(store)

export const getStoreToken = () => store.getState().auth.token