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
        noMeetingsMsg: "",
        duration: 0,
        initialTime: 0,
        timeZone: {
          startTime: {},
          suggestTime: {}
        },
        timeZoneCheck: [],
        gmtValues: []
      }
    }
  }

  componentDidMount() {
    axios({
      method: 'Get',
      url: 'https://proxy.hackeryou.com',
      dataResponse: 'json',
      params: {
        reqUrl: `https://worldtimeapi.org/api/timezone/Etc`,
        xmlToJSON: false,
        useCache: false
      }
    }).then(response => {
      const etcList = response.data;
      etcList.pop();
      const truncArr = etcList.map(el => parseInt(el.substring(7)));
      truncArr[0] = 0;
      truncArr.sort((a, b) => a - b);

      const negOnlyArr = truncArr.filter(el => el < 0).reverse();
      const posOnlyArr = truncArr.slice(negOnlyArr.length);
      const sortedArr = posOnlyArr.concat(negOnlyArr);

      this.setState({
        etcList: sortedArr,
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
    let copyStartTime = {
      location1: startTime,
      dayShift1: 0
    };

    this.validateTime(timeZoneArr, startTime, duration, copyTimeZoneCheck, copyStartTime);
    this.setState(prevState => ({
      userInput: {
        ...prevState.userInput,
        timeZone: {
          startTime: copyStartTime,
          suggestTime: copyStartTime
        },
        timeZoneCheck: copyTimeZoneCheck,
        gmtValues: timeZoneObj
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
        check = this.validateTime(timeZoneArr, startTime, duration, newSuggestCheck, newSuggestStart).every(Boolean);
      }
    }

    // when check becomes true after while loop, setState for updated suggestTime
    if (check) {
      this.setState(prevState => ({
        userInput: {
          ...prevState.userInput,
          meetingFound: true,
          noMeetingsMsg: "",
          timeZone: {
            ...prevState.userInput.timeZone,
            suggestTime: newSuggestStart
          }
        }
      }))
    } else {
      this.setState(prevState => ({
        userInput: {
          ...prevState.userInput,
          meetingFound: false,
          noMeetingsMsg: "No meetings found during work hours"
        }
      }))
    }
  }

  validateTime = (timeZoneArr, startTime, duration, copyTimeZoneCheck, copyStartTime) => {
    for (let i = 0; i < timeZoneArr.length; i++) {

      // adjusting time at different timeZones to be relative to first location
      let goodTime = true;
      let adjustStartTime = startTime + timeZoneArr[i] - timeZoneArr[0];

      // adjust for times that are outside 0-24
      if (adjustStartTime < 0) {
        adjustStartTime += 24;
        copyStartTime["dayShift" + (i + 1)] = -1;
      } else if (adjustStartTime > 24) {
        adjustStartTime -= 24;
        copyStartTime["dayShift" + (i + 1)] = +1;
      } else {
        copyStartTime["dayShift" + (i + 1)] = 0;
      }

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
        <div className="wrapper">
          <header>
            <h1>What time is it?</h1>
          </header>
          <div className="flex">
            {/* <div> */}
              <UserInput
                etcList={this.state.etcList}
                getUserInput={this.getUserInput}
                meetingFound={this.state.userInput.meetingFound}
                meetingMsg={this.state.userInput.noMeetingsMsg}
              />
            {/* </div> */}
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
