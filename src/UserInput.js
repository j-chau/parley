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
        const getZoneNames = axios.get(`http://worldtimeapi.org/api/timezone/`)
        getZoneNames.then(response => {
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
            console.log('get full time zone')
            this.getFullTimeZone(timeZoneArr);
        }) 
    }

    getTimeZoneOffset = (zone) => {
        return new Promise ((resolve) => {
            axios.get(`http://worldtimeapi.org/api/timezone/${zone}`)
                .then((res) => {
                    const fullZone = `${zone} (GMT${res.data.utc_offset})`
                    resolve(fullZone);
                })
        })
    }

    getFullTimeZone = async(array) => {
        let newArr = [];
        const promiseLoop = [];
        // for every zone in passed array run it through getTimeZoneOffset function and push result to promiseLoop array
        for (const zone of array) {
            promiseLoop.push(this.getTimeZoneOffset(zone))
        }
        // await all the promises in the promiseLoop array and when resolved make equal to newArr
        newArr = await Promise.all(promiseLoop);
        // update state with all resolved promises in newArr to timeZoneList
        this.setState({
            timeZoneList: newArr,
        })
    }

    // getFullTimeZone = async (array) => {
    //     const newArr = [];
    //     for (const zone of array) {
    //         const newZone = await this.getTimeZoneOffset(zone);
    //         newArr.push(newZone)
    //     }
    //     this.setState({
    //         timeZoneList: newArr,
    //     })
    // }


    // getFullTimeZone = (array) => {
    //     const fullArray = [];
    //     array.forEach((zone) => {
    //         axios.get(`http://worldtimeapi.org/api/timezone/${zone}`)
    //             .then(response => {
    //                 const allZones = response.data;
    //                 fullArray.push(`${allZones.timezone} (GMT${allZones.utc_offset})`)
    //             });
                
    //     });
    //     console.log('lets set state')
    //     this.setState({
    //         timeZoneList: fullArray,
    //     })
    // }

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
        const arr = this.state.timeZoneList.map((timeZone) => {
            return (<option value={timeZone}> {timeZone} </option >)
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
                    <input list="timeZones" name="timeZone" id="timeZone" value={this.state.intialTimeZone} onChange={(e) => this.setState({ intialTimeZone: e.target.value,
                    intialTimeZoneOffset: e.target.value.substr(-7, 3),
                    })}/>
                    <datalist  id="timeZones" >
                        {this.ZoneDropDownLoop()}
                    </datalist>
                </form>
            </div>
        );
    }
}