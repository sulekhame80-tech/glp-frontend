import React, { Component, Fragment } from 'react';
import MetaTags from "react-meta-tags";
import Sidenav from '../../layouts/Sidenav';
import Topbar from '../../layouts/Topbar';
import Quickbar from '../../layouts/Quickbar';
import Content from '../../sections/product/product-detail/Content';

class Productdetail extends Component {
    render() {
        return (
            <Fragment>
                <MetaTags>
                    <title>Genelifeplus | Product Detail</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </MetaTags>
                <div className="body-content-wrapper">
<Content productId={this.props.match.params.id}/>
</div>
            </Fragment>
        );
    }
}

export default Productdetail;
