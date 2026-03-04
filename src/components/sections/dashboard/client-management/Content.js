import React, { Component } from 'react';
import Countrytable from './Countrytable';
import Statistics from './Statistics';
import Usergraph from './Usergraph';
import Userpurchase from './Userpurchase';
import Usertraffic from './Usertraffic';
import Userchat from './Userchat';
import Supporttickets from './Supporttickets';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row"> 
                    <Statistics/>
                    <Countrytable/>
                    <Usergraph/>
                    <Usertraffic/>
                    <Userpurchase/>
                    <Userchat/>
                    <Supporttickets/>
                </div>
            </div>
        );
    }
}

export default Content;
