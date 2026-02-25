import React, { Fragment, useState ,useEffect} from 'react';
import { Form, Col, InputGroup, Button } from 'react-bootstrap';
import { createHospitalApi, importHospitalApi,locationDropdownApi } from '../../api/endpoint';   // <-- IMPORT API

function AddHospital() {
  const [validated, setValidated] = useState(false);
const [excelFile, setExcelFile] = useState(null);

const [locations, setLocations] = useState([]);
const [selectedLocation, setSelectedLocation] = useState("");
useEffect(() => {
  const fetchLocations = async () => {
    try {
      const res = await locationDropdownApi();
      setLocations(res.data || []);
    } catch (err) {
      console.error("Failed to load locations", err);
    }
  };

  fetchLocations();
}, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const formData = new FormData(form);

    try {
      const response = await createHospitalApi(formData);
      console.log("Hospital Created Successfully", response.data);

      alert("Hospital Added Successfully!");

      form.reset(); // Reset form after success
      setValidated(false);

    } catch (error) {
      console.error("Error while creating hospital:", error);
      alert("Failed to create hospital. Check console.");
    }
  };


 return (
  <Fragment>
    <div className="col-xl-12 col-md-12">
      <div className="ms-panel ms-panel-fh">
        <div className="ms-panel-body">
       


          <Form
            noValidate
            validated={validated}
            className="needs-validation clearfix"
            onSubmit={handleSubmit}
          >
            <Form.Row>

              {/* Hospital Name */}
              <Form.Group as={Col} md="4" controlId="hospitalName">
                <Form.Label>Hospital Name</Form.Label>
                <InputGroup>
                  <Form.Control required type="text" name="hospital_name" placeholder="Enter Hospital Name" />
                  <Form.Control.Feedback type="invalid">Hospital Name is required</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              {/* Doctor Name */}
              <Form.Group as={Col} md="4" controlId="doctorName">
                <Form.Label>Doctor Name</Form.Label>
                <InputGroup>
                  <Form.Control required type="text" name="doctor_name" placeholder="Enter Doctor Name" />
                  <Form.Control.Feedback type="invalid">Doctor Name is required</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              {/* Mobile */}
              <Form.Group as={Col} md="4" controlId="mobileNo">
                <Form.Label>Mobile Number</Form.Label>
                <InputGroup>
                  <Form.Control type="text" name="mobile_no" placeholder="Mobile Number" />
                </InputGroup>
              </Form.Group>

              {/* Email */}
              <Form.Group as={Col} md="4" controlId="email">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <Form.Control type="email" name="email_id" placeholder="Email" />
                </InputGroup>
              </Form.Group>

              {/* City */}
              <Form.Group as={Col} md="4" controlId="city">
                <Form.Label>City</Form.Label>
                <InputGroup>
                  <Form.Control type="text" name="city" placeholder="City" />
                </InputGroup>
              </Form.Group>

              {/* Location (Full Width) */}
            <Form.Group as={Col} md="4" controlId="location">
  <Form.Label>Location</Form.Label>
  <InputGroup>
    <Form.Control
      as="select"
      name="location"
      value={selectedLocation}
      onChange={(e) => setSelectedLocation(e.target.value)}
      required
    >
      <option value="">-- Select Location --</option>
      {locations.map((loc) => (
        <option key={loc.id} value={loc.location}>
          {loc.location}
        </option>
      ))}
    </Form.Control>
    <Form.Control.Feedback type="invalid">
      Location is required
    </Form.Control.Feedback>
  </InputGroup>
</Form.Group>



              {/* Bank Name */}
              <Form.Group as={Col} md="4">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control type="text" name="bank_name" placeholder="Bank Name" />
              </Form.Group>

              {/* Account No */}
              <Form.Group as={Col} md="4">
                <Form.Label>Account Number</Form.Label>
                <Form.Control type="text" name="account_no" placeholder="Account Number" />
              </Form.Group>

              {/* Branch Name */}
              <Form.Group as={Col} md="4">
                <Form.Label>Branch Name</Form.Label>
                <Form.Control type="text" name="branch_name" placeholder="Branch Name" />
              </Form.Group>

              {/* IFSC Code */}
              <Form.Group as={Col} md="4">
                <Form.Label>IFSC Code</Form.Label>
                <Form.Control type="text" name="ifsc_code" placeholder="IFSC Code" />
              </Form.Group>

              {/* Saving or Current */}
              <Form.Group as={Col} md="4">
                <Form.Label>Account Type</Form.Label>
                <Form.Control as="select" name="saving_current">
                  <option value="">-- Select --</option>
                  <option>SAVINGS</option>
                  <option>CURRENT</option>
                </Form.Control>
              </Form.Group>

              {/* GST */}
              <Form.Group as={Col} md="4">
                <Form.Label>GST Number</Form.Label>
                <Form.Control type="text" name="gst" placeholder="GST Number" />
              </Form.Group>

              {/* Upload Image (Full) */}
              <Form.Group as={Col} md="12">
                <Form.Label>Upload Hospital Logo</Form.Label>
                <InputGroup>
                  <Form.File name="image" label="Choose file..." custom />
                </InputGroup>
              </Form.Group>

              {/* Buttons (Right Align Full Row) */}
              <Form.Group as={Col} md="12" className="m-0 text-right">
                <Button type="reset" className="btn btn-primary mr-2">Reset</Button>
                <Button type="submit" className="btn btn-primary">Save</Button>
              </Form.Group>

            </Form.Row>
          </Form>
        </div>
      </div>
    </div>
  </Fragment>
);

}

export default AddHospital;
