import { FiEdit, FiTrash2 } from "react-icons/fi";
export const columns = [
     {
    name: "Order ID",
    selector: row => row.order_id,
    sortable: true,
  },
    {
    name: "Sample ID",
    selector: row => row.sample_id,
    sortable: true,
  },
  {
    name: "Patient Name",
    selector: row => row.patient_name,
    sortable: true,
  },
 
  {
    name: "CustomerName",
    selector: row => row.customer_name,
    sortable: true,
  },
  {
    name: "ClinicianName",
    selector: row => row.clinician_name,
    sortable: true,
  },
  {
    name: "TestName",
    selector: row => row.test_name,
    sortable: true,
  },
  
  {
    name: "OrderedDate",
    selector: row => row.order_booking_date,
  },
  {
    name: "ExpectedDate",
    selector: row => row.expected_report_date,
  },
  {
    name: "Actions",
    cell: (row, index) => (
      <div className="d-flex gap-2">
        <FiEdit
          className="fas fa-edit ms-text-primary"
          style={{ cursor: "pointer", marginRight: "45px" }}
    size={18}
          onClick={() => row.onEdit(row)}
        />
        <FiTrash2
          style={{ cursor: "pointer", color:"#3366cc" }}
         
           size={18}
            onClick={() => row.onDelete(row)}
        />
      </div>
    ),
  },
];
