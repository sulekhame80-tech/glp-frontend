import React, { Component } from 'react';
import { Line as LineChart } from 'react-chartjs-2';

var data_1 = [1800, 1600, 2300, 2800, 3600, 2900, 3000, 3800, 3600];
var labels = ["Jan-11", "Jan-12", "Jan-13", "Jan-14", "Jan-15", "Jan-16", "Jan-17", "Jan-18", "Jan-19"];
// line-chart
function linechart() {
    return {
        labels: labels,
        datasets: [{
            label: "Orders",
            borderColor: '#000000',
            pointBorderColor: '#000000',
            pointBackgroundColor: '#000000',
            pointHoverBackgroundColor: '#000000',
            pointHoverBorderColor: '#000000',
            pointBorderWidth: 1,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 2,
            fill: true,
            backgroundColor: "#45e34585",
            borderWidth: 1,
            data: data_1
        }]
    }
}
// Options
const options = {
    legend: {
        display: true
    },
    scales: {
        yAxes: [{
            ticks: {
                fontColor: "#A8A9AD",
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
                fontColor: "#A8A9AD"
            }
        }]
    }
}

class Line extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            data: linechart(),
            open: true,
        }
    };
    render() {
        return (
            <div className="col-xl-6 col-md-12">
                <div className="ms-panel">
                    <div className="ms-panel-header">
                        <h6>Line Chart</h6>
                    </div>
                    <div className="ms-panel-body">
                        <LineChart data={this.state.data} options={options} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Line;