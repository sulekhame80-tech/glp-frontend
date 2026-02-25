// src/pages/invoice/MonthlyInvoice.jsx
import React, { useEffect, useState, useRef } from "react";
import Breadcrumb from "../../../layouts/Breadcrumb";
import { Button, Form } from "react-bootstrap";
import {
  getMonthWiseRecordsApi,
  createmonthlyInvoiceApi,
  getInvoicesmonthlyApi,
} from "../../../api/endpoint";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../../assets/img/dashboard/logo.jpeg"; // adjust if needed

// -------------------- helper: number -> words (Indian, basic) --------------------
function numberToWords(num) {
  if (!num && num !== 0) return "";
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function twoDigits(n) {
    if (n < 20) return a[n];
    const tens = Math.floor(n / 10);
    const rest = n % 10;
    return b[tens] + (rest ? " " + a[rest] : "");
  }

  function threeDigits(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    return (
      (hundred ? a[hundred] + " Hundred" + (rest ? " and " : "") : "") +
      (rest ? twoDigits(rest) : "")
    );
  }

  if (num === 0) return "Zero";

  let result = "";
  const crore = Math.floor(num / 10000000);
  num = num % 10000000;
  const lakh = Math.floor(num / 100000);
  num = num % 100000;
  const thousand = Math.floor(num / 1000);
  num = num % 1000;
  const hundredPart = Math.floor(num); // integer rupees

  if (crore) result += `${threeDigits(crore)} Crore `;
  if (lakh) result += `${threeDigits(lakh)} Lakh `;
  if (thousand) result += `${threeDigits(thousand)} Thousand `;
  if (hundredPart) result += `${threeDigits(hundredPart)} `;
  return (result.trim() + " Rupees Only").replace(/\s+/g, " ");
}

// -------------------- Main component --------------------
export default function MonthlyInvoice() {
  const [hospitalName, setHospitalName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState([]); // fetched records from backend
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
 
  const [invoiceMeta, setInvoiceMeta] = useState({
    invoice_no: "",
    bill_to: "",
    payment_mode: "Online",
    received_amount: 0,
    advance_amount: 0,
    sgst: 0,
    cgst: 0,
    remarks: "",
  });

  const [createdInvoice, setCreatedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const invoiceRef = useRef();

  // Month options
  const monthOptions = [
    { v: 1, l: "January" },
    { v: 2, l: "February" },
    { v: 3, l: "March" },
    { v: 4, l: "April" },
    { v: 5, l: "May" },
    { v: 6, l: "June" },
    { v: 7, l: "July" },
    { v: 8, l: "August" },
    { v: 9, l: "September" },
    { v: 10, l: "October" },
    { v: 11, l: "November" },
    { v: 12, l: "December" },
  ];

  // Fetch records when user clicks "Fetch Records"
  const fetchMonthRecords = async () => {
    if (!hospitalName || !month || !year) {
      alert("Please provide Hospital, Month and Year.");
      return;
    }
    setLoading(true);
    try {
      const res = await getMonthWiseRecordsApi(
        hospitalName,
        doctorName,
        month,
        year
      );
      // expect res.data.data or res.data
      const data = res.data?.data ?? res.data ?? [];
      // ensure test_name normalized
     const normalized = data.map((r) => ({
  ...r,

  // normalize price fields from backend
  msp: parseFloat(r.total_msp ?? 0),
  mrp: parseFloat(r.total_mrp ?? 0),
  b2b_price: parseFloat(r.total_b2b ?? 0),

  price_type: "msp", // default
  custom_price: r.test_price ?? 0,

  test_name:
    typeof r.test_name === "string"
      ? (r.test_name.startsWith("[") ? tryParseListString(r.test_name) : r.test_name)
      : r.test_name,

  test_price: parseFloat(r.test_price ?? 0),
}));


      setRecords(normalized);
      setSelectedIds(new Set()); // reset selection
      setSelectAll(false);
      setCreatedInvoice(null);
    } catch (err) {
      console.error("Fetch month records error:", err);
      alert("Failed to fetch records. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse Python/list-like strings to JS array (basic)
  function tryParseListString(str) {
    try {
      // Convert Python single-quoted list to JSON array with double quotes
      const s = str.replace(/'/g, '"').replace(/None/g, "null");
      const parsed = JSON.parse(s);
      return parsed;
    } catch (e) {
      // fallback: return the raw string
      return str;
    }
  }

  // Toggle select one
  const toggleSelect = (id) => {
    const set = new Set(selectedIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    setSelectedIds(set);
    setSelectAll(set.size === records.length && records.length > 0);
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      const all = new Set(records.map((r) => r.lab_record_id || r.id));
      setSelectedIds(all);
      setSelectAll(true);
    }
  };

  // Calculations:
  const selectedRecords = records.filter((r) =>
    selectedIds.has(r.lab_record_id ?? r.id)
  );
 const subtotal = selectedRecords.reduce((sum, r) => {
  let price = 0;

  if (r.price_type === "mrp") price = r.mrp || 0;
  else if (r.price_type === "b2b") price = r.b2b_price || 0;
  else if (r.price_type === "custom") price = r.custom_price || 0;
  else price = r.msp || 0;

  return sum + price;
}, 0);

  const sgstAmount = (subtotal * parseFloat(invoiceMeta.sgst || 0)) / 100;
  const cgstAmount = (subtotal * parseFloat(invoiceMeta.cgst || 0)) / 100;
  const totalAmount = subtotal + sgstAmount + cgstAmount;
  const received = parseFloat(invoiceMeta.received_amount || 0);
  const advance = parseFloat(invoiceMeta.advance_amount || 0);
  const balance = totalAmount - (received + advance);

  // On change invoiceMeta
  const updateMeta = (key, val) =>
    setInvoiceMeta((p) => ({ ...p, [key]: val }));

  useEffect(() => {
  if (!invoiceMeta.bill_to) updateMeta("bill_to", hospitalName);
}, [hospitalName, invoiceMeta.bill_to]);

  // Create aggregated invoice payload
  const handleCreateInvoice = async () => {
    if (selectedIds.size === 0) {
      if (!window.confirm("No records selected. Create invoice with zero rows?"))
        return;
    }

    // Prepare payload. Backend expectation might vary; this payload is comprehensive:
    const payload = {
      hospital_name: hospitalName,
      doctor_name: doctorName,
      month,
      year,
      invoice_no: invoiceMeta.invoice_no || `GLP-${year}-${Date.now()}`,
      bill_to: invoiceMeta.bill_to || hospitalName,
      invoice_amount: totalAmount,
      received_amount: received,
      advance_amount: advance,
      balance_amount: balance,
      sgst: invoiceMeta.sgst,
      cgst: invoiceMeta.cgst,
      payment_mode: invoiceMeta.payment_mode,
      remarks: invoiceMeta.remarks,
      lab_record_ids: Array.from(selectedIds),
    };

    try {
      setLoading(true);
      const res = await createmonthlyInvoiceApi(payload);
      // backend should return invoice object
      const data = res.data?.data ?? res.data ?? res.data;
      setCreatedInvoice(data);
      alert("Invoice created successfully");
    } catch (err) {
      console.error("Create invoice error:", err);
      alert("Failed to create invoice. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // Generate PDF of invoiceRef
  const handleDownloadPdf = async () => {
    if (!createdInvoice) {
      alert("Please create/generate invoice first.");
      return;
    }

    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const filename = `invoice_${createdInvoice.invoice_no || "proforma"}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF.");
    }
  };

  // Simple list of years for select
  const yearOptions = [];
  for (let y = new Date().getFullYear(); y >= 2018; y--) yearOptions.push(y);

  // -------------------- Render --------------------
  return (
    <div className="ms-content-wrapper">
      <div className="row">
        <Breadcrumb pageprev={"Invoice"} pagecurrent={"Monthly Invoice"} />
        <div className="col-md-12">
          <div className="ms-panel">
            <div className="ms-panel-header d-flex justify-content-between">
              <h6>Monthly Invoice — Generate Proforma</h6>
              <div>
                <Button
                  variant="primary"
                  onClick={fetchMonthRecords}
                  disabled={loading}
                  style={{ marginRight: 8 }}
                >
                  {loading ? "Fetching..." : "Fetch Records"}
                </Button>
                <Button
                  variant="success"
                  onClick={handleCreateInvoice}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Invoice"}
                </Button>
              </div>
            </div>

            <div className="ms-panel-body">
              <div className="row mb-3">
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Hospital Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      placeholder="Enter Hospital name"
                    />
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Doctor Name (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="Enter doctor"
                    />
                  </Form.Group>
                </div>

                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Month</Form.Label>
                    <Form.Control
                      as="select"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      <option value="">Select Month</option>
                      {monthOptions.map((m) => (
                        <option key={m.v} value={m.v}>
                          {m.l}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      as="select"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      {yearOptions.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </div>

                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Invoice No (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      value={invoiceMeta.invoice_no}
                      onChange={(e) => updateMeta("invoice_no", e.target.value)}
                      placeholder="GLP-2025-..."
                    />
                  </Form.Group>
                </div>
              </div>

              {/* Records Table */}
              <div style={{ overflowX: "auto", marginBottom: 12 }}>
                <table
                  className="table table-bordered"
                  style={{ minWidth: 900, background: "#fff" }}
                >
                  <thead style={{ background: "#00bfff", color: "#fff" }}>
                    <tr>
                      <th style={{ width: 40 }}>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>#</th>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Patient</th>
                      <th>Test Name(s)</th>
                      <th style={{ textAlign: "right" }}>Test Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center" }}>
                          No records found. Use the controls above and click
                          Fetch Records.
                        </td>
                      </tr>
                    )}
                    {records.map((r, idx) => {
                      const id = r.lab_record_id ?? r.id;
                      const isSelected = selectedIds.has(id);
                      const testNames = Array.isArray(r.test_name)
                        ? r.test_name.join(", ")
                        : r.test_name;
                      return (
                        <tr key={id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(id)}
                            />
                          </td>
                          <td>{idx + 1}</td>
                          <td>
                            {r.date
                              ? new Date(r.date).toLocaleDateString()
                              : ""}
                          </td>
                          <td>{r.order_id || ""}</td>
                          <td>{r.patient_name || r.patient || ""}</td>
                          <td style={{ whiteSpace: "normal" }}>{testNames}</td>
                          <td style={{ textAlign: "right" }}>
  {parseFloat(r.test_price ?? 0).toFixed(2)}
</td>
<td style={{ textAlign: "right" }}>

  {/* Price Type Dropdown */}
  <select
    value={r.price_type}
    onChange={(e) => {
      const newType = e.target.value;

      setRecords((prev) =>
        prev.map((rec) => {
          if (rec.lab_record_id !== r.lab_record_id) return rec;

          let updatedPrice = rec.test_price;

          if (newType === "msp") updatedPrice = rec.msp;
          if (newType === "mrp") updatedPrice = rec.mrp;
          if (newType === "b2b") updatedPrice = rec.b2b_price;
          if (newType === "custom") updatedPrice = rec.custom_price;

          return {
            ...rec,
            price_type: newType,
            test_price: updatedPrice,
          };
        })
      );
    }}
    style={{ marginRight: 4 }}
  >
    <option value="msp">MSP</option>
    <option value="mrp">MRP</option>
    <option value="b2b">B2B</option>
    <option value="custom">Custom</option>
  </select>

  {/* Price Value Input */}
  <input
    type="number"
    value={r.test_price}
    disabled={r.price_type !== "custom"}
    onChange={(e) => {
      const newPrice = parseFloat(e.target.value || 0);

      setRecords((prev) =>
        prev.map((rec) => {
          if (rec.lab_record_id !== r.lab_record_id) return rec;

          return {
            ...rec,
            custom_price: newPrice,
            test_price: newPrice,
          };
        })
      );
    }}
    style={{ width: 90, textAlign: "right" }}
  />
</td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Invoice meta + calculations */}
              <div className="row">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Bill To</Form.Label>
                    <Form.Control
                      type="text"
                      value={invoiceMeta.bill_to}
                      onChange={(e) => updateMeta("bill_to", e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Payment Mode</Form.Label>
                    <Form.Control
                      as="select"
                      value={invoiceMeta.payment_mode}
                      onChange={(e) =>
                        updateMeta("payment_mode", e.target.value)
                      }
                    >
                      <option>Online</option>
                      <option>NEFT</option>
                      <option>Cash</option>
                      <option>Cheque</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Received Amount</Form.Label>
                    <Form.Control
                      type="number"
                      value={invoiceMeta.received_amount}
                      onChange={(e) =>
                        updateMeta("received_amount", Number(e.target.value || 0))
                      }
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Advance Amount</Form.Label>
                    <Form.Control
                      type="number"
                      value={invoiceMeta.advance_amount}
                      onChange={(e) =>
                        updateMeta("advance_amount", Number(e.target.value || 0))
                      }
                    />
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>SGST %</Form.Label>
                    <Form.Control
                      type="number"
                      value={invoiceMeta.sgst}
                      onChange={(e) => updateMeta("sgst", Number(e.target.value || 0))}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>CGST %</Form.Label>
                    <Form.Control
                      type="number"
                      value={invoiceMeta.cgst}
                      onChange={(e) => updateMeta("cgst", Number(e.target.value || 0))}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={invoiceMeta.remarks}
                      onChange={(e) => updateMeta("remarks", e.target.value)}
                    />
                  </Form.Group>
                </div>

                <div className="col-md-4">
                  <div style={{ padding: 12, border: "1px solid #ddd" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>Subtotal</strong>
                      <span>₹ {subtotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>SGST ({invoiceMeta.sgst}%)</span>
                      <span>₹ {sgstAmount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>CGST ({invoiceMeta.cgst}%)</span>
                      <span>₹ {cgstAmount.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>Total</strong>
                      <strong>₹ {totalAmount.toFixed(2)}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Received</span>
                      <span>₹ {(received + advance).toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <strong>Balance</strong>
                      <strong>₹ {balance.toFixed(2)}</strong>
                    </div>
                    <div style={{ marginTop: 8, fontStyle: "italic", color: "#666" }}>
                      {subtotal > 0 && (
                        <>
                          <div>
                            <small>In words:</small>
                          </div>
                          <div style={{ fontWeight: 600 }}>{numberToWords(Math.round(totalAmount))}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Created invoice preview area */}
              {createdInvoice && (
                <div style={{ marginTop: 20 }}>
                  <h5>Invoice Created: {createdInvoice.invoice_no}</h5>
                  <Button variant="primary" onClick={handleDownloadPdf} style={{ marginRight: 8 }}>
                    Download Invoice PDF
                  </Button>
                  <Button variant="secondary" onClick={() => window.location.reload()}>
                    New Invoice
                  </Button>

                  {/* PROFORMA INVOICE (rendered for PDF) */}
                  <div ref={invoiceRef} style={{ padding: 24, marginTop: 16, background: "#fff" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h2 style={{ margin: 0 }}>GENELIFE PLUS</h2>
                        <div>AUTHORIZED COLLECTION CENTRE FOR MEDGENOME LABS LTD.</div>
                        <div>Phone no.: 7639393689</div>
                        <div>Email: genelifeplus@gmail.com</div>
                        <div>GSTIN: 33FRGPS4137A1Z0</div>
                      </div>
                      <div>
                        <img src={logo} alt="logo" style={{ width: 300 }} />
                      </div>
                    </div>

                    <h3 style={{ textAlign: "center", margin: "16px 0", color: "#4a6cf7" }}>
                      PROFORMA INVOICE
                    </h3>

                    {/* Bill to & invoice details */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ background: "#b19cd9", color: "#fff", padding: 6 }}>Bill To:</div>
                        <div style={{ padding: 8 }}>
                          <strong>{createdInvoice.bill_to || invoiceMeta.bill_to}</strong>
                          <div>{createdInvoice.hospital_address || ""}</div>
                        </div>
                      </div>

                      <div style={{ width: 320 }}>
                        <div style={{ background: "#b19cd9", color: "#fff", padding: 6 }}>Invoice Details:</div>
                        <div style={{ padding: 8 }}>
                          <div><strong>Invoice No:</strong> {createdInvoice.invoice_no}</div>
                          <div><strong>Date:</strong> {createdInvoice.created_at || new Date().toLocaleDateString()}</div>
                          <div><strong>Payment Mode:</strong> {createdInvoice.payment_mode}</div>
                        </div>
                      </div>
                    </div>

                    {/* Items table */}
                    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
                      <thead>
                        <tr style={{ background: "#00bfff", color: "#fff" }}>
                          <th style={{ padding: 8, border: "1px solid #ccc" }}>#</th>
                          <th style={{ padding: 8, border: "1px solid #ccc" }}>Date</th>
                          <th style={{ padding: 8, border: "1px solid #ccc" }}>Patient Name</th>
                          <th style={{ padding: 8, border: "1px solid #ccc" }}>Test Name</th>
                          <th style={{ padding: 8, border: "1px solid #ccc" }}>Test Price</th>
                          <th style={{ padding: 8, border: "1px solid #ccc" }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecords.map((r, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: 8, border: "1px solid #ccc" }}>{idx + 1}</td>
                            <td style={{ padding: 8, border: "1px solid #ccc" }}>
                              {r.date ? new Date(r.date).toLocaleDateString() : ""}
                            </td>
                            <td style={{ padding: 8, border: "1px solid #ccc" }}>{r.patient_name || r.patient || ""}</td>
                            <td style={{ padding: 8, border: "1px solid #ccc" }}>
                              {Array.isArray(r.test_name) ? r.test_name.join(", ") : r.test_name}
                            </td>
                            <td style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                              {parseFloat(r.invoice_amount ?? r.payout_amount ?? 0).toFixed(2)}
                            </td>
                            <td style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                              {parseFloat(r.invoice_amount ?? r.payout_amount ?? 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}

                        {/* totals */}
                        <tr>
                          <td colSpan={4} style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            <strong>Subtotal</strong>
                          </td>
                          <td style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            <strong>₹ {subtotal.toFixed(2)}</strong>
                          </td>
                          <td style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            <strong>₹ {subtotal.toFixed(2)}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            SGST ({invoiceMeta.sgst}%)
                          </td>
                          <td style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>₹ {sgstAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan={5} style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            CGST ({invoiceMeta.cgst}%)
                          </td>
                          <td style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>₹ {cgstAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan={5} style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            <strong>Total</strong>
                          </td>
                          <td style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            <strong>₹ {totalAmount.toFixed(2)}</strong>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            Received
                          </td>
                          <td style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            ₹ {(received + advance).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={5} style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            <strong>Balance</strong>
                          </td>
                          <td style={{ padding: 8, border: "1px solid #ccc", textAlign: "right" }}>
                            <strong>₹ {balance.toFixed(2)}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Footer: bank details + QR + signature */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
                      <div style={{ width: "35%" }}>
                        <div style={{ background: "#b19cd9", color: "#fff", padding: 6 }}>Pay To:</div>
                        <div style={{ padding: 8 }}>
                          <div><strong>Bank Name:</strong> HDFC BANK LTD</div>
                          <div><strong>Account No.:</strong> 50200089204348</div>
                          <div><strong>IFSC:</strong> HDFC0000351</div>
                          <div><strong>Acc Holder:</strong> GENELIFE PLUS</div>
                        </div>
                      </div>

                      <div style={{ width: "30%", textAlign: "center" }}>
                        <div style={{ background: "#b19cd9", color: "#fff", padding: 6 }}>Scan & Pay</div>
                        <div style={{ padding: 8 }}>
                          {/* You can replace with a QR image if available */}
                          <div style={{ border: "1px solid #ddd", padding: 8 }}>
                            <img
                              alt="QR"
                              src={createdInvoice.qr_url || ""}
                              style={{ width: 140, height: 140, objectFit: "contain" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ width: "30%", textAlign: "center" }}>
                        <div style={{ padding: 8 }}>For GENELIFE PLUS</div>
                        <div style={{ marginTop: 40 }}>
                          <div style={{ fontFamily: "'Brush Script MT', cursive", fontSize: 20 }}>
                            {/* signature placeholder */}
                            J. (Signature)
                          </div>
                          <div>Authorized Signatory</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
