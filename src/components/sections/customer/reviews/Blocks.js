import React, { Component } from 'react';

class Blocks extends Component {
    render() {
        return (
            <div className="col-lg-6">
                <div className="row">
                    <div className="col-xl-6 col-md-6">
                        <div className="ms-card card-gradient-success ms-widget ms-infographics-widget">
                            <div className="ms-card-body media">
                                <div className="media-body">
                                    <h6>1 Star Ratings</h6>
                                    <p className="ms-card-change"> <i className="material-icons">arrow_upward</i> 4567</p>
                                    <p className="fs-12">48% From Last 24 Hours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6  col-md-6">
                        <div className="ms-card card-gradient-secondary ms-widget ms-infographics-widget">
                            <div className="ms-card-body media">
                                <div className="media-body">
                                    <h6>4 Star Ratings</h6>
                                    <p className="ms-card-change"> <i className="material-icons">arrow_upward</i>80,950</p>
                                    <p className="fs-12">2% Decreased from last day</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-6">
                        <div className="ms-card card-gradient-info ms-widget ms-infographics-widget">
                            <div className="ms-card-body media">
                                <div className="media-body">
                                    <h6>2 Star Ratings</h6>
                                    <p className="ms-card-change"><i className="material-icons">arrow_upward</i>80,950</p>
                                    <p className="fs-12">3% Decreased from last day</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-6">
                        <div className="ms-card card-gradient-warning ms-widget ms-infographics-widget">
                            <div className="ms-card-body media">
                                <div className="media-body">
                                    <h6>5 Star Ratings</h6>
                                    <p className="ms-card-change"> <i className="material-icons">arrow_upward</i> 4567</p>
                                    <p className="fs-12">48% From Last 64 Hours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-6">
                        <div className="ms-card card-gradient-warning ms-widget ms-infographics-widget">
                            <div className="ms-card-body media">
                                <div className="media-body">
                                    <h6>3 Star Ratings</h6>
                                    <p className="ms-card-change"> <i className="material-icons">arrow_upward</i> 4567</p>
                                    <p className="fs-12">48% From Last 32 Hours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-6">
                        <div className="ms-card card-gradient-info ms-widget ms-infographics-widget">
                            <div className="ms-card-body media">
                                <div className="media-body">
                                    <h6>Total Reviews</h6>
                                    <p className="ms-card-change"> $80,950</p>
                                    <p className="fs-12">3% Decreased from last day</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Blocks;
