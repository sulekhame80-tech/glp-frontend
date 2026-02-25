// src/pages/reports/ReportSummary.jsx
import React, { useEffect, useState } from "react";
import { getReportSummaryApi, locationDropdownApi } from "../../../api/endpoint";

const ReportSummary = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  // filters
  const [startDate, setStartDate] = useState("");
  const [location, setLocation] = useState("");

  // dropdown data
  const [locations, setLocations] = useState([]);

  // ------------------------------------------------
  // FETCH LOCATION DROPDOWN
  // ------------------------------------------------
  const fetchLocations = async () => {
  try {
    const res = await locationDropdownApi();

    // backend returns array directly
    if (Array.isArray(res.data)) {
      setLocations(res.data);
    }
  } catch (err) {
    console.error("Failed to load locations", err);
  }
};

  // ------------------------------------------------
  // FETCH REPORT SUMMARY
  // ------------------------------------------------
  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getReportSummaryApi({
        start_date: startDate,
        location: location,
      });

      if (res.data?.status === "success") {
        setSummary(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load report summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchSummary();
  }, []);

  return (
    <div className="container mt-4">
      <h5>Report Summary</h5>

      {/* 🔍 Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <label>Location</label>
          <select
  className="form-control"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
>
  <option value="">All Locations</option>
  {locations.map((loc) => (
    <option key={loc.id} value={loc.location}>
      {loc.location}
    </option>
  ))}
</select>

        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={fetchSummary}>
            Apply
          </button>
        </div>
      </div>

      {/* ❌ Error */}
      {error && <p className="text-danger">{error}</p>}

      {/* ⏳ Loading */}
      {loading && <p>Loading...</p>}

      {/* ✅ Summary Data */}
      {summary && (
        <>
          {/* 🔢 Overall Summary */}
          <h6>Overall Summary</h6>
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Total Orders</th>
                <th>Total Payment Received</th>
                <th>Total Payout Amount</th>
                
              </tr>
            </thead>
            <tbody className="table-light">
              <tr>
                <td>{summary.total_orders}</td>
                <td>₹ {summary.total_payment_received}</td>
                <td>₹ {summary.total_payout_amount}</td>
                
              </tr>
            </tbody>
          </table>

          {/* 🏢 Business Type Summary */}
          <h6>Business Type Summary</h6>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Business Type</th>
                <th>Orders</th>
                <th>Payments</th>
                <th>Payouts</th>
              </tr>
            </thead>
            <tbody className="table-light">
              {summary.by_business.map((row, index) => (
                <tr key={index}>
                  <td>{row.business_type}</td>
                  <td>{row.orders}</td>
                  <td>₹ {row.payments || 0}</td>
                  <td>₹ {row.payouts || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📅 Routine Orders */}
          <h6>Routine Orders (Day Wise)</h6>
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Orders Received</th>
                <th>Payment Received</th>
               
              </tr>
            </thead>
            <tbody>
              {summary.routine_daily?.length > 0 ? (
                summary.routine_daily.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.date}</td>
                    <td>{row.orders}</td>
                    <td>₹ {row.payments}</td>
                  
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Routine Orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ReportSummary;
