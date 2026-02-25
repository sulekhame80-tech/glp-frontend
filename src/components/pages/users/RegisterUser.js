import React, { useState, useEffect, useContext } from "react";
import { addRegisterApi, locationDropdownApi } from "../../api/endpoint";
import Breadcrumb from "../../layouts/Breadcrumb";
import { UserContext } from "../../../UserContext";

function RegisterUser() {
  const { userName, role } = useContext(UserContext);

  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    password: "",
    role: "",
    email: "",
    mobile_no: "",
    bank_name: "",
    account_no: "",
    branch_name: "",
    ifsc_code: "",
    saving_current: "",
    gst: "",
    location_id: null,
    created_by: userName,
  });

  // Load location dropdown from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await locationDropdownApi();
        setLocations(res.data || []);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, created_by: userName }));
  }, [userName]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If selecting a location from dropdown, set location_id
    if (name === "location_id") {
      const selectedLocation = locations.find((loc) => loc.id === parseInt(value));
      setFormData({
        ...formData,
        location_id: selectedLocation ? selectedLocation.id : null,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role || !formData.email || !formData.mobile_no || !formData.location_id) {
      alert("Please fill all mandatory fields!");
      return;
    }

    try {
  await addRegisterApi(formData);
  alert("User Registered Successfully!");

  setFormData({
    password: "",
    role: "",
    email: "",
    mobile_no: "",
    bank_name: "",
    account_no: "",
    branch_name: "",
    ifsc_code: "",
    saving_current: "",
    gst: "",
    location_id: null,
    created_by: userName,
  });
} catch (err) {
  console.error("ERROR REGISTERING USER:", err);

  // If backend sends a 400 with a message
  if (err.response && err.response.status === 400) {
    alert(err.response.data.message || "Registration failed!");
  } else {
    alert("Registration failed due to server error!");
  }
}

  };

  return (
    <div className="ms-content-wrapper">
      <div className="row">
        <Breadcrumb pageprev="Profile" pagecurrent="Create User" />

        <div className="col-md-12">
          <div className="ms-panel">
            <div className="ms-panel-header">
              <h6>Create New User</h6>
            </div>

            <div className="ms-panel-body">
              <form onSubmit={handleSubmit}>
                <div className="row">

                  {/* Role */}
                  <div className="col-md-4 mb-3">
                    <label>Role *</label>
                    <select
                      name="role"
                      className="form-control"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Role</option>
                      {role === "Super Admin" && (
                        <>
                          <option value="Super Admin">Super Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Employee">Employee</option>
                        </>
                      )}
                      {role === "Manager" && <option value="Employee">Employee</option>}
                      {role === "Employee" && <option disabled>No Permission</option>}
                    </select>
                  </div>

                  {/* Email */}
                  <div className="col-md-4 mb-3">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Mobile */}
                  <div className="col-md-4 mb-3">
                    <label>Mobile No *</label>
                    <input
                      type="text"
                      name="mobile_no"
                      className="form-control"
                      maxLength="10"
                      value={formData.mobile_no}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Location Dropdown */}
                  <div className="col-md-4 mb-3">
                    <label>Location *</label>
                    <select
                      className="form-control"
                      name="location_id"
                      value={formData.location_id || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bank Name */}
                  <div className="col-md-4 mb-3">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      name="bank_name"
                      className="form-control"
                      value={formData.bank_name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Account No */}
                  <div className="col-md-4 mb-3">
                    <label>Account Number</label>
                    <input
                      type="text"
                      name="account_no"
                      className="form-control"
                      value={formData.account_no}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Branch */}
                  <div className="col-md-4 mb-3">
                    <label>Branch Name</label>
                    <input
                      type="text"
                      name="branch_name"
                      className="form-control"
                      value={formData.branch_name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* IFSC */}
                  <div className="col-md-4 mb-3">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      name="ifsc_code"
                      className="form-control"
                      value={formData.ifsc_code}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Account type */}
                  <div className="col-md-4 mb-3">
                    <label>Account Type</label>
                    <select
                      name="saving_current"
                      className="form-control"
                      value={formData.saving_current}
                      onChange={handleChange}
                    >
                      <option value="">Select Type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>

                  {/* GST */}
                  {formData.saving_current === "Current" && (
                    <div className="col-md-4 mb-3">
                      <label>GST Number</label>
                      <input
                        type="text"
                        name="gst"
                        className="form-control"
                        value={formData.gst}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                  <button type="submit" className="btn btn-secondary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
