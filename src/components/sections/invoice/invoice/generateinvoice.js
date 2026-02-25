import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import logo from "../../../../assets/img/dashboard/logo.jpeg"; // adjust path
import { getInvoicesmonthlyApi } from "../../../api/endpoint";// adjust path
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import Docx from "docx";
import { Packer, Document, Paragraph, Table, TableRow, TableCell, WidthType, TextRun } from "docx";

const GenerateInoive = () => {
  const [invoices, setInvoices] = useState([]);
  const [hospital, setHospital] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cgstPercent, setCgstPercent] = useState(0);
  const [sgstPercent, setSgstPercent] = useState(0);

  useEffect(() => {
    if (hospital && month && year) fetchInvoices();
  }, [hospital, month, year]);

  const fetchInvoices = async () => {
    try {
      const res = await getInvoicesmonthlyApi(hospital, month, year);
      if (res.status) setInvoices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateAmounts = () => {
    let subtotal = 0;
    invoices.forEach((inv) => (subtotal += parseFloat(inv.invoice_amount || 0)));
    const cgst = (subtotal * cgstPercent) / 100;
    const sgst = (subtotal * sgstPercent) / 100;
    const total = subtotal + cgst + sgst;
    const received = invoices.reduce((acc, inv) => acc + parseFloat(inv.received_amount || 0), 0);
    const balance = total - received;
    return { subtotal, cgst, sgst, total, received, balance };
  };

  const downloadPDF = () => {
    const { subtotal, cgst, sgst, total, received, balance } = calculateAmounts();
    const doc = new jsPDF();

    doc.addImage(logo, "JPEG", 10, 10, 50, 20);
    doc.setFontSize(14);
    doc.text("GENELIFE PLUS - PROFORMA INVOICE", 70, 20);

    const tableData = invoices.map((inv, index) => [
      index + 1,
      inv.record_date,
      inv.order_id,
      inv.hospital_name,
      inv.test_name,
      inv.invoice_amount,
    ]);

    doc.autoTable({
      head: [["#", "Date", "Order ID", "Patient", "Test Name(s)", "Amount"]],
      body: tableData,
      startY: 40,
    });

    let finalY = doc.lastAutoTable.finalY + 10;

    doc.text(`Subtotal: ₹ ${subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`CGST@${cgstPercent}%: ₹ ${cgst.toFixed(2)}`, 140, finalY + 7);
    doc.text(`SGST@${sgstPercent}%: ₹ ${sgst.toFixed(2)}`, 140, finalY + 14);
    doc.setFontSize(16);
    doc.text(`Total: ₹ ${total.toFixed(2)}`, 140, finalY + 22);
    doc.setFontSize(12);
    doc.text(`Received: ₹ ${received.toFixed(2)}`, 140, finalY + 30);
    doc.text(`Balance: ₹ ${balance.toFixed(2)}`, 140, finalY + 38);

    doc.save(`MonthlyInvoice_${month}_${year}.pdf`);
  };

  const downloadWord = async () => {
    const { subtotal, cgst, sgst, total, received, balance } = calculateAmounts();

    const tableRows = invoices.map((inv, index) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(`${index + 1}`)] }),
          new TableCell({ children: [new Paragraph(inv.record_date)] }),
          new TableCell({ children: [new Paragraph(inv.order_id)] }),
          new TableCell({ children: [new Paragraph(inv.hospital_name)] }),
          new TableCell({ children: [new Paragraph(inv.test_name)] }),
          new TableCell({ children: [new Paragraph(`${inv.invoice_amount}`)] }),
        ],
      })
    );

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ children: [new TextRun("GENELIFE PLUS - PROFORMA INVOICE")], spacing: { after: 300 } }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("#")] }),
                    new TableCell({ children: [new Paragraph("Date")] }),
                    new TableCell({ children: [new Paragraph("Order ID")] }),
                    new TableCell({ children: [new Paragraph("Patient")] }),
                    new TableCell({ children: [new Paragraph("Test Name(s)")] }),
                    new TableCell({ children: [new Paragraph("Amount")] }),
                  ],
                }),
                ...tableRows,
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
            new Paragraph({ text: `Subtotal: ₹ ${subtotal.toFixed(2)}` }),
            new Paragraph({ text: `CGST@${cgstPercent}%: ₹ ${cgst.toFixed(2)}` }),
            new Paragraph({ text: `SGST@${sgstPercent}%: ₹ ${sgst.toFixed(2)}` }),
            new Paragraph({ text: `Total: ₹ ${total.toFixed(2)}` }),
            new Paragraph({ text: `Received: ₹ ${received.toFixed(2)}` }),
            new Paragraph({ text: `Balance: ₹ ${balance.toFixed(2)}` }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `MonthlyInvoice_${month}_${year}.docx`);
  };

  const { subtotal, cgst, sgst, total, received, balance } = calculateAmounts();

  return (
    <div className="container mt-4">
      <h3>Monthly Invoice</h3>
      <Form className="mb-3 d-flex gap-3">
        <Form.Control
          type="text"
          placeholder="Hospital Name"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="Month (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="Year (YYYY)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="CGST %"
          value={cgstPercent}
          onChange={(e) => setCgstPercent(e.target.value)}
        />
        <Form.Control
          type="number"
          placeholder="SGST %"
          value={sgstPercent}
          onChange={(e) => setSgstPercent(e.target.value)}
        />
        <Button onClick={fetchInvoices}>Fetch</Button>
      </Form>

      {invoices.length > 0 && (
        <>
          <Button className="me-2" onClick={downloadPDF}>
            Download PDF
          </Button>
          <Button onClick={downloadWord}>Download Word</Button>

          <div className="mt-4">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Patient</th>
                  <th>Test Name(s)</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, index) => (
                  <tr key={inv.invoice_id}>
                    <td>{index + 1}</td>
                    <td>{inv.record_date}</td>
                    <td>{inv.order_id}</td>
                    <td>{inv.hospital_name}</td>
                    <td>{inv.test_name}</td>
                    <td>{inv.invoice_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-2">
              <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
              <p>CGST@{cgstPercent}%: ₹ {cgst.toFixed(2)}</p>
              <p>SGST@{sgstPercent}%: ₹ {sgst.toFixed(2)}</p>
              <h5>Total: ₹ {total.toFixed(2)}</h5>
              <p>Received: ₹ {received.toFixed(2)}</p>
              <p>Balance: ₹ {balance.toFixed(2)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GenerateInoive;
