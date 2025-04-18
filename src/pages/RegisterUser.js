import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import travelImage from "../images/register_look.jpg"; // Import your local image

function RegisterUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Registering user:", { name, email });
    // Add your registration logic here (e.g., API call)
    navigate("/login-user"); // Redirect to login after successful registration
  };

  return (
    <div className="register-page">
      {/* Left Image Placard */}
      <div className="image-section">
        <img src={travelImage} alt="Travel Inspiration" /> {/* Use local image */}
        <h3>Explore the World</h3>
        <p>Join thousands of travelers and start your journey today.</p>
      </div>

      {/* Right Registration Form */}
      <div className="form-section">
        <div className="register-container">
          <h2>Create Your Account</h2>
          <form onSubmit={handleRegister}>
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
            <button type="submit" className="register-button">Register</button>
          </form>
          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login-user")}>Login here</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
