import React, { Component } from 'react';
import axios from 'axios';
import './UserInput.css';


export default class UserInput extends Component {

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

    timeDropDownLoop = (start, end) => {
        let arr = [];
        for (let i = start; i < end; i++) {
            let time = i;
            if (start === 8 && time > 12) time -= 12;
            arr.push(<option value={i} key={i}> {time} </option>)
        }
        return arr;
    }

    etcDropDownLoop = () => {
        const arr = this.state.etcList.map((timeZoneName) => {
            return (<option value={timeZoneName} key={timeZoneName}> {timeZoneName} </option >)
        })
        arr.pop();
        return arr;
    }

    addOrSubtract = (change) => {
        const duration = this.state.duration + change;
        if (duration < 5 && duration > 0) this.setState(prevState => ({
            duration: prevState.duration + change,
            endTime: prevState.initialTime + duration
        }))
    }


    render() {
        return (
            <div>
                <form action="">
                    <label htmlFor="">Meeting Start</label>
                    <select value={this.state.initialTime} onChange={(e) => this.setState({ initialTime: e.target.value })} name="" id="">
                        {this.timeDropDownLoop(8, 19)}
                    </select>

                    <label htmlFor="meetingDuration">Duration Meeting</label>
                    <span className="srOnly">subtract meeting time</span>
                    <i className="fas fa-minus" aria-hidden="true" onClick={() => this.addOrSubtract(-1)}></i>
                    <span id="meetingDuration">{this.state.duration}</span>
                    <span className="srOnly">add meeting time</span>
                    <i className="fas fa-plus" aria-hidden="true" onClick={() => this.addOrSubtract(+1)}></i>

                    <div className="gtm">
                        <h2>Select Time Zone:</h2>
                        <select value={this.state.timeZone} name="" id="" onChange={(e) => this.setState({ timeZone: e.target.value })}>
                            {this.etcDropDownLoop()}
                        </select>
                    </div>
                    <button type="submit" value="Submit">Submit</button>
                </form>
            </div>
        );
    }
}

