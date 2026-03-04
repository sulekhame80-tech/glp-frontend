import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Invoice from './Invoice';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Prebuilt Pages'} pagecurrent={'Invoice'} />
                    <div className="col-md-12">
                        <Invoice />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;
