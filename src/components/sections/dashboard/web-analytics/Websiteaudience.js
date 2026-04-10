import React, { Component } from 'react';
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { Line as LineChart } from 'react-chartjs-2';
import Channel from './Channel';

import { getDashboadmetricReportApi } from '../../../api/endpoint';
// Removed LabRecordTable from here — it will be rendered in Content.js
import { UserContext } from "../../../../UserContext";

const options = {
  elements: { line: { tension: 0 } },
  tooltips: {
    titleFontColor: '#3a3952',
    backgroundColor: '#FFF',
    bodyFontColor: '#878793',
    displayColors: false,
    mode: 'index',
    intersect: false
  },
  legend: { display: false },
  scales: {
    yAxes: [
      {
        ticks: { beginAtZero: true, fontColor: "#A8A9AD" },
        gridLines: { display: false }
      }
    ],
    xAxes: [
      {
        ticks: { fontColor: "#A8A9AD" },
        gridLines: { zeroLineColor: "transparent" }
      }
    ]
  }
};

class Websiteaudience extends Component {
  static contextType = UserContext;

  state = {
    glp: 0,
    nonglp: 0,
    routine: 0,
    registered: 0,
    completed: 0,
    data1: { labels: [], datasets: [] }
  };

  componentDidMount() {
    this.fetchDashboard("month");
    const { location, role } = this.context || {};
    console.log("Location in Websiteaudience:", location, role);
  }

  fetchDashboard = (type) => {
    const { location, role } = this.context || {};

    console.log(
      "Websiteaudience → Sending to backend | Location:",
      location,
      "| Role:",
      role
    );

    getDashboadmetricReportApi(type, location, role)
      .then((res) => {
        const api = res.data;

        const chartData = {
          labels: api.trend.labels,
          datasets: [
            {
              label: "Orders Received",
              data: api.trend.orders,
              fill: true,
              backgroundColor: "rgba(38,137,104,0.4)",
              borderColor: "#268968",
              borderWidth: 2,
            },
            {
              label: "Completed Orders",
              data: api.trend.completed,
              fill: true,
              backgroundColor: "rgba(234,110,39,0.4)",
              borderColor: "#ea6e27",
              borderWidth: 2,
            },
          ],
        };

        this.setState({
          glp: api.category_summary.glp,
          nonglp: api.category_summary.nonglp,
          routine: api.category_summary.routine,
          registered: api.summary.registered,
          completed: api.summary.completed,
          data1: chartData,
        });
      })
      .catch((err) => console.error("Dashboard Fetch Error:", err));
  };

  render() {
    const { glp, nonglp, routine, registered, completed } = this.state;

    return (
      <div>

        <div className="ms-panel">

          <div className="ms-panel-header header-mini">
           
            <div className="d-flex justify-content-between" style={{marginRight:"10px"}}>
             
              <ButtonToolbar>
                <ToggleButtonGroup
                  className="ms-graph-metrics"
                  type="radio"
                  name="options"
                  defaultValue={2}
                >
                  <ToggleButton
                    variant="sm btn-outline-primary day"
                    value={1}
                    onClick={() => this.fetchDashboard("day")}
                  >
                    Day
                  </ToggleButton>

                  <ToggleButton
                    variant="sm btn-outline-primary month"
                    value={2}
                    onClick={() => this.fetchDashboard("month")}
                  >
                    Month
                  </ToggleButton>

                  <ToggleButton
                    variant="sm btn-outline-primary year"
                    value={3}
                    onClick={() => this.fetchDashboard("year")}
                  >
                    Year
                  </ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar>
            </div>

            <div className="d-flex justify-content-between ms-graph-meta">
              <ul className="ms-list-flex">
                <li>
                  <span>GLP</span>
                  <h3 className="ms-count">{glp}</h3>
                </li>

                <li>
                  <span>Non-GLP</span>
                  <h3 className="ms-count">{nonglp}</h3>
                </li>

                <li>
                  <span>Routine</span>
                  <h3 className="ms-count">{routine}</h3>
                </li>
              </ul>

             
            </div>
          </div>

          <div className="ms-panel-body">
            <LineChart data={this.state.data1} options={options} />
          </div>
           <div className="ms-graph-labels">
                <span className="ms-graph-decrease" />
                <p>Registered Orders: {registered}</p>

                <span className="ms-graph-regular" />
                <p>Completed Orders: {completed}</p>
              </div>
        </div>
      </div>
    );
  }
}

export default Websiteaudience;
