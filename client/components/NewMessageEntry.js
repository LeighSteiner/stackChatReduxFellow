import React, { Component } from 'react';
import store from '../store';
import { writeMessage, gotNewMessageFromServer, postMessage } from '../store';
import socket from '../socket';
import axios from 'axios';

export default class NewMessageEntry extends Component {
  constructor () {
    super();
    this.state = store.getState();

    // don't forget to bind!
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount () {
    this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
  }

  componentWillUnmount () {
    this.unsubscribe();
  }


  handleChange (evt) {
    const action = writeMessage(evt.target.value);
    store.dispatch(action);
  }

  handleSubmit (evt) {
    evt.preventDefault(); // don't forget to preventDefault!
    console.log('HI!')

    // our message content is on our state (which we're getting from our Redux store)
    const content = this.state.newMessageEntry;

    // our channelId is available from the props sent by MessagesList, which it receives as props from the Route!
    const channelId = this.props.channelId;
  

   store.dispatch(postMessage({ content: content, channelId: channelId }));
  }

  render () {
    return (
      <form id="new-message-form">
        <div className="input-group input-group-lg">
          <input
            className="form-control"
            type="text"
            name="content"
            value={this.state.newMessageEntry}
            onChange={this.handleChange}
            placeholder="Say something nice..."
          />
          <span className="input-group-btn">
            <button className="btn btn-default" type="submit" onClick={this.handleSubmit}>Chat!</button>
          </span>
        </div>
      </form>
    );
  }

}



