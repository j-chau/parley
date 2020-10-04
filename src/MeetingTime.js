import React, { Component } from 'react';
import axios from 'axios';
import './MeetingTime.css';

export default class MeetingTime extends Component {

    render() {
        return (
            <div class="grid-container">
                <div class="grid-item item">
                    <h3>Local time</h3>
                </div>
                <div class="grid-item item">
                    <h3>Suggestions</h3>
                </div>
                <div class="grid-item">
                    <p>results</p>
                </div>
                <div class="grid-item">
                    <p>results</p>
                </div>
                <div class="grid-item">
                    <p>results</p>
                </div>
                <div class="grid-item">
                    <p>results</p>
                </div>
                <div class="grid-item">
                    <p>results</p>
                </div>
                <div class="grid-item">
                    <p>results</p>
                </div>

            </div>
          );
    }
}
