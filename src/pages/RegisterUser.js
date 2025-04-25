import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login_register.css";
import travelImage from "../images/register_look.jpg";

function RegisterUser() {
  const [userType, setUserType] = useState(""); // Selection step
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // CAPTCHA states
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState(null);

  const navigate = useNavigate();

  // Generate new CAPTCHA when form is loaded or user type changes
  useEffect(() => {
    if (userType !== "") {
      generateCaptcha();
    }
  }, [userType]);

  // Generate a simple math CAPTCHA
  const generateCaptcha = () => {
    // Generate random numbers between 1 and 20
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    // Randomly choose between addition and subtraction
    const isAddition = Math.random() > 0.5;

    let question, answer;

    if (isAddition) {
      question = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
    } else {
      // If num1 < num2, swap them for subtraction to avoid negative results
      const [larger, smaller] = num1 > num2 ? [num1, num2] : [num2, num1];
      question = `${larger} - ${smaller} = ?`;
      answer = larger - smaller;
    }

    setCaptchaQuestion(question);
    setCaptchaAnswer(answer);
    setCaptchaInput("");
  };

  // Verify the CAPTCHA input
  const verifyCaptcha = () => {
    const userInput = Number(captchaInput);

    if (userInput === captchaAnswer) {
      return true;
    }

    generateCaptcha(); // Generate a new CAPTCHA if incorrect
    return false;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Verify CAPTCHA first
    if (!verifyCaptcha()) {
      alert("Incorrect CAPTCHA. Please try again.");
      return;
    }

    const data = { id, name, email, phone, password };
    const endpoint =
      userType === "agency"
        ? `${process.env.REACT_APP_TRAVEL_AGENCY_API_BASE_URL}/api/auth/register`
        : `${process.env.REACT_APP_CUSTOMER_API_BASE_URL}/api/auth/register`;

    try {
      const res = await axios.post(endpoint, data);
      const { token } = res.data;
      localStorage.setItem("token", token);
      alert("Registered successfully!");
      navigate("/login-user");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || error);
      // Generate new CAPTCHA after failed registration
      generateCaptcha();
    }
  };

  return (
    <div className="register-page-pro">
      <div className="register-left">
        <img src={travelImage} alt="Travel" />
        <h2>Join MyTravel</h2>
        <p>
          Create your account to book tickets, manage your journeys, and unlock
          exclusive offers!
        </p>
      </div>
      <div className="register-right">
        <div className="register-container-pro">
          {userType === "" ? (
            <>
              <h2>Choose your account type</h2>
              <div className="user-type-buttons-pro">
                <button onClick={() => setUserType("user")}>
                  Register as User
                </button>
                <button onClick={() => setUserType("agency")}>
                  Register as Travel Agency
                </button>
              </div>
              <p className="login-link">
                Already have an account?{" "}
                <span onClick={() => navigate("/login-user")}>Login here</span>.
              </p>
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
                  <div className="input-icon">
                    <span className="input-emoji">👤</span>
                    <input
                      type="text"
                      value={id}
                      placeholder="Choose a username"
                      onChange={(e) => setId(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-icon">
                    <span className="input-emoji">📝</span>
                    <input
                      type="text"
                      value={name}
                      placeholder="Enter your full name"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-icon">
                    <span className="input-emoji">✉️</span>
                    <input
                      type="email"
                      value={email}
                      placeholder="Enter your email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-icon">
                    <span className="input-emoji">📱</span>
                    <input
                      type="tel"
                      value={phone}
                      placeholder="Enter your phone number"
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-icon">
                    <span className="input-emoji">🔒</span>
                    <input
                      type="password"
                      value={password}
                      placeholder="Create a password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-icon">
                    <span className="input-emoji">🔒</span>
                    <input
                      type="password"
                      value={confirmPassword}
                      placeholder="Confirm your password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group captcha-container">
                  <label>Verification</label>
                  <div className="captcha-box">
                    <div className="captcha-question">
                      {captchaQuestion || "Loading..."}
                    </div>
                  </div>
                  <div className="captcha-input">
                    <input
                      type="number"
                      value={captchaInput}
                      placeholder="Enter the answer"
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="refresh-captcha"
                      onClick={generateCaptcha}
                    >
                      ↻
                    </button>
                  </div>
                </div>
                <button type="submit" className="register-btn-pro">
                  Register
                </button>
              </form>
              <button
                className="back-button-pro"
                onClick={() => setUserType("")}
              >
                ← Back
              </button>
              <p className="login-link">
                Already have an account?{" "}
                <span onClick={() => navigate("/login-user")}>Login here</span>.
              </p>
            </>
          )}
        </div>
        <footer className="register-footer">
          <span>
            © {new Date().getFullYear()} MyTravel. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}

export default RegisterUser;
