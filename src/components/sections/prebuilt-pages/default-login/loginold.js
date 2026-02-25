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
   
        <div className="ms-auth-col">
          <div className="ms-auth-form">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <h1>Login to Account</h1>
              <p>Please enter your username and password to continue</p>

              <Form.Group className="mb-3" controlId="validationCustom01">
                <Form.Label>User Name</Form.Label>
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

              <Form.Group className="mb-2" controlId="validationCustom02">
                <Form.Label>Password</Form.Label>
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

              <Form.Group controlId="validationCustom03">
                <Form.Label className="ms-checkbox-wrap">
                  <input className="form-check-input" type="checkbox" defaultValue />
                  <i className="ms-checkbox-check" />
                </Form.Label>
                <span> Remember Password </span>
                <Form.Label className="d-block mt-3">
                  <Link to="#" className="btn-link" onClick={handleShow}>
                    Forgot Password?
                  </Link>
                </Form.Label>
              </Form.Group>

              <Button type="submit" className="mt-4 d-block w-100">
                Sign In
              </Button>

              {/* Social login buttons and register link remain same */}
            </Form>

            {/* Modal remains same */}
            <Modal show={show} className="modal-min" onHide={handleClose} centered>
              <Modal.Body className="text-center">
                <Fragment>
                  <button type="button" className="close" onClick={handleClose}>
                    <span aria-hidden="true">×</span>
                  </button>
                  <i className="flaticon-secure-shield d-block" />
                  <h1>Forgot Password?</h1>
                  <p> Enter your email to recover your password </p>
                  <form>
                    <div className="ms-form-group has-icon">
                      <input
                        type="text"
                        placeholder="Email Address"
                        className="form-control"
                        name="forgot-password"
                      />
                      <i className="material-icons">email</i>
                    </div>
                    <button type="submit" className="btn btn-primary shadow-none">
                      Reset Password
                    </button>
                  </form>
                </Fragment>
              </Modal.Body>
            </Modal>
          </div>
        </div>
     
 
  );
}

export default Content;
