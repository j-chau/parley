import React, { Fragment } from 'react'
import './../styles/MeetingTime.css';

const showResults = ({ duration, timeZone, timeZoneCheck }) => {
    const displayStartArr = Object.values(timeZone.startTime);
    const displaySuggestArr = Object.values(timeZone.suggestTime);

    let displayTime;
    return displayStartArr.map((el, index) => {
        if (timeZoneCheck[index]) displayTime = "goodTime";
        else displayTime = "badTime";
        const newTime = displaySuggestArr[index];

        return (
          <Fragment key={index}>
            <p className={displayTime}>{`${el} - ${el + duration}`}</p>
            <p>{`${newTime} - ${newTime + duration}`}</p>
          </Fragment>
        )
    })
}

const MeetingTime = (props) => {
    return (
      <div className="grid-container">
          <h3>Local time</h3>
          <h3>Suggestions</h3>
        {showResults(props.displayResults)}
      </div>
    );
}

export default MeetingTime;