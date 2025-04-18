import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function LoginUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Logging in as:", userType);
    console.log("Email:", email, "Password:", password);

    // Authentication logic for admin credentials
    if (userType === "user") {
      if (email === "admin" && password === "pass") {
        navigate("/flights"); // Redirect to FlightPage page
      } else {
        alert("Invalid credentials! Please try again.");
      }
    } else {
      alert("Please select 'Login as User' to proceed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {userType === "" ? (
          <>
            <h2>Select Login Type</h2>
            <div className="user-type-buttons">
              <button onClick={() => setUserType("user")}>Login as User</button>
              <button onClick={() => setUserType("agency")}>Login as Travel Agency</button>
            </div>
          </>
        ) : (
          <>
            <h2>{userType === "user" ? "User Login" : "Travel Agency Login"}</h2>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username (Email)</label>
                <input
                  type="text"
                  value={email}
                  placeholder="Enter your username"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit">Login</button>
            </form>

            <button className="back-button" onClick={() => setUserType("")}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginUser;
