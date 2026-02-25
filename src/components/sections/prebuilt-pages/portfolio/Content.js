import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Default from './Default';
import Minimal from './Minimal';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Prebuilt Pages'} pagecurrent={'Portfolio'} />
                    <div className="col-md-12">
                        <Default />
                        <Minimal />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;