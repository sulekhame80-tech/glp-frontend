import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { createLabReceiptApi, getLabReceiptPdfApi, getOrdersApi } from "../../../api/endpoint";
import logo from "../../../../assets/img/dashboard/logo.jpeg";

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

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 40;

      // ===== HEADER =====
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, pageWidth, 80, "F");
      doc.setFontSize(26);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, "bold");
      doc.text((data.hospital?.hospital_name || "").toUpperCase(), pageWidth / 2, 50, { align: "center" });

      y = 100;
      const lineSpacing = 18;

      // ===== PATIENT INFO =====
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "normal");

      doc.text(`Name: ${data.patient?.name || ""}`, 40, y);
      doc.text(`Mobile: ${data.patient?.mobile_no || ""}`, 300, y);
      y += lineSpacing;

      doc.text(`Age: ${data.patient?.age || ""}`, 40, y);
      doc.text(`Sex: ${data.patient?.sex || ""}`, 150, y);
      doc.text(`Date: ${data.date || ""}`, 300, y);
      y += lineSpacing;

      doc.text(`Sample ID: ${data.patient?.sample_id || ""}`, 40, y);
      doc.text(`Order No: ${data.order_id || ""}`, 300, y);
      y += 30;

      // ===== TEST TABLE =====
      autoTable(doc, {
        startY: y,
        head: [["Test Name"]],
        body: data.tests?.length > 0 ? data.tests.map((t) => [t.name || ""]) : [["No tests available"]],
        theme: "grid",
        headStyles: { fillColor: [0, 102, 204], textColor: 255, fontSize: 12, halign: "center", fontStyle: "bold" },
        styles: { fontSize: 11, cellPadding: 6 },
        margin: { left: 40, right: 40 },
      });

      y = doc.lastAutoTable.finalY + 20;

      // ===== TOTAL AMOUNT RIGHT =====
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(`Total Amount: ${Number(data.total_amount || 0).toFixed(2)}`, pageWidth - 40, y, { align: "right" });

      y += 40;

      // ===== FOOTER =====
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text("Thank you for visiting. Wishing you good health.", pageWidth / 2, y, { align: "center" });

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
    <div className="ms-panel mt-4">
      <div className="ms-panel-header">
        <h6>Bill Generate</h6>
      </div>
      <div className="ms-panel-body">
        <div className="lr-container" style={{ marginBottom: "20px" }}>
          <form className="lr-form" onSubmit={handleSubmit}>
            <div className="lr-group">
              <label>Order ID</label>
             <select
  className="lr-input"
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
            <div className="lr-row">
              <div className="lr-group lr-flex1">
                <label>Age</label>
                <input className="lr-input" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="lr-group lr-fixed">
                <label>Sex</label>
                <select className="lr-input" value={sex} onChange={(e) => setSex(e.target.value)}>
                  <option value="">--Select--</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                  <option value="O">O</option>
                </select>
              </div>
            </div>
            <button className="lr-btn" type="submit" disabled={loading}>
              {loading ? "Processing..." : "Submit & Generate PDF"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
