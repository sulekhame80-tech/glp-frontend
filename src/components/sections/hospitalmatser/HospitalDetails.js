import React, { useEffect, useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHospitalApi, updateHospitalApi, locationDropdownApi } from "../../api/endpoint";
import { Form, Col, InputGroup, Button } from "react-bootstrap";

const HospitalDetail = () => {
  const { id } = useParams(); // 👈 Get ID from URL
  const navigate = useNavigate();

  const [hospital, setHospital] = useState({
    hospital_name: "",
    doctor_name: "",
    mobile_no: "",
    email_id: "",
    city: "",
    location: "",
    bank_name: "",
    account_no: "",
    branch_name: "",
    ifsc_code: "",
    saving_current: "",
    gst: "",
    image: null,
  });
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await locationDropdownApi();
      setLocations(res.data || []);
    } catch (err) {
      console.error("Failed to fetch locations:", err);
    }
  };

  const [validated, setValidated] = useState(false);


  useEffect(() => {
    fetchHospital();
    // intentionally no react-hooks/exhaustive-deps usage
  }, []);

  const fetchHospital = async () => {
    try {
      const res = await getHospitalApi(id);
      // ensure we set an object so controlled inputs don't get undefined
      setHospital(res.data || {
        hospital_name: "",
        doctor_name: "",
        mobile_no: "",
        email_id: "",
        city: "",
        location: "",
        bank_name: "",
        account_no: "",
        branch_name: "",
        ifsc_code: "",
        saving_current: "",
        gst: "",
        image: null,
      });
      // keep dropdown visible initially regardless of returned value
      setIsCustomLocation(false);
    } catch (err) {
      console.error("Error fetching hospital:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    const newVal = files ? files[0] : type === "checkbox" ? checked : value;

    setHospital((prev) => ({
      ...prev,
      [name]: newVal,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(hospital).forEach((key) => {
      if (key === "image") {
        if (hospital.image instanceof File) {
          formData.append(key, hospital.image);
          console.log("Adding NEW image file to FormData");
        } else {
          console.log("Skipping existing image string/null for Update");
        }
      } else {
        formData.append(key, hospital[key] || "");
      }
    });

    try {
      await updateHospitalApi(id, formData);
      alert("Hospital Updated Successfully!");
      navigate("/add-hospital/");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed. See console for details.");
    }
  };



  return (
    <Fragment>
      <div className="col-xl-12 col-md-12">
        <div className="ms-panel ms-panel-fh">
          <div className="ms-panel-body">
            <Form
              noValidate
              // validated={validated}
              className="needs-validation clearfix"
              onSubmit={handleSubmit}
            >
              <Form.Row>
                {/* Hospital Name */}
                <Form.Group as={Col} md="4" controlId="hospitalName">
                  <Form.Label>Hospital Name</Form.Label>
                  <InputGroup>
                    <Form.Control
                      required
                      type="text"
                      name="hospital_name"
                      placeholder="Enter Hospital Name"
                      value={hospital.hospital_name || ""}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Hospital Name is required
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Doctor Name */}
                <Form.Group as={Col} md="4" controlId="doctorName">
                  <Form.Label>Doctor Name</Form.Label>
                  <InputGroup>
                    <Form.Control
                      required
                      type="text"
                      name="doctor_name"
                      placeholder="Enter Doctor Name"
                      value={hospital.doctor_name || ""}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Doctor Name is required
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Mobile Number */}
                <Form.Group as={Col} md="4" controlId="mobileNo">
                  <Form.Label>Mobile Number</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="mobile_no"
                      placeholder="Mobile Number"
                      value={hospital.mobile_no || ""}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Email */}
                <Form.Group as={Col} md="4" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      name="email_id"
                      value={hospital.email_id || ""}
                      placeholder="Email"
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>

                {/* City */}
                <Form.Group as={Col} md="4" controlId="city">
                  <Form.Label>City</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="city"
                      value={hospital.city || ""}
                      placeholder="City"
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Location (Dropdown or Text Input) */}
                <Form.Group as={Col} md="4" controlId="location">
                  <Form.Label>Location</Form.Label>

                  <Form.Control
                    as="select"
                    name="location"
                    value={hospital.location || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Location</option>

                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.location}>
                        {loc.location}
                      </option>
                    ))}
                  </Form.Control>

                  <Form.Control.Feedback type="invalid">
                    Please select a location
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Bank Name */}
                <Form.Group as={Col} md="4">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="bank_name"
                    value={hospital.bank_name || ""}
                    placeholder="Bank Name"
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Account No */}
                <Form.Group as={Col} md="4">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_no"
                    value={hospital.account_no || ""}
                    placeholder="Account Number"
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Branch Name */}
                <Form.Group as={Col} md="4">
                  <Form.Label>Branch Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="branch_name"
                    value={hospital.branch_name || ""}
                    placeholder="Branch Name"
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* IFSC Code */}
                <Form.Group as={Col} md="4">
                  <Form.Label>IFSC Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="ifsc_code"
                    value={hospital.ifsc_code || ""}
                    placeholder="IFSC Code"
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Saving or Current */}
                <Form.Group as={Col} md="4">
                  <Form.Label>Account Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="saving_current"
                    value={hospital.saving_current || ""}
                    onChange={handleChange}
                  >
                    <option value="">-- Select --</option>
                    <option value="SAVINGS">SAVINGS</option>
                    <option value="CURRENT">CURRENT</option>
                  </Form.Control>
                </Form.Group>

                {/* GST */}
                <Form.Group as={Col} md="4">
                  <Form.Label>GST Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="gst"
                    value={hospital.gst || ""}
                    placeholder="GST Number"
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col} md="12">
                  <Form.Label>Hospital Logo</Form.Label>
                  <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {hospital.image ? (
                      hospital.image instanceof File ? (
                        <img
                          src={URL.createObjectURL(hospital.image)}
                          alt="Hospital Logo (new)"
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #dee2e6" }}
                        />
                      ) : (
                        <img
                          src={`data:image/png;base64,${hospital.image}`}
                          alt="Hospital Logo"
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #dee2e6" }}
                        />
                      )
                    ) : (
                      <div style={{ width: "100px", height: "100px", borderRadius: "8px", background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #3366cc' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#3366cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 21h18" />
                          <path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" />
                          <path d="M9 12h6" />
                          <path d="M12 9v6" />
                        </svg>
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <Form.File name="image" label="Change Logo" custom onChange={handleChange} />
                      <small className="text-muted mt-2 d-block">Recommended: Square image, max 2MB</small>
                    </div>
                  </div>
                </Form.Group>

                {/* Buttons (Right Align Full Row) */}
                <Form.Group as={Col} md="12" className="m-0 text-right">
                  <Button type="submit" className="btn btn-primary">
                    Save
                  </Button>
                </Form.Group>
              </Form.Row>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default HospitalDetail;
