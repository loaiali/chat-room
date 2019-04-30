import {LOG_IN_FULFILLED, LOG_IN_REJECTED, LOG_IN_SENT} from './authActions'

const authInitialState = {
  loading: false,
  loginErr: null,
  userId: "",
}

const authReducer = (state = authInitialState, action) => {
  switch (action.type) {
    case LOG_IN_SENT:
      return {
        ...state,
        loading: true,
        loginErr: null,
        token: null,
      }
    case LOG_IN_FULFILLED:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        loading: false,
      }
    case LOG_IN_REJECTED:
      return {
        ...state,
        loginErr: action.payload,
        loading: false,
        token: null,
      }
    case 'SIGN_OUT':
      return {
        ...state,
        token: null,
      }
    default:
      return state
  }
}

export default authReducer
