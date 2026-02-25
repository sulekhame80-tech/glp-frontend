import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../layouts/Breadcrumb";
import { getLabReportApi } from "../../../api/endpoint";
import "./order.css";

function Report() {
  const [reportType, setReportType] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [quarter, setQuarter] = useState("");
  const [businessType, setBusinessType] = useState("");

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===========================
  //   FETCH REPORT FUNCTION
  // ===========================
  const fetchReport = async () => {
    try {
      setLoading(true);

      const params = {
        type: reportType,
        location,
        business_type: businessType,
        date,
        from_date: fromDate,
        to_date: toDate,
        month,
        year,
        quarter,
      };

      const response = await getLabReportApi(params);
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report", error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  //        CLEAR FILTERS
  // ===========================
  const clearFilters = () => {
    setReportType("");
    setLocation("");
    setBusinessType("");
    setDate("");
    setFromDate("");
    setToDate("");
    setMonth("");
    setYear("");
    setQuarter("");
    setReportData(null);
  };

  return (
    <div className="ms-content-wrapper">
      <div className="row">
        <Breadcrumb pageprev={"Orders"} pagecurrent={"Report"} />

        <div className="col-md-12 card p-4">

          {/* =======================
                FILTERS
          ======================== */}
          <div className="row mb-3">

            {/* REPORT TYPE */}
            <div className="col-md-3">
              <label>Report Type</label>
              <select
                className="form-control"
                value={reportType}
                onChange={(e) => {
                  setReportType(e.target.value);
                  setDate("");
                  setFromDate("");
                  setToDate("");
                  setMonth("");
                  setYear("");
                  setQuarter("");
                }}
              >
                <option value="">Select</option>
                <option value="day">Day</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </select>
            </div>

            {/* LOCATION */}
            <div className="col-md-3">
              <label>Location</label>
              <select
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">All</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* BUSINESS TYPE */}
            <div className="col-md-3">
              <label>Business Type</label>
              <select
                className="form-control"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              >
                <option value="">All</option>
                <option value="B2B">B2B</option>
                <option value="B2C">B2C</option>
                <option value="ROUTINE">Routine</option>
              </select>
            </div>

            {/* ===== DAY REPORT INPUTS ===== */}
            {reportType === "day" && (
              <>
                <div className="col-md-3">
                  <label>Select Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label>From</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label>To</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ===== MONTH REPORT ===== */}
            {reportType === "month" && (
              <>
                <div className="col-md-3">
                  <label>Month</label>
                  <select
                    className="form-control"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option value="">Select</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("default", { month: "short" })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Year</label>
                  <input
                    type="number"
                    className="form-control"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ===== QUARTER REPORT ===== */}
            {reportType === "quarter" && (
              <>
                <div className="col-md-3">
                  <label>Quarter</label>
                  <select
                    className="form-control"
                    value={quarter}
                    onChange={(e) => setQuarter(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="1">Q1</option>
                    <option value="2">Q2</option>
                    <option value="3">Q3</option>
                    <option value="4">Q4</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Year</label>
                  <input
                    type="number"
                    className="form-control"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* ===== YEAR REPORT ===== */}
            {reportType === "year" && (
              <div className="col-md-3">
                <label>Year</label>
                <input
                  type="number"
                  className="form-control"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* FETCH + CLEAR BUTTONS */}
          <div className="mt-3">
            <button
              className="btn btn-primary me-2"
              onClick={fetchReport}
              disabled={loading}
              style={{marginRight:"20px"}}
            >
              {loading ? "Loading..." : "Get Report"}
            </button>

            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear
            </button>
          </div>

          {/* =======================
                TABLE RESULT
          ======================== */}
          {reportData && (
            <div className="mt-4">
              <h4>Report Summary</h4>

              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Total Orders</th>
                    <td>{reportData.total_orders}</td>
                  </tr>

                  <tr>
                    <th>Paid Orders</th>
                    <td>{reportData.paid_orders}</td>
                  </tr>

                  <tr>
                    <th>Pending Orders</th>
                    <td>{reportData.pending_orders}</td>
                  </tr>

                  <tr>
                    <th>Total Payment Received</th>
                    <td>₹ {reportData.total_payment_received}</td>
                  </tr>

                  <tr>
                    <th>GLP Charges</th>
                    <td>₹ {reportData.total_glp_charges}</td>
                  </tr>

                  <tr>
                    <th>Pheblo Charges</th>
                    <td>₹ {reportData.total_pheblo_charges}</td>
                  </tr>

                  <tr>
                    <th>Payout Amount</th>
                    <td>₹ {reportData.total_payout_amount}</td>
                  </tr>

                  <tr>
                    <th>Payout Paid</th>
                    <td>{reportData.payout_paid}</td>
                  </tr>

                  <tr>
                    <th>Payout Pending</th>
                    <td>{reportData.payout_pending}</td>
                  </tr>

                 
                </tbody>
              </table>

              {/* BUSINESS TYPE SUMMARY TABLE */}
              {reportData.business_summary?.length > 0 && (
                <>
                  <h5 className="mt-4">Business Type Summary</h5>

                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Business Type</th>
                        <th>Total Orders</th>
                        <th>Total Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.business_summary.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.business_type}</td>
                          <td>{item.total}</td>
                          <td>₹ {item.total_payment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Report;
