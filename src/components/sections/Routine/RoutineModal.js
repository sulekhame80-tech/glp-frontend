import React, { useEffect, useState } from "react";
import {
  patientDropdownApi,
  getTestDropdownApi,
  addRoutineApi,
  updateRoutineApi,
  getRoutineByIdApi,
  getTestPriceApi
} from "../../api/endpoint";
import Select from "react-select";
const RoutineModal = ({ editId, onClose, onSuccess }) => {
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [prices, setPrices] = useState({ mrp: "" });
  const [form, setForm] = useState({
  patient: "",
  test_codes: [],   // ✅ array
  test_names: [],   // ✅ array
  lab_id: "",
  discount: "",
  total_mrp: "",
  price: ""
});

const testOptions = (Array.isArray(tests) ? tests : []).map(t => ({
  value: t.test_code,
  label: t.label,        // "[CODE] - NAME"
  test_name: t.test_name
}));


  // Load dropdowns
  useEffect(() => {
    patientDropdownApi().then(res => setPatients(res.data));
    getTestDropdownApi().then(res => setTests(res.data.data));
  }, []);

  // Load routine data if editing
useEffect(() => {
  if (editId) {
    getRoutineByIdApi(editId).then(res => {
      const data = res.data;

      setForm({
        patient: data.patient_id || "",           // ✅ use patient_id
        test_codes: data.test_code
          ? data.test_code.split(",").map(c => c.trim())
          : [],
        test_names: data.test_name
          ? data.test_name.split(",").map(n => n.trim())
          : [],
        lab_id: data.lab_id || "",
        discount: data.discount || "",
        total_mrp: data.test_details
          ? data.test_details.reduce((sum, t) => sum + Number(t.mrp), 0).toFixed(2)
          : "",
        price: data.price || ""
      });
    });
  }
}, [editId]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => {
      let updatedForm = { ...prev, [name]: value };

      // Recalculate price if discount changes
      if (name === "discount") {
        const mrpValue = parseFloat(prices.mrp) || 0;
        const discountValue = parseFloat(value) || 0;
        updatedForm.price = (mrpValue - (mrpValue * discountValue / 100)).toFixed(2);
      }

      return updatedForm;
    });
  };
const handleTestSelect = async (selectedOptions) => {
  const selected = selectedOptions || [];

  const test_codes = selected.map(opt => opt.value);
  const test_names = selected.map(opt => opt.test_name);

  try {
    // 🔹 Fetch all prices in parallel
    const responses = await Promise.all(
      selected.map(opt =>
        getTestPriceApi(opt.value, opt.test_name)
      )
    );

    // 🔹 Sum all MRPs
    const totalMrp = responses.reduce((sum, res) => {
      return sum + Number(res.data.data?.mrp || 0);
    }, 0);

    const discount = Number(form.discount || 0);
    const finalPrice = totalMrp - (totalMrp * discount) / 100;

    setForm(prev => ({
      ...prev,
      test_codes,
      test_names,
      total_mrp: totalMrp.toFixed(2),
      price: finalPrice.toFixed(2)
    }));

  } catch (error) {
    console.error("Error fetching test prices", error);
  }
};
const handleDiscountChange = (e) => {
  const discount = Number(e.target.value || 0);
  const totalMrp = Number(form.total_mrp || 0);

  const finalPrice = totalMrp - (totalMrp * discount) / 100;

  setForm(prev => ({
    ...prev,
    discount,
    price: finalPrice.toFixed(2)
  }));
};

const handleSubmit = () => {
  if (!form.patient || form.test_codes.length === 0) {
    alert("Patient and at least one test are required");
    return;
  }

  const payload = {
    patient: Number(form.patient),

   // patient_id: Number(form.patient),                // ✅ FIX
    test_code: form.test_codes.join(","),            // ✅ string
    test_name: form.test_names.join(","),            // ✅ string
    lab_id: form.lab_id || null,                     // ✅ avoid empty string
    total_mrp: Number(form.total_mrp),               // ✅ number
    discount: Number(form.discount || 0),            // ✅ number
    price: Number(form.price)                        // ✅ number
  };

  console.log("SUBMIT PAYLOAD:", payload);

  const apiCall = editId
    ? updateRoutineApi(editId, payload)
    : addRoutineApi(payload);

  apiCall
    .then(() => {
      onSuccess();
      onClose();
    })
    .catch(err => {
      console.error("API ERROR:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    });
};


  return (
    <div className="modal-backdrop-p">
      <div className="modal-box-p">
        <div className="modal-header-p">{editId ? "Update Routine" : "Add Routine"}</div>

        <div className="modal-body-p">
          <select name="patient" value={form.patient} onChange={handleChange}>
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
<Select
  isMulti
  options={testOptions}
  value={testOptions.filter(opt =>
    form.test_codes.includes(opt.value)
  )}
  onChange={handleTestSelect}
  placeholder="Select Tests"
/>



         <div>
              <input name="lab_id" placeholder="Lab ID" value={form.lab_id} onChange={handleChange} />

        </div>

<input
  type="text"
  value={form.total_mrp}
  placeholder="Total MRP"
  disabled
/>

<input
  type="number"
  placeholder="Discount %"
  value={form.discount}
  onChange={handleDiscountChange}
/>

<input
  type="text"
  value={form.price}
  placeholder="Final Price"
  disabled
/>

         </div>

        <div className="modal-footer-p">
          <button className="btn btn-primary" onClick={handleSubmit}>{editId ? "Update" : "Save"}</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RoutineModal;
