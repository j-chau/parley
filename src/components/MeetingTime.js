import React, { Fragment } from 'react'
import './../styles/MeetingTime.css';

const buildDisplayArr = (timeZoneObj, displayArr, dayShiftArr) => {
    for (const key in timeZoneObj) {
        const el = timeZoneObj[key];
        if (key.includes("location")) displayArr.push(el);
        else dayShiftArr.push(el);
    }
}

const showResults = ({ duration, timeZone, timeZoneCheck, meetingFound, gmtValues }) => {

    // convert timeZone objects to arrays
    let displayStartArr = [];
    let dayShiftStartArr = [];
    buildDisplayArr(timeZone.startTime, displayStartArr, dayShiftStartArr);

    let displaySuggestArr = [];
    let suggestArr = [];
    buildDisplayArr(timeZone.suggestTime, displaySuggestArr, suggestArr);

    // if time has rolled into +/- 24 hrs, include +/- 1 day
    const x = suggestArr[0];
    let dayShiftSuggestArr = [0];
    if (!x) {
        dayShiftSuggestArr = suggestArr.map(el => el - x);
    }

    // if user selected meeting time does not work for every time zone, add class badTime; else add class goodTime
    let displayTime;
    return displayStartArr.map((el, index) => {
        if (timeZoneCheck[index]) displayTime = "goodTime";
        else displayTime = "badTime";
        const newTime = displaySuggestArr[index];

        // add '+' to positive values
        let dayShiftStart = dayShiftStartArr[index];
        if (dayShiftStart > 0) dayShiftStart = "+" + dayShiftStart

        let dayShiftSuggest = dayShiftSuggestArr[index];
        if (dayShiftSuggest > 0) dayShiftSuggest = "+" + dayShiftSuggest

        // construct string to display timezone format
        let displayGmt = "GMT ";
        const gmtInt = gmtValues[index];
        if (gmtInt >= 0) displayGmt += "+";
        // only show timezones on screens smaller than 940px
        let mobileView = " srOnly";
        if (window.screen.width < 940) mobileView = ""

        return (
            <Fragment key={index}>
                <p className={"gmtGridItem" + mobileView}>{displayGmt + gmtInt}</p>

                {/* display meeting times with user selected time */}
                <p className={displayTime}>
                    {`${el} - ${el + duration}`}
                    {dayShiftStart !== 0 && (<span className="dayShift">{dayShiftStart + " day"}</span>)}
                </p>

                {meetingFound === true
                    // display suggested meeting times
                    ? <p>{`${newTime} - ${newTime + duration}`}
                        {dayShiftSuggest !== 0 && (<span className="dayShift">{dayShiftSuggest + " day"}</span>)}
                    </p>
                    : <p>None</p>}
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