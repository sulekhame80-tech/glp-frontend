import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Blocklevel from './Blocklevel';
import Circleicon from './Circleicon';
import Circleoutlineicon from './Circleoutlineicon';
import Groupbutton from './Groupbutton';
import Pill from './Pill';
import Pillgradient from './Pillgradient';
import Pilloutline from './Pilloutline';
import Pillsocialmedia from './Pillsocialmedia';
import Pillwithicon from './Pillwithicon';
import Round from './Round';
import Roundgradient from './Roundgradient';
import Roundicon from './Roundicon';
import Roundoutline from './Roundoutline';
import Roundoutlineicon from './Roundoutlineicon';
import Roundsocialmedia from './Roundsocialmedia';
import Roundwithicon from './Roundwithicon';
import Square from './Square';
import Squaregradient from './Squaregradient';
import Squareicon from './Squareicon';
import Squareoutline from './Squareoutline';
import Squareoutlineicon from './Squareoutlineicon';
import Squaresocialmedia from './Squaresocialmedia';
import Squarewithicon from './Squarewithicon';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Basic UI Elements'} pagecurrent={'Alerts'} />
                    <div className="col-md-12">
                        <Round />
                        <Square />
                        <Pill />
                        <Roundoutline />
                        <Squareoutline />
                        <Pilloutline />
                        <Roundgradient />
                        <Squaregradient />
                        <Pillgradient />
                        <Roundwithicon />
                        <Squarewithicon />
                        <Pillwithicon />
                        <div className="row">
                            <Roundicon />
                            <Roundoutlineicon />
                            <Squareicon />
                            <Squareoutlineicon />
                            <Circleicon />
                            <Circleoutlineicon />
                            <Groupbutton />
                            <Blocklevel />
                        </div>
                        <Roundsocialmedia />
                        <Squaresocialmedia />
                        <Pillsocialmedia />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;
