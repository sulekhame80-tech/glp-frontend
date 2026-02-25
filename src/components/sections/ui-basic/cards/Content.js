import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Basicimage from './Basicimage';
import Gradients from './Gradients';
import Imagewithbutton from './Imagewithbutton';
import Socialcards from './Socialcards';
import States from './States';
import Withheaderfooter from './Withheaderfooter';

class Content extends Component {
    render() {
        return ( 
            <div className="ms-content-wrapper cardspage">
                <div className="row">
                    <Breadcrumb pageprev={'Basic UI Elements'} pagecurrent={'Cards'} />
                    <Basicimage/>
                    <Imagewithbutton/>
                    <Socialcards/>
                    <States/>
                    <Gradients/>
                    <Withheaderfooter/>
                </div>
            </div>
        );
    }
}

export default Content;