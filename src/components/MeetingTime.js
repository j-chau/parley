import React from 'react';
import './../styles/MeetingTime.css';

const showResults = ({ duration, timeZone, timeZoneCheck }) => {
    const displayStartArr = Object.values(timeZone.startTime);
    let displayTime;
    return displayStartArr.map((el, index) => {
        if (timeZoneCheck[index]) displayTime = "goodTime";
        else displayTime = "badTime"
        
        return (
            <div className={"grid-item " + displayTime}>
                <p>{`${el} - ${el + duration}`}</p>
            </div>
        )
    })
}

const MeetingTime = (props) => {
    return (
      <div className="grid-container">
        <div className="grid-item item">
          <h3>Local time</h3>
          {showResults(props.displayResults)}
        </div>
        <div className="grid-item item">
          <h3>Suggestions</h3>
          {/* {showResults(props.displayResults)} */}
        </div>
      </div>
    );
}

export default MeetingTime;