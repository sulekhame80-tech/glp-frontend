import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Sidenav from '../../layouts/Sidenav';
import Topbar from '../../layouts/Topbar';
import Quickbar from '../../layouts/Quickbar';
import Content from '../../sections/prebuilt-pages/default-register/Content';

class Defaultregister extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>Weedoboard React | Default Register</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <div className="body ms-body ms-primary-theme ms-logged-out" id="body">
                    <Sidenav />
                    <main className="body-content">
                          <Topbar />*/}
                        <Content/>
                    </main>
                    <Quickbar />
                </div>
            </Fragment>
        );
    }
}

export default Defaultregister;