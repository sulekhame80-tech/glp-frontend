import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { createLabReceiptApi, getLabReceiptPdfApi, getOrdersApi } from "../../../api/endpoint";
import logo from "../../../../assets/img/dashboard/logo.jpeg";
import qrCode from "../../../../assets/img/dashboard/qr-code.jpeg";

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

const DEFAULT_COMPANY_DETAILS = {
  hospital_name: "GENELIFE PLUS",
  phone: "7639393689",
  email: "genelifeplus@gmail.com",
  gstin: "33FRGPS4137A1Z0",
  bank_name: "HDFC BANK LTD",
  account_no: "50200089204348",
  ifsc_code: "HDFC0000351",
  branch_name: "HDFC Bank",
  address: "AUTHORISED COLLECTION CENTRE I,4FOR MEDGENOME LABS LTD."
};

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.src = src;
  });
}

export default function LabReceiptSubmit() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch orders for dropdown
  useEffect(() => {
    getOrdersApi().then(res => {
      setOrders(res.data || []);
    }).catch(err => {
      console.error("Error fetching orders:", err);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId) {
      alert("Please select Order ID");
      return;
    }
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

      const logoImg = await loadImage(logo);
      const qrImg = await loadImage(qrCode);
      const defaultDetails = DEFAULT_COMPANY_DETAILS;

      // ===== HEADER SECTION =====
      const logoWidth = 35;
      const logoHeight = 22;
      doc.addImage(logoImg, "JPEG", margin, yPosition, logoWidth, logoHeight);
      yPosition += logoHeight + 4;

      doc.setFontSize(22);
      doc.setTextColor(40, 140, 76);
      doc.setFont(undefined, "bold");
      doc.text("GENELIFE PLUS", margin, yPosition);

      doc.setFontSize(18);
      doc.setTextColor(66, 183, 213);
      doc.text("MEDGENOME", pageWidth - margin, margin + 5, { align: "right" });

      yPosition += 6;
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text("(AUTHORISED COLLECTION CENTRE FOR MEDGENOME LABS LTD.)", margin, yPosition);
      yPosition += 4;
      doc.setFont(undefined, "normal");
      doc.text(`Phone no. : ${defaultDetails.phone}`, margin, yPosition);
      yPosition += 4;
      doc.text(`Email: ${defaultDetails.email}`, margin, yPosition);
      yPosition += 4;
      doc.text(`GSTIN: ${defaultDetails.gstin}`, margin, yPosition);
      yPosition += 6;

      doc.setDrawColor(150, 120, 180);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      doc.setFontSize(18);
      doc.setTextColor(0, 191, 255);
      doc.setFont(undefined, "bold");
      doc.text("LAB RECEIPT", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;

      // ===== PATIENT & RECEIPT DETAILS BOXES =====
      const colGap = 5;
      const colWidth = (pageWidth - 2 * margin - colGap) / 2;
      const boxHeight = 28;
      const headerHeight = 7;

      // Left Box: Patient Details
      doc.setFillColor(160, 120, 180);
      doc.rect(margin, yPosition, colWidth, headerHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("Patient Details -", margin + 3, yPosition + 4.5);
      doc.setDrawColor(221, 221, 221);
      doc.rect(margin, yPosition, colWidth, boxHeight);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.text(data.patient?.name || "N/A", margin + 3, yPosition + headerHeight + 5);
      doc.setFont(undefined, "normal");
      doc.setFontSize(8);
      doc.text(`Age: ${data.patient?.age || ""}`, margin + 3, yPosition + headerHeight + 10);
      doc.text(`Sex: ${data.patient?.sex || ""}`, margin + 30, yPosition + headerHeight + 10);
      doc.text(`Mobile: ${data.patient?.mobile_no || ""}`, margin + 3, yPosition + headerHeight + 15);

      // Right Box: Receipt Details
      const rightColX = margin + colWidth + colGap;
      doc.setFillColor(160, 120, 180);
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
      doc.text(`${data.order_id || ""}`, rightColX + 25, yPosition + headerHeight + 5);
      doc.setFont(undefined, "bold");
      doc.text("Date:", rightColX + 3, yPosition + headerHeight + 10);
      doc.setFont(undefined, "normal");
      doc.text(`${data.date || ""}`, rightColX + 25, yPosition + headerHeight + 10);
      doc.setFont(undefined, "bold");
      doc.text("Sample ID:", rightColX + 3, yPosition + headerHeight + 15);
      doc.setFont(undefined, "normal");
      doc.text(`${data.patient?.sample_id || "N/A"}`, rightColX + 25, yPosition + headerHeight + 15);

      yPosition += boxHeight + 10;

      // ===== TEST TABLE =====
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

      // ===== SUMMARY =====
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("Total Amount", pageWidth - margin - 50, yPosition);
      doc.text(`Rs. ${Number(data.total_amount || 0).toFixed(2)}`, pageWidth - margin - rightPadding, yPosition, { align: "right" });

      yPosition += 8;
      doc.setFont(undefined, "normal");
      doc.setFontSize(8);
      doc.text(`Amount in Words: Rs. ${numberToWords(Math.round(data.total_amount))}`, margin, yPosition);

      yPosition += 10;

      // ===== FOOTER =====
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, "F");
      const footerColWidth = (pageWidth - 2 * margin) / 3;
      const footerY = yPosition + 6;

      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.text("Payment Info:", margin + 4, footerY);
      doc.setFont(undefined, "normal");
      doc.text("Lab Collection Receipt", margin + 4, footerY + 5);
      doc.text(`Company: ${defaultDetails.hospital_name}`, margin + 4, footerY + 12);
      doc.text(`Contact: ${defaultDetails.phone}`, margin + 4, footerY + 16);

      const qrCenterX = margin + footerColWidth;
      doc.setFont(undefined, "bold");
      doc.text("Scan & Pay:", qrCenterX + footerColWidth/2, footerY, { align: "center" });
      doc.addImage(qrImg, "JPEG", qrCenterX + (footerColWidth - 22)/2, footerY + 5, 22, 22);

      const sigX = margin + 2 * footerColWidth;
      doc.text("For GENELIFE PLUS", pageWidth - margin - 4, footerY, { align: "right" });
      doc.line(pageWidth - margin - 30, footerY + 25, pageWidth - margin - 4, footerY + 25);
      doc.text("Authorized Signatory", pageWidth - margin - 4, footerY + 30, { align: "right" });

      doc.save(`LAB_RECEIPT_${data.order_id}.pdf`);
      console.log("✅ PDF generated successfully!");
    } catch (err) {
      console.error("❌ ERROR generating PDF:", err);
      alert("Error generating PDF. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ms-panel mt-4" style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <div className="ms-panel-header">
        <h6 style={{ color: "#288C4C" }}>Lab Receipt Generator</h6>
      </div>
      <div className="ms-panel-body">
        <div className="lr-container" style={{ marginBottom: "20px" }}>
          <form className="lr-form" onSubmit={handleSubmit}>
            <div className="lr-group mb-3">
              <label className="form-label">Order ID</label>
              <select
                className="form-select"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              >
                <option value="">--Select Order--</option>
                {orders.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Age</label>
                <input className="form-control" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sex</label>
                <select className="form-select" value={sex} onChange={(e) => setSex(e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                  <option value="O">O</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={loading} style={{ background: "#00BFFF", border: "none" }}>
              {loading ? "Processing..." : "Submit & Generate PDF Receipt"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
