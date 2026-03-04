import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Returnlist from './Returnlist';
import Statics from './Statics';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Product'} pagecurrent={'Return Product List'} />
                    <Statics/>
                    <Returnlist/>
                </div>
            </div>
        );
    }
}

export default Content;
