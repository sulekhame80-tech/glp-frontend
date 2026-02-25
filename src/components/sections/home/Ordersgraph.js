import React, { Component } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { Line as LineChart } from 'react-chartjs-2';
import { Bar as BarChart } from 'react-chartjs-2';

// Line Chart
function linechart() {
    return {
        labels: ["Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17", "Jan-18", "Jan-19"],
        datasets: [{
            label: "Orders",
            borderColor: "#000000",
            pointBorderColor: "#000000",
            pointBackgroundColor: "#000000",
            pointHoverBackgroundColor: "#000000",
            pointHoverBorderColor: "#000000",
            pointBorderWidth: 1,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 2,
            fill: true,
            backgroundColor: "#45e34585",
            borderWidth: 1,
            data: [1800, 1600, 2300, 2800, 3600, 2900, 3000, 3800, 3600]
        }]
    }
}
// Bar Chart
function barchart() {
    return {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
            {
                label: "Orders",
                backgroundColor: ["linear-gradient(to bottom left, #0f5c87 1%, #31c7d4 83%);", "#28a745", "linear-gradient(to bottom left, #0f5c87 1%, #31c7d4 83%);", "#28a745", "linear-gradient(to bottom left, #0f5c87 1%, #31c7d4 83%);"],
                data: [2478, 5267, 1734, 3384, 1433]
            }
        ]
    }
}
// Options
const baroptions = {
    legend: { display: false },
    title: {
        display: true,
        text: 'Orders In 2022'
    }
}
const lineoptions = {
    legend: {
        display: true,
    },
    scales: {
        yAxes: [{
            ticks: {
                fontColor: "rgba(0,0,0,0.5)",
                fontStyle: "bold",
                beginAtZero: true,
                maxTicksLimit: 200,
                padding: 20
            },
            gridLines: {
                drawTicks: false,
                display: false
            }

        }],
        xAxes: [{
            gridLines: {
                zeroLineColor: "transparent"
            },
            ticks: {
                padding: 20,
                fontColor: "rgba(0,0,0,0.5)",
                fontStyle: "bold"
            }
        }]
    }
}

class Ordersgraph extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            data: linechart(),
            data1: barchart(),
            open: true,
        }
    };
    render() {
        return (
            <div className="col-md-12 col-xl-6">
                <div className="ms-panel ms-panel-fh">
                    <Tab.Container defaultActiveKey="tab1">
                        <div className="ms-panel-header ms-panel-custom align-items-center">
                            <h6>Orders Graph</h6>
                            <Nav variant="tabs" className="nav nav-tabs d-flex nav-justified mb-0">
                                <Nav.Item>
                                    <Nav.Link eventKey="tab1" className="pb-0">
                                        <i className="fas fa-chart-bar fa-2x" />
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="tab2" className="pb-0">
                                        <i className="fas fa-chart-line fa-2x" />
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </div>
                        <div className="ms-panel-body clearfix">
                            <Tab.Content>
                                <Tab.Pane eventKey="tab1">
                                    <div className="ms-panel-body p-0">
                                        <BarChart data={this.state.data1} options={baroptions} />
                                    </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="tab2">
                                    <div className="ms-panel-body p-0">
                                        <LineChart data={this.state.data} options={lineoptions} />
                                    </div>
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </Tab.Container>
                </div>
            </div>
        );
    }
}

export default Ordersgraph;