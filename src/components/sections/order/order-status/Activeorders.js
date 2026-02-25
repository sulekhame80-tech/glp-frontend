import React, { Component } from 'react';
import { Pie as PieChart } from 'react-chartjs-2';

// active-orders
function activeorders() {
    return {
        labels: ["Low Rider", "Hemp Oil", "Super Skunk", "Ingrid", "UK Cheese"],
        datasets: [
            {
                label: "Population (millions)",
                borderColor: 'transparent',
                backgroundColor: ["#1d911d", "#45e345", "#000000", "#403f55", "#00f300"],
                data: [478, 267, 734, 784, 433]
            }
        ]
    }
}
// Options
const options = {
    cutoutPercentage: 70,
    animation: {
        animateScale: true
    },
    title: {
        display: false,
        text: 'Predicted world population (millions) in 2050'
    },
    legend: {
        position: 'left',
        display: false,
    },
}

class Activeorders extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            data1: activeorders(),
            open: true,
        }
    };
    render() {
        return (
            <div className="col-xl-6 col-md-12">
                <div className="ms-panel ms-panel-fh">
                    <div className="ms-panel-header">
                        <h6>Active Orders</h6>
                        <p>Real time Orders information and rating data</p>
                    </div>
                    <div className="ms-panel-body">
                        <div className="row">
                            <div className="col-xl-4 col-md-4">
                                <div className="ms-graph-labels column-direction">
                                    <div className="ms-chart-no-label">
                                        <span className="bg-success" />
                                        <p>$9,348,319</p>
                                    </div>
                                    <div className="ms-chart-no-label">
                                        <span className="bg-dark-green" />
                                        <p>$4,344,316</p>
                                    </div>
                                    <div className="ms-chart-no-label">
                                        <span className="bg-warning" />
                                        <p>$518,513</p>
                                    </div>
                                    <div className="ms-chart-no-label">
                                        <span className="bg-danger" />
                                        <p>$348,319</p>
                                    </div>
                                    <div className="ms-chart-no-label">
                                        <span className="bg-secondary" />
                                        <p>$3,416,139</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-8 col-md-8">
                                <PieChart data={this.state.data1} options={options} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Activeorders;