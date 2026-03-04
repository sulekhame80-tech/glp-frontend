import React, { Component, Fragment } from 'react';

const stars = [
    { title: "5 Star", value: 25 },
    { title: "4 Star", value: 50 },
    { title: "3 Star", value: 75 },
    { title: "2 Star", value: 100 },
    { title: "1 Star", value: 75 },
];

class Ratingbars extends Component {
    render() {
        return (
            <div className="col-lg-6">
                <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-body">
                        {stars.map((item, i) => (
                            <Fragment key={i}>
                                <span className="progress-label bold"> {item.title}</span>
                                <div className="progress">
                                    <div className="progress-bar bg-dark-green" role="progressbar" style={{ width: item.value + '%' }} aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>{item.value}%</div>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Ratingbars;
