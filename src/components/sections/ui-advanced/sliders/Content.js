import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Arrowsandcaptions from './Arrowsandcaptions';
import Buttons from './Buttons';
import Default from './Default';
import Dottedindicator from './Dottedindicator';
import Images from './Images';
import Indicators from './Indicators';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Advanced UI Elements'} pagecurrent={'Sliders'} />
                    <div className="col-md-12">
                        <Default />
                        <Arrowsandcaptions />
                    </div> 
                    <Buttons />
                    <Indicators />
                    <Dottedindicator />
                    <Images />
                </div>
            </div>
        );
    }
}

export default Content;