import React, { useEffect, useState } from 'react'; 
import Breadcrumb from '../../layouts/Breadcrumb';
import DataTable from 'react-data-table-component';
import { 
  addSpecimenTypeApi,
  getSpecimenList,
  getSpecimenTypeApi,
  deleteSpecimenTypeApi,
  updateSpecimenTypeApi 
} from '../../api/endpoint';
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import '../test-list/test.css';
const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#ffffff", // Header background
      color: "#000",
      fontWeight: "600",
    },
  },
  cells: {
    style: (row) => ({
      backgroundColor: "#ffffff",   // Row background
      color: "#000",
    }),
  },
};

function SpecimenType() {

  const [specimens, setSpecimens] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null); 
  const [loading, setLoading] = useState(false);
const [search, setSearch] = useState("");
const [page, setPage] = useState(1);
const [totalRows, setTotalRows] = useState(0);
const pageSize = 10;
useEffect(() => {
  fetchSpecimens();
}, [search, page]);

  const fetchSpecimens = async () => {
  setLoading(true);
  try {
    const res = await getSpecimenList(search, page, pageSize);

    setSpecimens(res.data.data);
    setTotalRows(res.data.total);
  } catch (error) {
    console.error(error);
    alert("Failed to load specimen types");
  }
  setLoading(false);
};


  // Add or Update Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter specimen type");
      return;
    }

    try {
      if (editId) {
        // Update
        await updateSpecimenTypeApi(editId, { name });
        alert("Specimen Type Updated Successfully");
      } else {
        // Add
        await addSpecimenTypeApi({ name });
        alert("Specimen Type Added Successfully");
      }
      setName("");
      setEditId(null);
      fetchSpecimens();
    } catch (error) {
      console.error(error);
      alert("Error saving specimen type");
    }
  };

  // Load selected row for edit
  const handleEdit = async (id) => {
    try {
      const res = await getSpecimenTypeApi(id);
      setName(res.data.data.name);
      setEditId(id);
    } catch (error) {
      console.error(error);
      alert("Failed to load record");
    }
  };

  // Soft Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await deleteSpecimenTypeApi(id);
      alert("Specimen Type Deleted");
      fetchSpecimens();
    } catch (error) {
      console.error(error);
      alert("Failed to delete specimen type");
    }
  };

const columns = [
  {
    name: "S.No",
    selector: row => row.id,
    center: true,
    width: "80px", // small fixed width
  },
  {
    name: "Specimen Name",
    selector: row => row.name,
    center: true,
    // remove fixed width
  },
  {
    name: "Actions",
    center:true,
    cell: row => (
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <FiEdit
          style={{ cursor: "pointer",color: "#246932ff" }}
          onClick={() => handleEdit(row.id)}
          size={18}
        />
        <FiTrash2
          style={{ cursor: "pointer", color: "#3366cc" }}
          onClick={() => handleDelete(row.id)}
          size={18}
        />
      </div>
    ),
    width: "140px",
  }
];



  return (
    <div className="ms-content-wrapper">
      <div className="row">
        <Breadcrumb pageprev={'Test'} pagecurrent={'Specimen Type'} />

        <div className="col-md-12">
          <div className="ms-panel">

            {/* Panel Header */}
            <div className="ms-panel-header d-flex justify-content-between">
              <h6>Specimen Type</h6>
            </div>

            {/* ADD / UPDATE FORM */}
            <div className="ms-panel-body">
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="row">
                  <div className="col-md-4">
                    <label>Specimen Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter specimen type"
                    />
                  </div>

                  <div className="col-md-2 d-flex align-items-end">
                    <button type="submit" className="btn btn-success w-100">
                      {editId ? "Update" : "Add"}  
                    </button>
                  </div>

                  {editId && (
                    <div className="col-md-2 d-flex align-items-end">
                      <button 
                        type="button" 
                        className="btn btn-secondary w-100"
                        onClick={() => { setName(""); setEditId(null); }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </form>

<div>
    <div className="row mb-3">
  <div className="col-md-12 d-flex justify-content-end">
    <input 
      type="text"
      className="form-control w-25" // width 25% of container
      placeholder="Search specimen type..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1); // reset to first page
      }}
    />
  </div>
</div>

 <DataTable
  columns={columns}
  data={specimens}
  progressPending={loading}
  pagination
  paginationServer
  paginationTotalRows={totalRows}
  onChangePage={(p) => setPage(p)}
  highlightOnHover
  striped
  noHeader
  customStyles={customStyles}
/>


</div>
              {/* DATA TABLE */}
             
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SpecimenType;
