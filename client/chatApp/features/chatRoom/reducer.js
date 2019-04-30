import { NEW_MESSAGE_ACTION, LOAD_OLD_MESSAGE, LOAD_OLD_MESSAGE_SUCCESS, LOAD_OLD_MESSAGE_FAILED, SEND_MESSAGE } from './actions'

const initialState = {
    messages: [],
    loading: false,
    err: null,
    roomName: ""
}
const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case NEW_MESSAGE_ACTION:
            console.log("NEW_MESSAGE_ACTION YESSSSSSSSSSSSSSSSSSS")
            return {
                ...state,
                messages: [...state.messages, action.payload],
            }
        case SEND_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload],
            }
        case LOAD_OLD_MESSAGE:
            return {
                ...state,
                loading: true,
                err: null,
                messages: []
            }
        case LOAD_OLD_MESSAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                err: null,
                messages: action.payload.messages,
                roomName: action.payload.roomName,
            }
        case LOAD_OLD_MESSAGE_FAILED:
            return {
                ...state,
                loading: false,
                err: action.payload,
                messages: [],
            }

        default:
            return state
    }
}

export default chatReducer
