import React, { Component } from 'react';
import axios from 'axios';


export default class UserInput extends Component {

    constructor() {
        super();
        this.state = {
            initialTime: "",
            duration: 0,
            endTime: "",
            timeZoneList: [],
            intialTimeZone: "",
            intialTimeZoneOffset: 0,
        }
    }

    componentDidMount() {
        
        axios({
            url: `http://worldtimeapi.org/api/timezone/`,

        }).then(response => {
            const allZones = response.data;
            const timeZoneArr = allZones.filter((zone) => {
                return(zone.startsWith("America") || 
                zone.startsWith("Antarctica") || 
                zone.startsWith("Asia") || 
                zone.startsWith("Atlantic") || 
                zone.startsWith("Australia") || 
                zone.startsWith("Europe") || 
                zone.startsWith("Indian") || 
                zone.startsWith("Pacific"))
            });
            this.setState({
                timeZoneList: timeZoneArr,
            })
        })
    }

    timeDropDownLoop = (start, end) => {
    let arr = [<option value={""}>{""}</option>];
        for (let i = start; i < end; i++) {
            let time = i;
            if (start === 8 && time > 12) time -= 12;
            arr.push(<option value={i}> {time} </option>)
        }
        return arr;
    }

    ZoneDropDownLoop = () => {

        const arr = this.state.timeZoneList.map((timeZoneName) => {
            return (<option value={timeZoneName}> {`${timeZoneName}`} </option >)
        })
        return arr;
    }

    addOrSubtract = (change) => {
        const duration = this.state.duration + change;
        if (duration < 5 && duration > 0) this.setState(prevState => ({
            duration: prevState.duration + change,
            endTime: parseInt(prevState.initialTime) + parseInt(duration)
        }))
    }

    render() {
        return (
            <div>
                <form action="">
                    <label htmlFor="initialTime">initialTime</label>
                    <select value={this.state.initialTime} onChange={(e) => this.setState({ initialTime: parseInt(e.target.value) })} name="" id="initialTime">
                        {this.timeDropDownLoop(8, 19)}
                    </select>

                    <label htmlFor="">duration</label>
                    <i className="fas fa-minus" onClick={() => this.addOrSubtract(-1)}></i>
                    <span>{this.state.duration}</span>
                    <i className="fas fa-plus" onClick={() => this.addOrSubtract(+1)}></i>

                    <label htmlFor="timeZone">Time Zone:</label>
                    <input list="timeZones" name="timeZone" id="timeZone" value={this.state.intialTimeZone} onChange={(e) => this.setState({ intialTimeZone: e.target.value })}/>
                    <datalist  id="timeZones" >
                        {this.ZoneDropDownLoop()}
                    </datalist>
                </form>
            </div>
        );
    }
}