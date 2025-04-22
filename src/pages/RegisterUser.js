// src/pages/RegisterUser.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";
import travelImage from "../images/register_look.jpg";

function RegisterUser() {
  const [userType, setUserType] = useState(""); // Selection step
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = { id, name, email, phone, password };
    const endpoint = userType === "agency"
      ? "http://localhost:3002/api/auth/register"
      : "http://localhost:3001/api/auth/register";

    try {
      const res = await axios.post(endpoint, data);
      const { token } = res.data;
      localStorage.setItem("token", token);
      alert("Registered successfully!");
      navigate("/login-user");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || error);
    }
  };

  return (
    <div className="register-page">
      {/* Left Placard */}
      <div className="image-section">
        <img src={travelImage} alt="Travel" />
        <h3>Explore the World</h3>
        <p>Join thousands of travelers and start your journey today.</p>
      </div>

      {/* Right Section */}
      <div className="form-section">
        <div className="register-container">
          {userType === "" ? (
            <>
              <h2>Select Registration Type</h2>
              <div className="user-type-buttons">
                <button onClick={() => setUserType("user")}>Register as User</button>
                <button onClick={() => setUserType("agency")}>Register as Travel Agency</button>
              </div>
            </>
          ) : (
            <>
              <h2>
                {userType === "user"
                  ? "Create Your User Account"
                  : "Create Your Agency Account"}
              </h2>

              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label>Username (used as ID)</label>
                  <input
                    type="text"
                    value={id}
                    placeholder="Choose a username"
                    onChange={(e) => setId(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter your full name"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    placeholder="Enter your phone number"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    placeholder="Create a password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm your password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="register-button">
                  Register
                </button>
              </form>

              <button className="back-button" onClick={() => setUserType("")}>← Back</button>

              <p className="login-link">
                Already have an account? {" "}
                <span onClick={() => navigate("/login-user")}>Login here</span>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
