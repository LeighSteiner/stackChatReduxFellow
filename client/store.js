import { createStore, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import axios from 'axios';
//action types

const GOT_MESSAGES_FROM_SERVER = 'GOT_MESSAGES_FROM_SERVER';
const WRITE_MESSAGE = 'WRITE_MESSAGE';
const GOT_NEW_MESSAGE_FROM_SERVER = 'GOT_NEW_MESSAGE_FROM_SERVER';

//action creator

export const gotMessagesFromServer = function (messages) {
  return {
    type: GOT_MESSAGES_FROM_SERVER, // be sure to use the constant, not a string literal
    messages: messages
  };
};

export const writeMessage = function(inputContent) {
  return {
    type: WRITE_MESSAGE,
    newMessageEntry: inputContent
  };
}

export const gotNewMessageFromServer = function(message) {
  return {
    type: GOT_NEW_MESSAGE_FROM_SERVER,
    message: message
  };
}

//initial state

const initialState = {
  messages: [],
  newMessageEntry: ''
};

// our "thunk creator"
export function fetchMessages () {
    return function thunk (dispatch) {
        return axios.get('/api/messages')
      .then(res => res.data)
      .then(messages => {
        const action = gotMessagesFromServer(messages);
        // note that we can just "dispatch", rather than "store.dispatch"
        dispatch(action);
      });
  }
}

export function postMessage (message) {
  return function thunk (dispatch) {
    return axios.post('/api/messages', message)
      .then(res => res.data)
      .then(newMessage => {
        const action = gotMessagesFromServer(newMessage);
        dispatch(action);
        socket.emit('new-message', newMessage);
      });
  }
}

//reducer 

const reducer = function(state = initialState, action) {
  switch (action.type) {

    case GOT_MESSAGES_FROM_SERVER: 
       return Object.assign({}, state, { messages: action.messages });

    case WRITE_MESSAGE:
      return Object.assign({}, state, { newMessageEntry: action.newMessageEntry })

    case GOT_NEW_MESSAGE_FROM_SERVER:
      return Object.assign({}, state, { messages: state.messages.concat(action.message) });
   
    default: 
       return state;
  }
}
// Two things to note: 
//   1. We use Object.assign to maintain immutability.
//      Since our state only has one key on it, it doesn't matter much, but what if we added more?
//   2. If we receive an action that doesn't have a type we recognize, we return the previous state



// STORE


const store = createStore(reducer, applyMiddleware(loggerMiddleware, thunkMiddleware));
export default store;