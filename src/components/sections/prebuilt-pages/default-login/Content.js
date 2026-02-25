import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, InputGroup, Button } from "react-bootstrap";

// ✅ FIXED IMPORT PATH
import {
  LoginApi,
  send_otp_API,
  verify_otp_API,
  getusernamebyUserApi,
} from "../../../api/endpoint";

// ✅ FIXED IMPORT PATH
import { UserContext } from "../../../../UserContext";

function Content() {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // 🔹 setLocation used for other pages
  const { setUserName, setRole, setLocation } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!event.currentTarget.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);

    // -----------------------------
    // STEP 1: USERNAME + PASSWORD
    // -----------------------------
    if (!otpSent) {
      try {
        const loginResponse = await LoginApi({ user_name: username, password });

        // Optional sanity check (keep your old check)
        if (!loginResponse || loginResponse.length === 0) {
          alert("Invalid username or password");
          return;
        }

        const otpResponse = await send_otp_API(username);
        if (otpResponse?.data?.message) {
          setOtpSent(true);
          alert("OTP sent to your registered email.");
        } else {
          alert("Failed to send OTP.");
        }
      } catch (err) {
        console.error("Login Error:", err);

        // 👉 Wrong username or password (most common)
        if (
          err?.response?.status === 400 ||
          err?.response?.status === 401 ||
          err?.response?.status === 404
        ) {
          alert("Invalid username or password");
          return;
        }

        if (err?.response?.data?.message) {
          alert(err.response.data.message);
          return;
        }

        alert("Something went wrong. Please try again.");
      }
      return;
    }

    // -----------------------------
    // STEP 2: OTP VERIFICATION
    // -----------------------------
    try {
      const verifyResponse = await verify_otp_API(username, otp);

      if (verifyResponse?.success) {
        const userDetails = await getusernamebyUserApi(username);

        if (userDetails?.data) {
          // existing logic
          setUserName(userDetails.data.user_name);
          setRole(userDetails.data.role);

          // store location and log it
          if (userDetails.data.location !== undefined) {
            setLocation(userDetails.data.location);
            console.log(
              "Location from backend in Content.js:",
              userDetails.data.location
            );
          } else {
            console.log("No location field in userDetails.data");
          }
        } else {
          console.log("userDetails.data not found");
        }

        navigate("/dashboard/web-analytics");
      } else {
        // OTP is invalid but request succeeded
        alert("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP Verify Error:", err);

      // 👉 Wrong OTP from backend
      if (err?.response?.status === 400 || err?.response?.status === 404) {
        alert("Invalid OTP. Please try again.");
        return;
      }

      if (err?.response?.data?.message) {
        alert(err.response.data.message);
        return;
      }

      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="ms-auth-col">
      <div className="ms-auth-form">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <h1>Login</h1>
          <p>Please enter login details</p>

          <Form.Group className="mb-3">
            <Form.Label>User Name</Form.Label>
            <InputGroup>
              <Form.Control
                required
                type="text"
                placeholder="Enter username"
                value={username}
                disabled={otpSent}
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          {!otpSent && (
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          )}

          {otpSent && (
            <Form.Group className="mb-3">
              <Form.Label>Enter OTP</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          )}

          <Button type="submit" className="mt-4 d-block w-100">
            {!otpSent ? "Verify Credentials & Send OTP" : "Verify OTP & Login"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Content;
