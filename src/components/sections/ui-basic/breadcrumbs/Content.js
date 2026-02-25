import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Arrow from './Arrow';
import Default from './Default';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Basic UI Elements'} pagecurrent={'Breadcrumbs'} />
                    <div className="col-md-12">
                        <Default />
                        <Arrow />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;