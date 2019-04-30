import { getStoreToken } from "../../store";
import { loadOldMessages as apiLoad } from "../../DataProviders";
export const SEND_MESSAGE = "CHAT_ROOM_SEND_MESSAGE"
export const ADD_USER_TO_ROOM = "CHAT_ROOM_ADD_USER"
export const REMOVE_USER_FROM_ROOM = "CHAT_ROOM_REMOVE_USER"

export const SUBSCRIBE_FOR_MESSAGES = "CHAT_ROOM_SUBSCRIBE_FOR_MESSAGES"
export const NEW_MESSAGE_ACTION = "CHAT_ROOM_NEW_MESSAGE_ACTION"
export const LOAD_OLD_MESSAGE = "CHAT_ROOM_LOAD_OLD_MESSAGE"
export const LOAD_OLD_MESSAGE_SUCCESS = "CHAT_ROOM_LOAD_OLD_MESSAGE_SUCCESS"
export const LOAD_OLD_MESSAGE_FAILED = "CHAT_ROOM_LOAD_OLD_MESSAGE_FAILED"

// creators
export const doInit = (userId, roomId) => ({
    startio: true,
    event: "show-message",
    handle: NEW_MESSAGE_ACTION,
    roomId,
    userId, // we don't need it
})


export const sendSignedIn = () => ({
    withSocketNeed: (socket) => socket.emit("signedIn", { token: getStoreToken() }),
    type: "__",
})


export const loadOldMessages = (roomId) => async dispatch => {
    dispatch({
        type: LOAD_OLD_MESSAGE
    })
    try {
        const res = await apiLoad(roomId) // res.messages, res.roomName
        dispatch({
            type: LOAD_OLD_MESSAGE_SUCCESS,
            payload: res,
        })
    } catch (error) {
        console.log(error)
        dispatch({
            type: LOAD_OLD_MESSAGE_FAILED,
            payload: error,
        })
    }
}

export const sendMessage = (message) => ({
    withSocketNeed: (socket) => { 
        console.log("emitttttttting")
        socket.emit("sendMessage", message) 
    },
    type: SEND_MESSAGE,
    payload: message,
})