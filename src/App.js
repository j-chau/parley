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
            <h1>What time is it?</h1>
          </header>
          <div className="flex">
            <div>
              <UserInput />
            </div>
            <MeetingTime />
          </div>

        </div>
        <footer>
          <p>&copy; Created at <a href="https://junocollege.com/" target="_blank" rel="noopener noreferrer">Juno College</a></p>
        </footer>
      </div>
    )
  }
}

