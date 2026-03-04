import React, { Component } from 'react';
import Conversation from './Conversation';
import Facebookengagements from './Facebookengagements';
import Facebookfeed from './Facebookfeed';
import Followers from './Followers';
import Instagramfeed from './Instagramfeed';
import Overview from './Overview';
import Twitterfeed from './Twitterfeed';
import Youtubesubscribers from './Youtubesubscribers';

class Content extends Component { 
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Overview/>
                    <Followers/>
                    <Conversation/>
                    <Youtubesubscribers/>
                    <Facebookengagements/>
                    <Twitterfeed/>
                    <Facebookfeed/>
                    <Instagramfeed/>
                </div>
            </div>
        );
    }
}

export default Content;
