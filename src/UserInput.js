import React, { Component } from 'react';
import axios from 'axios';


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
            arr.push(<option value={i}> {time} </option>)
        }

        return arr;
    }

    etcDropDownLoop = () => {

        const arr = this.state.etcList.map((timeZoneName) => {
            return (<option value={timeZoneName}> {timeZoneName} </option >)
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
                    <label htmlFor="">initialTime</label>
                    <select value={this.state.initialTime} onChange={(e) => this.setState({ initialTime: e.target.value })} name="" id="">
                        {this.timeDropDownLoop(8, 19)}
                    </select>

                    <label htmlFor="">duration</label>
                    <i className="fas fa-minus" onClick={() => this.addOrSubtract(-1)}></i>
                    <span>{this.state.duration}</span>
                    <i className="fas fa-plus" onClick={() => this.addOrSubtract(+1)}></i>

                    <label htmlFor=""></label>
                    <select value={this.state.timeZone} name="" id="" onChange={(e) => this.setState({ timeZone: e.target.value })}>
                        {this.etcDropDownLoop()}
                    </select>
                </form>
            </div>
        );
    }
}