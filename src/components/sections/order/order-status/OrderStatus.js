import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FiDownload, FiUpload, FiPrinter, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getLabrecordApi, downloadGmailExcelApi, saveGmailOrderApi, deleteLabrecordApi, getUserLocationApi } from "../../../api/endpoint";
import './order.css';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import AssignTechnicianForm from "./Assigntech";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useContext } from "react";
import { UserContext } from "../../../../UserContext";
function OrderStatus() {
  const navigate = useNavigate();
  const { userName, role } = useContext(UserContext);
  console.log("user", userName, role);
  const [orderData, setOrderData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // <-- selected order
  const [loading, setLoading] = useState(false);
  const [gmailOrders, setGmailOrders] = useState([]);
  const [showGmailPopup, setShowGmailPopup] = useState(false);

  const handleUpdate = (row) => {
    setSelectedOrderId(row.order_id); // <-- pass order_id to form
  };
  const handleDelete = async (row) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await deleteLabrecordApi(row.id);  // row.id MUST exist in your table data

      alert("Record deleted successfully!");

      fetchOrders(currentPage, searchText); // refresh table
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete record.");
    }
  };
  const [userLocation, setUserLocation] = useState(""); // store location

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (!userName || !role) return;

      try {
        const response = await getUserLocationApi({ user_name: userName, role });
        console.log("User location response:", response.data);
        setUserLocation(response.data.location || "N/A");
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    fetchUserLocation();
  }, [userName, role]);
  const formatTestNames = (value) => {
    if (!value) return "";

    try {
      const parsed = JSON.parse(value.replace(/'/g, '"')); // Convert Python list → JS array
      return parsed.join("\n"); // Each test on a new line
    } catch (e) {
      return value;  // fallback
    }
  };

  // Columns defined in same file
  const NewColumns = [
    {
      name: "Order ID", selector: row => row.order_id || "", sortable: true, fixed: "left",
      minWidth: "150px"
    },
    {
      name: "Ack Date",
      minWidth: "150px", selector: row => row.order_ack_date ? row.order_ack_date.slice(0, 10) : ""
    },
    {
      name: "Patient Name",
      selector: row => row.patient_id__patient_name || "",
      minWidth: "180px",
      wrap: true,
      style: { whiteSpace: "normal" },
      resizable: true,
      minimizedWidth: "70px",
      expandedWidth: "180px",
    },
    { name: "Sales Person", selector: row => row.sales_person_name || "", minWidth: "150px", },
    { name: "Clinician", selector: row => row.clinician_id__doctor_name || "", minWidth: "150px", },
    {
      name: "Test Name",
      selector: row => formatTestNames(row.test_name),
      minWidth: "300px",
      wrap: true,
      style: {
        whiteSpace: "pre-line",
        lineHeight: "18px"
      },
    },

    { name: "Location", selector: row => row.location || "", minWidth: "150px" },
    { name: "Sample Status", selector: row => row.sample_status || "", minWidth: "150px" },
    { name: "Sample Type", selector: row => row.sample_type || "", minWidth: "150px" },

    { name: "Business Type", selector: row => row.business_type || "", minWidth: "150px" },
    { name: "Payment Status", selector: row => row.payment_status || "", minWidth: "150px" },
    { name: "Amount", selector: row => row.payment_received || "" },
    { name: "Sample Dispatch ", selector: row => row.sample_dispatch_date || "", minWidth: "150px", },
    { name: "Remarks", selector: row => row.remarks || "" },
    {
      name: "Actions",
      cell: row => (
        <div style={{ display: "flex", gap: "10px" }}>
          <FiEdit
            className="fas fa-edit ms-text-primary"
            style={{ cursor: "pointer", marginRight: "45px" }}

            onClick={() => handleUpdate(row)}
            size={18}
          />
          <FiTrash2
            style={{ cursor: "pointer", color: "#3366cc" }}
            onClick={() => handleDelete(row)}
            size={18}
          />

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: "100px"
    }
  ];

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchOrders(1, searchText);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  useEffect(() => {
    if (userLocation) {
      fetchOrders(currentPage, searchText);
    }
  }, [userLocation]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page, searchText);
  };


  const fetchOrders = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await getLabrecordApi(page, 10, search);
      let data = response.data.data || [];

      console.log("TABLE DATA:", data);

      // ⭐ FILTER DATA FOR EMPLOYEE ROLE
      if (role === "Employee" && userLocation) {
        data = data.filter(item =>
          item.location?.toLowerCase() === userLocation.toLowerCase()
        );
      }

      setOrderData(data);
      setTotalRows(data.length); // update count after filtering
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportGmail = async () => {
    setLoading(true);
    try {
      console.log("🚀 Starting Gmail Sync...");
      const response = await downloadGmailExcelApi();
      console.log("✅ Gmail Sync Success:", response.data);
      setGmailOrders(response.data.orders || []);
      setShowGmailPopup(true);
    } catch (error) {
      console.error("❌ Gmail Sync Error:", error);
      alert("Failed to sync Gmail orders. Please check backend console for authentication or errors.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGmailOrder = async (order) => {
    try {
      setLoading(true);
      await saveGmailOrderApi(order);
      alert(`Order ${order.order_id} saved successfully!`);
      setGmailOrders(prev => prev.filter(o => o.order_id !== order.order_id));
      fetchOrders(currentPage, searchText);
    } catch (error) {
      console.error("❌ Save Gmail Order Error:", error);
      alert("Failed to save order.");
    } finally {
      setLoading(false);
    }
  };


  const handlePrint = () => {
    if (!orderData || orderData.length === 0) return alert("No data available to print!");
    let tableHTML = `
      <html>
      <head>
        <title>Print Orders</title>
        <style>
          table { width:100%; border-collapse: collapse; font-size: 14px; }
          table, th, td { border:1px solid #333; padding:8px; text-align:left; color:black; }
          th { background:#f2f2f2; }
        </style>
      </head>
      <body>
        <h3>Order Status</h3>
        <table>
          <thead>
            <tr>${NewColumns.map(c => `<th>${c.name}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${orderData.map(row => `
              <tr>
                ${NewColumns.map(col => {
      const value = typeof col.selector === "function" ? col.selector(row) : row[col.selector] ?? "";
      return `<td>${value}</td>`;
    }).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleExport = async () => {
    try {
      if (!orderData || orderData.length === 0) return alert("No data available to export!");
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Orders");
      sheet.addRow(NewColumns.map(col => col.name));
      orderData.forEach(row => {
        const rowData = NewColumns.map(col => typeof col.selector === "function" ? col.selector(row) : row[col.selector] ?? "");
        sheet.addRow(rowData);
      });
      sheet.columns.forEach(col => col.width = 20);
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "orders_list.xlsx");
    } catch (error) {
      console.error("Excel Export Error:", error);
      alert("Failed to export Excel.");
    }
  };
  useEffect(() => {
    const headers = document.querySelectorAll(".rdt_TableCol");

    headers.forEach((header, index) => {
      if (!header.querySelector(".resize-handle")) {
        const handle = document.createElement("div");
        handle.className = "resize-handle";
        header.appendChild(handle);

        let startX = 0;
        let startWidth = 0;

        // --------------------------
        // 1️⃣ DRAG RESIZING (Smooth)
        // --------------------------
        handle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          startX = e.clientX;
          startWidth = header.offsetWidth;

          const onMouseMove = (moveEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);

            if (newWidth > 80) {
              header.style.width = `${newWidth}px`;

              const cells = document.querySelectorAll(
                `.rdt_TableRow > div:nth-child(${index + 1}), 
               .rdt_TableCell:nth-child(${index + 1})`
              );

              cells.forEach((cell) => {
                cell.style.width = `${newWidth}px`;
              });
            }
          };

          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });

        // ------------------------------------
        // 2️⃣ DOUBLE-CLICK => AUTO-EXPAND COLUMN
        // ------------------------------------
        handle.addEventListener("dblclick", () => {
          let maxWidth = 100;
          const cells = document.querySelectorAll(
            `.rdt_TableRow > div:nth-child(${index + 1}), 
           .rdt_TableCell:nth-child(${index + 1})`
          );

          cells.forEach((cell) => {
            maxWidth = Math.max(maxWidth, cell.scrollWidth + 40);
          });

          header.style.width = `${maxWidth}px`;
          cells.forEach((cell) => (cell.style.width = `${maxWidth}px`));
        });

        // ------------------------------------
        // 3️⃣ RIGHT-CLICK => AUTO-COLLAPSE COLUMN
        // ------------------------------------
        handle.addEventListener("contextmenu", (e) => {
          e.preventDefault();

          const collapsedWidth = 120;

          header.style.width = `${collapsedWidth}px`;

          const cells = document.querySelectorAll(
            `.rdt_TableRow > div:nth-child(${index + 1}), 
           .rdt_TableCell:nth-child(${index + 1})`
          );

          cells.forEach((cell) => {
            cell.style.width = `${collapsedWidth}px`;
          });
        });

      }
    });
  }, [orderData]);

  NewColumns.forEach(col => {
    if (col.resizable) {
      col.className = "resizable";
    }
  });


  return (
    <div className="col-md-12">
      {/* Gmail Verification Popup */}
      {showGmailPopup && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div className="modal-header-themed">
              <h6 className="mb-0">Gmail Orders Verification</h6>
              <button
                type="button"
                className="close text-white"
                onClick={() => setShowGmailPopup(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', lineHeight: 1 }}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body-themed">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="text-muted mb-0">Review and select orders to add to the database.</p>
                <span className="badge badge-primary">{gmailOrders.length} Orders Found</span>
              </div>

              <div className="table-responsive">
                <table className="table table-hover table-striped border">
                  <thead className="thead-light">
                    <tr>
                      <th>Sample ID</th>
                      <th>Patient Name</th>
                      <th>Clinician</th>
                      <th>Test Name</th>
                      <th>Booking Date</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gmailOrders.length > 0 ? (
                      gmailOrders.map((order, idx) => (
                        <tr key={idx}>
                          <td className="font-weight-bold text-primary">{order.sample_id}</td>
                          <td>{order.patient_name}</td>
                          <td>{order.clinician_name}</td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }} title={order.test_name}>
                              {order.test_name}
                            </div>
                          </td>
                          <td>{order.order_booking_date}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-success px-3"
                              onClick={() => handleSaveGmailOrder(order)}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">No orders found in recent emails.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer-themed">
              <button className="btn btn-secondary" onClick={() => setShowGmailPopup(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ms-panel">
        <AssignTechnicianForm selectedOrderId={selectedOrderId} setSelectedOrderId={setSelectedOrderId} refreshOrders={fetchOrders} />


        <div className="ms-panel-header">
          <h6>Orders Status</h6>
        </div>
        <div className="ms-panel-body">
          <div className="d-flex justify-content-end align-items-center mb-3 icon-group">
            <input
              type="text"
              className="form-control w-25"
              placeholder="Search orders..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="icon-btn bg-success text-white" title="Import Gmail Data" onClick={handleImportGmail}>
              <FiDownload size={20} />
            </div>
            <div className="icon-btn bg-warning text-white"
              style={{ background: 'linear-gradient(to bottom left, #00ffff 0%, #33cccc 89%)' }}
              title="Export Table Data" onClick={handleExport}>
              <FiUpload size={20} />
            </div>
            <div className="icon-btn"
              style={{ color: "white", background: "linear-gradient(to bottom left, #006600 0%, #0066cc 89%)" }}
              title="Print Table" onClick={handlePrint}>
              <FiPrinter size={20} />
            </div>
            <button
              type="button"
              className="btn"
              style={{
                marginLeft: 8,
                color: "#fff",
                background: "linear-gradient(to bottom left, #007bff 0%, #33aaff 89%)",
                border: "none",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              title="Open Bill"
              onClick={() => {
                navigate(`/bills`);
              }}
            >

              Go to Bill
            </button>

            <button
              type="button"
              className="btn"
              style={{
                marginLeft: 8,
                color: "#fff",
                background: "linear-gradient(to bottom left, #ff9900 0%, #ff6600 89%)",
                border: "none",
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              title="Go to Invoice"
              onClick={() => {
                navigate(`/invoice/invoice`);
              }}
            >
              Go to Invoice
            </button>

          </div>
          <div className="table-wrapper">
            <DataTable
              columns={NewColumns}
              data={orderData}
              pagination
              responsive
              highlightOnHover
              striped
              noHeader
              overflowX="auto"
              fixedHeader
              fixedHeaderScrollHeight="500px"
              progressPending={loading}
              progressComponent={
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <FiSearch size={40} className="ms-text-primary" style={{ animation: 'bounce 1s infinite' }} />
                  <span style={{ fontSize: '16px', fontWeight: '500', color: '#3366cc' }}>Searching for orders...</span>
                </div>
              }
              direction="ltr"
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

export default OrderStatus;
