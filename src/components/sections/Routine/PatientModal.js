import React, { useEffect, useState } from "react";
import {
  addPatientApi,
  updatePatientApi,
  getPatientByIdApi,
  getclinicianApi
} from "../../api/endpoint";
import "./patient.css";

const PatientModal = ({ editId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    patient_name: "",
    age: "",
    mobile_no: "",
    email_id: "",
    sex: "",
    category: "",
    address: "",
    medical_history: "",
    remarks: "",
    hospital_id: "",
   // created_by: ""
  });

  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    // Fetch clinicians (provides hospital + doctor info)
    getclinicianApi()
      .then(res => {
        const list = res.data?.data || res.data || [];
        setHospitals(Array.isArray(list) ? list : []);
      })
      .catch(err => console.error("Error fetching clinicians:", err));
  }, []);

  useEffect(() => {
    if (editId) {
      getPatientByIdApi(editId).then(res => {
        setForm({
          patient_name: res.data.patient_name || "",
          age: res.data.age || "",
          mobile_no: res.data.mobile_no || "",
          email_id: res.data.email_id || "",
          sex: res.data.sex || "",
          category: res.data.category || "",
          address: res.data.address || "",
          medical_history: res.data.medical_history || "",
          remarks: res.data.remarks || "",
          hospital_id: res.data.hospital_id || "",
         // created_by: res.data.created_by || ""
        });
      });
    }
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const apiCall = editId
      ? updatePatientApi(editId, form)
      : addPatientApi(form);

    apiCall
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="modal-backdrop-p">
      <div className="modal-box-p">
        <div className="modal-header-p">
          {editId ? "Update Patient" : "Add Patient"}
        </div>

        <div className="modal-body-p">
          <input
            name="patient_name"
            placeholder="Patient Name"
            value={form.patient_name}
            onChange={handleChange}
          />

          <input
            name="mobile_no"
            placeholder="Mobile Number"
            value={form.mobile_no}
            onChange={handleChange}
          />

          <input
            name="age"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
          />

          <input
            name="email_id"
            placeholder="Email ID"
            value={form.email_id}
            onChange={handleChange}
          />

          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="hospital_id"
            value={form.hospital_id}
            onChange={handleChange}
          >
            <option value="">Select Hospital / Doctor</option>
            {Array.isArray(hospitals) && hospitals.map(h => (
              <option key={h.id} value={h.id}>
                {`${h.hospital_name || h.hospital || h.name || ""}${h.doctor_name || h.doctor ? ` - ${h.doctor_name || h.doctor}` : ""}`}
              </option>
            ))}
          </select>

         
          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
          />

          <textarea
            name="medical_history"
            placeholder="Medical History"
            value={form.medical_history}
            onChange={handleChange}
          />

          <textarea
            name="remarks"
            placeholder="Remarks"
            value={form.remarks}
            onChange={handleChange}
          />

          
        </div>

        <div className="modal-footer-p">
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </button>
          <button className="modal-btn-p cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;
