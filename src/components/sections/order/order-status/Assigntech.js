import React, { useEffect, useState } from "react";
import {
  getOrdersApi,
  getTechniciansApi,
  getLab_recordByIdApi,
  getclinicianApi,
  getClinicianByOrderIdApi,
  assignTechnicianApi,salespersonDropdownApi,
  getTestDropdownApi,locationDropdownApi,businessTypeDropdownApi,statusDropdownApi,categoryDropdownApi
} from "../../../api/endpoint";
import Select from "react-select";

   const logApi = (name, res) => {
  console.log(`✅ ${name} SUCCESS`);
  console.log("➡ response:", res);
  console.log("➡ response.data:", res?.data);
  console.log("➡ response.data.data:", res?.data?.data);
};

const logApiError = (name, err) => {
  console.error(`❌ ${name} FAILED`);
  console.error(err);
};

const AssignTechnicianForm = ({ selectedOrderId, setSelectedOrderId, refreshOrders }) => {
  const [orders, setOrders] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);

  const [hospitals, setHospitals] = useState([]);
  const [testList, setTestList] = useState([]);
const [sampleStatusOptions, setSampleStatusOptions] = useState([]);

  // Track dropdown selection locally, synced with parent prop
  const [selectedOrder, setSelectedOrder] = useState(selectedOrderId || "");
  const [allClinicians, setAllClinicians] = useState([]);
  const [orderClinician, setOrderClinician] = useState(null);
const [locations, setLocations] = useState([]);
const [businessTypes, setBusinessTypes] = useState([]);
const [categories, setCategories] = useState([]);
const [statusOptions, setStatusOptions] = useState([]);

const [formData, setFormData] = useState({
  order_id: "",
  sales_person_name: "",
  technician_id: "",
  clinician_id: "",
  business_type: "",
  category: "",
  order_ack_date: "",
  sample_dispatch_date: "",
 test_name: [],

  payment_status: "PENDING",
  payment_received: "",
  tid_last6_digit: "",
  date_of_transaction: "",
  pheblo_service: false,
  glp_charges: "",
  pheblo_charges: "",
  payout_amount: "",
  payout_status: "PENDING",
  date_of_payout_transferred: "",
  hard_copy_update: false,
   sample_status: "",
  sample_type: "",
  utr_upi_time: "",
  mg_billing: "",
  report_status: "",
  location_id: ""
});
 const [technicians, setTechnicians] = useState([]);
 
  // Sync local dropdown with parent prop whenever it changes
  useEffect(() => {
    if (selectedOrderId) setSelectedOrder(selectedOrderId);
  }, [selectedOrderId]);

 useEffect(() => {
  getOrdersApi()
    .then(res => {
      logApi("getOrdersApi", res);

      // backend returns array of strings
      const list = Array.isArray(res?.data) ? res.data : [];
      setOrders(list);
    })
    .catch(err => logApiError("getOrdersApi", err));
}, []);


useEffect(() => {
  console.log("🚀 INIT: Loading dropdown APIs");

  salespersonDropdownApi()
    .then(res => {
      logApi("salespersonDropdownApi", res);
      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
        ? res.data
        : [];
      setSalesPersons(list);
    })
    .catch(err => logApiError("salespersonDropdownApi", err));

  getclinicianApi()
    .then(res => {
      logApi("getclinicianApi", res);
      setAllClinicians(
        Array.isArray(res?.data?.data) ? res.data.data : res?.data || []
      );
    })
    .catch(err => logApiError("getclinicianApi", err));

  getTestDropdownApi()
    .then(res => {
      logApi("getTestDropdownApi", res);
      setTestList(
        Array.isArray(res?.data?.data) ? res.data.data : res?.data || []
      );
    })
    .catch(err => logApiError("getTestDropdownApi", err));

  locationDropdownApi()
    .then(res => {
      logApi("locationDropdownApi", res);
      setLocations(
        Array.isArray(res?.data?.data) ? res.data.data : res?.data || []
      );
    })
    .catch(err => logApiError("locationDropdownApi", err));

  businessTypeDropdownApi()
    .then(res => {
      logApi("businessTypeDropdownApi", res);
      setBusinessTypes(
        Array.isArray(res?.data?.data) ? res.data.data : res?.data || []
      );
    })
    .catch(err => logApiError("businessTypeDropdownApi", err));

  categoryDropdownApi()
    .then(res => {
      logApi("categoryDropdownApi", res);
      setCategories(
        Array.isArray(res?.data?.data) ? res.data.data : res?.data || []
      );
    })
    .catch(err => logApiError("categoryDropdownApi", err));
  getTechniciansApi().then(res => setTechnicians(res.data.data));
  
  statusDropdownApi()
    .then(res => {
      logApi("statusDropdownApi", res);
      const options = Array.isArray(res?.data?.data) ? res.data.data : res?.data || [];
      
      setStatusOptions(options);       // For payment_status / payout_status
      setSampleStatusOptions(options);
    })
    .catch(err => logApiError("statusDropdownApi", err));

}, []);

  // Fetch order data whenever selectedOrder changes
  useEffect(() => {
    if (!selectedOrder) {
      // Clear form if nothing selected
    if (!selectedOrder) {
  setFormData({
    order_id: "",
    sales_person_name: "",
    technician_id: "",
    clinician_id: "",
    business_type: "",
    category: "",
    order_ack_date: "",
    sample_dispatch_date: "",
   test_name:[],
    payment_status: "PENDING",
    payment_received: "",
    tid_last6_digit: "",
    date_of_transaction: "",
    pheblo_service: false,
    glp_charges: "",
    pheblo_charges: "",
    payout_amount: "",
    payout_status: "PENDING",
    date_of_payout_transferred: "",
    hard_copy_update: false,
    sample_status: "",
    sample_type: "",
    utr_upi_time: "",
    mg_billing: "",
    report_status: "",
    location_id: ""
  });

  setHospitals([]);
  return;
}
 
    }

 

   const fetchOrderData = async () => { 
  console.log("➡ STEP 1: Starting fetchOrderData for Order:", selectedOrder);

  try {
    const res = await getLab_recordByIdApi(selectedOrder);
    console.log("➡ STEP 2: API Response (getLab_recordByIdApi):", res.data);

    const data = res.data;

    if (data) {
   let finalTestName = [];

if (Array.isArray(data.test_name)) {
  console.log("➡ test_name is REAL array");
  finalTestName = data.test_name;
}
else if (typeof data.test_name === "string") {
  console.log("➡ test_name is STRING (Python list format) → converting manually");

  try {
    // Convert Python list string to JSON array string
    const jsonString = data.test_name
      .replace(/'/g, '"')     // replace single quotes with double quotes
      .replace(/None/g, 'null');

    finalTestName = JSON.parse(jsonString);
  } catch (e) {
    console.error("❌ Manual conversion failed:", e);
  }
}

console.log("➡ STEP 5: Final test_name stored in formData:", finalTestName);

      setFormData({
        order_id: data.order_id || "",
        sales_person_name: data.sales_person_name || "",
        technician_id: data.technician_id || "",
        clinician_id: data.clinician_id || "",
        business_type: data.business_type || "",
        category: data.category_of_collection || "",
        order_ack_date: data.order_ack_date ? data.order_ack_date.slice(0,16) : "",
        sample_dispatch_date: data.sample_dispatch_date ? data.sample_dispatch_date.slice(0,16) : "",
        test_name: finalTestName,

        payment_status: data.payment_status || "PENDING",
        payment_received: data.payment_received || "",
        tid_last6_digit: data.tid_last6_digit || "",
        date_of_transaction: data.date_of_transaction ? data.date_of_transaction.slice(0,16) : "",
        pheblo_service: data.pheblo_service || false,
        glp_charges: data.glp_charges || "",
        pheblo_charges: data.pheblo_charges || "",
        payout_amount: data.payout_amount || "",
        payout_status: data.payout_status || "PENDING",
        date_of_payout_transferred:
          data.date_of_payout_transferred ? data.date_of_payout_transferred.slice(0,16) : "",
        hard_copy_update: data.hard_copy_update || false,
        sample_status: data.sample_status || "",
        sample_type: data.sample_type || "",
        utr_upi_time: data.utr_upi_time ? data.utr_upi_time.slice(0, 16) : "",
        mg_billing: data.mg_billing || "",
        report_status: data.report_status || "",
        location_id: data.location_id || ""

       
      });

      console.log("➡ STEP 6: formData updated successfully");

      const clinicianRes = await getClinicianByOrderIdApi(selectedOrder);
      console.log("➡ STEP 7: Clinician response:", clinicianRes.data.data);
      setOrderClinician(clinicianRes.data.data?.[0] || null);

      if (clinicianRes.data.data?.length > 0) {
        setFormData(prev => ({
          ...prev,
          clinician_id: clinicianRes.data.data[0].id
        }));
      }
      
      
    } else {
      console.log("❌ No data found for order. Clearing form data.");

      setFormData({
        order_id: selectedOrder,
        sales_person_name: "",
        clinician_id: "",
        business_type: "",
        category: "",
        order_ack_date: "",
        sample_dispatch_date: "",
        test_name: [],
        payment_status: "PENDING",
        payment_received: "",
        tid_last6_digit: "",
        date_of_transaction: "",
        pheblo_service: false,
        glp_charges: "",
        pheblo_charges: "",
        payout_amount: "",
        payout_status: "PENDING",
        date_of_payout_transferred: "",
        hard_copy_update: false,
        location_id: "",
         clinician_id: "",
      });

      setHospitals([]);
    }
  } catch (err) {
    console.error("❌ STEP ERROR: Failed to fetch order", err);
  }
};


    fetchOrderData();
  }, [selectedOrder]);

  // Dropdown change
  const handleOrderChange = (e) => {
    const orderId = e.target.value;
    setSelectedOrder(orderId);
    if (setSelectedOrderId) setSelectedOrderId(orderId); // sync to parent
  };

 const handleChange = (e) => {
  let value = e.target.value;
  if (e.target.name === "pheblo_service" || e.target.name === "hard_copy_update") {
    value = value === 'true';
  }
  setFormData({ ...formData, [e.target.name]: value });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Prepare payload
   const payload = {
    ...formData,
     ...(formData.order_id ? { order_id: formData.order_id } : {}),
    category_of_collection: formData.category || null, // match model field
    pheblo_service: formData.pheblo_service === 'true' || formData.pheblo_service === true,
    hard_copy_update: formData.hard_copy_update === 'true' || formData.hard_copy_update === true,
    order_ack_date: formData.order_ack_date || null,
    sample_dispatch_date: formData.sample_dispatch_date || null,
    date_of_transaction: formData.date_of_transaction || null,
    date_of_payout_transferred: formData.date_of_payout_transferred || null,
    payment_received: formData.payment_received || null,
    glp_charges: formData.glp_charges || null,
    pheblo_charges: formData.pheblo_charges || null,
    payout_amount: formData.payout_amount || null,
    payment_status: formData.payment_status || "Pending",
    payout_status: formData.payout_status || "Pending",
    location_id: formData.location_id || null,
    technician_id: formData.technician_id || null,
  };


  try {
    const res = await assignTechnicianApi(payload);
    console.log("payload", payload);
    alert("✔ Technician Assigned Successfully!");
    if (refreshOrders) refreshOrders();

    // Reset form
    handleClear();

  } 
catch (err) {
  console.error(err);

  let errorMsg = "❌ Failed to assign technician";

  if (err.response?.data) {
    const messages = [];
    for (const key in err.response.data) {
      const val = err.response.data[key];
      if (Array.isArray(val)) {
        messages.push(`${key}: ${val.join(", ")}`);
      } else {
        messages.push(`${key}: ${val}`);
      }
    }
    errorMsg = messages.join("\n");
  }

  alert(errorMsg);
}


};

 const handleClear = () => {
  setFormData({
    order_id: "",
    technician_id: "",
  
    clinician_id: "",
    business_type: "",
    category: "",
    order_ack_date: "",
    sample_dispatch_date: "",
   test_name:[],
    payment_status: "PENDING",
    payment_received: "",
    tid_last6_digit: "",
    date_of_transaction: "",
    pheblo_service: false,
    glp_charges: "",
    pheblo_charges: "",
    payout_amount: "",
    payout_status: "PENDING",
    date_of_payout_transferred: "",
    hard_copy_update: false,
      sample_status: "",
  sample_type: "",
  utr_upi_time: "",
  mg_billing: "",
  report_status: "",
  location_id: ""
  });
  setSelectedOrder("");
  if (setSelectedOrderId) setSelectedOrderId(null);
  setHospitals([]);
};


  return (
    <div className="ms-panel mt-4">
  <div className="ms-panel-header">
    <h6>Update Order Status</h6>
  </div>
  <div className="ms-panel-body">
    <form onSubmit={handleSubmit}>
      <div className="section-block">
        <h5 className="section-title">Order Details</h5>

        <div className="row mb-3">
        <div className="col-md-4">
          <label>Order ID</label>
         <select
  className="form-control"
  name="order_id"
  value={selectedOrder}
  onChange={handleOrderChange}
>
  <option value="">Select Order</option>

  {orders.map(orderId => (
    <option key={orderId} value={orderId}>
      {orderId}
    </option>
  ))}
</select>

        </div>
       <div className="col-md-4">
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
<div className="col-md-4">
  <label>Location</label>
 <select
  className="form-control"
  name="location_id"
  value={formData.location_id}
  onChange={handleChange}
>
  <option value="">Select Location</option>
  {locations?.map(l => (
  <option key={l.id} value={l.id}>
    {l.location}
  </option>
))}

</select>
        
    </div>  


 
        </div><p></p>
        <div className="row mb-3">
         <div className="col-md-4">
          <label>Hospital / Clinician</label>
          <select
  className="form-control"
  name="clinician_id"
  value={formData.clinician_id}
  onChange={handleChange}
>
  <option value="">Select Hospital</option>

  {allClinicians.map(c => (
    <option key={c.id} value={c.id}>
      {c.hospital_name} - {c.doctor_name}
    </option>
  ))}
</select>


        </div>
         <div className="col-md-4">
              <label>Business Type</label>
              <select
                className="form-control"
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                {businessTypes?.map(b => (
  <option key={b.value} value={b.value}>{b.label}</option>
))}

              </select>
            </div>

        <div className="col-md-4">
              <label>Category</label>
              <select
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
        </div><p></p>
        <div className="row mb-3">
          <div className="col-md-4">
          <label>Sales Person Name</label>
         <select
  className="form-control"
  name="sales_person_name"
  value={formData.sales_person_name}
  onChange={handleChange}
>
  <option value="">Select Sales Person</option>
  {salesPersons?.map(sp => (
   <option key={sp.value} value={sp.value}>
  {sp.label}
</option>


  ))}
</select>

        </div>
         <div className="col-md-4">
          <label>Order Acknowledgement Date</label>
          <input
            type="datetime-local"
            className="form-control"
            name="order_ack_date"
            value={formData.order_ack_date}
            onChange={handleChange}
          />
        </div>
         <div className="col-md-4">
          <label>Employee</label>
          <select
            className="form-control"
            name="technician_id"
            value={formData.technician_id}
            onChange={handleChange}
          >
            <option value="">Select Employee</option>
            {technicians.map(t => (
              <option key={t.id} value={t.id}>{t.technician_name} ({t.mobile_no})</option>
            ))}
          </select>
        </div>


</div>
</div>

<div className="section-block">
        <h5 className="section-title">Sample Details</h5>

        <div className="row">
<div className="col-md-4">
  <label>Sample Status</label>
  <select
    className="form-control"
    name="sample_status"
    value={formData.sample_status}
    onChange={handleChange}
  >
    <option value="">Select Status</option>
    {sampleStatusOptions.map(s => (
      <option key={s.value} value={s.value}>{s.label}</option>
    ))}
  </select>
</div>



  <div className="col-md-4">
    <label>Sample Type</label>
    <input
      type="text"
      className="form-control"
      name="sample_type"
      value={formData.sample_type}
      onChange={handleChange}
    />
  </div>
 <div className="col-md-4">
          <label>Sample Dispatch Date</label>
          <input
            type="datetime-local"
            className="form-control"
            name="sample_dispatch_date"
            value={formData.sample_dispatch_date}
            onChange={handleChange}
          />
        </div>
        </div>

        </div>
       <div className="section-block">
        <h5 className="section-title">Payment Details</h5>

      <div className="row mb-3">
       
       

        <div className="col-md-4">
              <label>Payment Status</label>
              <select
                className="form-control"
                name="payment_status"
                value={formData.payment_status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                {statusOptions?.map(s => (
  <option key={s.value} value={s.value}>{s.label}</option>
))}

              </select>
            </div>
          <div className="col-md-4">
          <label>Received Amount</label>
          <input
            type="number"
            className="form-control"
            name="payment_received"
            value={formData.payment_received}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label>TID Last 6 Digits</label>
          <input
            type="text"
            className="form-control"
            name="tid_last6_digit"
            value={formData.tid_last6_digit}
            onChange={handleChange}
          />
        </div></div>    
 <div className="row mb-3">
        <div className="col-md-4">
          <label>Date of Transaction</label>
          <input
            type="datetime-local"
            className="form-control"
            name="date_of_transaction"
            value={formData.date_of_transaction}
            onChange={handleChange}
          />
        </div>
     </div> 
      
</div>
      {/* Row 5: Pheblo Service, GLP Charges, Pheblo Charges */}
       <div className="section-block">
        <h5 className="section-title">Pheblo Details</h5>

      <div className="row">
        <div className="col-md-4">
          <label>Pheblo Service</label>
          <select
            className="form-control"
            name="pheblo_service"
            value={formData.pheblo_service}
            onChange={handleChange}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>

        <div className="col-md-4">
          <label>GLP Charges</label>
          <input
            type="number"
            className="form-control"
            name="glp_charges"
            value={formData.glp_charges}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label>Pheblo Charges</label>
          <input
            type="number"
            className="form-control"
            name="pheblo_charges"
            value={formData.pheblo_charges}
            onChange={handleChange}
          />
        </div>
      </div>
</div>
      {/* Row 6: Payout Amount, Payout Status, Date of Payout Transferred */}
      <div className="section-block">
        <h5 className="section-title">Payout Details</h5>
 
      <div className="row">
        <div className="col-md-4">
          <label>Payout Amount</label>
          <input
            type="number"
            className="form-control"
            name="payout_amount"
            value={formData.payout_amount}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
              <label>Payout Status</label>
              <select
                className="form-control"
                name="payout_status"
                value={formData.payout_status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                {statusOptions?.map(s => (
  <option key={s.value} value={s.value}>{s.label}</option>
))}

              </select>
            </div>
        <div className="col-md-4">
          <label>Date of Payout Transferred</label>
          <input
            type="datetime-local"
            className="form-control"
            name="date_of_payout_transferred"
            value={formData.date_of_payout_transferred}
            onChange={handleChange}
          />
        </div>
     
        
      </div>
</div>
{/* Row: MG Billing, Report Status */}
 <div className="section-block">
        <h5 className="section-title">Report Details</h5>

<div className="row mb-3">
 <div className="col-md-4">
    <label>UTR / UPI Time</label>
    <input
      type="datetime-local"
      className="form-control"
      name="utr_upi_time"
      value={formData.utr_upi_time}
      onChange={handleChange}
    />
  </div>
  <div className="col-md-4">
    <label>MG Billing</label>
    <input
      type="text"
      className="form-control"
      name="mg_billing"
      value={formData.mg_billing}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-4">
              <label>Report Status</label>
              <select
                className="form-control"
                name="report_status"
                value={formData.report_status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                {statusOptions?.map(s => (
  <option key={s.value} value={s.value}>{s.label}</option>
))}

              </select>
            </div>
  </div>
  <div className='row mb-3'>    
  <div className="col-md-4">
          <label>Hard Copy Update</label>
          <select
            className="form-control"
            name="hard_copy_update"
            value={formData.hard_copy_update}
            onChange={handleChange}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>

</div>
</div>

      {/* Submit + Clear Buttons */}
      <div className="mt-4 d-flex justify-content-between">
        <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear All</button>
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>

    </form>
  </div>
</div>

  );
};

export default AssignTechnicianForm;
