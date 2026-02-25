import React, { useEffect, useState } from "react";
import Breadcrumb from "../../layouts/Breadcrumb";
import { FiEdit, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MASTER_CONFIG } from "./masterconfig";

function MasterPage() {
  const [selectedMaster, setSelectedMaster] = useState("specimen");
  const config = MASTER_CONFIG[selectedMaster];

  const [data, setData] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // fixed page size
  const [totalRows, setTotalRows] = useState(0);

  const [search, setSearch] = useState("");

  /* -------------------- DERIVED VALUES -------------------- */
 const hasNextPage = data.length === pageSize;

  /* -------------------- EFFECTS -------------------- */

  useEffect(() => {
    setFormValues({});
    setEditId(null);
    setPage(1);
  }, [selectedMaster]);

  useEffect(() => {
    fetchList();
  }, [selectedMaster, page, pageSize, search]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  /* -------------------- API -------------------- */

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await config.api.list(search, page, pageSize);
      const results = res.data.results || res.data.data || [];

      setData(
        results.map(item => ({
          ...item,
          business_type: item.bussiness_type,
        }))
      );

      setTotalRows(res.data.count || 0);
    } catch (err) {
      console.error("Fetch error", err);
      setData([]);
      setTotalRows(0);
    }
    setLoading(false);
  };

  /* -------------------- FORM -------------------- */

  const handleChange = (key, value) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = { ...formValues };

    if (payload.business_type !== undefined) {
      payload.bussiness_type = payload.business_type;
      delete payload.business_type;
    }

    if (editId) {
      await config.api.update(editId, payload);
    } else {
      await config.api.add(payload);
    }

    setFormValues({});
    setEditId(null);
    fetchList();
  };

  /* -------------------- ACTIONS -------------------- */

  const handleEdit = (row) => {
    const values = {};
    config.fields.forEach(field => {
      values[field.key] = row[field.key];
    });
    setFormValues(values);
    setEditId(row.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await config.api.delete(id);
    fetchList();
  };

  /* -------------------- RENDER -------------------- */

  return (
    <div className="ms-content-wrapper">
      <Breadcrumb pageprev="Master Tables" pagecurrent={config.title} />

      <div style={{ marginLeft: "20px" }}>
        {/* MASTER SELECT + SEARCH */}
        <div className="mb-3 d-flex gap-3">
          <select
          style={{marginRight: "10px"}}
            className="form-control w-25"
            value={selectedMaster}
            onChange={(e) => setSelectedMaster(e.target.value)}
          >
            <option value="specimen">Specimen Type</option>
            <option value="status">Status</option>
            <option value="category">Category</option>
            <option value="location">Location</option>
             <option value="salesperson">Salesperson</option>
          </select>

          <input
            className="form-control w-25"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="card shadow-sm p-4 mb-4">
          <div className="row g-3">
            {config.fields.map(field => (
              <div className="col-md-4" key={field.key}>
                <label className="form-label fw-semibold">
                  {field.label}
                </label>
                <input
                  className="form-control"
                  value={formValues[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required
                />
              </div>
            ))}

            <div className="col-md-2 d-flex align-items-end">
  <button
    style={{
      width: "70px",
      padding: "6px 10px",
      fontSize: "14px"
    }}
    className={`btn ${editId ? "btn-warning" : "btn-success"}`}
  >
    {editId ? "Update" : "Add"}
  </button>
</div>

          </div>
        </form>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                {config.fields.map(field => (
                  <th key={field.key} className="text-center">
                    {field.label}
                  </th>
                ))}
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={config.fields.length + 1} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={config.fields.length + 1} className="text-center">
                    No records found
                  </td>
                </tr>
              ) : (
                data.map(row => (
                  <tr key={row.id}>
                    {config.fields.map(field => (
                      <td key={field.key} className="text-center">
                        {row[field.key]}
                      </td>
                    ))}

                    <td className="text-center">
                      <FiEdit
                        className="me-3 text-primary cursor-pointer"
                        onClick={() => handleEdit(row)}
                      />
                      <FiTrash2
                        className="text-danger cursor-pointer"
                        onClick={() => handleDelete(row.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

       <div className="d-flex justify-content-between align-items-center mt-3">
  <div>
    Page {page}
    {totalRows > 0 && ` | Total ${totalRows}`}
  </div>

 <div className="d-flex align-items-center" style={{ gap: "4px" }}>
  <div
    className={`pagination-icon ${page === 1 ? "disabled" : ""}`}
    onClick={() => page !== 1 && setPage(p => p - 1)}
  >
    <FiChevronLeft size={18} />
  </div>

  <div
    className={`pagination-icon ${!hasNextPage ? "disabled" : ""}`}
    onClick={() => hasNextPage && setPage(p => p + 1)}
  >
    <FiChevronRight size={18} />
  </div>
</div>

</div>

      </div>
    </div>
  );
}

export default MasterPage;
