import React, { Component } from 'react';
import Latestprojects from './Latestprojects';
import Mostsellings from './Mostsellings';
import Projectsales from './Projectsales';
import Projecttimeline from './Projecttimeline';
import Recentbuyers from './Recentbuyers';
import Statistics from './Statistics';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Statistics /> 
                    <Recentbuyers/>
                    <Projecttimeline/>
                    <Projectsales/>
                    <div className="col-xl-5 col-md-12">
                        <Mostsellings/>
                    </div>
                    <Latestprojects/>
                </div>
            </div>
        );
    }
}

export default Content;
