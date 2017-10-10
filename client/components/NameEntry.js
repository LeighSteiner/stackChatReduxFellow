import React, { Component } from 'react';
import store from '../store';

export default class NameEntry extends Component {
	constructor() {
		super()
		this.state = store.getState();
	}

  componentDidMount() {
  	this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
 
  }

  componentWillUnmount() {
  	this.unsubscribe();
  }
  render() {
   return (
	<form className="form-inline">
	  <label htmlFor="name">Your name:</label>
	  <input
	    type="text"
	    name="name"
	    placeholder="Enter your name"
	    className="form-control"
	  />
	</form>


		)
  }
}