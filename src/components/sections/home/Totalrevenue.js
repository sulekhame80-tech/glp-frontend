import React, { Component, Fragment } from 'react';

const totalvalue = [
    { title: "Weekly Earnings", value: 55 },
    { title: "Monthly Earnings", value: 25 },
    { title: "Quaterly Earnings", value: 20 },
    { title: "Yearly Earnings", value: 60 },
];

class Totalrevenue extends Component {
    render() {
        return (
            <div className="col-md-12 col-xl-4 ">
                <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-header">
                        <h6>Total Revenue </h6>
                    </div>
                    <div className="ms-panel-body pb-1">
                        {totalvalue.map((item, i) => (
                            <Fragment key={i}>
                                <span className="progress-label bold">{item.title}</span>
                                <div className="progress">
                                    <div className="progress-bar bg-dark-green" role="progressbar" style={{ width: item.value + '%' }}>{item.value}%</div>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Totalrevenue;
