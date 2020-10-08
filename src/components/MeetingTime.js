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

    let displayStartArr = [];
    let dayShiftStartArr = [];
    buildDisplayArr(timeZone.startTime, displayStartArr, dayShiftStartArr);

    let displaySuggestArr = [];
    let dayShiftSuggestArr = [];
    buildDisplayArr(timeZone.suggestTime, displaySuggestArr, dayShiftSuggestArr);

    // if time has rolled into +/- 24 hrs, include +/- 1 day
    const x = dayShiftSuggestArr[0];
    if (x !== 0) {
        dayShiftSuggestArr.forEach(el => el - x)
    }

    let displayTime;
    return displayStartArr.map((el, index) => {
        if (timeZoneCheck[index]) displayTime = "goodTime";
        else displayTime = "badTime";
        const newTime = displaySuggestArr[index];

        let dayShiftStart = dayShiftStartArr[index]
        if (dayShiftStart > 0) "+".concat(dayShiftStart)

        let dayShiftSuggest = dayShiftSuggestArr[index]
        if (dayShiftSuggest > 0) "+".concat(dayShiftSuggest)

        let displayGmt = "GMT ";
        const gmtInt = gmtValues[index];
        if (gmtInt >= 0) displayGmt += "+";

        let mobileView = " srOnly";
        if (window.screen.width < 940) mobileView = ""

        return (
            <Fragment key={index}>
                <p className={"gmtGridItem" + mobileView}>{displayGmt + gmtInt}</p>

                {/* display meeting times with user selected time */}
                <p className={displayTime}>
                    {`${el} - ${el + duration}`}
                    <span>{dayShiftStart !== 0 && (dayShiftStart + " day")}</span>
                </p>

                {meetingFound === true
                    // display suggested meeting times
                    ? <p>{`${newTime} - ${newTime + duration}`}
                        <span>{dayShiftSuggest !== 0 && (dayShiftSuggest + " day")}</span>
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