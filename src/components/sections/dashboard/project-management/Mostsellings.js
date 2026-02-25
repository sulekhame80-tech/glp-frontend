import React, { Component, Fragment } from 'react';

const projects = [
    { title: "HTML & CSS Projects", value: 80 },
    { title: "Wordpress Projects", value: 50 },
    { title: "PSD Projects", value: 75 },
    { title: "Code Snippets", value: 92 },
];

class Mostsellings extends Component {
    render() {
        return (
            <div className="ms-panel">
                <div className="ms-panel-header">
                    <h6>most sellings projects</h6>
                </div>
                <div className="ms-panel-body">
                    {projects.map((item, i) => (
                        <Fragment key={i}>
                            <span className="progress-label">{item.title}</span><span className="progress-status">{item.value}%</span>
                            <div className="progress progress-tiny">
                                <div className="progress-bar bg-dark-green" role="progressbar" style={{ width: item.value + '%' }} />
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
        );
    }
}

export default Mostsellings;