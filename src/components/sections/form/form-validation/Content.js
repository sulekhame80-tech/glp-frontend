import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Default from './Default';
import Fills from './Fills';
import Tooltip from './Tooltip';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <div className="col-md-12">
                        <Breadcrumb pageprev={'Forms'} pagecurrent={'Form Validation'} />
                        <Default />
                        <Fills />
                        <Tooltip />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;
