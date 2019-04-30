import io from 'socket.io-client';

export default function socketMiddleware() {
  let socket = null;

  return ({ dispatch }) => next => (action) => {
    if (typeof action === 'function') {
      return next(action);
    }

    const {
      event,
      leave,
      handle,
      withSocketNeed,
      startio,
      ...rest
    } = action;

    if(startio){
      console.log("initialize io")
      socket = io("http://192.168.1.4:5000")
      socket.emit("sendMessage", "DATA")
    }

    if (withSocketNeed){
      console.log("withSocketNeed")
      withSocketNeed(socket)
    }

    if (!event) {
      return next(action);
    }

    if (leave) {
      socket.removeListener(event);
    }

    let handleEvent = handle;
    if (typeof handleEvent === 'string') {
      handleEvent = result => dispatch({ type: handle, payload: result, ...rest });
    }
    return socket.on(event, handleEvent);
  };
}