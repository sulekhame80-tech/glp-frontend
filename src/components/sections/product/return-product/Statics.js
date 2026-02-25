import React, { Component, Fragment } from 'react';

class Statics extends Component {
    render() {
        return (
            <Fragment>
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="ms-panel">
                        <div className="ms-panel-body">
                            <div className="progress-rounded mb-0">
                                <div className="progress-value">Defective Items</div>
                                <svg>
                                    <circle className="progress-cicle bg-success animated" cx={65} cy={65} r={57} strokeWidth={16} fill="none" aria-valuenow={12} aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} role="slider" style={{ strokeDashoffset: '315.165px' }}>
                                    </circle>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="ms-panel">
                        <div className="ms-panel-body">
                            <div className="progress-rounded mb-0">
                                <div className="progress-value">Late Delivery</div>
                                <svg>
                                    <circle className="progress-cicle bg-info animated" cx={65} cy={65} r={57} strokeWidth={16} fill="none" aria-valuenow="38.8" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} role="slider" style={{ strokeDashoffset: '219.183px' }}>
                                    </circle>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="ms-panel">
                        <div className="ms-panel-body">
                            <div className="progress-rounded mb-0">
                                <div className="progress-value">Damaged Items</div>
                                <svg>
                                    <circle className="progress-cicle bg-danger animated" cx={65} cy={65} r={57} strokeWidth={16} fill="none" aria-valuenow={100} aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} role="slider" style={{ strokeDashoffset: '0px' }}>
                                    </circle>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="ms-panel">
                        <div className="ms-panel-body">
                            <div className="progress-rounded mb-0">
                                <div className="progress-value">Wrong Product</div>
                                <svg>
                                    <circle className="progress-cicle bg-warning animated" cx={65} cy={65} r={57} strokeWidth={16} fill="none" aria-valuenow="78.8" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} role="slider" style={{ strokeDashoffset: '75.926px' }}>
                                    </circle>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Statics;