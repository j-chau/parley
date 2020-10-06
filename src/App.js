import React, { Component } from 'react'
import './App.css';
import axios from 'axios';

import MeetingTime from './components/MeetingTime';
import UserInput from './components/UserInput';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      etcList: [],
      userInput: {
        initialTime: 0,
        initialEndTime: 0,
        timeZone: {
          startTime: {},
          endTime: {}
        },
        timeZoneCheck: []
      }
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

  getUserInput = (initialTime, duration, timeZone) => {
    this.setState({
      userInput: {
        initialTime,
        duration,
        timeZone: {
          startTime: timeZone
        },
      }
    })
    // creating array from the values of the timeZone
    const timeZoneObj = Object.values(timeZone);
    const timeZoneArr = timeZoneObj.map(el => parseInt(el))

    // initial settings for for-loop
    let copyTimeZoneCheck = [];
    let copyStartTime = { location1: parseInt(initialTime) };
    let copyEndTime = { location1: parseInt(initialTime) + duration };

    // adjusting time at different timeZones to be relative to first location
    for (let i = 1; i < timeZoneArr.length; i++) {
      let goodTime = true;
      let adjustStartTime = parseInt(initialTime) + timeZoneArr[i] - timeZoneArr[0];

      // adjust for times that are outside 0-24
      if (adjustStartTime < 0) adjustStartTime += 24;
      else if (adjustStartTime > 24) adjustStartTime -= 24;

      let adjustEndTime = adjustStartTime + duration;

      // if meeting start time && meeting end time is outside of working hours, set false
      if ((adjustStartTime < 8 || adjustStartTime > 19)
        || (adjustEndTime < 8 || adjustEndTime > 19)) goodTime = false;
      copyTimeZoneCheck.push(goodTime);

      const keyName = "location" + (i + 1);
      copyStartTime[keyName] = adjustStartTime;
      copyEndTime[keyName] = adjustEndTime;
    }
    copyTimeZoneCheck.unshift(true);
    this.setState(prevState => ({
      userInput: {
        ...prevState.userInput,
        timeZone: {
          startTime: copyStartTime,
          endTime: copyEndTime
        },
        timeZoneCheck: copyTimeZoneCheck
      }
    }))
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
            <MeetingTime displayResults={this.state.userInput} />
          </div>

        </div>
        <footer>
          <p>&copy; Created at <a href="https://junocollege.com/" target="_blank" rel="noopener noreferrer">Juno College</a></p>
        </footer>
      </div>
    )
  }
}

