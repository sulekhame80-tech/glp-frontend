import React, { useState, useEffect } from "react";
import { getTechnicianApi,updatetechnicianApi } from "../../api/endpoint";
import Breadcrumb from "../../layouts/Breadcrumb";
import UserTable from "./Usertable";
function ProfilePage() {
  const loggedInUser = localStorage.getItem("user_name") ;
const loggedInUserRole = localStorage.getItem("user_role") ;
console.log("role with name", loggedInUserRole, loggedInUser)

  const [formData, setFormData] = useState({
    email: "",
    mobile_no: "",
    bank_name: "",
    account_no: "",
    branch_name: "",
    ifsc_code: "",
    saving_current: "",
    gst: "",
    age:"",
    technician_name:"",
    medical_history:"",
     blood_group:"",
     address:"",
    created_by: loggedInUser,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, created_by: loggedInUser }));
  }, [loggedInUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // -------------------- SUBMIT FUNCTION WITH API CALL --------------------
const handleSubmit = async (e) => { 
  e.preventDefault();

  if (!formData.technician_name || !formData.email || !formData.mobile_no) {
    alert("Please fill required fields");
    return;
  }

  const payload = {
    username: loggedInUser,   // IMPORTANT!

    // LOGIN table fields
    email: formData.email,
    mobile_no: formData.mobile_no,
    bank_name: formData.bank_name,
    account_no: formData.account_no,
    branch_name: formData.branch_name,
    ifsc_code: formData.ifsc_code,
    saving_current: formData.saving_current,
    gst: formData.gst,

    // TECHNICIAN table
    technician_name: formData.technician_name,
    email_id: formData.email,
    age: formData.age,
    address: formData.address,
    medical_history: formData.medical_history,
    blood_group: formData.blood_group,

    modified_by: loggedInUser,
  };

  try {
    const response = await updatetechnicianApi(payload);
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
                      required
                    />
                  </div>*/}
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
      <label>Age</label>
      <input
        type="number"
        name="age"
        className="form-control"
        value={formData.age}
        onChange={handleChange}
      />
    </div>
                </div>

  <div className="row">
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
       <UserTable/>*/}
      </div>
    </div>
  );
}

export default ProfilePage;
