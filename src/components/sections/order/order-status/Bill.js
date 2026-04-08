import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { createLabReceiptApi, getLabReceiptPdfApi, getOrdersApi, getLab_recordByIdApi, getOrderByIdApi } from "../../../api/endpoint";

function numberToWords(num) {
  if (!num && num !== 0) return "";
  const a = [
    "", "One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"
  ];
  const b = ["","", "Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  function twoDigits(n){ if(n<20)return a[n]; const t=Math.floor(n/10); const r=n%10; return b[t]+(r?" "+a[r]:""); }
  function threeDigits(n){ const h=Math.floor(n/100); const r=n%100; return (h?a[h]+" Hundred"+(r?" and ":""):"")+(r?twoDigits(r):""); }
  if(num===0)return "Zero";
  let result=""; const crore=Math.floor(num/10000000); num=num%10000000;
  const lakh=Math.floor(num/100000); num=num%100000;
  const thousand=Math.floor(num/1000); num=num%1000; const hundredPart=Math.floor(num);
  if(crore)result+=`${threeDigits(crore)} Crore `; if(lakh)result+=`${threeDigits(lakh)} Lakh `;
  if(thousand)result+=`${threeDigits(thousand)} Thousand `; if(hundredPart)result+=`${threeDigits(hundredPart)} `;
  return (result.trim()+" Rupees Only").replace(/\s+/g," ");
}

export default function LabReceiptSubmit() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [patientName, setPatientName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  // Fetch orders for dropdown
  useEffect(() => {
    getOrdersApi().then(res => {
      setOrders(res.data || []);
    }).catch(err => {
      console.error("Error fetching orders:", err);
    });
  }, []);

  // Fetch record details when Order ID changes (Frontend-only chaining)
  useEffect(() => {
    if (orderId) {
      setFetchingDetails(true);
      // 1. Get the Lab Record to find the Patient Details PK
      getLab_recordByIdApi(orderId).then(res => {
        const labRecord = res.data;
        if (labRecord) {
          setHospitalName(labRecord.clinician_name || ""); // Hospital Master Name
          
          // 2. Get the full Order Details (Age, Sex, Referring Doctor)
          if (labRecord.patient_id) {
            getOrderByIdApi(labRecord.patient_id).then(orderRes => {
              const orderData = orderRes.data;
              if (orderData) {
                setPatientName(orderData.patient_name || "");
                setAge(orderData.age || "");
                setSex(orderData.sex || "");
                setDoctorName(orderData.clinician_name || ""); // Referring Doctor Name
              }
            }).catch(err => console.error("Error fetching order details:", err));
          }
        }
      }).catch(err => {
        console.error("Error fetching lab record:", err);
      }).finally(() => {
        setFetchingDetails(false);
      });
    } else {
      setPatientName("");
      setHospitalName("");
      setDoctorName("");
      setAge("");
      setSex("");
    }
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId) return;
    setLoading(true);

    try {
      const postRes = await createLabReceiptApi({ order_id: orderId, age, sex });
      if (!postRes.data?.status) {
        alert(postRes.data?.message || "Error from server");
        return;
      }

      const getRes = await getLabReceiptPdfApi(orderId);
      const data = getRes.data?.data || getRes.data;
      if (!data) {
        alert("No data returned from server");
        return;
      }

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      let yPosition = margin;

      // ===== HEADER SECTION (DYNAMIC HOSPITAL NAME) =====
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      
      const title = (data.hospital?.hospital_name || hospitalName || "GENELIFEPLUS").toUpperCase();
      doc.text(title, margin, yPosition + 10);
      
      yPosition += 18;
      doc.setDrawColor(200);
      doc.setLineWidth(0.3);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      doc.setFontSize(16);
      doc.setTextColor(0, 191, 255);
      doc.setFont(undefined, "bold");
      doc.text("LAB RECEIPT", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;

      // ===== PATIENT & RECEIPT DETAILS BOXES =====
      const colGap = 5;
      const colWidth = (pageWidth - 2 * margin - colGap) / 2;
      const boxHeight = 28;
      const headerHeight = 7;

      doc.setFillColor(0, 191, 255);
      doc.rect(margin, yPosition, colWidth, headerHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("Patient Details -", margin + 3, yPosition + 4.5);
      doc.setDrawColor(221, 221, 221);
      doc.rect(margin, yPosition, colWidth, boxHeight);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text(data.patient?.name || patientName || "N/A", margin + 3, yPosition + headerHeight + 5);
      doc.setFont(undefined, "normal");
      doc.setFontSize(8);
      doc.text(`Age: ${data.patient?.age || age || ""}`, margin + 3, yPosition + headerHeight + 10);
      doc.text(`Sex: ${data.patient?.sex || sex || ""}`, margin + 30, yPosition + headerHeight + 10);
      doc.text(`Mobile: ${data.patient?.mobile_no || ""}`, margin + 3, yPosition + headerHeight + 15);
      doc.text(`Doctor: ${doctorName || "N/A"}`, margin + 3, yPosition + headerHeight + 20);

      const rightColX = margin + colWidth + colGap;
      doc.setFillColor(0, 191, 255);
      doc.rect(rightColX, yPosition, colWidth, headerHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("Receipt Details -", rightColX + 3, yPosition + 4.5);
      doc.rect(rightColX, yPosition, colWidth, boxHeight);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.text("Order ID:", rightColX + 3, yPosition + headerHeight + 5);
      doc.setFont(undefined, "normal");
      doc.text(`${data.order_id || orderId || ""}`, rightColX + 25, yPosition + headerHeight + 5);
      doc.setFont(undefined, "bold");
      doc.text("Date:", rightColX + 3, yPosition + headerHeight + 10);
      doc.setFont(undefined, "normal");
      doc.text(`${data.date || ""}`, rightColX + 25, yPosition + headerHeight + 10);
      doc.setFont(undefined, "bold");
      doc.text("Sample ID:", rightColX + 3, yPosition + headerHeight + 15);
      doc.setFont(undefined, "normal");
      doc.text(`${data.patient?.sample_id || "N/A"}`, rightColX + 25, yPosition + headerHeight + 15);

      yPosition += boxHeight + 10;

      autoTable(doc, {
        startY: yPosition,
        head: [["#", "Test Name"]],
        body: data.tests?.length > 0 ? data.tests.map((t, i) => [i + 1, t.name || ""]) : [[1, "No tests available"]],
        theme: "grid",
        margin: { left: margin, right: margin },
        headerStyles: { fillColor: [0, 191, 255], textColor: 255, fontSize: 10, fontStyle: "bold" },
        styles: { fontSize: 9 },
        columnStyles: { 0: { cellWidth: 10, halign: "center" } }
      });

      yPosition = doc.lastAutoTable.finalY + 8;
      const rightPadding =  2;

      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("Total Amount", pageWidth - margin - 50, yPosition);
      doc.text(`Rs. ${Number(data.total_amount || 0).toFixed(2)}`, pageWidth - margin - rightPadding, yPosition, { align: "right" });

      yPosition += 8;
      doc.setFont(undefined, "normal");
      doc.setFontSize(8);
      doc.text(`Amount in Words: Rs. ${numberToWords(Math.round(data.total_amount))}`, margin, yPosition);

      yPosition += 30;
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
      doc.text("This is a computer generated document.", margin, yPosition);
      
      doc.text("Authorized Signatory", pageWidth - margin - 4, yPosition, { align: "right" });
      doc.line(pageWidth - margin - 40, yPosition - 5, pageWidth - margin - 4, yPosition - 5);

      doc.save(`LAB_RECEIPT_${data.order_id || orderId}.pdf`);
      console.log("✅ PDF generated successfully!");
    } catch (err) {
      console.error("❌ ERROR generating PDF:", err);
      alert("Error generating PDF. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ms-panel mt-4" style={{ 
      background: "#fff", 
      padding: "30px", 
      borderRadius: "15px", 
      boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      maxWidth: "600px",
      margin: "auto"
    }}>
      <div className="ms-panel-header text-center mb-4">
        <h4 style={{ color: "#288C4C", fontWeight: "700" }}>Lab Receipt Generator</h4>
        <p className="text-muted small">Sequential Billing Process</p>
      </div>
      
      <div className="ms-panel-body">
        <form onSubmit={handleSubmit}>
          {/* STEP 1: SELECT ORDER */}
          <div className="mb-4">
            <label className="form-label mb-1" style={{ fontWeight: "600", fontSize: "0.9rem" }}>1. Select Order ID</label>
            <select
              className="form-select"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={{ border: "2px solid #00BFFF", borderRadius: "8px" }}
            >
              <option value="">-- Choose Order --</option>
              {orders.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* STEP 2: AGE (Show if orderId is selected) */}
          {orderId && !fetchingDetails && (
            <div className="mb-4 animate__animated animate__fadeIn">
              <label className="form-label mb-1" style={{ fontWeight: "600", fontSize: "0.9rem" }}>2. Confirm Age</label>
              <input 
                type="number"
                className="form-control"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter patient age"
                style={{ border: "2px solid #00BFFF", borderRadius: "8px" }}
              />
            </div>
          )}

          {/* STEP 3: GENDER (Show if age is entered) */}
          {age && (
            <div className="mb-4 animate__animated animate__fadeIn">
              <label className="form-label mb-1" style={{ fontWeight: "600", fontSize: "0.9rem" }}>3. Select Gender</label>
              <select 
                className="form-select" 
                value={sex} 
                onChange={(e) => setSex(e.target.value)}
                style={{ border: "2px solid #00BFFF", borderRadius: "8px" }}
              >
                <option value="">-- Select --</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          )}

          {/* STEP 4: PREVIEW (Show if gender is selected) */}
          {sex && (
            <div className="preview-section mb-4 animate__animated animate__zoomIn" style={{
              background: "#F8F9FA",
              padding: "20px",
              borderRadius: "12px",
              border: "1px dashed #00BFFF"
            }}>
              <h6 className="mb-3 text-center" style={{ color: "#00BFFF", fontWeight: "700" }}>Final Preview</h6>
              <div className="row g-3 small">
                <div className="col-12 border-bottom pb-2">
                  <span className="text-muted">Patient:</span> <strong className="float-end">{patientName || "N/A"}</strong>
                </div>
                <div className="col-6 border-bottom pb-2">
                  <span className="text-muted">Age:</span> <strong className="float-end">{age}</strong>
                </div>
                <div className="col-6 border-bottom pb-2">
                  <span className="text-muted">Gender:</span> <strong className="float-end">{sex}</strong>
                </div>
                <div className="col-12 border-bottom pb-2">
                  <span className="text-muted">Hospital:</span> <strong className="float-end">{hospitalName || "N/A"}</strong>
                </div>
                <div className="col-12 pb-1">
                  <span className="text-muted">Doctor:</span> <strong className="float-end">{doctorName || "N/A"}</strong>
                </div>
              </div>

              <button 
                className="btn btn-primary w-100 mt-4" 
                type="submit" 
                disabled={loading} 
                style={{ 
                  background: "#00BFFF", 
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  fontWeight: "700"
                }}
              >
                {loading ? "Processing..." : "GENERATE BILL"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
