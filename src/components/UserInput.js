import React, { Component } from 'react';
import './../styles/UserInput.css';

import AddLocation from './AddLocation.js';

export default class UserInput extends Component {

    constructor() {
        super();
        this.state = {
            initialTime: 8,
            duration: 1,
            timeZone: {},
            numLocation: 1,
            errMsg: "",
        }
    }

    timeDropDownLoop = (start, end) => {
        let meetingTimeArr = [];
        for (let i = start; i < end; i++) {
            let time = i;
            if (start === 8 && time > 12) time -= 12;
            meetingTimeArr.push(<option value={i} key={i}> {time}:00</option>)
        }
        return meetingTimeArr;
    }

    etcDropDownLoop = () => {
        const etcArr = this.props.etcList.map(el => {
            let displayText = "GMT ";
            if (el >= 0) displayText += "+";
            return (
                <option value={el} key={el}>{displayText + el}</option>
            )
        })
        etcArr.unshift(<option value={""} key="a" disabled> {""} </option>);
        return etcArr;
    }

    addOrSubtract = (change) => {
        const duration = this.state.duration + change;
        if (duration < 5 && duration > 0) {
            this.setState(prevState => ({
                duration: prevState.duration + change
            }), () => {
                if (this.state.timeZone.hasOwnProperty("location1")) this.updateResults();
            })
        }
    }

    addNewLocation = () => {
        let locationArr = [];
        for (let i = 0; i < this.state.numLocation; i++) {
            locationArr.push(
                <AddLocation
                    id={i + 1}
                    key={i + 1}
                    timeZoneList={this.etcDropDownLoop()}
                    onSelect={this.saveTimeZone} />
            )
        }
        return locationArr;
    }

    saveStartTime = (e) => {
        let time = parseInt(e.target.value);
        this.setState({
            initialTime: time
        }, () => {
            if (this.state.timeZone.hasOwnProperty("location1")) this.updateResults();
        })
    }

    saveTimeZone = (e) => {
        const copyTimeZone = { ...this.state.timeZone };
        const keyName = "location" + e.target.name;
        copyTimeZone[keyName] = e.target.value;

        if (e.target.value !== '') {
            this.setState({
                timeZone: copyTimeZone
            }, this.updateResults);
        }
    }

    updateResults = () => {
        const { initialTime, duration, timeZone } = this.state;
        this.props.getUserInput(initialTime, duration, timeZone);
    }

    handleClick = (e) => {
        e.preventDefault();
        if (this.state.duration === 0) this.setState({
            errMsg: "Meeting duration cannot be 0"
        })
        else if (this.state.numLocation < 3) {
            this.setState(prevState => ({
                numLocation: prevState.numLocation + 1,
                errMsg: ""
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
                    <label htmlFor="initialMeetingTime">Meeting Start</label>
                    <select value={this.state.initialTime} onChange={this.saveStartTime} name="selectMeetingTime" id="initialMeetingTime">
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
                <p className="errMsg">{this.state.errMsg}</p>
                <p className="errMsg">{this.props.meetingMsg}</p>

            </form>
        );
    }
}

