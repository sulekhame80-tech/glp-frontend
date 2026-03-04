import React, { Component } from 'react';

class Topsales extends Component {
    render() {
        return (
            <div className="ms-panel">
                <div className="ms-panel-header">
                    <h6>Top Sales</h6>
                    <p>Your highest selling projects</p>
                </div>
                <div className="ms-panel-body p-0">
                    <div className="ms-quick-stats">
                        <div className="ms-stats-grid">
                            <p className="ms-text-success">+47.18%</p>
                            <p className="ms-text-dark">8,033</p>
                            <span>Admin Dashboard</span>
                        </div>
                        <div className="ms-stats-grid">
                            <p className="ms-text-success">+17.24%</p>
                            <p className="ms-text-dark">6,039</p>
                            <span>Wordpress Theme</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Topsales;
