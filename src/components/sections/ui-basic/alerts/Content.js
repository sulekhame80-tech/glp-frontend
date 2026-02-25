import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Default from './Default';
import Outline from './Outline';
import Defaultwithicon from './Defaultwithicon';
import Outlinewithicon from './Outlinewithicon';
import Solid from './Solid';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Basic UI Elements'} pagecurrent={'Alerts'} />
                    <div className="col-md-12">
                        <Default />
                        <Outline />
                        <Defaultwithicon />
                        <Outlinewithicon />
                        <Solid />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;