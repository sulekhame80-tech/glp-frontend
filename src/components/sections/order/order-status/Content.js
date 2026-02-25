import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Activeorders from './Activeorders';
import Ordersbycountry from './Ordersbycountry';
import Orderslist from './Orderslist';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Orders'} pagecurrent={'Register Order'} />
                    {/*<Ordersbycountry/>
                    <Activeorders/>*/}
                    <Orderslist/>
                </div> 
            </div>
        );
    }
}

export default Content;