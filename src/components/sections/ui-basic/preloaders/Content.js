import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Abstract from './Abstract';
import Circle from './Circle';
import Simple from './Simple';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Basic UI Elements'} pagecurrent={'Preloaders'} />
                    <div className="col-md-12">
                        <Simple />
                        <Circle />
                    </div>
                    <Abstract />
                </div>
            </div>
        );
    }
}

export default Content;
