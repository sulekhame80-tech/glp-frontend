import React, { Component } from 'react';
import Breadcrumb from '../../../layouts/Breadcrumb';
import Ordergraph from './Ordergraph';
import Productlist from './Productlist';
import Productreport from './Productreport';

class Content extends Component {
    render() {
        return (
            <div className="ms-content-wrapper">
                <div className="row">
                    <Breadcrumb pageprev={'Product'} pagecurrent={'Product List'} />
                    <div className="col-md-12">
                        <div className="alert alert-success" role="alert">
                            <i className="flaticon-tick-inside-circle" />
                            <strong>Well done!</strong> You successfully Deleted the Product.
                        </div>
                    </div>
                    <Ordergraph/>
                    <Productreport/>
                    <Productlist/>
                </div>
            </div>
        );
    }
}

export default Content;