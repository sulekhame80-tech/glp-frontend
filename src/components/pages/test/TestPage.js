import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Sidenav from '../../layouts/Sidenav';
import Topbar from '../../layouts/Topbar';
import Quickbar from '../../layouts/Quickbar';

import TestList from '../../sections/test-list/Content';
class TestPage extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>Weedoboard React | Customer List</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <div className="body-content-wrapper">
<TestList/>
</div>
            </Fragment>
        );
    }
}

export default TestPage;