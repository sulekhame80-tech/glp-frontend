import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Sidenav from '../layouts/Sidenav';
import Topbar from '../layouts/Topbar';
import Quickbar from '../layouts/Quickbar';
import Content from '../sections/pricing/Content';

class Pricing extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>Genelifeplus | Pricing</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <div className="body-content-wrapper">
<Content/>
</div>
            </Fragment>
        );
    }
}

export default Pricing;
