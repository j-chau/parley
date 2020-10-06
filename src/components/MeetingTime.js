import React from 'react';
import './../styles/MeetingTime.css';

const showResults = ({ initialTime, timeZone, timeZoneCheck }) => {
    const displayStartArr = Object.values(timeZone.startTime);
    const displayEndArr = Object.values(timeZone.endTime);
    let displayTime;
    return displayStartArr.map((el, index) => {
        if (timeZoneCheck[index]) displayTime = "goodTime";
        else displayTime = "badTime"
        
        return (
            <div className={"grid-item " + displayTime}>
                <p>{`${el} - ${displayEndArr[index]}`}</p>
            </div>
        )
    })
}

const MeetingTime = (props) => {
    return (
        <div className="grid-container">
            <div className="grid-item item">
                <h3>Local time</h3>
            </div>
            <div className="grid-item item">
                <h3>Suggestions</h3>
            </div>
            {showResults(props.displayResults)}
        </div>
    );
}

export default MeetingTime;