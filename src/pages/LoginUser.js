// src/pages/LoginUser.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function LoginUser() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // 'user' or 'agency'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userType) {
      alert("Please select login type.");
      return;
    }

    const loginURL =
      userType === "user"
        ? "http://localhost:3001/api/auth/login"
        : "http://localhost:3002/api/auth/login";

    try {
      const response = await axios.post(loginURL, { id, password });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("loggedInUser", JSON.stringify({ id, role: userType }));

        alert("Login successful!");
        navigate(userType === "user" ? "/flights" : "/agency-dashboard");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
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
                <label>Username (ID)</label>
                <input
                  type="text"
                  value={id}
                  placeholder="Enter your ID"
                  onChange={(e) => setId(e.target.value)}
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
