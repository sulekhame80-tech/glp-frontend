import React, { Component } from 'react';
import { Bar as BarChart } from 'react-chartjs-2';

// bar-chart
function barchart() {
    return {
        labels: ["January", "February", "March", "April", "May"],
        datasets: [
            {
                label: "Orders",
                backgroundColor: ["#45e345", "#000000", "#45e345", "#000000", "#45e345"],
                data: [2478, 5267, 1734, 3384, 1433]
            }
        ]
    }
}
// Options
const options = {
    legend: {
        display: false,
        labels: {
            fontColor: "#A8A9AD",
        }
    },
    title: {
        display: true,
        text: 'Orders In 2022',
        fontColor: "#A8A9AD",
    },
    scales: {
        yAxes: [{
            ticks: {
                fontColor: "#A8A9AD",
            }

        }],
        xAxes: [{
            ticks: {
                fontColor: "#A8A9AD",
            }
        }]
    }
}
class Bar extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            data: barchart(),
            open: true,
        }
    };
    render() {
        return (
            <div className="col-xl-6 col-md-12">
                <div className="ms-panel">
                    <div className="ms-panel-header">
                        <h6>Bar Chart</h6>
                    </div>
                    <div className="ms-panel-body">
                        <BarChart data={this.state.data} options={options} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Bar;