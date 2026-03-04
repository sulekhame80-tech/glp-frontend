import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FiDownload, FiUpload, FiPrinter } from "react-icons/fi"; // Feather icons
import { columns } from "../../../data/orderlist";
import { getAllordersApi, addOrderApi, getOrderByIdApi, downloadGmailExcelApi, updateOrderApi, deleteOrderApi } from "../../../api/endpoint";
import './order.css';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { FiPlus } from "react-icons/fi";
import { getTestDropdownApi, getclinicianApi } from "../../../api/endpoint";

function Orderslist() {

  const [orderData, setOrderData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchOrders(1, searchText);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page, searchText);
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  useEffect(() => {
    fetchDropdowns();
  }, []);

  const [testOptions, setTestOptions] = useState([]);
  const [clinicianOptions, setClinicianOptions] = useState([]);

  // --- fetch once on mount -------------------
  useEffect(() => {
    fetchDropdowns();
  }, []);

  // --- helper to normalize different API shapes ----
  function normalizeArrayResponse(apiData) {
    if (!apiData) return [];
    if (Array.isArray(apiData)) return apiData;
    // common shapes: { results: [...] } or { data: [...] } or { items: [...] }
    if (Array.isArray(apiData.results)) return apiData.results;
    if (Array.isArray(apiData.data)) return apiData.data;
    if (Array.isArray(apiData.items)) return apiData.items;
    // maybe the array is nested deeper, try to find first array value
    for (const key of Object.keys(apiData)) {
      if (Array.isArray(apiData[key])) return apiData[key];
    }
    return []; // fallback
  }

  // --- fetch dropdowns -----------------------
  const fetchDropdowns = async () => {
    try {
      const [testRes, clinicianRes] = await Promise.all([
        getTestDropdownApi(),
        getclinicianApi(),
      ]);

      // DEBUG - uncomment if you need to inspect what API returns
      // console.log("testRes.data:", testRes?.data);
      // console.log("clinicianRes.data:", clinicianRes?.data);

      const tests = normalizeArrayResponse(testRes?.data);
      const clinicians = normalizeArrayResponse(clinicianRes?.data);

      setTestOptions(tests);
      setClinicianOptions(clinicians);
    } catch (err) {
      console.error("Dropdown load error", err);
      setTestOptions([]);
      setClinicianOptions([]);
    }
  };


  const fetchOrders = async (page = 1, search = "") => {
    try {
      const response = await getAllordersApi(page, search);

      // Map each row to include 'id' from backend
      setOrderData(
        response.data.results.map((row) => ({
          ...row,
          id: row.id, // <-- must exist and match DB primary key
        }))
      );
      setTotalRows(response.data.count);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };



  const [isSyncing, setIsSyncing] = useState(false);

  const handleFetchFromGmail = async () => {
    setIsSyncing(true);
    try {
      await downloadGmailExcelApi();
      fetchOrders(currentPage, searchText);
      alert("✔ Gmail data uploaded successfully!");
    } catch (error) {
      console.error("Error syncing Gmail data:", error);
      alert("Failed to sync Gmail data.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePrint = () => {
    if (!orderData || orderData.length === 0) {
      alert("No data available to print!");
      return;
    }

    // Build printable HTML table
    let tableHTML = `
    <html>
    <head>
      <title>Print Orders</title>
      <style>
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        table, th, td {
          border: 1px solid #333;
          padding: 8px;
          text-align: left;
        }
        th {
          background: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <h3>Orders List</h3>
      <table>
        <thead>
          <tr>
            ${columns.map(c => `<th>${c.name}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${orderData
        .map(row => {
          return `
              <tr>
                ${columns
              .map(col => {
                let value =
                  typeof col.selector === "function"
                    ? col.selector(row)
                    : row[col.selector] ?? "";
                return `<td>${value}</td>`;
              })
              .join("")}
              </tr>`;
        })
        .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

    // Open print window
    const printWindow = window.open("", "_blank");
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };


  const handleExport = async () => {
    try {
      if (!orderData || orderData.length === 0) {
        alert("No data available to export!");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Orders");

      // HEADER
      sheet.addRow(columns.map(col => col.name));

      // DATA ROWS
      orderData.forEach(row => {
        const rowData = columns.map(col => {
          if (typeof col.selector === "function") {
            return col.selector(row);   // ✅ correctly extract with function
          }
          return row[col.selector] ?? "";
        });
        sheet.addRow(rowData);
      });

      // Auto column width
      sheet.columns.forEach(col => {
        col.width = 20;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "orders_list.xlsx");

    } catch (error) {
      console.error("Excel Export Error:", error);
      alert("Failed to export Excel.");
    }
  };
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0]; // keeps YYYY-MM-DD
  };

  const handleEdit = async (row) => {
    try {
      const response = await getOrderByIdApi(row.id);
      const data = response.data;

      setFormData({
        ...data,
        order_booking_date: formatDateForInput(data.order_booking_date),
        expected_report_date: formatDateForInput(data.expected_report_date),
        history: data.history || null,
      });

      setShowForm(true);
    } catch (error) {
      console.error("Failed to fetch order by ID:", error);
      alert("Failed to fetch order details.");
    }
  };


  const handleDelete = async (row) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrderApi(row.id); // your API call
        alert("Order deleted successfully");
        fetchOrders(currentPage, searchText);
      } catch (error) {
        console.error("Delete error", error);
        alert("Failed to delete order");
      }
    }
  };

  const formFields = [
    { key: "patient_name", label: "Patient Name", type: "text" },
    { key: "mobile_no", label: "Mobile Number", type: "text" },
    { key: "sample_id", label: "Sample ID", type: "text" },
    { key: "history", label: "Patient History", type: "text" },
    { key: "customer_name", label: "Customer Name", type: "text" },
    { key: "clinician_name", label: "Clinician Name", type: "text" },
    { key: "test_name", label: "Test Name", type: "text" },
    { key: "order_booking_date", label: "Order Booking Date", type: "date" },
    { key: "expected_report_date", label: "Expected Report Date", type: "date" },
    { key: "order_id", label: "Order ID", type: "text" },
  ];
  const handleSubmit = async () => {
    try {
      // Clone formData
      const submitData = { ...formData };

      // Remove the history field if it's empty or a FileList
      if (submitData.history instanceof File) {
        const reader = new FileReader();
        reader.readAsDataURL(submitData.history);

        reader.onloadend = async () => {
          const base64String = reader.result.split(",")[1];
          submitData.history = base64String; // ✅ string for backend
          await saveData(submitData);
        };
      } else if (typeof submitData.history === "string") {
        // keep existing base64
        await saveData(submitData);
      } else {
        // history is empty or not a file → remove the key so backend sees nothing
        delete submitData.history;
        await saveData(submitData);
      }

      async function saveData(dataToSend) {
        if (formData.id) {
          console.log("Update payload:", dataToSend);
          await updateOrderApi(formData.id, dataToSend);
          alert("✔ Order updated successfully!");
        } else {
          console.log("Add payload:", dataToSend);
          await addOrderApi(dataToSend);
          alert("✔ Order added successfully!");
        }
        fetchOrders(currentPage, searchText);
        setShowForm(false);
        setFormData({});
      }

    } catch (error) {
      console.error(
        "Save Order Error:",
        error.response?.data || error.message || error
      );
      alert("Failed to save order. Check console for details.");
    }
  };


  const enhancedOrderData = orderData.map(order => ({
    ...order,
    onEdit: handleEdit,
    onDelete: handleDelete,
  }));

  return (
    <div className="col-md-12">
      <div className="ms-panel">
        {showForm && (
          <div className="modal-backdrop">
            <div className="modal-box">
              <h4>Add New Order</h4>

              <div className="row g-3">
                {formFields.map((field) => (
                  <div className="col-md-4" key={field.key}>
                    <label><strong>{field.label}</strong></label>

                    {field.key === "history" ? (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={(e) =>
                            setFormData({ ...formData, [field.key]: e.target.files[0] })
                          }
                        />
                        {formData.history && typeof formData.history === "string" && (
                          <img
                            src={`data:image/jpeg;base64,${formData.history}`}
                            alt="History"
                            style={{ width: "100px", marginTop: "5px", border: "1px solid #ccc" }}
                          />
                        )}
                      </>
                    ) : field.key === "test_name" ? (
                      <select
                        className="form-control"
                        value={formData.test_name || ""}
                        onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                      >
                        <option value="">Select Test Name</option>

                        {Array.isArray(testOptions) && testOptions.length > 0 ? (
                          testOptions.map((item, i) => {
                            // Use formatted label [test_code] - test_name as both label and value
                            const value = `[${item.test_code}] - ${item.test_name}`;
                            const label = `[${item.test_code}] - ${item.test_name}`;
                            return (
                              <option key={item.id ?? i} value={value}>
                                {label}
                              </option>
                            );
                          })
                        ) : (
                          <option value="" disabled>
                            Loading...
                          </option>
                        )}
                      </select>


                    ) : field.key === "clinician_name" ? (
                      <select
                        className="form-control"
                        value={formData.clinician_name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, clinician_name: e.target.value })
                        }
                      >
                        <option value="">Select Clinician</option>

                        {Array.isArray(clinicianOptions) && clinicianOptions.length > 0 ? (
                          clinicianOptions.map((item, i) => (
                            <option key={i} value={item.doctor_name}>
                              {item.doctor_name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            Loading...
                          </option>
                        )}
                      </select>


                    ) : (
                      <input
                        type={field.type}
                        className="form-control"
                        value={formData[field.key] || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.key]: e.target.value })
                        }
                      />
                    )}
                  </div>
                ))}

              </div>

              <div className="text-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setShowForm(false)}
                  style={{ marginRight: "10px" }}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={() => handleSubmit()}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}


        <div className="ms-panel-header">
          <h6>Order List</h6>
        </div>
        <div className="ms-panel-body">
          <div className="d-flex justify-content-end mb-3 icon-group">
            <input
              style={{ marginTop: '5px' }}
              type="text"
              className="form-control w-25"
              placeholder="Search orders..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {/* Add New Order */}
            <div
              className="icon-btn "
              style={{ color: "white", background: "linear-gradient(to bottom left, #0066ff 1%, #31c7d4 83%)" }}
              title="Add New Order"
              onClick={() => setShowForm(true)}
            >
              <FiPlus size={20} />
            </div>

            {/* Import */}

            <div
              className={`icon-btn bg-success text-white ${isSyncing ? "disabled" : ""}`}
              title={isSyncing ? "Syncing..." : "Import Gmail Data"}
              onClick={!isSyncing ? handleFetchFromGmail : null}
              style={{ cursor: isSyncing ? "not-allowed" : "pointer" }}
            >
              {isSyncing ? (
                <div className="spinner-border spinner-border-mini" role="status">
                  {/* <span className="visually-hidden">Loading...</span> */}
                </div>
              ) : (
                <FiDownload size={20} />
              )}
            </div>

            {/* Export CSV */}
            <div
              className="icon-btn bg-warning text-white"
              style={{ background: 'linear-gradient(to bottom left, #00ffff 0%, #33cccc 89%)' }}
              title="Export Table Data"
              onClick={handleExport}
            >
              <FiUpload size={20} />
            </div>

            {/* Print */}
            <div
              className="icon-btn"
              style={{ color: "white", background: "linear-gradient(to bottom left, #006600 0%, #0066cc 89%)" }}
              title="Print Table"

              onClick={handlePrint}
            >
              <FiPrinter size={20} />
            </div>
          </div>


          <div id="orders-table">
            <DataTable
              columns={columns}
              data={enhancedOrderData}
              pagination
              responsive
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
  );
}

export default Orderslist;
