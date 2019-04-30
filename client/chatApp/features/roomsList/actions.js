export const SELECT_ROOM = "ROOMS_LIST_SELECT_ROOM"
export const ADD_ROOM = "ROOMS_LIST_ADD_ROOM"
export const LOAD_ROOM = "ROOMS_LIST_LOAD_ROOM"
export const LOAD_ROOM_SUCCESS = "ROOMS_LIST_LOAD_ROOM_SUCCESS"
export const LOAD_ROOM_FAILED = "ROOMS_LIST_LOAD_ROOM_FAILED"
export const REMOVE_ROOM = "ROOMS_LIST_REMOVE_ROOM"
import { loadRooms as apiLoadRooms } from "../../DataProviders"


// creators
export const selectRoom = (roomId) => ({
    type: SELECT_ROOM,
    payload: roomId,
})

export const loadRooms = () => async dispatch => {
    console.log("loadRooms", "load rooms actions")
    dispatch({ type: LOAD_ROOM })
    try {
        const rooms = await apiLoadRooms()
        dispatch({ type: LOAD_ROOM_SUCCESS, payload: rooms })
    } catch (error) {
        dispatch({ type: LOAD_ROOM_FAILED, payload: error })
    }
}


// export const addRoom = (roomInfo) => async dispatch => {
//     await 
// }