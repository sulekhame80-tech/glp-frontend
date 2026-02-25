import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../../../layouts/Breadcrumb";
import { Button } from "react-bootstrap";
import Select from "react-select";
import {
  createInvoiceApi,
  getInputinvoioceApi,
  getOrdersApi,
  getclinicianApi, getTestDropdownApi
} from "../../../api/endpoint";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../../assets/img/dashboard/logo.jpeg";
import "./invoice.css";
import qrCode from "../../../../assets/img/dashboard/qr-code.jpeg";
import image1 from "../../../../assets/img/dashboard/image1.PNG";
import { FaPlus } from "react-icons/fa";

function Content() {
  const invoiceRef = useRef(null);
  const [orderInfo, setOrderInfo] = useState(null);

  const [orders, setOrders] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [testList, setTestList] = useState([]);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showManualFields, setShowManualFields] = useState(false);
  const [cgstPercent, setCgstPercent] = useState("");
  const [sgstPercent, setSgstPercent] = useState("");

  const [formData, setFormData] = useState({
    order_id: "",
    patient_name: "",
    test_name: [],
    hospital_id: "",
    invoice_amount: "",
    advance_amount: "",
    received_amount: "",
    payment_mode: "",
    bill_to: "",
    balance_amount: "",
    invoice_no: "",   
  });

  /* ===================== LOAD ORDERS & HOSPITALS & TESTS ===================== */
  useEffect(() => {
    getOrdersApi()
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => console.error("Orders API error:", err));

    getclinicianApi()
      .then((res) => {
        setHospitals(res.data.data || res.data || []);
      })
      .catch((err) => console.error("Hospital API error:", err));

    getTestDropdownApi()
      .then((res) => {
        const testArray = res.data?.data || res.data || [];
        setTestList(Array.isArray(testArray) ? testArray : []);
      })
      .catch((err) => console.error("Test API error:", err));
  }, []);

  /* ===================== HANDLE INPUT ===================== */
  useEffect(() => {
    console.log("👀 invoiceData changed:", invoiceData);

    if (!invoiceData?.test_names) return;

    if (typeof invoiceData.test_names === "string") {
      try {
        const parsed = JSON.parse(invoiceData.test_names.replace(/'/g, '"'));
        console.log("🔁 Parsed test_names:", parsed);

        setInvoiceData((prev) => {
          const updated = { ...prev, test_names: parsed };
          console.log("🧾 Updated invoiceData with parsed tests:", updated);
          return updated;
        });
      } catch (e) {
        console.error("❌ Failed to parse test_names:", e);
      }
    }
  }, [invoiceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("✏️ Input changed:", name, value);

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      console.log("📝 Updated formData:", updated);
      return updated;
    });

    if (name === "order_id" && value && !showManualFields) {
      console.log("📡 Fetching invoice input for order:", value);

      getInputinvoioceApi(value)
        .then((res) => {
          console.log("✅ getInputInvoice response:", res.data);

          if (res.data?.status === "success") {
            console.log("📦 Setting orderInfo:", res.data);
            setOrderInfo(res.data);

            setFormData((prev) => {
              const testNamesData = res.data.test_names || "";
              let parsedTestNames = [];
              
              if (Array.isArray(testNamesData)) {
                parsedTestNames = testNamesData;
              } else if (typeof testNamesData === "string") {
                try {
                  parsedTestNames = JSON.parse(testNamesData.replace(/'/g, '"'));
                  if (!Array.isArray(parsedTestNames)) parsedTestNames = [parsedTestNames];
                } catch {
                  parsedTestNames = [testNamesData];
                }
              }

              const updated = {
                ...prev,
                invoice_no: res.data.invoice_no || "",
                invoice_amount: res.data.invoice_amount || "",
                received_amount: res.data.received_amount || "",
                payment_mode: res.data.payment_mode || "",
                bill_to: res.data.bill_to || "",
                advance_amount: res.data.advance_amount || "",
                balance_amount: res.data.balance_amount || "",
                patient_name: res.data.patient_name || "",
                test_name: parsedTestNames,
              };
              console.log("📝 Auto-filled formData:", updated);
              return updated;
            });
          }
        })
        .catch((err) => console.error("❌ Invoice input fetch error:", err));
    }
  };

  /* ===================== HANDLE TEST SELECTION ===================== */
  const handleTestSelect = (testName) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (Array.isArray(updated.test_name)) {
        if (updated.test_name.includes(testName)) {
          updated.test_name = updated.test_name.filter((t) => t !== testName);
        } else {
          updated.test_name = [...updated.test_name, testName];
        }
      } else {
        updated.test_name = [testName];
      }
      console.log("🧪 Updated test_name:", updated.test_name);
      return updated;
    });
  };

  /* ===================== SUBMIT INVOICE ===================== */
  const submitInvoice = async () => {
    console.log("🚀 Submit clicked");
    console.log("FormData:", formData);
    console.log("OrderInfo:", orderInfo);

    if (!formData.order_id) {
      alert("Please select Order ID");
      return;
    }

    if (showManualFields && (!formData.patient_name || !formData.test_name || formData.test_name.length === 0)) {
      alert("Please fill in patient_name and select at least one test");
      return;
    }

    try {
      const submitData = {
        ...formData,
        test_name: Array.isArray(formData.test_name) ? formData.test_name.join(", ") : formData.test_name,
      };

      const res = await createInvoiceApi(submitData);
      console.log("createInvoice response:", res?.data);

      if (!res?.data) {
        alert("No response from server");
        return;
      }

      if (res.data.status === "success") {
        const rawTests = formData.test_name || orderInfo?.test_names || [];
        let parsedTests = Array.isArray(rawTests) ? rawTests : [];
        
        if (!Array.isArray(rawTests)) {
          try {
            if (typeof rawTests === "string") {
              parsedTests = JSON.parse(rawTests.replace(/'/g, '"'));
              if (!Array.isArray(parsedTests)) parsedTests = [parsedTests];
            }
          } catch {}
        }

        const finalData = {
          ...res.data.data,
          patient_name: formData.patient_name || orderInfo?.patient_name || "",
          test_names: parsedTests,
          payment_received_date: res.data.data?.payment_received_date || "",
        };

        console.log("✅ Final invoiceData:", finalData);
        setInvoiceData(finalData);
        alert("Invoice created successfully");
      } else {
        alert(res.data.message || "Invoice creation failed");
      }
    } catch (err) {
      console.error("Invoice error:", err);
      alert("Invoice creation failed");
    }
  };


  /* ===================== PDF ===================== */
 const generatePDF = () => {
  if (!invoiceRef.current || !invoiceData) return;

  const btn = document.getElementById("downloadBtn");
  if (btn) btn.style.display = "none";   // hide before capture

  html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`invoice_${invoiceData.invoice_no}.pdf`);

    if (btn) btn.style.display = "inline-block"; // show again
  });
};

  const toggleOrderInput = () => {
    setUseCustomOrderInput((prev) => !prev);
    setFormData((prev) => ({ ...prev, order_id: "" }));
  };
const subTotal = Number(invoiceData?.invoice_amount || 0);
const cgstPer = Number(cgstPercent || 0);
const sgstPer = Number(sgstPercent || 0);

const cgstAmt = (subTotal * cgstPer) / 100;
const sgstAmt = (subTotal * sgstPer) / 100;
const grandTotal = subTotal + cgstAmt + sgstAmt;
const balance = grandTotal - Number(invoiceData?.received_amount || 0);

  return (
    <div className="ms-content-wrapper">
      <Breadcrumb pageprev="Invoice" pagecurrent="Invoice" />

      <div className="ms-panel">
        <div className="ms-panel-header d-flex justify-content-between">
          <h6>Invoice</h6>
          <h6>{invoiceData?.invoice_no || "—"}</h6>
        </div>

        <div className="ms-panel-body">
          <h4>Enter Invoice Details</h4>

          <div className="row">
            <div className="col-md-4 mb-2">
              <label>
                Order ID
                <FaPlus 
                  style={{ cursor: "pointer", marginLeft: "10px", color: "#127405ff" }}
                  onClick={() => setShowManualFields(!showManualFields)}
                  title={showManualFields ? "Hide manual fields" : "Show manual fields"}
                />
              </label>
              
              {showManualFields ? (
                <input
                  type="text"
                  name="order_id"
                  className="form-control"
                  value={formData.order_id}
                  onChange={handleChange}
                  placeholder="Enter Order ID"
                />
              ) : (
                <select
                  name="order_id"
                  className="form-control"
                  value={formData.order_id}
                  onChange={handleChange}
                >
                  <option value="">Select Order</option>
                  {orders.map((id, i) => (
                    <option key={i} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* ===== MANUAL FIELDS (Patient, Test, Hospital) ===== */}
            {showManualFields && (
              <>
                <div className="col-md-4 mb-2">
                  <label>Patient Name *</label>
                  <input
                    type="text"
                    name="patient_name"
                    className="form-control"
                    value={formData.patient_name}
                    onChange={handleChange}
                    placeholder="Enter Patient Name"
                  />
                </div>

                <div className="col-md-4 mb-2">
                  <label>Test Code Name</label>
                  <Select
                    isMulti
                    options={(Array.isArray(testList) ? testList : []).map(t => ({
                      value: t.label,
                      label: t.label
                    }))}
                    value={(Array.isArray(formData.test_name) ? formData.test_name : []).map(name => ({
                      value: name,
                      label: name
                    }))}
                    onChange={(selectedOptions) => {
                      const values = selectedOptions
                        ? selectedOptions.map(opt => opt.value)
                        : [];
                      setFormData({ ...formData, test_name: values });
                    }}
                    placeholder="Select Test"
                  />
                </div>

                <div className="col-md-4 mb-2">
                  <label>Hospital / Doctor</label>
                  <select
                    name="hospital_id"
                    className="form-control"
                    value={formData.hospital_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Hospital/Doctor</option>
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.hospital_name || h.doctor_name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="col-md-4 mb-2">
              <label>Invoice No</label>
              <input
                type="text"
                name="invoice_no"
                className="form-control"
                value={formData.invoice_no}
                onChange={handleChange}
                placeholder="Enter Invoice Number"
              />
            </div>

            <div className="col-md-4 mb-2">
              <label>CGST %</label>
              <input
                type="number"
                className="form-control"
                value={cgstPercent}
                onChange={(e) => setCgstPercent(e.target.value)}
                placeholder="Enter CGST %"
              />
            </div>

            <div className="col-md-4 mb-2">
              <label>SGST %</label>
              <input
                type="number"
                className="form-control"
                value={sgstPercent}
                onChange={(e) => setSgstPercent(e.target.value)}
                placeholder="Enter SGST %"
              />
            </div>

            {[
              "invoice_amount",
              "advance_amount",
              "received_amount",
              "payment_mode",
              "bill_to",
            ].map((key) => (
              <div className="col-md-4 mb-2" key={key}>
                <label>{key.replace("_", " ").toUpperCase()}</label>
                <input
                  type={key.includes("amount") ? "number" : "text"}
                  name={key}
                  className="form-control"
                  value={formData[key]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>

          <Button className="mt-3" onClick={submitInvoice}>
            Generate Invoice
          </Button>

          {/* ===================== INVOICE PREVIEW ===================== */}
         {invoiceData && (
  <div ref={invoiceRef} className="invoice-container">

    {/* ===== HEADER ===== */}
  <div className="invoice-header">
  <div className="header-left">
    <img src={logo} alt="logo" className="invoice-logo-top" />
    <h5>GENELIFE PLUS</h5>
    <p className="small">
      (AUTHORISED COLLECTION CENTRE <br />
      FOR MEDGENOME LABS LTD.)
    </p>
    <p>Phone no: 7639393689</p>
    <p>Email: genelifeplus@gmail.com</p>
    <p>GSTIN: 33FRGPS4137A1Z0</p>
  </div>

  <div className="header-right">
    <img src={image1} alt="logo" className="invoice-logo" />
  </div>
</div>


    {/* ===== TITLE ===== */}
    <div className="invoice-title">PAYMENT RECEIPT</div>

    {/* ===== BILL INFO ===== */}
    <div className="invoice-info">
      <div className="bill-section">
        <span className="section-label">Bill To :-</span>
        <p className="bill-name">{invoiceData.bill_to}</p>
      </div>

      <div className="invoice-section">
        <span className="section-label">Invoice Details :-</span>
        <p><b>Invoice No:</b> {invoiceData.invoice_no}</p>
        <p><b>Date:</b> {invoiceData.payment_received_date}</p>
      </div>
    </div>

    {/* ===== TABLE ===== */}
    <table className="invoice-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Patient Name</th>
          <th>Test Name</th>
          <th>Test Price</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>{invoiceData.patient_name}</td>
          <td>
            {Array.isArray(invoiceData.test_names)
              ? invoiceData.test_names.join(", ")
              : invoiceData.test_names}
          </td>
          <td>{invoiceData.invoice_amount}</td>
          <td>{invoiceData.received_amount}</td>
        </tr>
      </tbody>
    </table>

    {/* ===== SUMMARY ===== */}
   {/* ===== DESCRIPTION & SUMMARY ===== */}
<div className="invoice-summary-full">

  {/* LEFT SIDE */}
  <div className="left-summary">
    <p><b>Description :-</b></p>
    <p><b>Ref:</b></p>

    <p className="mt-3"><b>Invoice Amount in Words :-</b></p>
    <p>Sixteen thousand rupees only</p>

    <p className="mt-3"><b>Terms And Conditions :-</b></p>
    <p>100% payment to be made for order booking</p>
  </div>

  {/* RIGHT SIDE */}
  <div className="right-summary">
   <div className="row">
  <span>Sub Total</span>
  <span>₹ {subTotal}</span>
</div>

<div className="row">
  <span>CGST @{cgstPer}%</span>
  <span>₹ {cgstAmt.toFixed(2)}</span>
</div>

<div className="row">
  <span>SGST @{sgstPer}%</span>
  <span>₹ {sgstAmt.toFixed(2)}</span>
</div>

<div className="row total">
  <span>Total</span>
  <span>₹ {grandTotal.toFixed(2)}</span>
</div>

<div className="row">
  <span>Received</span>
  <span>₹ {invoiceData?.received_amount || 0}</span>
</div>

<div className="row">
  <span>Balance</span>
  <span>₹ {balance.toFixed(2)}</span>
</div>
</div>

</div>


    {/* ===== FOOTER ===== */}
    {/* ===== FOOTER HEADER ===== */}
    <div className="invoice-footer-header">
      <div className="footer-left-label">Pay To:</div>
      <div className="footer-right-label" style={{marginLeft:"-210px"}}>Scan & Pay:</div>
      <div className="footer-right-label"></div>
    </div>

   {/* ===== PAYMENT + BANK DETAILS ===== */}
<div className="invoice-bottom">

  {/* LEFT SIDE – BANK DETAILS */}
  <div>
    <p><b>Bank Name:</b> HDFC BANK LTD</p>
    <p><b>Bank Account No.:</b> 50200089204348</p>
    <p><b>Bank IFSC code:</b> HDFC0000351</p>
    <p><b>Account Holder's Name:</b> GENELIFE PLUS</p>
  </div>

  {/* CENTER – QR CODE */}
  <div className="qr-section">
    
    <img
      src={qrCode}
      alt="QR Code"
      className="qr-image"
    />
  </div>

  {/* RIGHT – SIGNATURE */}
  <div className="signatory">
    <p><b>For GENELIFE PLUS</b></p>
    <br />
    <p></p>
    <p>Authorized Signatory</p>
  </div>

</div>


    <button
      id="downloadBtn"
      className="btn btn-primary mt-3"
      onClick={generatePDF}
    >
      Download
    </button>

  </div>
)}

        </div>
      </div>
    </div>
  );
}

export default Content;
