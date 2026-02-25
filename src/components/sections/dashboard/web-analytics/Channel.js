import React, { Component } from "react";
import { Line as LineChart } from "react-chartjs-2";
import { getLabrecordApi } from "../../../api/endpoint";

class Channel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      data1: trendone(),
      data2: trendtwo(),
      data3: trendthree(),
      data4: trendfour(),
      data5: trendfive(),
    };
  }

  componentDidMount() {
    this.fetchLabRecords();
  }

  fetchLabRecords = async () => {
    try {
      const res = await getLabrecordApi();
      this.setState({ records: res.data });
    } catch (error) {
      console.error("Error loading Lab Records:", error);
    }
  };

  render() {
    return (
      <div className="ms-panel">
        <div className="ms-panel-header">
          <h6>Lab Records Overview</h6>
          <p>Important analytics from latest lab entries</p>
        </div>

        <div className="ms-panel-body p-0">
          <div className="table-responsive">
            <table className="table table-hover thead-light mb-0">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Test Name</th>
                  <th>Date</th>
                  <th>Business Type</th>
                  <th>Payment Status</th>
                  <th>Technician</th>
                  <th>Clinician</th>
                  <th>Patient</th>
                  <th>Amount</th>
                  <th>Payout</th>
                </tr>
              </thead>

              <tbody>
                {this.state.records.map((rec, index) => (
                  <tr key={index}>
                    <td>{rec.order_id}</td>

                    <td>{rec.test_name}</td>

                    <td>{rec.date?.slice(0, 10)}</td>

                    <td>
                      <span className="badge badge-info">
                        {rec.business_type}
                      </span>
                    </td>

                    <td className={rec.payment_status === "Received" ? "text-success" : "text-warning"}>
                      {rec.payment_status}
                    </td>

                    <td>{rec.technician_id__technician_name || "-"}</td>

                    <td>{rec.clinician_id__hospital_name || "-"}</td>

                    <td>{rec.patient_id__patient_name}</td>

                    <td>₹{rec.payment_received || 0}</td>

                    <td className={rec.payout_status === "Pending" ? "text-danger" : "text-success"}>
                      {rec.payout_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Channel;
