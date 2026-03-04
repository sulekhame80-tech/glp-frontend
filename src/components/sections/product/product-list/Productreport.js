import React, { Component } from 'react';
import { Line as LineChart } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { Dropdown, NavLink } from 'react-bootstrap';

// crypto-rating-graph
function cryptoratinggraph() {
    return {
        labels: ["12 AM", "2 AM", "4 AM", "6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"],
        datasets: [{
            label: "Price",
            borderColor: "#45e345",
            pointBorderWidth: 9,
            pointRadius: 9,
            pointBorderColor: 'transparent',
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3,
            pointHoverBackgroundColor: 'white',
            pointHoverBorderColor: '#45e345',
            pointBackgroundColor: 'transparent',
            fill: true,
            backgroundColor: "#e0ffef",
            borderWidth: 2,
            data: [65, 59, 80, 81, 56, 55, 40, 70, 56, 76, 51, 59]
        }]
    }
}
// Options
const options = {
    animation: false,
    scaleOverride: true,
    scaleSteps: 10,
    scaleStepWidth: 10,
    scaleStartValue: 0,
    elements: {
        line: {
            tension: 0
        }
    },
    legend: {
        display: false,
        position: "top"
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                padding: 20
            },
        }],
        xAxes: [{

            ticks: {
                padding: 20,
                beginAtZero: true,
            }
        }]
    }
}
class Productreport extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            data: cryptoratinggraph(),
            open: true,
        }
    };
    render() {
        return (
            <div className="col-xl-6 col-md-12">
                <div className="ms-panel ms-panel-fh ms-crypto-rating">
                    <div className="ms-panel-header header-mini">
                        <div className="d-flex justify-content-between">
                            <div className="ms-header-text">
                                <h6>Product Report</h6>
                                <p>Cannabis Orders information and rating data</p>
                            </div>
                        </div>
                        <Dropdown>
                            <Dropdown.Toggle as={NavLink} className="p-0 has-chevron d-inline-block">
                                <i className="cc BTC" /> Orders
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <li className="ms-dropdown-list">
                                    <Link className="media p-2" to="#">
                                        <div className="media-body">
                                            <span>Hemp Oil</span>
                                        </div>
                                    </Link>
                                    <Link className="media p-2" to="#">
                                        <div className="media-body">
                                            <span>Super Skunk</span>
                                        </div>
                                    </Link>
                                    <Link className="media p-2" to="#">
                                        <div className="media-body">
                                            <span>Low Rider</span>
                                        </div>
                                    </Link>
                                </li>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="ms-panel-body">
                        <LineChart data={this.state.data} options={options} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Productreport;
