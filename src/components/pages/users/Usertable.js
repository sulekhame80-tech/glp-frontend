import React, { useState, useEffect } from "react";
import { getAllUsersApi, updateUserApi, deleteUserApi, locationDropdownApi } from "../../api/endpoint";
import DataTable from "react-data-table-component";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "./UserTable.css";
import Breadcrumb from "../../layouts/Breadcrumb";

function UserTable({ onEdit }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const [editUser, setEditUser] = useState(null); // Show form
  const [locations, setLocations] = useState([]); // Dropdown locations
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    mobile_no: "",
    password: "",
    role: "",
    location_id: "", // changed to location_id
    bank_name: "",
    account_no: "",
    branch_name: "",
    ifsc_code: "",
    saving_current: "",
    gst: "",
  });

  useEffect(() => {
    fetchUsers(page, search);
    fetchLocations();
  }, [page, search]);

  const fetchUsers = async (page, search) => {
    setLoading(true);
    try {
      const res = await getAllUsersApi(page, search);
      setUsers(res.results || []);
      setTotalRows(res.count || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const fetchLocations = async () => {
    try {
      const res = await locationDropdownApi();
      console.log("Fetched locations:", res.data);
      setLocations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "location_id" ? parseInt(value) || "" : value,
    });
  };

  const handleEdit = (row) => {
    setEditUser(row.id);
    setFormData({
      user_name: row.user_name || "",
      email: row.email || "",
      mobile_no: row.mobile_no || "",
      password: row.password || "",
      role: row.role || "",
      location_id: row.location_id || "",
      bank_name: row.bank_name || "",
      account_no: row.account_no || "",
      branch_name: row.branch_name || "",
      ifsc_code: row.ifsc_code || "",
      saving_current: row.saving_current || "",
      gst: row.gst || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserApi(id);
      alert("User deleted successfully!");
      fetchUsers(page, search);
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserApi(editUser, formData);
      alert("User updated successfully!");
      setEditUser(null);
      fetchUsers(page, search);
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

  const columns = [
    { name: "Username", selector: (row) => row.user_name, sortable: true },
    { name: "Password", selector: (row) => row.password },
    { name: "Role", selector: (row) => row.role },
    {
      name: "Edit",
      cell: (row) => (
        <FiEdit
          className="fas fa-edit ms-text-primary"
          style={{ cursor: "pointer", marginRight: "45px" }}
          size={18}
          onClick={() => handleEdit(row)}
        />
      ),
    },
    {
      name: "Delete",
      cell: (row) => (
        <FiTrash2
          style={{ cursor: "pointer", color: "#3366cc" }}
          size={18}
          onClick={() => handleDelete(row.id)}
        />
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "linear-gradient(to bottom left, #0f5c87 1%, #31c7d4 83%)",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
  };

  return (
    <div className="user-table-container">
      <Breadcrumb pageprev="Profile" pagecurrent=" Users Data" />
      {editUser && (
        <div className="col-md-12">
          <div className="ms-panel">
            <div className="ms-panel-header">
              <h6>Update User</h6>
            </div>

            <div className="ms-panel-body">
              <form onSubmit={handleUpdateSubmit}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label>Username *</label>
                    <input type="text" name="user_name" className="form-control" value={formData.user_name} onChange={handleChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Password</label>
                    <input type="text" name="password" className="form-control" value={formData.password} onChange={handleChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Role *</label>
                    <select name="role" className="form-control" value={formData.role} onChange={handleChange}>
                      <option value="">Select Role</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Email *</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Mobile No</label>
                    <input type="text" name="mobile_no" className="form-control" value={formData.mobile_no} onChange={handleChange} />
                  </div>

                  {/* LOCATION DROPDOWN */}
                  <div className="col-md-4 mb-3">
  <label>Location *</label>
  <select
    name="location_id"
    className="form-control"
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


                  <div className="col-md-4 mb-3">
                    <label>Bank Name</label>
                    <input type="text" name="bank_name" className="form-control" value={formData.bank_name} onChange={handleChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Account No</label>
                    <input type="text" name="account_no" className="form-control" value={formData.account_no} onChange={handleChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Branch Name</label>
                    <input type="text" name="branch_name" className="form-control" value={formData.branch_name} onChange={handleChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>IFSC Code</label>
                    <input type="text" name="ifsc_code" className="form-control" value={formData.ifsc_code} onChange={handleChange} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Account Type</label>
                    <select name="saving_current" className="form-control" value={formData.saving_current} onChange={handleChange}>
                      <option value="">Select Type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>
                  {formData.saving_current === "Current" && (
                    <div className="col-md-4 mb-3">
                      <label>GST Number</label>
                      <input type="text" name="gst" className="form-control" value={formData.gst} onChange={handleChange} />
                    </div>
                  )}
                </div>

                <div className="form-btn-row">
                  <button type="submit" className="btn btn-success" style={{ background: "linear-gradient(to bottom left, #0f5c87 1%, #31c7d4 83%)" }}>
                    Update
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => setEditUser(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="search-wrapper">
        <input type="text" placeholder="Search User..." onChange={(e) => setSearch(e.target.value)} className="search-box" />
      </div>

      <div className="table-wrapper">
        <DataTable
          columns={columns}
          data={users}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangePage={(page) => setPage(page)}
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}
        />
      </div>
    </div>
  );
}

export default UserTable;
