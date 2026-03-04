import React, { useState, Fragment, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, InputGroup, Button, Modal } from "react-bootstrap";
import { LoginApi, getusernamebyUserApi } from "../../../api/endpoint"; // your API function
import { UserContext } from "../../../../UserContext";

function Content() {
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Get UserContext functions
  const { setUserName, setRole, setLocation } = useContext(UserContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    try {
      // Step 1: Verify username and password
      const response = await LoginApi({
        user_name: username,
        password: password
      });

      console.log("LOGIN RESPONSE:", response);

      if (!response || response.length === 0) {
        alert("Invalid username or password");
        return;
      }

      // Step 2: Get user details (name, role, location)
      const userDetails = await getusernamebyUserApi(username);

      if (userDetails?.data) {
        // Set user data in context (automatically saves to localStorage)
        setUserName(userDetails.data.user_name);
        setRole(userDetails.data.role);

        // Store location if available
        if (userDetails.data.location !== undefined) {
          setLocation(userDetails.data.location);
          console.log("Location from backend:", userDetails.data.location);
        }

        // Legacy localStorage for backward compatibility
        localStorage.setItem("user", JSON.stringify(userDetails.data));
        localStorage.setItem("user_name", userDetails.data.user_name);
        localStorage.setItem("user_role", userDetails.data.role);

        navigate("/dashboard/web-analytics");
      } else {
        alert("Failed to retrieve user details");
      }
    } catch (err) {
      console.error("Login Error:", err);

      // Handle specific error cases
      if (err?.response?.status === 400 || err?.response?.status === 401 || err?.response?.status === 404) {
        alert("Invalid username or password");
        return;
      }

      if (err?.response?.data?.message) {
        alert(err.response.data.message);
        return;
      }

      alert("Login error: " + JSON.stringify(err?.response?.data || err?.message || err));
    }
  };

  return (

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f0f8ff' // keeping this to match landing page, but can revert if needed
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        padding: '40px',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Logo at the top */}
        <div style={{ textAlign: 'center', marginBottom: '30px', width: '100%' }}>
          <img
            src={process.env.PUBLIC_URL + '/logo.png'}
            alt="GENELIFE Plus"
            style={{ height: '90px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 10px' }}
          />
          {/* <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1565c0', letterSpacing: '0.5px' }}>
            GENELIFE <span style={{ color: '#2e7d32' }}>Plus</span>
          </div> */}
        </div>

        <h1 className="text-center mb-" style={{ width: '100%', fontSize: '20px' }}>Login to Account</h1>
        <p className="text-center mb-4 text-muted" style={{ width: '100%' }}>Please enter your username and password to continue</p>

        <Form noValidate validated={validated} onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Form.Group className="mb-3" controlId="validationCustom01">
            <Form.Label className="d-block text-center">User Name</Form.Label>
            <InputGroup>
              <Form.Control
                required
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4" controlId="validationCustom02">
            <Form.Label className="d-block text-center">Password</Form.Label>
            <InputGroup>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a password.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="validationCustom03" className="mb-4">
            <div className="d-flex flex-column align-items-center">
              <div className="mb-2">
                <Form.Label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', margin: 0 }}>
                  <input className="form-check-input" type="checkbox" style={{ marginRight: '8px' }} />
                  <span> Remember Password </span>
                </Form.Label>
              </div>
              <Link to="#" className="btn-link" onClick={handleShow} style={{ color: '#1565c0', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
          </Form.Group>

          <Button type="submit" className="w-100 py-2">
            Sign In
          </Button>
        </Form>
      </div>

      <Modal show={show} className="modal-min" onHide={handleClose} centered>
        <Modal.Body className="text-center">
          <Fragment>
            <button type="button" className="close" onClick={handleClose}>
              <span aria-hidden="true">×</span>
            </button>
            <i className="flaticon-secure-shield d-block" />
            <h1>Forgot Password?</h1>
            <p> Enter your email to recover your password </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="ms-form-group has-icon">
                <input
                  type="text"
                  placeholder="Email Address"
                  className="form-control"
                  name="forgot-password"
                />
                <i className="material-icons">email</i>
              </div>
              <button type="submit" className="btn btn-primary shadow-none" onClick={handleClose}>
                Reset Password
              </button>
            </form>
          </Fragment>
        </Modal.Body>
      </Modal>
    </div>


  );
}

export default Content;
