import React, { Component } from 'react'
import './App.css';
import axios from 'axios';

import MeetingTime from './components/MeetingTime';
import UserInput from './components/UserInput';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      initialTime: 0,
      initialEndTime: 0,
      etcList: [],
      timeZone: {},
      timeZoneCheck: []
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

  getUserInput = (initialTime, initialEndTime, timeZone) => {
    this.setState({
      initialTime,
      initialEndTime,
      timeZone,
    })
    // creating array from the values of the timeZone
    const timeZoneObj = Object.values(timeZone);
    const timeZoneArr = timeZoneObj.map(el => parseInt(el))

    const adjustInitStart = parseInt(initialTime) + timeZoneArr[0];
    const adjustInitEnd = initialEndTime + timeZoneArr[0];

    // initial settings for for-loop
    let copyTimeZoneCheck = [];
    let copyTimeZone = { location1: parseInt(initialTime) };

    // adjusting time at different timeZones to be relative to first location
    for (let i = 1; i < timeZoneArr.length; i++) {
      let goodTime = true;
      let adjustLocationTime = parseInt(initialTime) + timeZoneArr[i] - timeZoneArr[0];
      if (adjustLocationTime < 0) adjustLocationTime += 24;
      else if (adjustLocationTime > 24) adjustLocationTime -= 24;

      // if meeting start time is outside of working hours, set false
      if (adjustLocationTime < 8 || adjustLocationTime > 19) goodTime = false;
      copyTimeZoneCheck.push(goodTime);
      copyTimeZone["location" + (i + 1)] = adjustLocationTime;
    }
    copyTimeZoneCheck.unshift(true);
    this.setState({
      timeZone: copyTimeZone,
      timeZoneCheck: copyTimeZoneCheck
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
                getUserInput={this.getUserInput}
              />
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

