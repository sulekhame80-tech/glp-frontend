import axios from "axios";
// const API_URL = "http://localhost:8000";
// const API_URL = "https://glp-backend-production.up.railway.app";
// const API_URL = "https://genelifeplus.co.in";
//const API_URL = "http://localhost:8000";
const API_URL = "https://glp-backend.onrender.com";
/**
 * Register User API
 * @param {Object} user - user registration details
 */
export function addRegisterApi(user) {
  return axios
    .post(`${API_URL}/api/register/`, {
      email: user.email,
      location_id: user.location_id,
      password: user.password,
      role: user.role,
      mobile_no: user.mobile_no,
      bank_name: user.bank_name,
      account_no: user.account_no,
      branch_name: user.branch_name,
      ifsc_code: user.ifsc_code,
      saving_current: user.saving_current,
      gst: user.gst,
      created_by: user.created_by,
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error registering user:", error);
    });
}
export function LoginApi({ user_name, password }) {
  console.log("📌 STEP 1 → Calling Login API", user_name, password);

  return axios
    .get(`${API_URL}/api/login/`, {
      params: { user_name, password },
    })
    .then((response) => {
      console.log("📌 STEP 2 → Login API Success:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("❌ Login API Error:", error);
      throw error;
    });
}


export function LogoutApi(user_name) {
  return axios
    .post(`${API_URL}/api/logout/`, {
      user_name: user_name,
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Logout error:", error);
    });
}

export function getAllUsersApi(page = 1, search = "", page_size = 10) {
  console.log("📌 Calling Get All Users API");

  return axios
    .get(`${API_URL}/api/user/all/`, {
      params: {
        page,
        search,
        page_size,
      },
    })
    .then((response) => {
      console.log("📌 Get All Users API Success:", response.data);
      return response.data; // includes results, count, next, previous
    })
    .catch((error) => {
      console.error("❌ Get All Users API Error:", error);
      throw error;
    });
}

export function updateUserApi(user_id, data) {
  return axios.put(`${API_URL}/api/user/update/${user_id}/`, data);
}
export function getusernamebyUserApi(user_name) {
  return axios.get(`${API_URL}/api/user_by_username/${user_name}/`);
}


export const deleteUserApi = async (userId) => {
  return await axios.delete(`${API_URL}/api/user/delete/${userId}/`);
};

export function createHospitalApi(data) {
  return axios.post(`${API_URL}/api/hospital/create/`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}



export function getHospitalApi(hospital_id) {
  return axios.get(`${API_URL}/api/hospital/${hospital_id}/`);
}

export function updateHospitalApi(hospital_id, data) {
  // Debug: print all FormData keys and values
  if (data instanceof FormData) {
    console.log("FormData being sent to backend:");
    for (let pair of data.entries()) {
      console.log(pair[0], pair[1]);
    }
  } else {
    console.log("Data being sent to backend:", data);
  }

  return axios.put(`${API_URL}/api/hospital/update/${hospital_id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure files are sent correctly
    },
  });
}

export function getLabReportApi(params) {
  return axios.get(`${API_URL}/api/lab-report/`, { params });
}

export function deleteHospitalApi(hospital_id) {
  return axios.delete(`${API_URL}/api/hospital/delete/${hospital_id}/`);
}
export function getAllordersApi(page = 1, search = "") {
  return axios.get(`${API_URL}/api/order_reg/`, {
    params: {
      page,
      search
    }
  });
}

export function addOrderApi(data) {
  return axios.post(`${API_URL}/api/orders/add/`, data);
}

// Update order by ID
export function updateOrderApi(id, data) {
  return axios.put(`${API_URL}/api/orders/update/${id}/`, data);
}

// Soft delete order by ID
export function deleteOrderApi(id) {
  return axios.delete(`${API_URL}/api/orders/delete/${id}/`);
}
export function getOrderByIdApi(id) {
  return axios.get(`${API_URL}/api/orders/${id}/`);
}
export const downloadGmailExcelApi = async () => {
  console.log("📌 downloadGmailExcelApi called"); // log when API is called
  try {
    const response = await axios.get(`${API_URL}/api/download-gmail-excels/`);
    console.log("✅ Gmail API response:", response.data); // log response from backend
    return response;
  } catch (error) {
    console.error("❌ Gmail API error:", error);
    throw error;
  }
};

export function updateGpsLocationApi(data) {
  return axios.post(`${API_URL}/api/gps/update/`, data);
}

export function assignTechnicianApi(data) {
  return axios.post(`${API_URL}/api/assign-technician/`, data);
}

export function getTechniciansApi() {
  return axios.get(`${API_URL}/api/get-technicians/`);
}

export function getclinicianApi() {
  return axios.get(`${API_URL}/api/get-clinician/`);
}

export function getOrdersApi() {
  return axios.get(`${API_URL}/api/get-orders/`);
}
export function getClinicianByOrderIdApi(order_id) {
  return axios.get(`${API_URL}/api/get-cliniciabyid/`, {
    params: { order_id }
  });
}
export function getTestsApi(page = 1, pageSize = 10, search = "") {
  return axios.get(`${API_URL}/api/tests/`, {
    params: {
      page: page,
      page_size: pageSize,
      search: search || undefined,

    },
  });
}


// CREATE TEST
export function createTestApi(data) {
  return axios.post(`${API_URL}/api/tests/create/`, data);
}

// GET TEST BY ID
export function getTestByIdApi(id) {
  return axios.get(`${API_URL}/api/tests/${id}/`);
}

// UPDATE TEST BY ID
export function updateTestApi(id, data) {
  return axios.put(`${API_URL}/api/tests/update/${id}/`, data);
}

// DELETE TEST BY ID
export function deleteTestApi(id) {
  return axios.delete(`${API_URL}/api/tests/delete/${id}/`);
}

export function getTestDropdownApi() {
  return axios.get(`${API_URL}/api/tests/dropdown/`);
}
// api.js or your API file
export function getLab_recordByIdApi(order_id) {
  return axios.get(`${API_URL}/api/lab-records-byid/`, {
    params: { order_id }   // <-- send order_id as query param
  });
}
export function deleteLabrecordApi(id) {
  return axios.delete(`${API_URL}/api/lab-records/delete/${id}/`);
}
export const importTestMasterApi = (formData) => {
  return axios.post(`${API_URL}/api/import-test-master/`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const importHospitalApi = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_URL}/api/import-hospital-master/`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};
export function createInvoiceApi(data) {
  return axios.post(
    `${API_URL}/api/invoice/create/`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}


export function getInvoiceInputApi(order_id) {
  return axios.get(`${API_URL}/api/generate/invoice/`, {
    params: { order_id }
  });
}
export function getInputinvoioceApi(order_id) {
  return axios.get(`${API_URL}/api/get_input/invoice/`, {
    params: { order_id }
  });
}
export function getInvoicesApi({ page = 1, page_size = 10, search = "" } = {}) {
  return axios.get(`${API_URL}/api/invoice/table/`, {
    params: { page, page_size, search }
  });
}
export function getUserLocationApi({ user_name, role = "" } = {}) {
  return axios.get(`${API_URL}/api/user/location/`, {
    params: { user_name, role }
  });
}
export function send_otp_API(username) {
  return axios.post(`${API_URL}/api/send-otp/`, { username });
}
export function verify_otp_API(username, otp) {
  console.log("Sending OTP verify request:", { username, otp }); // <-- Add this line

  return axios
    .post(`${API_URL}/api/verify-otp/`, JSON.stringify({ username, otp }), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("OTP verify response:", response.data); // <-- Add this line
      return response.data;
    })
    .catch((err) => {
      console.error("OTP verify error:", err.response?.data || err);
      throw err;
    });
}


export function getTechnicianApi(username) {
  return axios.get(`${API_URL}/api/get_user/${username}/`);
}

export function updatetechnicianApi(data) {
  return axios.post(`${API_URL}/api/update_user/`, data);
}

export const getDashboardReportApi = (type) => {
  return axios.get(`${API_URL}/api/dashboard-report/`, {
    params: { type: type }
  });
};


export function addSpecimenTypeApi(data) {
  return axios.post(`${API_URL}/api/specimen-type/add/`, data);
}
export function getSpecimenList(search, page, page_size) {
  return axios.get(`${API_URL}/api/specimen-type/all/`, {
    params: { search, page, page_size }
  });
}

export function getSpecimenTypeApi(id) {
  return axios.get(`${API_URL}/api/specimen-type/${id}/`);
}
export function updateSpecimenTypeApi(id, data) {
  return axios.put(`${API_URL}/api/specimen-type/${id}/update/`, data);
}
export function deleteSpecimenTypeApi(id) {
  return axios.delete(`${API_URL}/api/specimen-type/${id}/delete/`);
}
export function getspecimenDropdownApi() {
  return axios.get(`${API_URL}/api/specimen-types/dropdown/`);
}



// new

// new vishal
export const getPaymentSummaryApi = (location, role) => {
  const params = {};

  if (location) {
    params.location = location;
  }

  if (role) {
    params.role = role; // 👈 NEW: send role to backend
  }

  return axios.get(`${API_URL}/api/dashboard/payment-summary/`, {
    params,
  });
};



export function getLabrecordApi(
  page = 1,
  pageSize = 10,
  search = "",
  location = null,
  role = null     // ⭐ NEW
) {
  console.log("➡ Role:", role); // ⭐ log role

  const params = {
    page: page,
    page_size: pageSize,
    search: search || undefined,
  };

  if (location) params.location = location;
  if (role) params.role = role;  // ⭐ send role to backend

  return axios.get(`${API_URL}/api/lab-records/`, { params });
}


export const getDashboadmetricReportApi = (filterType, location, role) => {
  return axios.get(`${API_URL}/api/dashboard/metrics/`, {
    params: {
      filter: filterType,
      location: location || undefined,
      role: role || undefined,        // ⭐ NEW: send role
    },
  });
};




// API call to get total orders by business type
export const getcountbybussinesApi = (location, role) => {
  return axios.get(`${API_URL}/api/orders-by-business/`, {
    params: {
      location: location || undefined,
      role: role || undefined,         // ⭐ NEW
    },
  });
};

export const getpaymentbybussinessApi = (location, role) => {
  return axios.get(`${API_URL}/api/payment-by-business/`, {
    params: {
      location: location || undefined,
      role: role || undefined,         // ⭐ NEW
    },
  });
};


export const getReportSummaryApi = ({ start_date, end_date, location, role } = {}) => {
  const params = {};
  if (start_date) params.start_date = start_date;

  if (location) params.location = location;


  return axios.get(`${API_URL}/api/reports/summary/`, { params });
};



export function getAllHospitalsApi(params = {}) {
  return axios.get(`${API_URL}/api/hospital/all/`, { params });
}



export const getMonthWiseRecordsApi = (hospital_name, doctor_name, month, year) => {
  return axios.get(`${API_URL}/api/invoice/month-records/`, {
    params: {
      hospital_name,
      doctor_name,
      month,
      year
    }
  });
};

export const createmonthlyInvoiceApi = (data) => {
  return axios.post(`${API_URL}/api/invoice/month-create/`, data);
};
export const getInvoicesmonthlyApi = (hospital_name, month, year) => {
  return axios.get(`${API_URL}/api/invoice/new/`, {
    params: {
      hospital_name,
      month,
      year
    }
  });

};


export const createLabReceiptApi = (data) => {
  console.log("📤 SENDING REQUEST TO BACKEND /generate-lab-receipt/");
  console.log("➡️ Payload:", data);
  console.log("➡️ URL:", `${API_URL}/api/generate-lab-receipt/`);

  return axios
    .post(`${API_URL}/api/generate-lab-receipt/`, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => {
      console.log("✅ BACKEND RESPONSE RECEIVED");
      console.log("⬅️ Response Data:", res.data);
      return res;
    })
    .catch((err) => {
      console.error("❌ API ERROR (createLabReceiptApi):", err);

      if (err.response) {
        console.error("❌ Server responded with error:", err.response.data);
      } else {
        console.error("❌ No response from server - Network/URL/CORS issue");
      }

      throw err;
    });
};

export const getLabReceiptPdfApi = (orderId) => {
  return axios.get(`${API_URL}/api/generate-lab-receipt/`, {
    params: { order_id: orderId },
    responseType: "json" // <-- IMPORTANT: use json not blob
  });
};



// new
export const getTechniciansForAttendanceApi = () => {
  return axios.get(`${API_URL}/api/attendance/technicians/`);
};

export const saveAttendanceApi = (payload) => {
  // payload shape: { date: "YYYY-MM-DD", rows: [ { technician_name, username, status }, ... ] }
  return axios.post(`${API_URL}/api/attendance/save/`, payload);
};

export const getAttendanceStatusApi = (date) => {
  // GET /api/attendance/status/?date=YYYY-MM-DD
  return axios.get(`${API_URL}/api/attendance/status/`, { params: { date } });
};


export const getAttendanceRangeApi = (fromDate, toDate) => {
  return axios.get(`${API_URL}/api/attendance/range/`, { params: { from: fromDate, to: toDate } });
};

export const searchEmployeeAttendanceApi = (username, month) => {
  return axios.get(`${API_URL}/api/employee-attendance-search/`, {
    params: {
      username,
      month,
    },
  });
};


/* ===================== STATUS APIs ===================== */

// Add Status
export function addStatusApi(data) {
  return axios.post(`${API_URL}/api/status/create/`, data);
}


// Update Status
export function updateStatusApi(id, data) {
  return axios.put(`${API_URL}/api/status/update/${id}/`, data);
}

// Delete Status (Soft Delete)
export function deleteStatusApi(id) {
  return axios.delete(`${API_URL}/api/status/delete/${id}/`);
}

/* ===================== CATEGORY APIs ===================== */

// Add Category
export function addCategoryApi(data) {
  return axios.post(`${API_URL}/api/category/create/`, data);
}


// Update Category
export function updateCategoryApi(id, data) {
  return axios.put(`${API_URL}/api/category/update/${id}/`, data);
}

// Delete Category (Soft Delete)
export function deleteCategoryApi(id) {
  return axios.delete(`${API_URL}/api/category/delete/${id}/`);
}

/* ===================== LOCATION APIs ===================== */

// Add Location
export function addLocationApi(data) {
  return axios.post(`${API_URL}/api/location/create/`, data);
}

export function addsalespersonApi(data) {
  return axios.post(`${API_URL}/api/salesperson/create/`, data);
}



// Update Location
export function updateLocationApi(id, data) {
  return axios.put(`${API_URL}/api/location/update/${id}/`, data);
}

export function updatesalespersonApi(id, data) {
  return axios.put(`${API_URL}/api/salesperson/update/${id}/`, data);
}
// Delete Location (Soft Delete)
export function deleteLocationApi(id) {
  return axios.delete(`${API_URL}/api/location/delete/${id}/`);
}
export function deletesalespersonApi(id) {
  return axios.delete(`${API_URL}/api/salesperson/delete/${id}/`);
}
export function getStatusListApi(search = "", page = 1, pageSize = 10) {
  return axios.get(`${API_URL}/api/status/list/`, {
    params: { search, page, page_size: pageSize }
  });
}

export function getCategoryListApi(search = "", page = 1, pageSize = 10) {
  return axios.get(`${API_URL}/api/category/list/`, {
    params: { search, page, page_size: pageSize }
  });
}

export function getLocationListApi(search = "", page = 1, pageSize = 10) {
  return axios.get(`${API_URL}/api/location/list/`, {
    params: { search, page, page_size: pageSize }
  });
}
export function getsalespersonListApi(search = "", page = 1, pageSize = 10) {
  return axios.get(`${API_URL}/api/salesperson/list/`, {
    params: { search, page, page_size: pageSize }
  });
}
export function statusDropdownApi() {
  return axios.get(`${API_URL}/api/dropdown/status/`);
}

// -------------------- Category Dropdown --------------------
export function categoryDropdownApi() {
  return axios.get(`${API_URL}/api/dropdown/category/`);
}

// -------------------- Business Type Dropdown --------------------
export function businessTypeDropdownApi() {
  return axios.get(`${API_URL}/api/dropdown/business-type/`);
}

// -------------------- Location Dropdown --------------------
export function locationDropdownApi() {
  return axios.get(`${API_URL}/api/dropdown/location/`);
}

export function salespersonDropdownApi() {
  return axios.get(`${API_URL}/api/salesperson/dropdown/`);
}

/* ADD PATIENT */
export function addPatientApi(data) {
  return axios.post(`${API_URL}/api/patient/add/`, data);
}

/* UPDATE PATIENT */
export function updatePatientApi(patient_id, data) {
  return axios.put(
    `${API_URL}/api/patient/update/${patient_id}/`,
    data
  );
}

/* SOFT DELETE PATIENT */
export function deletePatientApi(patient_id) {
  return axios.delete(
    `${API_URL}/api/patient/delete/${patient_id}/`
  );
}

/* GET ALL PATIENTS */
export function getPatientListApi(search = "", page = 1, size = 10) {
  return axios.get(`${API_URL}/api/patient/list/`, {
    params: { search, page, size }
  });
}

/* GET PATIENT BY ID */
export function getPatientByIdApi(patient_id) {
  return axios.get(
    `${API_URL}/api/patient/${patient_id}/`
  );
}

export function patientDropdownApi() {
  return axios.get(`${API_URL}/api/patient/dropdown/`);
}


/* ADD ROUTINE */
export function addRoutineApi(data) {
  return axios.post(`${API_URL}/api/routine/add/`, data);
}

/* UPDATE ROUTINE */
export function updateRoutineApi(routine_id, data) {
  return axios.put(
    `${API_URL}/api/routine/update/${routine_id}/`,
    data
  );
}

/* DELETE ROUTINE */
export function deleteRoutineApi(routine_id) {
  return axios.delete(
    `${API_URL}/api/routine/delete/${routine_id}/`
  );
}

/* GET ALL ROUTINES */
export function getRoutineListApi(params) {
  return axios.get(`${API_URL}/api/routine/list/`, { params });
}

/* GET ROUTINE BY ID */
export function getRoutineByIdApi(routine_id) {
  return axios.get(
    `${API_URL}/api/routine/${routine_id}/`
  );
}

/* GET ROUTINES BY PATIENT */
export function getRoutineByPatientApi(patient_id) {
  return axios.get(
    `${API_URL}/api/routine/by-patient/${patient_id}/`
  );
}
// api/endpoint.js
export function getTestPriceApi(test_code, test_name) {
  return axios.get(`${API_URL}/api/tests/price/`, {
    params: { test_code, test_name }
  });
}


// Employee Monthly Orders Report
export function getEmployeeMonthlyOrdersApi({ username, month }) {
  return axios.get(`${API_URL}/api/reports/employee-monthly-orders/`, {
    params: {
      username,
      month,
    },
  });
}
