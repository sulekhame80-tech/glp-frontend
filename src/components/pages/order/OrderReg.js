import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Sidenav from '../../layouts/Sidenav';

import Quickbar from '../../layouts/Quickbar';
import Content from '../../sections/order/order-status/Content';

class OrderReg extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>Weedoboard React | Order Status</title>
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

export default OrderReg;