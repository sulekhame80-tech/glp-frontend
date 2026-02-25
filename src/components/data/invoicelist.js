import React from "react";
import { Link } from "react-router-dom";

export const columns = [
  { name: "Invoice No", selector: row => row.invoice_no, sortable: true },
  { name: "Patient Name", selector: row => row.patient_name, sortable: true },
  { name: "Order Id", selector: row => row.order_id, sortable: true },
  { name: "Test Name", selector: row => row.test_name, sortable: true },
  { name: "Invoice Amount", selector: row => row.invoice_amount, sortable: true, right: true },
  { name: "Received Amount", selector: row => row.received_amount, sortable: true, right: true },
  { name: "Balance Amount", selector: row => row.balance_amount, sortable: true, right: true },
  { 
    name: "Status", 
    cell: row => <span className={row.status === "Paid" ? 'badge badge-primary' : 'badge badge-danger'}>{row.status}</span>, 
    sortable: true 
  },
  
];
