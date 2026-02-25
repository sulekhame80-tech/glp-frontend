import React, { Component } from "react";
import { getLabrecordApi } from "../../../api/endpoint";
import { UserContext } from "../../../../UserContext"; // context for location & role

class LabRecordTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      loading: false,
    };
  }

  // enable context inside this class
  static contextType = UserContext;

  componentDidMount() {
    const { location, role } = this.context || {};
    console.log("Location in LabRecordTable:", location, "Role:", role);

    this.fetchLabRecords();
  }

  fetchLabRecords = async () => {
    this.setState({ loading: true });
    try {
      const { location, role } = this.context || {};
      console.log(
        "Sending to backend from LabRecordTable → Location:",
        location,
        "Role:",
        role
      );

      // page, pageSize, search, location, role
      const res = await getLabrecordApi(
        this.state.currentPage,
        this.state.pageSize,
        "",
        location,
        role
      );

      console.log("Lab API Response:", res.data);

      this.setState({
        records: Array.isArray(res.data.data) ? res.data.data : [],
        currentPage: res.data.current_page,
        totalPages: res.data.total_pages,
        pageSize: res.data.page_size,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching lab records:", error);
      this.setState({ records: [], loading: false });
    }
  };

  changePage = (page) => {
    if (page >= 1 && page <= this.state.totalPages) {
      this.setState({ currentPage: page }, () => this.fetchLabRecords());
    }
  };

  render() {
    const { records, currentPage, totalPages, loading } = this.state;

    return (
      <div className="ms-panel">
        <div className="ms-panel-header">
          <h6>Lab Records Overview</h6>
          <p>Displaying latest lab order & payment details</p>
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
                  <th>Payout Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                ) : records.length > 0 ? (
                  records.map((rec, index) => (
                    <tr key={index}>
                      <td>{rec.order_id}</td>
                      <td>{rec.test_name}</td>
                      <td>{rec.date ? rec.date.slice(0, 10) : "-"}</td>
                      <td>
                        <span className="badge badge-info">
                          {rec.business_type}
                        </span>
                      </td>
                      <td
                        className={
                          rec.payment_status === "Received"
                            ? "ms-text-success"
                            : "ms-text-warning"
                        }
                      >
                        {rec.payment_status}
                      </td>
                      <td>{rec.technician_id__technician_name || "-"}</td>
                      <td>{rec.clinician_id__hospital_name || "-"}</td>
                      <td>{rec.patient_id__patient_name || "-"}</td>
                      <td>₹{rec.payment_received || 0}</td>
                      <td
                        className={
                          rec.payout_status === "Pending"
                            ? "ms-text-danger"
                            : "ms-text-success"
                        }
                      >
                        {rec.payout_status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Arrows */}
          <div
            className="d-flex justify-content-center align-items-center mt-3"
            style={{ fontSize: "18px" }}
          >
            {/* Left Arrow */}
            <span
              style={{
                cursor: currentPage > 1 ? "pointer" : "not-allowed",
                opacity: currentPage === 1 ? 0.4 : 1,
                marginRight: "20px",
                fontSize: "22px",
              }}
              onClick={() =>
                currentPage > 1 && this.changePage(currentPage - 1)
              }
            >
              ‹
            </span>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            {/* Right Arrow */}
            <span
              style={{
                cursor: currentPage < totalPages ? "pointer" : "not-allowed",
                opacity: currentPage === totalPages ? 0.4 : 1,
                marginLeft: "20px",
                fontSize: "22px",
              }}
              onClick={() =>
                currentPage < totalPages && this.changePage(currentPage + 1)
              }
            >
              ›
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default LabRecordTable;
