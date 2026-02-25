// src/pages/invoice/MonthlyInvoice.jsx
import React, { useEffect, useState, useRef } from "react";
import Breadcrumb from "../../../layouts/Breadcrumb";
import { Button, Form } from "react-bootstrap";
import {
  getMonthWiseRecordsApi,
  createmonthlyInvoiceApi,
  getInvoicesmonthlyApi,
  getclinicianApi,
} from "../../../api/endpoint";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../../assets/img/dashboard/logo.jpeg";
import qrCode from "../../../../assets/img/dashboard/qr-code.jpeg";

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
  HeadingLevel,
  ImageRun,
  TableLayoutType
} from "docx";
import { saveAs } from "file-saver";
import "./invoice.css";

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

// Default company details - used across PDF, Word, and Preview
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

export default function MonthlyInvoice() {
  const [hospitalName,setHospitalName]=useState("");
  const [doctorName,setDoctorName]=useState("");
  const [clinicians, setClinicians] = useState([]);
  const [selectedClinicianId, setSelectedClinicianId] = useState("");
  const [month,setMonth]=useState("");
  const [year,setYear]=useState(new Date().getFullYear());
  const [records,setRecords]=useState([]);
  const [selectedIds,setSelectedIds]=useState(new Set());
  const [selectAll,setSelectAll]=useState(false);
  const [invoiceMeta,setInvoiceMeta]=useState({
    invoice_no:"", bill_to:"", received_amount:0, sgst:0, cgst:0, remarks:""
  });
  const [createdInvoice,setCreatedInvoice]=useState(null);
  const [loading,setLoading]=useState(false);
  const [hospitalDetails,setHospitalDetails]=useState({});
  const [showPreview,setShowPreview]=useState(false);
  const [responseMessage,setResponseMessage]=useState({type:null, title:"", message:"", details:null});
  const invoiceRef=useRef();

  const monthOptions=[{v:1,l:"January"},{v:2,l:"February"},{v:3,l:"March"},{v:4,l:"April"},{v:5,l:"May"},{v:6,l:"June"},{v:7,l:"July"},{v:8,l:"August"},{v:9,l:"September"},{v:10,l:"October"},{v:11,l:"November"},{v:12,l:"December"}];

  const fetchMonthRecords=async()=>{
    if(!hospitalName||!month||!year){alert("Provide Hospital, Month, Year"); return;}
    setLoading(true);
    try{
      const res=await getMonthWiseRecordsApi(hospitalName,doctorName,month,year);
      const data=res.data?.data??res.data??[];
      const normalized=data.map(r=>({
        ...r,
        msp:parseFloat(r.total_msp??0),
        mrp:parseFloat(r.total_mrp??0),
        b2b_price:parseFloat(r.total_b2b??0),
        price_type:"msp",
        custom_price:r.test_price??0,
        test_name:typeof r.test_name==="string"?(r.test_name.startsWith("[")?JSON.parse(r.test_name.replace(/'/g,'"').replace(/None/g,"null")):r.test_name):r.test_name,
        test_price:parseFloat(r.test_price??0)
      }));
      setRecords(normalized);
      setSelectedIds(new Set());
      setSelectAll(false);
      setCreatedInvoice(null);
      
      // Fetch hospital details from API
      try{
        const invoiceRes=await getInvoicesmonthlyApi(hospitalName);
        const details=invoiceRes.data?.data?.[0]??invoiceRes.data?.[0]??{};
       console.log("Fetched hospital details:", details);
        setHospitalDetails(details);
      }catch(err){console.error("Failed to fetch hospital details:",err);}
    }catch(err){console.error(err); alert("Failed to fetch records");}
    finally{setLoading(false);}
  }

  const toggleSelect=id=>{
    const set=new Set(selectedIds);
    if(set.has(id))set.delete(id); else set.add(id);
    setSelectedIds(set);
    setSelectAll(set.size===records.length && records.length>0);
  }

  const toggleSelectAll=()=>{
    if(selectAll){setSelectedIds(new Set()); setSelectAll(false);}
    else{const all=new Set(records.map(r=>r.lab_record_id??r.id)); setSelectedIds(all); setSelectAll(true);}
  }

  const selectedRecords=records.filter(r=>selectedIds.has(r.lab_record_id??r.id));
  const subtotal=selectedRecords.reduce((sum,r)=>{
    let price=0;
    if(r.price_type==="mrp")price=r.mrp||0;
    else if(r.price_type==="b2b")price=r.b2b_price||0;
    else if(r.price_type==="custom")price=r.custom_price||0;
    else price=r.msp||0;
    return sum+price;
  },0);

  const sgstAmount=(subtotal*parseFloat(invoiceMeta.sgst||0))/100;
  const cgstAmount=(subtotal*parseFloat(invoiceMeta.cgst||0))/100;
  const totalAmount=subtotal+sgstAmount+cgstAmount;
  const received=parseFloat(invoiceMeta.received_amount||0);

  const updateMeta=(key,val)=>setInvoiceMeta(p=>({...p,[key]:val}));

  useEffect(()=>{if(!invoiceMeta.bill_to)updateMeta("bill_to",hospitalName);},[hospitalName,invoiceMeta.bill_to]);

  // Load clinicians/hospitals for dropdown
  useEffect(() => {
    let mounted = true;
    getclinicianApi()
      .then((res) => {
        const list = res.data?.data || res.data || [];
        if (mounted) setClinicians(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.error("Failed to load clinicians:", err));
    return () => { mounted = false; };
  }, []);

  const handleCreateInvoice=async()=>{
    console.log("[Invoice] start: selectedIds=", Array.from(selectedIds));
    if(selectedIds.size===0){if(!window.confirm("No records selected. Create invoice?"))return;}
    const payload={
      hospital_name:hospitalName,
      doctor_name:doctorName,
      month, year,
      invoice_no:invoiceMeta.invoice_no||`GLP-${year}-${Date.now()}`,
      bill_to:invoiceMeta.bill_to||hospitalName,
      invoice_amount:totalAmount,
      received_amount:totalAmount,
      sgst:invoiceMeta.sgst,
      cgst:invoiceMeta.cgst,
      remarks:invoiceMeta.remarks,
      lab_record_ids:Array.from(selectedIds)
    };
    try{
      console.log("[Invoice] payload:", payload);
      setLoading(true);
      setResponseMessage({type:null, title:"", message:"", details:null});
      console.log("[Invoice] sending create request...");
      const res=await createmonthlyInvoiceApi(payload);
      console.log("[Invoice] response:", res);
      const responseData=res.data?.data??res.data;
      setCreatedInvoice(responseData);
      
      if(res.status===200 || res.status===201){
        setResponseMessage({
          type:"success",
          title:"✓ Invoice Created Successfully",
          message:responseData?.message||"Invoice has been created and saved.",
          details:responseData
        });
      }else{
        setResponseMessage({
          type:"error",
          title:"✗ Failed to Create Invoice",
          message:responseData?.message||"An error occurred while creating the invoice.",
          details:responseData
        });
      }
      console.log("[Invoice] finished, createdInvoice=", responseData);
    }catch(err){
      console.error("[Invoice] error:", err);
      const errorMsg=err.response?.data?.message||err.message||"Failed to create invoice";
      setResponseMessage({
        type:"error",
        title:"✗ Error Creating Invoice",
        message:errorMsg,
        details:err.response?.data||{error:err.message}
      });
    }
    finally{setLoading(false); console.log("[Invoice] end");}
  }

  function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.src = src;
  });
}
function checkPage(pdf, y, margin = 20) {
  if (y > pdf.internal.pageSize.getHeight() - margin) {
    pdf.addPage();
    return 20;
  }
  return y;
}

// Helper function to convert image to ArrayBuffer
async function imageToBuffer(src) {
  const res = await fetch(src);
  return await res.arrayBuffer();
}

const handleDownloadPdf = async () => {
  try {
    if (selectedRecords.length === 0) { alert("Select records first"); return; }

    const defaultDetails = DEFAULT_COMPANY_DETAILS;
    
    // Calculate totals
    const subtotal = selectedRecords.reduce((sum, r) => sum + (r.test_price || r.price || 0), 0);
    const sgstAmount = (subtotal * (invoiceMeta.sgst || 0)) / 100;
    const cgstAmount = (subtotal * (invoiceMeta.cgst || 0)) / 100;
    const totalAmount = subtotal + sgstAmount + cgstAmount;

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    let yPosition = margin;

    // Load images
    const logoImg = await loadImage(logo);
    const qrImg = await loadImage(qrCode);

    // ===== HEADER SECTION =====
    pdf.addImage(logoImg, "JPEG", margin, yPosition, 28, 22);
    
    pdf.setFontSize(14);
    pdf.setTextColor(40, 140, 76);
    pdf.setFont(undefined, "bold");
    pdf.text("GENELIFE PLUS", margin + 35, yPosition + 5);
    
    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, "normal");
    pdf.text("(AUTHORISED COLLECTION CENTRE FOR MEDGENOME LABS LTD.)", margin + 35, yPosition + 10);
    pdf.text(`Phone: ${defaultDetails.phone} | Email: ${defaultDetails.email}`, margin + 35, yPosition + 14);
    pdf.text(`GSTIN: ${defaultDetails.gstin}`, margin + 35, yPosition + 18);

    yPosition += 30;

    // Horizontal line
    pdf.setDrawColor(200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;

    // ===== TITLE =====
    pdf.setFontSize(14);
    pdf.setTextColor(0, 191, 255);
    pdf.setFont(undefined, "bold");
    pdf.text("PROFORMA INVOICE", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // ===== BILL TO & INVOICE DETAILS =====
    const leftColX = margin;
    const leftColWidth = 95;
    const rightColX = leftColX + leftColWidth + 5;
    const rightColWidth = pageWidth - rightColX - margin;

    // Bill To Box
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(160, 120, 180);
    pdf.setFont(undefined, "bold");
    pdf.rect(leftColX, yPosition, leftColWidth, 28, "F");
    pdf.text("Bill To -", leftColX + 3, yPosition + 4);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, "normal");
    pdf.setFontSize(8);
    pdf.text(defaultDetails.hospital_name, leftColX + 3, yPosition + 8);
    pdf.text(defaultDetails.address, leftColX + 3, yPosition + 12);
    pdf.text(`GSTIN: ${defaultDetails.gstin}`, leftColX + 3, yPosition + 16);

    // Invoice Details Box
    pdf.setFontSize(9);
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(160, 120, 180);
    pdf.setFont(undefined, "bold");
    pdf.rect(rightColX, yPosition, rightColWidth, 28, "F");
    pdf.text("Invoice Details -", rightColX + 3, yPosition + 4);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, "normal");
    pdf.setFontSize(8);
    pdf.text(`Invoice No: ${invoiceMeta.invoice_no || ""}`, rightColX + 3, yPosition + 8);
    pdf.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, rightColX + 3, yPosition + 12);

    yPosition += 35;

    // ===== RECORDS TABLE =====
    const tableData = selectedRecords.map((r, idx) => {
      const testNames = Array.isArray(r.test_name) ? r.test_name.join(", ") : r.test_name;
      return [
        (idx + 1).toString(),
        r.date ? new Date(r.date).toLocaleDateString('en-IN') : "",
        r.patient_name || r.patient || "",
        testNames,
        `₹${r.test_price?.toFixed(2) || "0.00"}`
      ];
    });

    autoTable(pdf, {
      startY: yPosition,
      head: [["#", "Date", "Patient Name", "Test Name(s)", "Amount"]],
      body: tableData,
      margin: { left: margin, right: margin },
      theme: "grid",
      headerStyles: { fillColor: [0, 191, 255], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 40 },
        3: { cellWidth: 60 },
        4: { cellWidth: 25, halign: "right" }
      }
    });

    yPosition = pdf.lastAutoTable.finalY + 10;

    // ===== DESCRIPTION =====
    pdf.setFontSize(8);
    pdf.setFont(undefined, "normal");
    pdf.text(`Description: - Ref: ${invoiceMeta.remarks || ""}`, margin, yPosition);
    yPosition += 10;

    // ===== TOTALS =====
    const totalsX = pageWidth - margin - 60;
    const totalsWidth = 60;

    pdf.setFont(undefined, "normal");
    pdf.setFontSize(8);
    pdf.text("Sub Total", totalsX, yPosition);
    pdf.text(`₹ ${subtotal.toFixed(2)}`, totalsX + totalsWidth - 5, yPosition, { align: "right" });
    yPosition += 6;

    pdf.text(`SGST@${invoiceMeta.sgst || 0}%`, totalsX, yPosition);
    pdf.text(`₹ ${sgstAmount.toFixed(2)}`, totalsX + totalsWidth - 5, yPosition, { align: "right" });
    yPosition += 6;

    pdf.text(`CGST@${invoiceMeta.cgst || 0}%`, totalsX, yPosition);
    pdf.text(`₹ ${cgstAmount.toFixed(2)}`, totalsX + totalsWidth - 5, yPosition, { align: "right" });
    yPosition += 8;

    // Total Box
    pdf.setFillColor(0, 191, 255);
    pdf.rect(totalsX, yPosition - 4, totalsWidth, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont(undefined, "bold");
    pdf.text("Total", totalsX, yPosition);
    pdf.text(`₹ ${totalAmount.toFixed(2)}`, totalsX + totalsWidth - 5, yPosition, { align: "right" });
    yPosition += 12;

    // Amount in words
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, "normal");
    pdf.setFontSize(7);
    pdf.text(`Invoice Amount in Words: Rs. ${numberToWords(Math.round(totalAmount))}`, margin, yPosition);
    yPosition += 8;

    // ===== TERMS & CONDITIONS + RECEIVED & BALANCE =====
    const termColWidth = (pageWidth - 2 * margin - 15) / 2;

    // Terms box
    pdf.setFont(undefined, "bold");
    pdf.setFontSize(8);
    pdf.text("Terms And Conditions :-", margin, yPosition);
    pdf.setFont(undefined, "normal");
    pdf.setFontSize(7);
    pdf.text("100% payment to be made for order booking", margin, yPosition + 5);

    // Received & Balance box
    const receivedX = margin + termColWidth + 15;
    pdf.setFont(undefined, "bold");
    pdf.setFontSize(8);
    pdf.text("Received", receivedX, yPosition);
    pdf.text(`₹ ${invoiceMeta.received_amount || 0}`, receivedX + 40, yPosition);
    pdf.setFont(undefined, "normal");
    pdf.setFontSize(7);
    yPosition += 5;
    pdf.setFont(undefined, "bold");
    pdf.text("Balance", receivedX, yPosition);
    pdf.text(`₹ ${(totalAmount - (invoiceMeta.received_amount || 0)).toFixed(2)}`, receivedX + 40, yPosition);
    yPosition += 12;

    // ===== FOOTER (3-Column) =====
    // Footer background
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 35, "F");

    const footerColWidth = (pageWidth - 2 * margin - 10) / 3;
    const footerY = yPosition + 3;

    // Left Column - Payment Mode
    pdf.setFont(undefined, "bold");
    pdf.setFontSize(8);
    pdf.text("Payment Mode:", margin + 3, footerY);
    pdf.setFont(undefined, "normal");
    pdf.setFontSize(7);
    pdf.text("Online – QR Code", margin + 3, footerY + 4);
    pdf.setFont(undefined, "bold");
    pdf.text("Pay To:", margin + 3, footerY + 10);
    pdf.setFontSize(6);
    pdf.setFont(undefined, "normal");
    pdf.text(`Bank: ${hospitalDetails?.bank_name || defaultDetails.bank_name}`, margin + 3, footerY + 14);
    pdf.text(`Acc: ${hospitalDetails?.account_no || defaultDetails.account_no}`, margin + 3, footerY + 17);
    pdf.text(`IFSC: ${hospitalDetails?.ifsc_code || defaultDetails.ifsc_code}`, margin + 3, footerY + 20);

    // Center Column - QR Code
    const qrCenterX = margin + footerColWidth + 8;
    pdf.setFont(undefined, "bold");
    pdf.setFontSize(8);
    pdf.text("Scan & Pay:", qrCenterX, footerY);
    pdf.setFontSize(7);
    pdf.setFont(undefined, "normal");
    pdf.text("GENELIFE PLUS", qrCenterX, footerY + 4);
    pdf.setFontSize(6);
    pdf.text("TID: 39805582", qrCenterX, footerY + 7);
    pdf.addImage(qrImg, "JPEG", qrCenterX - 5, footerY + 10, 22, 22);

    // Right Column - Signature
    const sigX = margin + 2 * footerColWidth + 13;
    pdf.setFont(undefined, "bold");
    pdf.setFontSize(8);
    pdf.text("For GENELIFE PLUS", sigX, footerY);
    pdf.line(sigX, footerY + 18, sigX + 25, footerY + 18);
    pdf.setFontSize(6);
    pdf.setFont(undefined, "normal");
    pdf.text("Authorized Signatory", sigX, footerY + 22);

    // Save PDF
    pdf.save(`Invoice_${invoiceMeta.invoice_no || "proforma"}.pdf`);
  } catch (err) {
    console.error("PDF download error:", err);
    alert("Failed to download PDF: " + err.message);
  }
};

const handleDownloadWord = async () => {
    try {
      if (selectedRecords.length === 0) { alert("Select records first"); return; }

      const defaultDetails = DEFAULT_COMPANY_DETAILS;
      
      // Calculate totals
      const subtotal = selectedRecords.reduce((sum, r) => sum + (r.test_price || r.price || 0), 0);
      const sgstAmount = (subtotal * (invoiceMeta.sgst || 0)) / 100;
      const cgstAmount = (subtotal * (invoiceMeta.cgst || 0)) / 100;
      const totalAmount = subtotal + sgstAmount + cgstAmount;

      // Convert images to buffers
      const logoBuffer = await imageToBuffer(logo);
      const qrBuffer = await imageToBuffer(qrCode);

      const children = [];
      
      // ===== HEADER SECTION =====
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: logoBuffer,
              transformation: {
                width: 60,
                height: 40,
              },
            }),
          ],
          spacing: { before: 0, after: 120 }
        }),
        new Paragraph({
          text: "GENELIFE PLUS",
          bold: true,
          size: 32,
          color: "288C4C",
          spacing: { before: 0, after: 0 }
        }),
        new Paragraph({
          text: "(AUTHORISED COLLECTION CENTRE I,4FOR MEDGENOME LABS LTD.)",
          size: 20,
          spacing: { before: 0, after: 80 }
        }),
        new Paragraph({
          text: `Phone no.: ${defaultDetails.phone}`,
          size: 20,
          spacing: { before: 0, after: 60 }
        }),
        new Paragraph({
          text: `Email: ${defaultDetails.email}`,
          size: 20,
          spacing: { before: 0, after: 60 }
        }),
        new Paragraph({
          text: `GSTIN: ${defaultDetails.gstin}`,
          size: 20,
          spacing: { before: 0, after: 120 }
        })
      );

      // Horizontal line separator
      children.push(
        new Paragraph({
          text: "_______________________________________________________________________________",
          spacing: { before: 0, after: 120 }
        })
      );

      // ===== TITLE =====
      children.push(
        new Paragraph({
          text: "PROFORMA INVOICE",
          bold: true,
          size: 28,
          color: "00BFFF",
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 200 }
        })
      );

      // ===== BILL TO & INVOICE DETAILS TABLE =====
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            new TableRow({
              children: [
                // Bill To Cell
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      text: "Bill To -",
                      bold: true,
                      size: 20,
                      color: "FFFFFF",
                      spacing: { before: 100, after: 100 }
                    }),
                    new Paragraph({
                      text: defaultDetails.hospital_name,
                      size: 18,
                      spacing: { before: 0, after: 50 }
                    }),
                    new Paragraph({
                      text: defaultDetails.address,
                      size: 16,
                      spacing: { before: 0, after: 50 }
                    }),
                    new Paragraph({
                      text: `GSTIN: ${defaultDetails.gstin}`,
                      size: 16,
                      spacing: { before: 0, after: 100 }
                    })
                  ],
                  shading: { fill: "A078B4", color: "auto" },
                  borders: {
                    top: { style: BorderStyle.SINGLE, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, color: "000000" },
                    left: { style: BorderStyle.SINGLE, color: "000000" },
                    right: { style: BorderStyle.SINGLE, color: "000000" }
                  },
                  verticalAlign: VerticalAlign.TOP,
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                }),
                // Invoice Details Cell
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  children: [
                    new Paragraph({
                      text: "Invoice Details -",
                      bold: true,
                      size: 20,
                      color: "FFFFFF",
                      spacing: { before: 100, after: 100 }
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Invoice No: ", bold: true }),
                        new TextRun({ text: `${invoiceMeta.invoice_no || ""}` })
                      ],
                      spacing: { before: 0, after: 50 }
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Date: ", bold: true }),
                        new TextRun({ text: new Date().toLocaleDateString('en-IN') })
                      ],
                      spacing: { before: 0, after: 100 }
                    })
                  ],
                  shading: { fill: "A078B4", color: "auto" },
                  borders: {
                    top: { style: BorderStyle.SINGLE, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, color: "000000" },
                    left: { style: BorderStyle.SINGLE, color: "000000" },
                    right: { style: BorderStyle.SINGLE, color: "000000" }
                  },
                  verticalAlign: VerticalAlign.TOP,
                  margins: { top: 100, bottom: 100, left: 100, right: 100 }
                })
              ]
            })
          ]
        })
      );

      children.push(new Paragraph({ text: "", spacing: { before: 120, after: 120 } }));

      // ===== RECORDS TABLE =====
      const recordRows = [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: "#", bold: true, alignment: AlignmentType.CENTER, color: "FFFFFF" })],
              shading: { fill: "00BFFF" },
              width: { size: 800, type: WidthType.DXA }
            }),
            new TableCell({
              children: [new Paragraph({ text: "Date", bold: true, alignment: AlignmentType.CENTER, color: "FFFFFF" })],
              shading: { fill: "00BFFF" },
              width: { size: 1200, type: WidthType.DXA }
            }),
            new TableCell({
              children: [new Paragraph({ text: "Patient Name", bold: true, alignment: AlignmentType.CENTER, color: "FFFFFF" })],
              shading: { fill: "00BFFF" },
              width: { size: 1500, type: WidthType.DXA }
            }),
            new TableCell({
              children: [new Paragraph({ text: "Test Name(s)", bold: true, alignment: AlignmentType.CENTER, color: "FFFFFF" })],
              shading: { fill: "00BFFF" },
              width: { size: 3500, type: WidthType.DXA }
            }),
            new TableCell({
              children: [new Paragraph({ text: "Amount", bold: true, alignment: AlignmentType.RIGHT, color: "FFFFFF" })],
              shading: { fill: "00BFFF" },
              width: { size: 1200, type: WidthType.DXA }
            })
          ]
        })
      ];

      selectedRecords.forEach((r, idx) => {
        const testNames = Array.isArray(r.test_name) ? r.test_name.join(", ") : r.test_name;
        const isAlternate = idx % 2 === 0;
        
        recordRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: (idx + 1).toString(), alignment: AlignmentType.CENTER })],
                shading: isAlternate ? { fill: "F5F5F5" } : { fill: "FFFFFF" },
                width: { size: 800, type: WidthType.DXA }
              }),
              new TableCell({
                children: [new Paragraph({ text: r.date ? new Date(r.date).toLocaleDateString('en-IN') : "" })],
                shading: isAlternate ? { fill: "F5F5F5" } : { fill: "FFFFFF" },
                width: { size: 1200, type: WidthType.DXA }
              }),
              new TableCell({
                children: [new Paragraph({ text: r.patient_name || r.patient || "" })],
                shading: isAlternate ? { fill: "F5F5F5" } : { fill: "FFFFFF" },
                width: { size: 1500, type: WidthType.DXA }
              }),
              new TableCell({
                children: [new Paragraph({ text: testNames })],
                shading: isAlternate ? { fill: "F5F5F5" } : { fill: "FFFFFF" },
                width: { size: 3500, type: WidthType.DXA }
              }),
              new TableCell({
                children: [new Paragraph({ text: `₹${r.test_price?.toFixed(2) || "0.00"}`, alignment: AlignmentType.RIGHT })],
                shading: isAlternate ? { fill: "F5F5F5" } : { fill: "FFFFFF" },
                width: { size: 1200, type: WidthType.DXA }
              })
            ]
          })
        );
      });

      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: recordRows
        })
      );

      children.push(new Paragraph({ text: "", spacing: { before: 120, after: 120 } }));

      // ===== DESCRIPTION & REMARKS =====
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: "Description: - Ref: ", bold: true }),
            new TextRun({ text: invoiceMeta.remarks || "" })
          ],
          spacing: { before: 0, after: 200 }
        })
      );

      // ===== TOTALS TABLE =====
      children.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "Sub Total", alignment: AlignmentType.RIGHT, bold: true })],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                }),
                new TableCell({
                  width: { size: 2400, type: WidthType.DXA },
                  children: [new Paragraph({ text: `₹ ${subtotal.toFixed(2)}`, alignment: AlignmentType.RIGHT })],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  children: [new Paragraph({ text: `SGST@${invoiceMeta.sgst || 0}%`, alignment: AlignmentType.RIGHT, bold: true })],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                }),
                new TableCell({
                  width: { size: 2400, type: WidthType.DXA },
                  children: [new Paragraph({ text: `₹ ${sgstAmount.toFixed(2)}`, alignment: AlignmentType.RIGHT })],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  children: [new Paragraph({ text: `CGST@${invoiceMeta.cgst || 0}%`, alignment: AlignmentType.RIGHT, bold: true })],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                }),
                new TableCell({
                  width: { size: 2400, type: WidthType.DXA },
                  children: [new Paragraph({ text: `₹ ${cgstAmount.toFixed(2)}`, alignment: AlignmentType.RIGHT })],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 5000, type: WidthType.DXA },
                  children: [new Paragraph({ text: "Total", bold: true, alignment: AlignmentType.RIGHT, size: 24, color: "FFFFFF" })],
                  shading: { fill: "00BFFF" },
                  borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                }),
                new TableCell({
                  width: { size: 2400, type: WidthType.DXA },
                  children: [new Paragraph({ text: `₹ ${totalAmount.toFixed(2)}`, bold: true, alignment: AlignmentType.RIGHT, size: 24, color: "FFFFFF" })],
                  shading: { fill: "00BFFF" },
                  borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE } }
                })
              ]
            })
          ]
        })
      );

      // ===== INVOICE AMOUNT IN WORDS =====
      children.push(
        new Paragraph({
          text: `Invoice Amount in Words: Rs. ${numberToWords(Math.round(totalAmount))}`,
          spacing: { before: 120, after: 200 }
        })
      );

      // ===== TERMS & CONDITIONS =====
      children.push(
        new Paragraph({ text: "", spacing: { before: 120, after: 120 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            new TableRow({
              children: [
                // LEFT COLUMN - TERMS AND CONDITIONS
                new TableCell({
                  width: { size: 3850, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [
                    new Paragraph({
                      text: "Terms And Conditions :-",
                      bold: true,
                      spacing: { before: 0, after: 100 }
                    }),
                    new Paragraph({
                      text: "100% payment to be made for order booking",
                      spacing: { before: 0, after: 0 }
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                }),
                // RIGHT COLUMN - RECEIVED & BALANCE
                new TableCell({
                  width: { size: 3850, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Received", bold: true }),
                        new TextRun({ text: "                    " }),
                        new TextRun({ text: `₹ ${invoiceMeta.received_amount || 0}`, bold: true })
                      ],
                      spacing: { before: 0, after: 100 }
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Balance", bold: true }),
                        new TextRun({ text: "                     " }),
                        new TextRun({ text: `₹ ${(totalAmount - (invoiceMeta.received_amount || 0)).toFixed(2)}`, bold: true })
                      ],
                      spacing: { before: 0, after: 0 }
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                })
              ]
            })
          ]
        })
      );

      // ===== 3-COLUMN FOOTER TABLE =====
      children.push(
        new Paragraph({ text: "", spacing: { before: 120, after: 120 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            new TableRow({
              children: [
                // LEFT COLUMN - PAYMENT MODE & BANK DETAILS
                new TableCell({
                  width: { size: 2567, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [
                    new Paragraph({
                      text: "Payment Mode:",
                      bold: true,
                      spacing: { before: 0, after: 50 }
                    }),
                    new Paragraph({
                      text: "Online – QR Code",
                      spacing: { before: 0, after: 150 }
                    }),
                    new Paragraph({
                      text: "Pay To:",
                      bold: true,
                      spacing: { before: 0, after: 50 }
                    }),
                    new Paragraph({
                      text: `Bank Name: ${hospitalDetails?.bank_name || defaultDetails.bank_name}`,
                      spacing: { before: 0, after: 50 },
                      size: 20
                    }),
                    new Paragraph({
                      text: `Bank Account No.: ${hospitalDetails?.account_no || defaultDetails.account_no}`,
                      spacing: { before: 0, after: 50 },
                      size: 20
                    }),
                    new Paragraph({
                      text: `Bank IFSC code: ${hospitalDetails?.ifsc_code || defaultDetails.ifsc_code}`,
                      spacing: { before: 0, after: 50 },
                      size: 20
                    }),
                    new Paragraph({
                      text: `Account Holder's Name: ${hospitalDetails?.saving_current || "GENELIFE PLUS"}`,
                      size: 20,
                      spacing: { before: 0, after: 0 }
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                }),
                // MIDDLE COLUMN - COMPANY BRANDING & QR
                new TableCell({
                  width: { size: 2567, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [
                    new Paragraph({
                      text: "Scan & Pay:",
                      bold: true,
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 0, after: 100 }
                    }),
                    new Paragraph({
                      text: "GENELIFE PLUS",
                      bold: true,
                      alignment: AlignmentType.CENTER,
                      size: 22,
                      spacing: { before: 0, after: 50 }
                    }),
                    new Paragraph({
                      text: "TID: 39805582",
                      alignment: AlignmentType.CENTER,
                      size: 20,
                      spacing: { before: 0, after: 100 }
                    }),
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: qrBuffer,
                          transformation: {
                            width: 80,
                            height: 80,
                          },
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 0, after: 0 }
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                }),
                // RIGHT COLUMN - SIGNATURE
                new TableCell({
                  width: { size: 2634, type: WidthType.DXA },
                  margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  children: [
                    new Paragraph({
                      text: "For GENELIFE PLUS",
                      bold: true,
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: 200 }
                    }),
                    new Paragraph({
                      text: "____________________",
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: 50 }
                    }),
                    new Paragraph({
                      text: "Authorized Signatory",
                      alignment: AlignmentType.RIGHT,
                      size: 20,
                      spacing: { before: 0, after: 0 }
                    })
                  ],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE }
                  }
                })
              ]
            })
          ]
        })
      );

      const doc = new Document({
        sections: [{
          children: children
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Invoice_${invoiceMeta.invoice_no || "proforma"}.docx`);
    } catch (err) {
      console.error("Word download error:", err);
      alert("Failed to download Word file: " + err.message);
    }
  };


  const yearOptions=[]; for(let y=new Date().getFullYear();y>=2018;y--)yearOptions.push(y);

  return(
    <div className="ms-content-wrapper">
      <div className="row">
        <Breadcrumb pageprev={"Invoice"} pagecurrent={"Monthly Invoice"} />
        <div className="col-md-12">
          <div className="ms-panel">
            <div className="ms-panel-header d-flex justify-content-between">
              <h6>Monthly Invoice — Generate Proforma</h6>
              <div>
                <Button variant="primary" onClick={fetchMonthRecords} disabled={loading} style={{marginRight:8}}>
                  {loading?"Fetching...":"Fetch Records"}
                </Button>
                <Button variant="success" onClick={handleCreateInvoice} disabled={loading}>
                  {loading?"Creating...":"Create Invoice"}
                </Button>
              </div>
            </div>
            <div className="ms-panel-body">
              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <Form.Group>
                    <Form.Label>Hospital / Doctor</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedClinicianId}
                      onChange={e => {
                        const id = e.target.value;
                        setSelectedClinicianId(id);
                        if (!id) {
                          setHospitalName("");
                          setDoctorName("");
                        } else {
                          const sel = clinicians.find(c => String(c.id) === String(id));
                          const h = sel?.hospital_name || sel?.name || sel?.clinic_name || "";
                          const d = sel?.doctor_name || sel?.doctor || sel?.doctor_name_display || "";
                          setHospitalName(h);
                          setDoctorName(d);
                        }
                      }}
                    >
                      <option value="">Select Hospital / Doctor</option>
                      {clinicians.map(c => (
                        <option key={c.id} value={c.id}>
                          {`${c.hospital_name || c.name || c.clinic_name || ""}${c.doctor_name || c.doctor ? ` - ${c.doctor_name || c.doctor}` : ""}`}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Month</Form.Label>
                    <Form.Control as="select" value={month} onChange={e=>setMonth(e.target.value)}>
                      <option value="">Select Month</option>
                      {monthOptions.map(m=><option key={m.v} value={m.v}>{m.l}</option>)}
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Year</Form.Label>
                    <Form.Control as="select" value={year} onChange={e=>setYear(e.target.value)}>
                      {yearOptions.map(y=><option key={y} value={y}>{y}</option>)}
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className="col-md-2">
                  <Form.Group>
                    <Form.Label>Invoice No (optional)</Form.Label>
                    <Form.Control type="text" value={invoiceMeta.invoice_no} onChange={e=>updateMeta("invoice_no",e.target.value)} placeholder="GLP-2025-..."/>
                  </Form.Group>
                </div>
              </div>

              {/* Records Table */}
              <div style={{overflowX:"auto",marginBottom:12}}>
                <table className="table table-bordered" style={{minWidth:1000,background:"#fff"}}>
                  <thead style={{background:"#00bfff",color:"#fff"}}>
                    <tr>
                      <th style={{width:40}}><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /></th>
                      <th>#</th>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Patient</th>
                      <th>Test Name(s)</th>
                      <th>MSP</th>
                      <th>MRP</th>
                      <th>B2B</th>
                      <th>Price Type + Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length===0&&<tr><td colSpan="10" style={{textAlign:"center"}}>No records found. Click Fetch Records.</td></tr>}
                    {records.map((r,idx)=>{
                      const id=r.lab_record_id??r.id;
                      const isSelected=selectedIds.has(id);
                      const testNames=Array.isArray(r.test_name)?r.test_name.join(", "):r.test_name;
                      return(
                        <tr key={id}>
                          <td><input type="checkbox" checked={isSelected} onChange={()=>toggleSelect(id)}/></td>
                          <td>{idx+1}</td>
                          <td>{r.date?new Date(r.date).toLocaleDateString():""}</td>
                          <td>{r.order_id||""}</td>
                          <td>{r.patient_name||r.patient||""}</td>
                          <td style={{whiteSpace:"normal"}}>{testNames}</td>
                          <td style={{textAlign:"right"}}>{r.msp?.toFixed(2)}</td>
                          <td style={{textAlign:"right"}}>{r.mrp?.toFixed(2)}</td>
                          <td style={{textAlign:"right"}}>{r.b2b_price?.toFixed(2)}</td>
                          <td style={{textAlign:"right"}}>
                            <select value={r.price_type} onChange={e=>{
                              const newType=e.target.value;
                              setRecords(prev=>prev.map(rec=>{
                                if(rec.lab_record_id!==r.lab_record_id) return rec;
                                let updatedPrice=rec.test_price;
                                if(newType==="msp") updatedPrice=rec.msp;
                                else if(newType==="mrp") updatedPrice=rec.mrp;
                                else if(newType==="b2b") updatedPrice=rec.b2b_price;
                                else if(newType==="custom") updatedPrice=rec.custom_price;
                                return {...rec, price_type:newType, test_price:updatedPrice};
                              }));
                            }} style={{marginRight:4}}>
                              <option value="msp">MSP</option>
                              <option value="mrp">MRP</option>
                              <option value="b2b">B2B</option>
                              <option value="custom">Custom</option>
                            </select>
                            <input type="number" value={r.test_price} disabled={r.price_type!=="custom"} onChange={e=>{
                              const newPrice=parseFloat(e.target.value||0);
                              setRecords(prev=>prev.map(rec=>{
                                if(rec.lab_record_id!==r.lab_record_id) return rec;
                                return {...rec, custom_price:newPrice, test_price:newPrice};
                              }));
                            }} style={{width:90,textAlign:"right"}}/>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Invoice Summary */}
              <div className="row">
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>SGST (%)</Form.Label>
                    <Form.Control type="number" value={invoiceMeta.sgst} onChange={e=>updateMeta("sgst",e.target.value)}/>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>CGST (%)</Form.Label>
                    <Form.Control type="number" value={invoiceMeta.cgst} onChange={e=>updateMeta("cgst",e.target.value)}/>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <Form.Label>Invoice Amount</Form.Label>
                    <Form.Control type="number" value={totalAmount.toFixed(2)} readOnly/>
                  </Form.Group>
                </div>
                
              </div>

              {/* Response Message Display */}
              {responseMessage.type && (
                <div style={{
                  marginTop: 16,
                  padding: "15px",
                  borderRadius: "6px",
                  border: `2px solid ${responseMessage.type === "success" ? "#28a745" : "#dc3545"}`,
                  backgroundColor: responseMessage.type === "success" ? "#d4edda" : "#f8d7da",
                  color: responseMessage.type === "success" ? "#155724" : "#721c24"
                }}>
                  <h5 style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                    {responseMessage.title}
                  </h5>
                  <p style={{ margin: "8px 0" }}>
                    {responseMessage.message}
                  </p>
                  {responseMessage.details && (
                    <div style={{
                      marginTop: "10px",
                      padding: "10px",
                      backgroundColor: "rgba(255,255,255,0.5)",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontFamily: "monospace"
                    }}>
                      {responseMessage.details.invoice_id && (
                        <div><strong>Invoice ID:</strong> {responseMessage.details.invoice_id}</div>
                      )}
                      {responseMessage.details.invoice_no && (
                        <div><strong>Invoice No:</strong> {responseMessage.details.invoice_no}</div>
                      )}
                      {responseMessage.details.invoice_ids && (
                        <div><strong>Invoice IDs:</strong> {responseMessage.details.invoice_ids.join(", ")}</div>
                      )}
                      {responseMessage.details.error && (
                        <div><strong>Error:</strong> {responseMessage.details.error}</div>
                      )}
                    </div>
                  )}
                  <button 
                    onClick={() => setResponseMessage({type:null, title:"", message:"", details:null})}
                    style={{
                      marginTop: "8px",
                      padding: "4px 8px",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: responseMessage.type === "success" ? "#155724" : "#721c24",
                      fontSize: "12px"
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              )}

<div style={{ marginTop: 12 }}>
  <Button variant="warning" onClick={() => setShowPreview(!showPreview)} style={{ marginRight: 8 }}>
    {showPreview ? "Hide Preview" : "Preview Invoice"}
  </Button>
  <Button variant="info" onClick={handleDownloadPdf} style={{ marginRight: 8 }}>Download PDF</Button>
  <Button variant="secondary" onClick={handleDownloadWord}>Download Word</Button>
</div>

{showPreview && (() => {
  // Calculate totals for preview
  const subtotal = selectedRecords.reduce((sum, r) => sum + (r.test_price || r.price || 0), 0);
  const sgstAmount = (subtotal * (invoiceMeta.sgst || 0)) / 100;
  const cgstAmount = (subtotal * (invoiceMeta.cgst || 0)) / 100;
  const totalAmount = subtotal + sgstAmount + cgstAmount;
  
  return (
  <div style={{ 
    marginTop: 20, 
    padding: "20px", 
    border: "1px solid #ddd", 
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    maxHeight: "800px",
    overflowY: "auto"
  }} ref={invoiceRef}>
    <style>{`
      .invoice-preview {
        background: white;
        padding: 30px;
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
      .invoice-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        border-bottom: 2px solid #9678B4;
        padding-bottom: 15px;
      }
      .invoice-company {
        flex: 1;
      }
      .invoice-company h2 {
        margin: 0;
        color: #288C4C;
        font-size: 24px;
        font-weight: bold;
      }
      .invoice-company .plus {
        color: #288C4C;
        font-size: 14px;
        font-weight: bold;
      }
      .invoice-company p {
        margin: 4px 0;
        font-size: 12px;
        color: #333;
      }
      .invoice-medgenome {
        text-align: right;
        color: #42B7D5;
        font-size: 18px;
        font-weight: bold;
      }
      .invoice-title {
        text-align: center;
        color: #00BFFF;
        font-size: 22px;
        font-weight: bold;
        margin: 20px 0;
      }
      .invoice-details-row {
        display: flex;
        gap: 20px;
        margin: 15px 0;
      }
      .invoice-box {
        flex: 1;
        border: 1px solid #ddd;
        padding: 12px;
        border-radius: 4px;
      }
      .invoice-box-header {
        background: #A078B4;
        color: white;
        padding: 8px 12px;
        font-weight: bold;
        font-size: 13px;
        margin: -12px -12px 10px -12px;
        border-radius: 4px 4px 0 0;
      }
      .invoice-box-content {
        font-size: 12px;
        line-height: 1.6;
      }
      .invoice-box-content strong {
        font-weight: bold;
      }
      .invoice-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 12px;
      }
      .invoice-table thead {
        background: #00BFFF;
        color: white;
      }
      .invoice-table th {
        padding: 10px;
        text-align: left;
        font-weight: bold;
        border: 1px solid #ddd;
      }
      .invoice-table td {
        padding: 8px 10px;
        border: 1px solid #ddd;
      }
      .invoice-table tbody tr:nth-child(even) {
        background: #F5F5F5;
      }
      .invoice-table tbody tr:hover {
        background: #F0F8FF;
      }
      .text-right {
        text-align: right;
      }
      .text-center {
        text-align: center;
      }
      .invoice-totals {
        margin: 20px 0;
        font-size: 12px;
      }
      .invoice-total-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
      }
      .invoice-total-row.bold {
        font-weight: bold;
      }
      .invoice-total-box {
        background: #00BFFF;
        color: white;
        padding: 12px;
        margin: 15px 0;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        font-size: 13px;
      }
      .invoice-footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #ddd;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 30px;
        font-size: 11px;
      }
      
      .invoice-footer-left {
        text-align: left;
      }
      
      .invoice-footer-left strong {
        display: block;
        font-weight: bold;
        margin-bottom: 6px;
        margin-top: 10px;
      }
      
      .invoice-footer-left strong:first-child {
        margin-top: 0;
      }
      
      .invoice-footer-center {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
      }
      
      .invoice-footer-center strong {
        display: block;
        margin-bottom: 6px;
      }
      
      .invoice-footer-center img {
        margin-top: 12px;
      }
      
      .invoice-footer-right {
        text-align: right;
        padding-top: 20px;
      }
      
      .invoice-footer-right strong {
        display: block;
        font-weight: bold;
        margin-top: 8px;
      }
      
      .invoice-footer-section {
        margin: 10px 0;
      }
      
      .invoice-footer-section strong {
        font-weight: bold;
      }
    `}</style>
    
    <div className="invoice-preview">
      {/* Header */}
      <div className="invoice-header">
          <div className="invoice-company">
            <img src={logo} alt="logo" style={{ width: 90, height: 60, objectFit: 'contain', marginBottom: 8 }} />
            <h2>GENELIFE <span className="plus">PLUS</span></h2>
          <p><strong>(AUTHORISED COLLECTION CENTRE I,4FOR MEDGENOME LABS LTD.)</strong></p>
          <p><strong>Phone no. :</strong> 7639393689</p>
          <p><strong>Email:</strong> genelifeplus@gmail.com</p>
          <p><strong>GSTIN:</strong> 33FRGPS4137A1Z0</p>
        </div>
        <div className="invoice-medgenome">
          MEDGENOME
        </div>
      </div>

      {/* Title */}
      <div className="invoice-title">PROFORMA INVOICE</div>

      {/* Details */}
      <div className="invoice-details-row">
        <div className="invoice-box" style={{ flex: 1.2 }}>
          <div className="invoice-box-header">Bill To -</div>
          <div className="invoice-box-content">
            <strong>GENELIFE PLUS</strong><br/>
            AUTHORISED COLLECTION CENTRE I,4FOR MEDGENOME LABS LTD.<br/>
            GSTIN: 33FRGPS4137A1Z0
          </div>
        </div>
        <div className="invoice-box">
          <div className="invoice-box-header">Invoice Details -</div>
          <div className="invoice-box-content">
            <strong>Invoice No:</strong> {invoiceMeta.invoice_no || "GLP-2025-..."}<br/>
            <strong>Date:</strong> {new Date().toLocaleDateString('en-IN')}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th className="text-center">Date</th>
            <th>Patient Name</th>
            <th>Test Name(s)</th>
            <th className="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {selectedRecords.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No records selected. Please select records to preview.</td>
            </tr>
          ) : (
            selectedRecords.map((r, idx) => (
              <tr key={idx}>
                <td className="text-center"><strong>{idx + 1}</strong></td>
                <td className="text-center">{r.date ? new Date(r.date).toLocaleDateString('en-IN') : ""}</td>
                <td>{r.patient_name || r.patient || ""}</td>
                <td>{Array.isArray(r.test_name) ? r.test_name.join(", ") : r.test_name}</td>
                <td className="text-right"><strong>₹{r.test_price?.toFixed(2) || "0.00"}</strong></td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Description & Remarks */}
      <div style={{ fontSize: "12px", marginBottom: "15px" }}>
        <strong>Description: - Ref:</strong> {invoiceMeta.remarks || ""}
      </div>

      {/* Totals */}
      <div className="invoice-totals">
        <div className="invoice-total-row">
          <span><strong>Sub Total</strong></span>
          <span><strong>₹{subtotal.toFixed(2)}</strong></span>
        </div>
        <div className="invoice-total-row">
          <span><strong>SGST@{invoiceMeta.sgst || 0}%</strong></span>
          <span><strong>₹{(sgstAmount||0).toFixed(2)}</strong></span>
        </div>
        <div className="invoice-total-row">
          <span><strong>CGST@{invoiceMeta.cgst || 0}%</strong></span>
          <span><strong>₹{(cgstAmount||0).toFixed(2)}</strong></span>
        </div>
      </div>

      {/* Total Box */}
      <div className="invoice-total-box">
        <span>TOTAL</span>
        <span>₹ {totalAmount.toFixed(2)}</span>
      </div>

      {/* Top Row: Terms And Conditions (Left) | Received & Balance (Right) */}
      <div style={{ display: "flex", gap: "40px", marginTop: "20px", marginBottom: "20px" }}>
        {/* Left: Terms And Conditions */}
        <div style={{ flex: 1, fontSize: "12px" }}>
          <strong>Terms And Conditions :-</strong>
          <div style={{ marginTop: "8px" }}>100% payment to be made for order booking</div>
        </div>
        
        {/* Right: Received & Balance */}
        <div style={{ flex: 1 }}>
          <div className="invoice-total-row">
            <span><strong>Received</strong></span>
            <span><strong>₹ {invoiceMeta.received_amount || 0}</strong></span>
          </div>
          <div className="invoice-total-row">
            <span><strong>Balance</strong></span>
            <span><strong>₹ {(totalAmount - (invoiceMeta.received_amount || 0)).toFixed(2)}</strong></span>
          </div>
        </div>
      </div>

      {/* 3-Column Footer */}
      <div className="invoice-footer">
        {/* Left Column: Payment Mode & Bank Details */}
        <div className="invoice-footer-left">
          <strong>Payment Mode:</strong> Online – QR Code
          
          <strong style={{ marginTop: "12px", display: "block" }}>Pay To:</strong>
          <div style={{ fontSize: "11px", marginTop: "4px" }}>
            <strong>Bank Name:</strong> {hospitalDetails?.bank_name || "HDFC BANK LTD"}<br/>
            <strong>Bank Account No.:</strong> {hospitalDetails?.account_no || "50200089204348"}<br/>
            <strong>Bank IFSC code:</strong> {hospitalDetails?.ifsc_code || "HDFC0000351"}<br/>
            <strong>Account Holder's Name:</strong> {hospitalDetails?.saving_current || "GENELIFE PLUS"}
          </div>
        </div>
        
        {/* Center Column: Company Name & QR Code */}
        <div className="invoice-footer-center">
          <div><strong>Scan & Pay:</strong></div>
          <div style={{ marginTop: "12px", fontSize: "11px", fontWeight: "bold" }}>GENELIFE PLUS</div>
          <div style={{ fontSize: "10px", marginBottom: "8px" }}>TID: 39805582</div>
          <img src={qrCode} alt="QR Code" style={{ width: "80px", height: "80px", objectFit: "contain" }} />
        </div>
        
        {/* Right Column: Signature */}
        <div className="invoice-footer-right">
          <strong>For GENELIFE PLUS</strong>
          <div style={{ marginTop: "40px" }}></div>
          <strong>Authorized Signatory</strong>
        </div>
      </div>
    </div>
  </div>
  );
})()}

            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
