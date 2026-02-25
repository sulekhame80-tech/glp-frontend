import React, { Component, Fragment } from 'react';

class Blocks extends Component {
    render() {
        return (
            <Fragment>
                <div className="col-xl-3 col-md-6">
                    <div className="ms-card card-gradient-success ms-widget ms-infographics-widget">
                        <div className="ms-card-body media">
                            <div className="media-body">
                                <h6>Total Orders</h6>
                                <p className="ms-card-change"> <i className="material-icons">arrow_upward</i> 4567</p>
                                <p className="fs-12">48% From Last 24 Hours</p>
                            </div>
                        </div>
                        <i className="flaticon-archive" />
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="ms-card card-gradient-secondary ms-widget ms-infographics-widget">
                        <div className="ms-card-body media">
                            <div className="media-body">
                                <h6>Compeleted Orders</h6>
                                <p className="ms-card-change"> $80,950</p>
                                <p className="fs-12">2% Decreased from last day</p>
                            </div>
                        </div>
                        <i className="flaticon-supermarket" />
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="ms-card card-gradient-warning ms-widget ms-infographics-widget">
                        <div className="ms-card-body media">
                            <div className="media-body">
                                <h6>Pending Orders</h6>
                                <p className="ms-card-change"> <i className="material-icons">arrow_upward</i> 4567</p>
                                <p className="fs-12">48% From Last 24 Hours</p>
                            </div>
                        </div>
                        <i className="flaticon-reuse" />
                    </div>
                </div>
                <div className="col-xl-3 col-md-6">
                    <div className="ms-card card-gradient-info ms-widget ms-infographics-widget">
                        <div className="ms-card-body pos media">
                            <div className="media-body">
                                <h6>Total Products</h6>
                                <p className="ms-card-change "> $80,950</p>
                                <p className="fs-12">2% Decreased from last week</p>
                            </div>
                        </div>
                        <i className="fas fa-cannabis" />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Blocks;