import React, { useEffect, useState } from 'react'; 
import Breadcrumb from '../../layouts/Breadcrumb';
import DataTable from 'react-data-table-component';
import { createTestApi,importTestMasterApi, getspecimenDropdownApi,getTestsApi, updateTestApi, deleteTestApi, getTestByIdApi } from '../../api/endpoint';
import Select from "react-select";

import { FiPlus } from "react-icons/fi";
import './test.css';
import * as XLSX from "xlsx";
function TestList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState(false);
const [excelFile, setExcelFile] = useState(null);

const [globalSearch, setGlobalSearch] = useState("");
const [formData, setFormData] = useState({
  test_name: "",
  test_code: "",
  category: "",
  methodology: "",
  tat: "",
 remarks: "",
  mrp: "",
  msp: "",
  b2b_price: ""
});

const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);
const [specimenList, setSpecimenList] = useState([]);
const [selectedSpecimen, setSelectedSpecimen] = useState([]);

const specimenIcons = (name) => {
  const lower = name.toLowerCase();

  if (lower.includes("blood")) return "💧";
  if (lower.includes("urine") || lower.includes("fluid")) return "🧪";
  if (lower.includes("pregnancy") || lower.includes("maternal")) return "🤰";
  if (lower.includes("dna") || lower.includes("genetic")) return "🧬";
  if (lower.includes("culture") || lower.includes("microbiology")) return "🧫";
  if (lower.includes("stool")) return "🚽";

  return "🧪"; // default icon
};

useEffect(() => {
  getspecimenDropdownApi().then(res => {
    setSpecimenList(res.data.data);
  });
}, []);
const specimenOptions = specimenList.map(sp => ({
  value: sp.id,
  label: `${specimenIcons(sp.name)}  ${sp.name}`
}));

  // 🔹 Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // 🔹 Search State
  const [search, setSearch] = useState("");

  const fetchData = () => {
    setLoading(true);
const finalSearch = globalSearch || search;

    getTestsApi(page, pageSize, finalSearch)
      .then(res => {
        let result = res.data?.results?.data || [];

        setTests(result);
        setTotalRows(res.data?.count || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

;

 const columns = [
  { 
    name: "Category", 
    selector: row => row.category || "", 
    sortable: true ,
    minWidth: "150px"
  },

  { 
    name: "Test Name", 
    selector: row => row.test_name || "", 
    sortable: true ,minWidth: "220px"
  },

  { 
    name: "Test Code", 
    selector: row => row.test_code || "", 
    sortable: true 
  },

  { 
    name: "Methodology", 
    selector: row => row.methodology || "", 
    sortable: true 
  },

  { 
    name: "TAT", 
    selector: row => row.tat || "", 
    sortable: true 
  },

  {
    name: "Specimen Type",
    selector: row =>
  row.specimen_type
    ?.map(s => specimenIcons(s))
    .join(" ") || "",
width:"180px",
    sortable: false
  },
{
  name: "MRP",
  selector: row => row.mrp || "",
  sortable: true,
  minWidth: "100px",
},

{
  name: "MSP",
  selector: row => row.msp || "",
  sortable: true,
  minWidth: "100px",
},

{
  name: "B2B Price",
  selector: row => row.b2b_price || "",
  sortable: true,
  minWidth: "100px",
},

  {
    name: "Actions",
    cell: row => (
      <div data-tag="allowRowEvents" className="d-flex">
        <i
          className="fas fa-edit ms-text-primary"
          style={{ cursor: "pointer", marginRight: "25px" }}
          onClick={() => handleEdit(row.id)}
        />
        <i
          className="far fa-trash-alt ms-text-danger"
          style={{ cursor: "pointer" }}
          onClick={() => handleDelete(row.id)}
        />
      </div>
    ),
    sortable: false
  }
];


  const handleDelete = async (id) => {
    if (!window.confirm("Confirm delete?")) return;
    await deleteTestApi(id);
    fetchData(); // Reload after delete
  };

 const handleEdit = async (id) => {
  try {
    const res = await getTestByIdApi(id);
    const data = res.data;

    setFormData({
      test_name: data.test_name,
      test_code: data.test_code,
      remarks: data.remarks || "",
      tat: data.tat,
      methodology: data.methodology,
      category: data.category,
      mrp: data.mrp || "",
      msp: data.msp || "",
      b2b_price: data.b2b_price || "",
    });

    // 👇 VERY IMPORTANT: store IDs only
    setSelectedSpecimen(data.specimen_type.map(sp => sp.id));

    setEditId(id);
    setIsEditing(true);
    setShowModal(true);

  } catch (err) {
    console.error(err);
  }
};

const handleImport = async () => {
  if (!excelFile) {
    alert("Please select an Excel file to import.");
    return;
  }

  const formData = new FormData();
  formData.append("file", excelFile);

  try {
    const res = await importTestMasterApi(formData);
    alert("Import Successful!");
    console.log(res.data);
    fetchData(); // refresh table
  } catch (err) {
    console.error(err);
    alert("Import Failed!");
  }
};

const handleSubmit = async () => {
  const payload = {
    ...formData,
    specimen_type: selectedSpecimen
  };

  try {
    if (isEditing) {
      await updateTestApi(editId, payload);
      alert("Updated successfully");
    } else {
      await createTestApi(payload);
      alert("Added successfully");
    }

    setShowModal(false);
    setIsEditing(false);
    setEditId(null);
    setSelectedSpecimen([]);
    fetchData();

  } catch (err) {
    console.error(err);
  }
};
const handleExport = () => {
  if (!tests || tests.length === 0) {
    alert("No data available to export!");
    return;
  }

  const exportData = tests.map(item => ({
  'Category': item.category || "",
  'Test Name': item.test_name || "",
  'Test Code': item.test_code || "",
  'Methodology': item.methodology || "",
  'TAT': item.tat || "",
  
  'Specimen Type': Array.isArray(item.specimen_type)
    ? item.specimen_type.join(", ")
    : "",
    'MRP': item.mrp || "",
  'MSP': item.msp || "",
  'B2B Price': item.b2b_price || "",
  'Remarks': item.remarks || ""
}));


  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "TestMaster");
  XLSX.writeFile(wb, "TestMaster.xlsx");
};


useEffect(() => {
  const handleGlobalSearch = (event) => {
    const value = event.detail;
    setGlobalSearch(value);
    setPage(1);
  };

  window.addEventListener("globalSearch", handleGlobalSearch);

  return () => {
    window.removeEventListener("globalSearch", handleGlobalSearch);
  };
}, []);

  return (
    <div className="ms-content-wrapper">
      <div className="row">
        <Breadcrumb pageprev={'Test'} pagecurrent={'Test List'} />
        <div className="col-md-12">
          <div className="ms-panel">
            <div className="ms-panel-header d-flex justify-content-between">
              <h6>Test List</h6>
<div className="search-add-container-test">
              {/* 🔍 Search Input */}
              <input
                type="text"
                placeholder="Search Test..."
                className="search-input-test"
onChange={(e) => {
    setSearch(e.target.value);
    setPage(1);
  }}    />
              <i
  className="fas fa-plus-circle ms-text-primary"
  style={{ fontSize: "25px", marginLeft: "20px", cursor: "pointer" }}
  onClick={() => setShowModal(true)}
></i>
</div>
<div className="import-container">

  <label className="custom-file-upload">
   ⬆ <input
      type="file"
      accept=".xlsx, .xls"
      onChange={(e) => setExcelFile(e.target.files[0])}
    />
   
  </label>

  <button
    onClick={handleImport}
    className="btn-import"
  >
     Import
  </button>
 <button
  onClick={handleExport}  // ✅ Correct React syntax
  className="btn-import"
>
  Export
</button>

 

</div>

            </div>

            <div className="ms-panel-body">
              <div className="table-responsive">
                <DataTable
                  columns={columns}
                  data={tests}
                  progressPending={loading}
                  pagination
                  paginationServer   // 🔹 BACKEND PAGINATION
                  paginationTotalRows={totalRows}
                  onChangePage={(p) => setPage(p)}
                  highlightOnHover
                  striped
                   noHeader 
              customStyles={{
      table: {
        style: {
          backgroundColor: "#9cefee",
        },
      },
      headRow: {
        style: {
          backgroundColor: "#9cefee",
        },
      },
      rows: {
        style: {
          backgroundColor: "#9cefee",
        },
      },
    }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
     {showModal && (
  <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog">
     <div className="modal-content" style={{width:"700px"}}>

  <div className="modal-header">
    <h5 className="modal-title">{isEditing ? "Update Test" : "Add Test"}</h5>
    <button className="close" onClick={() => setShowModal(false)}>×</button>
  </div>

 <div className="modal-body">

  {/* ROW 1: Category - Methodology - TAT */}
  <div className="row mt-3">

    <div className="col-md-4">
      <div className="form-group">
        <label>Category</label>
        <input
          className="form-control"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="form-group">
        <label>Test Name*</label>
        <input
          className="form-control"
          value={formData.test_name}
          onChange={(e) =>
            setFormData({ ...formData, test_name: e.target.value })
          }
        />
      </div>
    </div>

    <div className="col-md-4">
      <div className="form-group">
        <label>Test Code*</label>
        <input
          className="form-control"
          value={formData.test_code}
          onChange={(e) =>
            setFormData({ ...formData, test_code: e.target.value })
          }
        />
      </div>
    </div>

   
  </div>

  {/* ROW 2: Test Name - Test Code */}
  <div className="row mt-3">

    

	{/* Specimen Type (MANY-TO-MANY) */}
   
 <div className="col-md-4">
      <div className="form-group">
        <label>Methodology</label>
        <input
          className="form-control"
          value={formData.methodology}
          onChange={(e) =>
            setFormData({ ...formData, methodology: e.target.value })
          }
        />
      </div>
    </div>

    <div className="col-md-4">
      <div className="form-group">
        <label>TAT</label>
        <input
          className="form-control"
          value={formData.tat}
          onChange={(e) =>
            setFormData({ ...formData, tat: e.target.value })
          }
        />
      </div>
    </div>
<div className="col-md-4">
    <div className="form-group">
      <label>Remarks</label>
      <input
        className="form-control"
        rows="3"
        value={formData.remarks || ""}
        onChange={(e) =>
          setFormData({ ...formData, remarks: e.target.value })
        }
        placeholder="Enter remarks"
      />
    </div>
  </div>

  </div>
 <div className="row mt-3">
  <div className="col-md-4">
    <label>MRP</label>
    <input
      className="form-control"
      value={formData.mrp}
      onChange={(e) =>
        setFormData({ ...formData, mrp: e.target.value })
      }
      placeholder="Enter MRP"
    />
  </div>

  <div className="col-md-4">
    <label>MSP</label>
    <input
      className="form-control"
      value={formData.msp}
      onChange={(e) =>
        setFormData({ ...formData, msp: e.target.value })
      }
      placeholder="Enter MSP"
    />
  </div>

  <div className="col-md-4">
    <label>B2B Price</label>
    <input
      className="form-control"
      value={formData.b2b_price}
      onChange={(e) =>
        setFormData({ ...formData, b2b_price: e.target.value })
      }
      placeholder="Enter B2B Price"
    />
  </div>
</div>

  {/* ROW 3: Remarks */}
<div className="row mt-3">
  <div className="col-md-12">
  <div className="form-group">
    <label>Specimen Type</label>
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      isMulti
      options={specimenList.map((sp) => ({
        value: sp.id,
        label: sp.name,
      }))}
      value={selectedSpecimen.map((id) => {
  const found = specimenList.find((sp) => sp.id === id);
  return found ? { value: found.id, label: found.name } : null;
}).filter(Boolean)}

      onChange={(selectedOptions) => {
        const values = selectedOptions
          ? selectedOptions.map((opt) => opt.value)
          : [];
        setSelectedSpecimen(values);
      }}
      placeholder="Select Specimen Type"
    />
  </div>
</div>
</div>


</div>


  <div className="modal-footer">
    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
    <button className="btn btn-primary" onClick={handleSubmit}>
      {isEditing ? "Update" : "Save"}
    </button>
  </div>

</div>

    </div>
  </div>
)}

    </div>
  );
}

export default TestList;
