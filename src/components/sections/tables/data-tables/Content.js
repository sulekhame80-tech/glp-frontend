import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Hoverable from './Hoverable';
import Responsive from './Responsive';
import Withheaderstrips from './Withheaderstrips';
import Withscroll from './Withscroll';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Tables'} pagecurrent={'Data Table'} />
                    <div className="col-md-12">
                        <Hoverable />
                        <Withheaderstrips />
                        <Withscroll />
                        <Responsive />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;
