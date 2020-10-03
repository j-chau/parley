import React, { Component } from 'react'
import axios from 'axios';

import UserInput from './UserInput';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      data: []
    }
  }


  render() {
    return (
      <div className="App">
        <h1>test</h1>
        <UserInput />
      </div>
    )
  }
}
