import React, { Component } from 'react';
import './../styles/UserInput.css';

import AddLocation from './AddLocation.js';

export default class UserInput extends Component {

    constructor() {
        super();
        this.state = {
            initialTime: 0,
            duration: 0,
            initialEndTime: 0,
            timeZone: {},
            numLocation: 1,
            errMsg: ""
        }
    }

    timeDropDownLoop = (start, end) => {
        let meetingTimeArr = [<option value={""} key={0}> {""} </option>];
        for (let i = start; i < end; i++) {
            let time = i;
            if (start === 8 && time > 12) time -= 12;
            meetingTimeArr.push(<option value={i} key={i}> {time} </option>)
        }
        return meetingTimeArr;
    }

    etcDropDownLoop = () => {

        const etcArr = this.props.etcList.map((timeZoneName) => {
            return (<option value={timeZoneName.replace('Etc/GMT', '')} key={timeZoneName}> {timeZoneName.replace('Etc/', '')} </option >)
        })

        etcArr.unshift(<option value={""} key={0} > {""} </option>);
        etcArr.pop();
        return etcArr;
    }

    addOrSubtract = (change) => {
        const duration = this.state.duration + change;
        if (duration < 5 && duration > 0) this.setState(prevState => ({
            duration: prevState.duration + change,
            initialEndTime: prevState.initialTime + duration,
        }))
    }

    handleChange = (e) => {
        let time = parseInt(e.target.value);
        let end = time + this.state.duration;
        this.setState({
            initialTime: time,
            initialEndTime: end,
        })
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
        this.props.getUserInput(this.state.initialTime, this.state.duration, this.state.timeZone);
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
                    <label htmlFor="">Meeting Start</label>
                    <select value={this.state.initialTime} onChange={this.handleChange} name="" id="">
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

            </form>
        );
    }
}

