import React from 'react'

const AddLocation = (props) => {
    return (
        <div className="gtm">
            <label htmlFor="selectTimeZone">Select Time Zone:</label>
            <select value={props.value} name={props.id} id="selectTimeZone" onChange={(e) => props.onSelect(e)}>
                {props.timeZoneList}
            </select>
        </div>
    )
}

export default AddLocation;