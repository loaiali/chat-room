import { ADD_ROOM, LOAD_ROOM, REMOVE_ROOM, SELECT_ROOM, LOAD_ROOM_FAILED, LOAD_ROOM_SUCCESS } from './actions'

const initialState = {
  rooms: [],
  loading: false,
  err: null,
}
const roomsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ROOM:
      return {
        ...state,
        loading: true,
        err: null,
        rooms: [],
      }
    case LOAD_ROOM_SUCCESS:
      return {
        ...state,
        rooms: action.payload,
        loading: false,
      }
    case LOAD_ROOM_FAILED:
      return {
        ...state,
        err: action.payload,
        loading: false,
        rooms: [],
      }
    case SELECT_ROOM:
      return {
        ...state,
        currRoomId: action.payload,
      }
    case ADD_ROOM:
      return {
        ...state,
        rooms: [...rooms, action.payload]
      }
    default:
      return state
  }
}

export default roomsReducer
