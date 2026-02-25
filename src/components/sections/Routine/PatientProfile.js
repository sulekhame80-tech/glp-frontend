import React, { useEffect, useState } from "react";
import {
  deletePatientApi,
  getPatientListApi
} from "../../api/endpoint";
import PatientModal from "./PatientModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./patient.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PatientProfile = () => {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size] = useState(10); // records per page
  const [totalPages, setTotalPages] = useState(1);

  const loadPatients = () => {
    getPatientListApi(search, page, size)
      .then(res => {
        setPatients(res.data.data);
        setTotalPages(res.data.total_pages);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadPatients();
  }, [search, page]);

  const handleAdd = () => {
    setEditId(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this patient?")) return;
    deletePatientApi(id).then(() => loadPatients());
  };

  return (
    <div className="routine-main-container">
      <div className="patient-header">
        <h3>Patient List</h3>
        <button className="btn btn-primary"  onClick={handleAdd}>
          + Add Patient
        </button>
      </div>

      <div className="patient-search">
        <input
        style={{width:"300px",height:"35px",borderRadius:"5px",borderColor:"#127405ff",paddingLeft:"10px"}}
          type="text"
          placeholder="Search by any field..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
<p></p>
        <table className="routine-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.patient_name}</td>
              <td>{p.mobile_no}</td>
              <td>{p.email_id}</td>
              <td className="action-cell">
                <FaEdit
                 
                  style={{ cursor: "pointer", marginRight: "10px",color:"#127405ff" }}
                  onClick={() => handleEdit(p.id)}
                />
                <FaTrash
                 
                  style={{ cursor: "pointer", color: "red",color:"#127405ff" }}
                  onClick={() => handleDelete(p.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
<p></p>
   
<div className="custom-pagination">
  <FaChevronLeft
    className={`page-icon ${page === 1 ? "disabled-icon" : ""}`}
    onClick={() => page > 1 && setPage(prev => prev - 1)}
  />
  <span className="page-info">{page} / {totalPages}</span>
  <FaChevronRight
    className={`page-icon ${page === totalPages ? "disabled-icon" : ""}`}
    onClick={() => page < totalPages && setPage(prev => prev + 1)}
  />
</div>


      {showModal && (
        <PatientModal
          editId={editId}
          onClose={() => setShowModal(false)}
          onSuccess={loadPatients}
        />
      )}
    </div>
  );
};

export default PatientProfile;
