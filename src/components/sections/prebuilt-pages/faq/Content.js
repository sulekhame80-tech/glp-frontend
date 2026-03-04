import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Default from './Default';
import Withgap from './Withgap';
import Withicon from './Withicon';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Prebuilt Pages'} pagecurrent={"FAQ's"} />
                    <div className="col-md-12">
                        <Default />
                        <Withgap />
                        <Withicon />
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;
