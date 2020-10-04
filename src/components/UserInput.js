import React, { Component } from 'react';
import axios from 'axios';
import './../styles/UserInput.css';

import AddLocation from './AddLocation.js';

export default class UserInput extends Component {

    constructor() {
        super();
        this.state = {
            initialTime: "",
            duration: 0,
            endTime: "",
            etcList: [],
            timeZone: {},
            numLocation: 1,
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

    timeDropDownLoop = (start, end) => {
        let meetingTimeArr = [];
        for (let i = start; i < end; i++) {
            let time = i;
            if (start === 8 && time > 12) time -= 12;
            meetingTimeArr.push(<option value={i} key={i}> {time} </option>)
        }
        return meetingTimeArr;
    }

    etcDropDownLoop = () => {
        const etcArr = this.state.etcList.map((timeZoneName) => {
            return (<option value={timeZoneName} key={timeZoneName}>{timeZoneName}</option >)
        })
        etcArr.pop();
        return etcArr;
    }

    addOrSubtract = (change) => {
        const duration = this.state.duration + change;
        if (duration < 5 && duration > 0) this.setState(prevState => ({
            duration: prevState.duration + change,
            endTime: prevState.initialTime + duration
        }))
    }

    addNewLocation = () => {
        let locationArr = [];
        for (let i = 0; i < this.state.numLocation; i++) {
            locationArr.push(
                <AddLocation
                    id={i + 1}
                    key={i + 1}
                    timeZoneList={this.etcDropDownLoop()}
                    onSelect={(e) => this.saveTimeZone(e.target.value, e.target.name)} />
            )
        }
        return locationArr;
    }

    saveTimeZone = (value, name) => {
        const copyTimeZone = { ...this.state.timeZone };
        const keyName = "location" + name;
        copyTimeZone[keyName] = value;
        this.setState({
            timeZone: copyTimeZone
        })
    }

    handleClick = (e) => {
        e.preventDefault();
        if (this.state.numLocation < 3) {
            this.setState(prevState => ({
                numLocation: prevState.numLocation + 1
            }))
            this.addNewLocation();
        } else this.setState({
            errMsg: "Max. number of locations reached"
        })

    }

    render() {
        return (
            <form action="">
                <fieldset className="meetingStart">
                    <label htmlFor="">Meeting Start</label>
                    <select value={this.state.initialTime} onChange={(e) => this.setState({ initialTime: e.target.value })} name="" id="">
                        {this.timeDropDownLoop(8, 19)}
                    </select>
                </fieldset>

                <label htmlFor="meetingDuration">Meeting Duration</label>
                <fieldset className="addSubtract" id="meetingDuration">

                    <span className="srOnly">subtract meeting time</span>
                    <i className="fas fa-minus" aria-hidden="true" tabIndex={0} onClick={() => this.addOrSubtract(-1)}></i>

                    <span>{this.state.duration}</span>

                    <span className="srOnly">add meeting time</span>
                    <i className="fas fa-plus" aria-hidden="true" tabIndex={0} onClick={() => this.addOrSubtract(+1)}></i>
                </fieldset>

                {this.addNewLocation()}

                <button type="submit" value="Submit" onClick={this.handleClick}>Add New Location</button>

            </form>
        );
    }
}

