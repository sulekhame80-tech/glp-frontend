import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import General from './General';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Icons'} pagecurrent={'Materialize'} />
                    <General/>
                </div>
            </div>
        );
    }
}

export default Content;
