import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Latestreviews extends Component {
    render() {
        return (
            <div className="col-xl-12 col-md-12">
                <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-header">
                        <div className="d-flex justify-content-between">
                            <div>
                                <h6>Latest Reviwes</h6>
                                <p>Some of the recent support tickets</p>
                            </div>
                            <Link to="#" className="btn btn-primary"> View All</Link>
                        </div>
                    </div>
                    <div className="ms-panel-body p-0">
                        <ul className="ms-list ms-feed ms-twitter-feed ms-recent-support-tickets">
                            <li className="ms-list-item">
                                <Link to="#" className="media clearfix">
                                    <img src={process.env.PUBLIC_URL + "/assets/img/dashboard/rakhan-potik-1.jpg"} className="ms-img-round ms-img-small" alt="This is another feature" />
                                    <div className="media-body">
                                        <div className="d-flex  ">
                                            <h4 className="ms-feed-user mb-0 ">Nina Williams</h4>
                                            <h4 className="ms-feed-user ms-text-primary ml-2 mb-0 ">Product: Seeds</h4>
                                        </div>
                                        <ul className="ms-star-rating rating-fill mb-0 mt-2 rating-circle heart-rating">
                                            <li className="ms-rating-item rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                        </ul>
                                        <span className="my-2 d-block"> <i className="material-icons ms-text-primary">date_range</i> November 16, 2022</span>
                                        <p className="d-block"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus lectus a facilisis bibendum. Duis quis convallis sapien ... </p>
                                        <div className="d-flex justify-content-between align-items-end">
                                            <div className="ms-feed-controls">
                                                <span>
                                                    <i className="material-icons ms-text-primary">chat</i> 16
                  </span>
                                                <span>
                                                    <i className="material-icons ms-text-primary ">attachment</i> 3
                  </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li className="ms-list-item">
                                <Link to="#" className="media clearfix">
                                    <img src={process.env.PUBLIC_URL + "/assets/img/dashboard/rakhan-potik-2.jpg"} className="ms-img-round ms-img-small" alt="This is another feature" />
                                    <div className="media-body">
                                        <div className="d-flex ">
                                            <h4 className="ms-feed-user mb-0">Daryl Michaels</h4>
                                            <h4 className="ms-feed-user ms-text-primary ml-2 mb-0 ">Product: Oil</h4>
                                        </div>
                                        <ul className="ms-star-rating mb-0  mt-2 rating-fill rating-circle heart-rating">
                                            <li className="ms-rating-item rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                        </ul>
                                        <span className="my-2 d-block"> <i className="material-icons ms-text-primary">date_range</i> September 04, 2022</span>
                                        <p className="d-block"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus lectus a facilisis bibendum. Duis quis convallis sapien ... </p>
                                        <div className="d-flex justify-content-between align-items-end">
                                            <div className="ms-feed-controls">
                                                <span>
                                                    <i className="material-icons ms-text-primary">chat</i> 11
                  </span>
                                                <span>
                                                    <i className="material-icons ms-text-primary">attachment</i> 1
                  </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li className="ms-list-item">
                                <Link to="#" className="media clearfix">
                                    <img src={process.env.PUBLIC_URL + "/assets/img/dashboard/rakhan-potik-3.jpg"} className="ms-img-round ms-img-small" alt="This is another feature" />
                                    <div className="media-body">
                                        <div className="d-flex ">
                                            <h4 className="ms-feed-user mb-0">Brian Dunkst</h4>
                                            <h4 className="ms-feed-user ms-text-primary ml-2 mb-0 ">Product: Edibles</h4>
                                        </div>
                                        <ul className="ms-star-rating mb-0 mt-2 rating-fill rating-circle heart-rating">
                                            <li className="ms-rating-item rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                            <li className="ms-rating-item rated rating-custome"> <i className="material-icons">star</i> </li>
                                        </ul>
                                        <span className="my-2 d-block"> <i className="material-icons ms-text-primary">date_range</i> February 24, 2022</span>
                                        <p className="d-block"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla luctus lectus a facilisis bibendum. Duis quis convallis sapien ... </p>
                                        <div className="d-flex justify-content-between align-items-end">
                                            <div className="ms-feed-controls">
                                                <span>
                                                    <i className="material-icons ms-text-primary">chat</i> 21
                  </span>
                                                <span>
                                                    <i className="material-icons ms-text-primary">attachment</i> 5
                  </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Latestreviews;