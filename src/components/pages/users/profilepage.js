import React, { useState, useEffect, useContext } from "react";
import { getTechnicianApi, updatetechnicianApi } from "../../api/endpoint";
import Breadcrumb from "../../layouts/Breadcrumb";
import { UserContext } from "../../../UserContext";

function ProfilePage() {

  // ✅ Logged-in user from Context
  const { userName, role, location } = useContext(UserContext);

  // ✅ Initial state
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    mobile_no: "",
    bank_name: "",
    account_no: "",
    branch_name: "",
    ifsc_code: "",
    saving_current: "",
    gst: "",
    age: "",
    technician_name: "",
    medical_history: "",
    blood_group: "",
    address: "",
    created_by: "",
  });

  // --------------------------------------------------
  // ✅ SET USERNAME WHEN CONTEXT LOADS
  // --------------------------------------------------
  useEffect(() => {
    if (userName) {
      setFormData((prev) => ({
        ...prev,
        user_name: userName,
        created_by: userName,
      }));
    }
  }, [userName]);
useEffect(() => {
  if (!userName) return;

  const fetchProfile = async () => {
    try {
      const res = await getTechnicianApi(userName);

      if (res?.data?.status === "success") {
        const { login, technician } = res.data;

        setFormData({
          user_name: login.user_name || "",
          email: login.email || "",
          mobile_no: login.mobile_no || "",
          bank_name: login.bank_name || "",
          account_no: login.account_no || "",
          branch_name: login.branch_name || "",
          ifsc_code: login.ifsc_code || "",
          saving_current: login.saving_current || "",
          gst: login.gst || "",

          technician_name: technician?.technician_name || "",
          age: technician?.age || "",
          address: technician?.address || "",
          medical_history: technician?.medical_history || "",
          blood_group: technician?.blood_group || "",

          created_by: login.created_by || userName,
        });
      }
    } catch (err) {
      console.error("FETCH PROFILE ERROR:", err);
    }
  };

  fetchProfile();
}, [userName]);
  // --------------------------------------------------
  // INPUT CHANGE HANDLER
  // --------------------------------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.technician_name || !formData.email || !formData.mobile_no) {
      alert("Please fill required fields");
      return;
    }

   const payload = {
  username: userName,
  email: formData.email,
  mobile_no: formData.mobile_no,
  bank_name: formData.bank_name,
  account_no: formData.account_no,
  branch_name: formData.branch_name,
  ifsc_code: formData.ifsc_code,
  saving_current: formData.saving_current,
  gst: formData.gst,

  technician_name: formData.technician_name,
  age: formData.age,
  address: formData.address,
  medical_history: formData.medical_history,
  blood_group: formData.blood_group,

  modified_by: userName,
};

    try {
      await updatetechnicianApi(payload);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      alert("Update failed. Check console.");
    }
  };

  return (
    <div className="ms-content-wrapper">
      <div className="row">
        <Breadcrumb pageprev="Profile" pagecurrent="Register Profile" />

        <div className="col-md-12">
          <div className="ms-panel">
            <div className="ms-panel-header">
              <h6>Create New User</h6>
            </div>

            <div className="ms-panel-body">
              <form onSubmit={handleSubmit}>
                
                <div className="row">
                <div className="col-md-4 mb-3">
                    <label>Username *</label>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      value={formData.user_name}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
 <div className="col-md-4 mb-3">
      <label>Technician Name *</label>
      <input
        type="text"
        name="technician_name"
        className="form-control"
        value={formData.technician_name}
        onChange={handleChange}
        required
      />
    </div>

                  <div className="col-md-4 mb-3">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      
                    />
                  </div>

                 
                </div>
                <div className="row">
 <div className="col-md-4 mb-3">
      <label>Age</label>
      <input
        type="number"
        name="age"
        className="form-control"
        value={formData.age}
        onChange={handleChange}
      />
    </div>
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
                   <div className="col-md-4 mb-3">
      <label>Address</label>
      <textarea
        type="text"
        name="address"
        className="form-control"
        value={formData.address}
        onChange={handleChange}
      />
    </div>
               </div>
               <div className="row">
                  <div className="col-md-4 mb-3">
                    <label>Mobile No </label>
                    <input
                      type="text"
                      name="mobile_no"
                      className="form-control"
                      maxLength="10"
                      value={formData.mobile_no}
                      onChange={handleChange}
                      
                    />
                  </div>
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
                  </div>
                <div className="row">
                 
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

                  
                  
   <div className="col-md-4 mb-3">
      <label>Blood Group</label>
      <input
        type="text"
        name="blood_group"
        className="form-control"
        value={formData.blood_group}
        onChange={handleChange}
      />
    </div>

                </div>

  <div className="row">
    
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

    <div className="col-md-4 mb-3">
      <label>Medical History</label>
      <textarea
        name="medical_history"
        className="form-control"
        value={formData.medical_history}
        onChange={handleChange}
        rows="3"
      ></textarea>
    </div>

  </div>

 

                {/* ---------------- Submit Button ---------------- */}
               <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
  <button
    type="submit"
    className="btn btn-secondary"
   
  >
    Submit
  </button>
</div>

              </form>
            </div>
          </div>
        </div>
        <p>

        </p>
       
      </div>
    </div>
  );
}

export default ProfilePage;
