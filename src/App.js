import React, { Component } from 'react'
import './App.css';
import MeetingTime from './MeetingTime';

import UserInput from './UserInput';

export default class App extends Component {

  render() {
    return (
     <div>
        <div className="App wrapper">
          <header>
            <h1>What time it is?</h1>
            <div className="flex">
                <div>
                  <UserInput />
                  <p>results</p>
                  <p>results</p>
                  <p>results</p>
                </div>
                <MeetingTime />
            </div>
          </header>
        </div> 
          <footer>
            <p>&copy; Created at Juno   College</p>
          </footer>
      </div>
    )
  }
}

