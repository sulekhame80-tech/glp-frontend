import React, { Component } from "react";
import { Line as LineChart } from "react-chartjs-2";
import { getcountbybussinesApi, getpaymentbybussinessApi } from "../../../api/endpoint";
import PaymentSummaryDashboard from "./Paymentsummary";
import { UserContext } from "../../../../UserContext";   // ⭐ NEW


class GoogleAnalytics extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      ordersData: null,
      paymentData: null,
    };
  }

  componentDidMount() {
    this.fetchData();
    const { location ,role} = this.context || {};
    console.log("Location in business:", location,role);   // ⭐ NEW

  }

 fetchData = async () => {
  try {
    const { location, role } = this.context || {};
    console.log("Sending to Business API → Location:", location, "Role:", role);

    const ordersRes = await getcountbybussinesApi(location, role);
    const paymentRes = await getpaymentbybussinessApi(location, role);

    const ordersData = this.createChartData(
      ordersRes.data.data,
      "total_orders"
    );

    const paymentData = this.createChartData(
      paymentRes.data.data,
      "total_payment_received"
    );

    this.setState({ ordersData, paymentData });
  } catch (error) {
    console.error("Error fetching business data:", error);
  }
};


  createChartData = (dataArray, key) => {
    const labels = dataArray.map((item) => item.business_type);
    const data = dataArray.map((item) => item[key]);

    return {
      labels,
      datasets: [
        {
          label: key === "total_orders" ? "Total Orders" : "Total Payment",
          data,
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.3)",
          fill: true,
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    };
  };

  render() {
    const { ordersData, paymentData } = this.state;

    // Custom options for orders
    const ordersOptions = {
      elements: { line: { tension: 0 } },
      legend: { display: false },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1, // 1,2,3,4...
            },
          },
        ],
        xAxes: [{ display: true }],
      },
    };

    // Custom options for payment
    const paymentOptions = {
      elements: { line: { tension: 0 } },
      legend: { display: false },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1000, // 1000, 2000, 3000...
            },
          },
        ],
        xAxes: [{ display: true }],
      },
    };

    return (
      <div className="ms-panel">
        <div className="ms-panel-header">
          <h6>Business Dashboard</h6>
        </div>

        <div className="ms-panel-body p-0">
          <ul className="ms-list ms-website-performance clearfix">
            <li className="ms-list-item">
              <h4>Total Orders </h4>
              {ordersData ? <LineChart data={ordersData} options={ordersOptions} /> : <p>Loading...</p>}
            </li>

            <li className="ms-list-item">
              <h4>Total Payment Received </h4>
              {paymentData ? <LineChart data={paymentData} options={paymentOptions} /> : <p>Loading...</p>}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default GoogleAnalytics;
