const NewColumns = [
  {
    name: "Order ID",
    selector: (row) => row.order_id || "",
    sortable: true,
  },
  {
    name: "Order Acknowledgment Date",
    selector: (row) => row.order_ack_date ? row.order_ack_date.slice(0, 10) : "",
  },
  {
    name: "Patient Name",
    selector: (row) => row.patient_id__patient_name || "",
  },
  {
    name: "Sales Person Name",
    selector: (row) => row.technician_id__technician_name || "",
  },
  {
    name: "Clinician",
    selector: (row) => row.clinician_id__doctor_name || "",
  },
  {
    name: "Test Name",
    selector: (row) => row.test_name || "",
  },
  {
    name: "Business Type",
    selector: (row) => row.business_type || "",
  },
  {
    name: "Payment Status",
    selector: (row) => row.payment_status || "",
  },
  {
    name: "Payment Received",
    selector: (row) => row.payment_received || "",
  },
  {
    name: "Sample Dispatch Date",
    selector: (row) => row.sample_dispatch_date || "",
  },
  {
    name: "Remarks",
    selector: (row) => row.remarks || "",
  },
];
