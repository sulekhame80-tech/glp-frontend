import React, { Component } from 'react';
import Overview from './Overview';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper profilepage cardspage">
                <Overview/>
            </div>
        );
    }
}

export default Content;