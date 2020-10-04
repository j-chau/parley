import React, { Component } from 'react'
import './App.css';
import axios from 'axios';
import MeetingTime from './MeetingTime';

import UserInput from './UserInput';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      initialTime: "",
      duration: 0,
      endTime: "",
      etcList: [],
      timeZone: "",
    }
  }

  componentDidMount() {
    axios({
        url: `http://worldtimeapi.org/api/timezone/Etc`,

    }).then(response => {
        this.setState({
            etcList: response.data,
        })
    })

  }
  
  render() {
    return (
     <div>
        <div className="App wrapper">
          <header>
            <h1>What time is it?</h1>
          </header>
          <div className="flex">
            <div>
              <UserInput 
                  etcList={this.state.etcList}
              />
              <p>results</p>
              <p>results</p>
              <p>results</p>
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

