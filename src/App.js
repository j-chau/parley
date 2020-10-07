import React, { Component } from 'react'
import './App.css';
import axios from 'axios';
import './styles/MediaQuery.css'

import MeetingTime from './components/MeetingTime';
import UserInput from './components/UserInput';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      etcList: [],
      userInput: {
        meetingFound: true,
        initialTime: 0,
        initialEndTime: 0,
        timeZone: {
          startTime: {},
          suggestTime: {}
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
    this.setState(prevState => ({
      userInput: {
        ...prevState.userInput,
        initialTime: initialTime,
        duration,
        timeZone: {
          startTime: timeZone
        },
      }
    }))

    // creating array from the values of the timeZone
    const timeZoneObj = Object.values(timeZone);
    const timeZoneArr = timeZoneObj.map(el => parseInt(el))
    let startTime = initialTime;
    // initial settings for validateTime()
    let copyTimeZoneCheck = [];
    let copyStartTime = { location1: startTime };

    this.validateTime(timeZoneArr, startTime, copyTimeZoneCheck, copyStartTime);
    this.setState(prevState => ({
      userInput: {
        ...prevState.userInput,
        timeZone: {
          startTime: copyStartTime,
          suggestTime: copyStartTime
        },
        timeZoneCheck: copyTimeZoneCheck
      }
    }))

    // if meeting time for other locations are outside of work hours, 
    //    iterate start time (from initial user input) until suitable time is reached
    let check = copyTimeZoneCheck.every(Boolean);
    let newSuggestStart = { ...copyStartTime };
    if (!check) {
      let newSuggestCheck = [...copyTimeZoneCheck];
      let i = 0;
      while (!check && i < 24) {
        i++;
        startTime += 1;
        check = this.validateTime(timeZoneArr, startTime, newSuggestCheck, newSuggestStart).every(Boolean);
        if (i === 24 && !check) {
          this.noMeetings();
        }
      }
    }

    // when check becomes true after while loop, setState for updated suggestTime
    if (check) {
      this.setState(prevState => ({
        userInput: {
          ...prevState.userInput,
          timeZone: {
            ...prevState.userInput.timeZone,
            suggestTime: newSuggestStart
          }
        }
      }))
    }
  }

// when check is still false after while loop
  noMeetings = () => {
    this.setState(prevState => ({
      userInput: {
        ...prevState.userInput,
        meetingFound: false,
      }
    }))
  }
  
  validateTime = (timeZoneArr, startTime, copyTimeZoneCheck, copyStartTime) => {
    const duration = this.state.duration;
    for (let i = 0; i < timeZoneArr.length; i++) {

      // adjusting time at different timeZones to be relative to first location
      let goodTime = true;
      let adjustStartTime = startTime + timeZoneArr[i] - timeZoneArr[0];

      // adjust for times that are outside 0-24
      if (adjustStartTime < 0) adjustStartTime += 24;
      else if (adjustStartTime > 24) adjustStartTime -= 24;

      let adjustEndTime = adjustStartTime + duration;

      // if meeting start time OR meeting end time is outside of working hours, set false
      if ((adjustStartTime < 8 || adjustStartTime > 19)
        || (adjustEndTime < 8 || adjustEndTime > 19)) goodTime = false;
      copyTimeZoneCheck[i] = goodTime;

      const keyName = "location" + (i + 1);
      copyStartTime[keyName] = adjustStartTime;
    }
    return copyTimeZoneCheck;
  }

  render() {
    return (
      <>
        <div className="App wrapper">
          <header>
            <h1>What time is it?</h1>
          </header>
          <div className="flex">
            <div>
              <UserInput
                etcList={this.state.etcList}
                getUserInput={this.getUserInput}
                meetingFound={this.state.userInput.meetingFound}
              />
            </div>
            <MeetingTime displayResults={this.state.userInput} />
          </div>
        </div>
        <footer>
          <p>
            &copy; Created at{" "}
            <a
              href="https://junocollege.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Juno College
            </a>
          </p>
        </footer>
      </>
    );
  }
}

