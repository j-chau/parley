import React, { Component } from 'react';
import axios from 'axios';
import './UserInput.css';

import AddLocation from './AddLocation.js';

export default class UserInput extends Component {

    constructor() {
        super();
        this.state = {
            initialTime: "",
            duration: 0,
            endTime: "",
<<<<<<< HEAD
            timeZone: "",
=======
            etcList: [],
            timeZone: {},
            numLocation: 1,
>>>>>>> master
        }
    }

    componentDidMount() {
<<<<<<< HEAD
        

    }

    timeDropDownLoop = (start, end) => {
        let arr = [<option value={""}> {""} </option>];
=======
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
>>>>>>> master
        for (let i = start; i < end; i++) {
            let time = i;
            if (start === 8 && time > 12) time -= 12;
            meetingTimeArr.push(<option value={i} key={i}> {time} </option>)
        }
        return meetingTimeArr;
    }

    etcDropDownLoop = () => {
<<<<<<< HEAD

        const arr = this.props.etcList.map((timeZoneName) => {
            return (<option value={timeZoneName.replace('Etc/GMT','')}> {timeZoneName.replace('Etc/','')} </option >)
        })

        arr.unshift(<option value={""}> {""} </option>);
        arr.pop();
        return arr;

=======
        const etcArr = this.state.etcList.map((timeZoneName) => {
            return (<option value={timeZoneName} key={timeZoneName}>{timeZoneName}</option >)
        })
        etcArr.pop();
        return etcArr;
>>>>>>> master
    }

    addOrSubtract = (change) => {
        const duration = this.state.duration + change;
        if (duration < 5 && duration > 0) this.setState(prevState => ({
            duration: prevState.duration + change,
            endTime: parseInt(prevState.initialTime) + parseInt(duration)
        }))
    }

<<<<<<< HEAD
    handleChange = (e) => {
        let time = e.target.value;
        let end = parseInt(time) + parseInt(this.state.duration);
        this.setState({
            initialTime: time,
            endTime: end, 

        })

    }

=======
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
        } else console.log("max number reached");
    }
>>>>>>> master

    render() {
        return (
            <div>
                <form action="">
                    <label htmlFor="">Meeting Start</label>
                    <select value={this.state.initialTime} onChange={this.handleChange} name="" id="">
                        {this.timeDropDownLoop(8, 19)}
                    </select>

                    <label htmlFor="meetingDuration">Duration Meeting</label>
                    <span className="srOnly">subtract meeting time</span>
                    <i className="fas fa-minus" aria-hidden="true" onClick={() => this.addOrSubtract(-1)}></i>
                    <span id="meetingDuration">{this.state.duration}</span>
                    <span className="srOnly">add meeting time</span>
                    <i className="fas fa-plus" aria-hidden="true" onClick={() => this.addOrSubtract(+1)}></i>

                    {this.addNewLocation()}

                    <button type="submit" value="Submit" onClick={this.handleClick}>Add New Location</button>

                </form>
            </div>
        );
    }
}

