import React, { useEffect, useState, useContext } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { getAllHospitalsApi, importHospitalApi, deleteHospitalApi } from "../../api/endpoint";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { UserContext } from "../../../UserContext";

const SortIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 18L6 12L18 12L12 18Z"
      fill="currentColor"
    />
  </svg>
);

const Latestproducts = () => {
  const { role, location } = useContext(UserContext);

  console.log("⭐ Latestproducts → Role:", role);
  console.log("⭐ Latestproducts → Location:", location);

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [excelFile, setExcelFile] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const pageSize = 6;
  const [totalRows, setTotalRows] = useState(0);

  const fetchHospitals = async () => {

    setLoading(true);
    try {
      const res = await getAllHospitalsApi({
        page: page,
        page_size: pageSize,
        search: search,
        role: role,
        location: location
      });

      setHospitals(res.data.results || []);
      setTotalRows(res.data.count || 0);
    } catch (error) {
      console.error("❌ Error fetching hospitals:", error);
    }
    setLoading(false);
  };


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchHospitals();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  const columns = [
    {
      name: "Logo",
      selector: (row) => row.image,
      cell: (row) => (
        <img
          src={row.image ? `data:image/jpeg;base64,${row.image}` : "/no-image.jpg"}
          alt="hospital"
          style={{ width: 50, height: 50, borderRadius: 5 }}
        />
      ),
      width: "80px",
    },
    {
      name: "Hospital Name",
      selector: (row) => row.hospital_name,
      sortable: true,
    },
    {
      name: "Doctor Name",
      selector: (row) => row.doctor_name,
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city || "-",
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.location || "-",
      width: "250px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>

          {/* EDIT ICON WITH LINK */}
          <Link to={`/hospital/detail/${row.id}`}>
            <FiEdit
              style={{
                cursor: "pointer",
                marginRight: "20px",
                color: "#3366cc",
              }}
              size={18}
            />
          </Link>

          {/* DELETE ICON */}
          <FiTrash2
            style={{
              cursor: "pointer",
              color: "green",
            }}
            size={18}
            onClick={() => handleDelete(row)}
          />

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }

  ];

  const handleImport = async () => {
    if (!excelFile) {
      alert("Please choose an Excel file first!");
      return;
    }

    try {
      const response = await importHospitalApi(excelFile);   // FIXED
      console.log("Import Response:", response.data);
      alert(`Imported: ${response.data.created} rows`);
      setExcelFile(null);
      fetchHospitals();

    } catch (error) {
      console.error("Import Error:", error);
      alert("Failed to import Excel file.");
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete "${row.hospital_name}"?`)) {
      return;
    }

    try {
      await deleteHospitalApi(row.id);   // API Call
      alert("Hospital deleted successfully!");

      fetchHospitals(); // Refresh table
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete the hospital.");
    }
  };

  const handleExport = () => {
    if (hospitals.length === 0) {
      alert("No data to export!");
      return;
    }

    // Convert table data exactly with required column names
    const exportData = hospitals.map((row) => ({
      HospitalName: row.hospital_name || "",
      Address: row.city || "",  // Assuming 'city' is the address
      Phone: row.mobile_no || "",
      Email: row.email_id || "",
      City: row.city || "",
      BankName: row.bank_name || "",
      AccountNo: row.account_no || "",
      BranchName: row.branch_name || "",
      IFSC: row.ifsc_code || "",
      AccountType: row.saving_current || "",
      GST: row.gst || "",
      Location: row.location || "",
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Adjust column widths for better readability
    const columnWidths = [
      { wch: 25 }, // HospitalName
      { wch: 20 }, // Address
      { wch: 15 }, // Phone
      { wch: 30 }, // Email
      { wch: 15 }, // City
      { wch: 20 }, // BankName
      { wch: 20 }, // AccountNo
      { wch: 20 }, // BranchName
      { wch: 20 }, // IFSC
      { wch: 20 }, // AccountType
      { wch: 20 }, // GST
      { wch: 30 }, // Location
    ];

    worksheet["!cols"] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hospitals");

    // Generate excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Download file
    saveAs(new Blob([excelBuffer]), "Hospital_Master.xlsx");
  };

  return (
    <div className="col-md-12">
      <div className="ms-panel">
        <div className="ms-panel-header">
          <h6>Doctors & Hospitals</h6>
          <p>All Registered Hospitals</p>
        </div>
        <div className="import-container">

          {/* Show file input + Import + Export ONLY for Super Admin or Manager */}
          {(role === "Super Admin" || role === "Manager") && (
            <>
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
                onClick={handleExport}
                className="btn-import"
              >
                Export
              </button>
            </>
          )}

          <div >
            <input
              type="text"
              placeholder="Search by hospital, doctor, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ width: "300px", display: "inline-block" }}
            />
          </div>

        </div>
        <div className="ms-panel-body">
          <DataTable
            columns={columns}
            data={hospitals}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={pageSize}
            onChangePage={(newPage) => setPage(newPage)}
            sortIcon={SortIcon}
            noHeader
            highlightOnHover
            striped
            dense
          />
        </div>
      </div>
    </div>
  );
};

export default Latestproducts;
