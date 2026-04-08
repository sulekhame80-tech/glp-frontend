import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import logo from "../../../../assets/img/dashboard/logo.jpeg";
import qrCode from "../../../../assets/img/dashboard/qr-code.jpeg";
import { getInvoicesmonthlyApi } from "../../../api/endpoint";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  VerticalAlign,
  AlignmentType,
  WidthType,
  ImageRun,
  TableLayoutType
} from "docx";

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

async function imageToBuffer(src) {
  const res = await fetch(src);
  return await res.arrayBuffer();
}

const GenerateInoive = () => {
  const [invoices, setInvoices] = useState([]);
  const [hospital, setHospital] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cgstPercent, setCgstPercent] = useState(0);
  const [sgstPercent, setSgstPercent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hospital && month && year) fetchInvoices();
  }, [hospital, month, year]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await getInvoicesmonthlyApi(hospital, month, year);
      const data = res.data?.data || res.data || [];
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAmounts = () => {
    let subtotal = 0;
    invoices.forEach((inv) => (subtotal += parseFloat(inv.invoice_amount || 0)));
    const cgst = (subtotal * parseFloat(cgstPercent || 0)) / 100;
    const sgst = (subtotal * parseFloat(sgstPercent || 0)) / 100;
    const total = subtotal + cgst + sgst;
    // Assuming 'received_amount' is already available or same as total if fully paid
    const received = invoices.reduce((acc, inv) => acc + parseFloat(inv.received_amount || 0), 0);
    const balance = total - received;
    return { subtotal, cgst, sgst, total, received, balance };
  };

  const downloadPDF = async () => {
    try {
      if (invoices.length === 0) { alert("Fetch invoices first"); return; }
      const { subtotal, cgst, sgst, total, received, balance } = calculateAmounts();

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
      doc.text("PROFORMA INVOICE", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;

      // ===== BILL TO & INVOICE DETAILS =====
      const colGap = 5;
      const colWidth = (pageWidth - 2 * margin - colGap) / 2;
      const boxHeight = 28;
      const headerHeight = 7;

      doc.setFillColor(160, 120, 180);
      doc.rect(margin, yPosition, colWidth, headerHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("Bill To -", margin + 3, yPosition + 4.5);
      doc.setDrawColor(221, 221, 221);
      doc.rect(margin, yPosition, colWidth, boxHeight);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, "bold");
      doc.setFontSize(9);
      doc.text(hospital || "GENELIFE PLUS", margin + 3, yPosition + headerHeight + 5);
      doc.setFont(undefined, "normal");
      doc.setFontSize(8);
      const addressLines = doc.splitTextToSize(defaultDetails.address, colWidth - 6);
      doc.text(addressLines, margin + 3, yPosition + headerHeight + 9);

      const rightColX = margin + colWidth + colGap;
      doc.setFillColor(160, 120, 180);
      doc.rect(rightColX, yPosition, colWidth, headerHeight, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("Invoice Details -", rightColX + 3, yPosition + 4.5);
      doc.rect(rightColX, yPosition, colWidth, boxHeight);
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.text("Invoice No:", rightColX + 3, yPosition + headerHeight + 5);
      doc.setFont(undefined, "normal");
      doc.text(`GLP-${year}-${month}-${Date.now().toString().slice(-4)}`, rightColX + 25, yPosition + headerHeight + 5);
      doc.setFont(undefined, "bold");
      doc.text("Date:", rightColX + 3, yPosition + headerHeight + 10);
      doc.setFont(undefined, "normal");
      doc.text(`${new Date().toLocaleDateString('en-IN')}`, rightColX + 25, yPosition + headerHeight + 10);

      yPosition += boxHeight + 8;

      // ===== TABLE =====
      const tableData = invoices.map((inv, index) => [
        index + 1,
        inv.record_date || inv.date || "",
        inv.order_id || "",
        inv.patient_name || inv.patient || inv.hospital_name || "",
        inv.test_name || "",
        `Rs.${parseFloat(inv.invoice_amount || 0).toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [["#", "Date", "Order ID", "Patient", "Test Name(s)", "Amount"]],
        body: tableData,
        margin: { left: margin, right: margin },
        theme: "grid",
        headerStyles: { fillColor: [0, 191, 255], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 25, halign: "center" },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: 57 },
          5: { cellWidth: 25, halign: "right" }
        }
      });

      yPosition = doc.lastAutoTable.finalY + 8;
      const rightPadding = 2;

      // ===== SUMMARY =====
      const totalsWidth = 70;
      const totalsX = pageWidth - margin - totalsWidth;
      const drawRow = (label, amt, y, bold = false) => {
        doc.setFont(undefined, bold ? "bold" : "normal");
        doc.text(label, totalsX, y);
        doc.text(`Rs. ${parseFloat(amt).toFixed(2)}`, pageWidth - margin - rightPadding, y, { align: "right" });
        return y + 6;
      };

      yPosition = drawRow("Sub Total", subtotal, yPosition, true);
      yPosition = drawRow(`SGST@${sgstPercent}%`, sgst, yPosition, true);
      yPosition = drawRow(`CGST@${cgstPercent}%`, cgst, yPosition, true);

      const totalBoxY = yPosition + 2;
      doc.setFillColor(0, 191, 255);
      doc.rect(totalsX - 2, totalBoxY - 4, totalsWidth + 2, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("TOTAL", totalsX, totalBoxY + 1.5);
      doc.text(`Rs. ${totalAmount.toFixed(2)}`, pageWidth - margin - rightPadding, totalBoxY + 1.5, { align: "right" });

      yPosition = totalBoxY + 12;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.text(`Invoice Amount in Words: Rs. ${numberToWords(Math.round(totalAmount))}`, margin, yPosition);
      
      yPosition += 10;
      doc.setDrawColor(200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;

      const halfWidth = (pageWidth - 2 * margin - 10) / 2;
      doc.setFont(undefined, "bold");
      doc.setFontSize(9);
      doc.text("Terms And Conditions :-", margin, yPosition);
      doc.setFont(undefined, "normal");
      doc.setFontSize(8);
      doc.text("100% payment to be made for order booking", margin, yPosition + 5);

      const receivedX = margin + halfWidth + 10;
      doc.setFont(undefined, "bold");
      doc.text("Received", receivedX, yPosition);
      doc.text(`Rs. ${received.toFixed(2)}`, pageWidth - margin - rightPadding, yPosition, { align: "right" });
      doc.text("Balance", receivedX, yPosition + 5);
      doc.text(`Rs. ${balance.toFixed(2)}`, pageWidth - margin - rightPadding, yPosition + 5, { align: "right" });

      yPosition += 15;
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, "F");
      const footerColWidth = (pageWidth - 2 * margin) / 3;
      const footerY = yPosition + 6;

      doc.setFontSize(8);
      doc.setFont(undefined, "bold");
      doc.text("Payment Mode:", margin + 4, footerY);
      doc.setFont(undefined, "normal");
      doc.text("Online – QR Code", margin + 4, footerY + 5);
      doc.text(`Bank: ${defaultDetails.bank_name}`, margin + 4, footerY + 12);
      doc.text(`Acc: ${defaultDetails.account_no}`, margin + 4, footerY + 16);
      doc.text(`IFSC: ${defaultDetails.ifsc_code}`, margin + 4, footerY + 20);

      const qrCenterX = margin + footerColWidth;
      doc.setFont(undefined, "bold");
      doc.text("Scan & Pay:", qrCenterX + footerColWidth/2, footerY, { align: "center" });
      doc.addImage(qrImg, "JPEG", qrCenterX + (footerColWidth - 22)/2, footerY + 5, 22, 22);

      const sigX = margin + 2 * footerColWidth;
      doc.text("For GENELIFE PLUS", pageWidth - margin - 4, footerY, { align: "right" });
      doc.line(pageWidth - margin - 30, footerY + 25, pageWidth - margin - 4, footerY + 25);
      doc.text("Authorized Signatory", pageWidth - margin - 4, footerY + 30, { align: "right" });

      doc.save(`Invoice_${hospital || "Bill"}_${year}_${month}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF: " + err.message);
    }
  };

  const downloadWord = async () => {
    try {
      if (invoices.length === 0) { alert("Fetch invoices first"); return; }
      const { subtotal, cgst, sgst, total, received, balance } = calculateAmounts();
      const logoBuffer = await imageToBuffer(logo);
      const qrBuffer = await imageToBuffer(qrCode);

      const recordRows = invoices.map((inv, index) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(`${index + 1}`)] }),
            new TableCell({ children: [new Paragraph(inv.record_date || "")] }),
            new TableCell({ children: [new Paragraph(inv.order_id || "")] }),
            new TableCell({ children: [new Paragraph(inv.hospital_name || "")] }),
            new TableCell({ children: [new Paragraph(inv.test_name || "")] }),
            new TableCell({ children: [new Paragraph(`Rs.${inv.invoice_amount || 0}`)], alignment: AlignmentType.RIGHT }),
          ],
        })
      );

      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({
              children: [new ImageRun({ data: logoBuffer, transformation: { width: 60, height: 40 } })],
              spacing: { after: 200 }
            }),
            new Paragraph({ text: "GENELIFE PLUS", bold: true, size: 32, color: "288C4C" }),
            new Paragraph({ text: "PROFORMA INVOICE", bold: true, size: 28, color: "00BFFF", alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("#")], shading: { fill: "00BFFF" } }),
                    new TableCell({ children: [new Paragraph("Date")], shading: { fill: "00BFFF" } }),
                    new TableCell({ children: [new Paragraph("Order ID")], shading: { fill: "00BFFF" } }),
                    new TableCell({ children: [new Paragraph("Patient")], shading: { fill: "00BFFF" } }),
                    new TableCell({ children: [new Paragraph("Test Name(s)")], shading: { fill: "00BFFF" } }),
                    new TableCell({ children: [new Paragraph("Amount")], shading: { fill: "00BFFF" } }),
                  ],
                }),
                ...recordRows,
              ],
            }),
            new Paragraph({ text: `Subtotal: Rs. ${subtotal.toFixed(2)}`, alignment: AlignmentType.RIGHT, spacing: { before: 200 } }),
            new Paragraph({ text: `Total: Rs. ${total.toFixed(2)}`, bold: true, alignment: AlignmentType.RIGHT }),
            new Paragraph({ text: `Received: Rs. ${received.toFixed(2)}`, alignment: AlignmentType.RIGHT }),
            new Paragraph({ text: `Balance: Rs. ${balance.toFixed(2)}`, bold: true, alignment: AlignmentType.RIGHT }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Invoice_${hospital || "Bill"}.docx`);
    } catch (err) {
       console.error(err);
    }
  };

  const { subtotal, cgst, sgst, total, received, balance } = calculateAmounts();

  return (
    <div className="container mt-4" style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h3 style={{ color: "#288C4C", marginBottom: "20px" }}>General Bill Generator</h3>
      <Form className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <Form.Label>Hospital / Patient Name</Form.Label>
            <Form.Control type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} />
          </div>
          <div className="col-md-2">
            <Form.Label>Month (1-12)</Form.Label>
            <Form.Control type="number" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
          <div className="col-md-2">
            <Form.Label>Year</Form.Label>
            <Form.Control type="number" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="col-md-2">
            <Form.Label>CGST %</Form.Label>
            <Form.Control type="number" value={cgstPercent} onChange={(e) => setCgstPercent(e.target.value)} />
          </div>
          <div className="col-md-2">
            <Form.Label>SGST %</Form.Label>
            <Form.Control type="number" value={sgstPercent} onChange={(e) => setSgstPercent(e.target.value)} />
          </div>
        </div>
        <Button variant="success" className="mt-3" onClick={fetchInvoices} disabled={loading}>
          {loading ? "Fetching..." : "Fetch Bill Records"}
        </Button>
      </Form>

      {invoices.length > 0 && (
        <div className="ms-panel">
          <div className="ms-panel-header d-flex justify-content-between align-items-center">
            <h6>Bill Preview — {hospital}</h6>
            <div>
              <Button variant="info" className="me-2" onClick={downloadPDF}>Download PDF</Button>
              <Button variant="secondary" onClick={downloadWord}>Download Word</Button>
            </div>
          </div>
          <div className="ms-panel-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead style={{ background: "#00BFFF", color: "#fff" }}>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Patient</th>
                    <th>Test Name(s)</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{inv.record_date}</td>
                      <td>{inv.order_id}</td>
                      <td>{inv.hospital_name}</td>
                      <td>{inv.test_name}</td>
                      <td className="text-end">Rs.{parseFloat(inv.invoice_amount || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 border rounded bg-light" style={{ maxWidth: "400px", marginLeft: "auto" }}>
              <div className="d-flex justify-content-between"><span>Subtotal:</span> <strong>Rs. {subtotal.toFixed(2)}</strong></div>
              <div className="d-flex justify-content-between"><span>CGST ({cgstPercent}%):</span> <strong>Rs. {cgst.toFixed(2)}</strong></div>
              <div className="d-flex justify-content-between"><span>SGST ({sgstPercent}%):</span> <strong>Rs. {sgst.toFixed(2)}</strong></div>
              <hr />
              <div className="d-flex justify-content-between text-primary"><h5>Total:</h5> <h5>Rs. {total.toFixed(2)}</h5></div>
              <div className="d-flex justify-content-between text-success"><span>Received:</span> <span>Rs. {received.toFixed(2)}</span></div>
              <div className="d-flex justify-content-between text-danger"><span>Balance:</span> <span>Rs. {balance.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateInoive;
