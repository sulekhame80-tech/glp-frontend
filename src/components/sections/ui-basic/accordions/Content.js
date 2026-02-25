import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Default from './Default';
import Withgap from './Withgap';
import Withicon from './Withicon';
import Withicongap from './Withicongap';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Basic UI Elements'} pagecurrent={'Accordions'} />
                    <Default/>
                    <Withgap/>
                    <Withicon/>
                    <Withicongap/>
                </div>
            </div>
        );
    }
}

export default Content;