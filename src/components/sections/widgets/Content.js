import React, { Component } from 'react';
import Breadcrumb from '../../layouts/Breadcrumb';
import Chat from './Chat';
import Crypto from './Crypto';
import Emailwidget from './Emailwidget';
import Followers from './Followers';
import Iconcards from './Iconcards';
import Identifiers from './Identifiers';
import Infographics from './Infographics';
import Notifications from './Notifications';
import Profile from './Profile';
import Todobox from './Todo';
import Tradehistory from './Tradehistory';
import Useractivity from './Useractivity';
import Userchat from './Userchat';

class Content extends Component {
    render() {
        return ( 
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Pages'} pagecurrent={'Widgets'} />
                    <Infographics/>
                    <Iconcards/>
                    <Notifications/>
                    <Useractivity/>
                    <Tradehistory/>
                    <Userchat/>
                    <Todobox/>
                    <Emailwidget/>
                    <Crypto/>
                    <Chat/>
                    <Followers/>
                    <Profile/>
                    <Identifiers/>
                </div>
            </div>
        );
    }
}

export default Content;