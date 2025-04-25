import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login_register.css";
import loginImage from "../images/register_look.jpg";

function LoginUser() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // 'user' or 'agency'
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    generateCaptcha();
  }, [userType]);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const isAddition = Math.random() > 0.5;
    let question, answer;
    if (isAddition) {
      question = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
    } else {
      const [larger, smaller] = num1 > num2 ? [num1, num2] : [num2, num1];
      question = `${larger} - ${smaller} = ?`;
      answer = larger - smaller;
    }
    setCaptchaQuestion(question);
    setCaptchaAnswer(answer);
    setCaptchaInput("");
  };

  const verifyCaptcha = () => {
    const userInput = Number(captchaInput);
    if (userInput === captchaAnswer) return true;
    generateCaptcha();
    return false;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!userType) {
        alert("Please select login type.");
        setIsLoading(false);
        return;
      }
      if (!verifyCaptcha()) {
        alert("Incorrect CAPTCHA. Please try again.");
        setIsLoading(false);
        return;
      }
      console.log(process.env);
      const loginURL =
        userType === "user"
          ? `${process.env.REACT_APP_CUSTOMER_API_BASE_URL}/api/auth/login`
          : `${process.env.REACT_APP_TRAVEL_AGENCY_API_BASE_URL}/api/auth/login`;
      const response = await axios.post(loginURL, { id, password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ id, role: userType })
        );
        alert("Login successful!");
        navigate(userType === "user" ? "/flights" : "/agency-dashboard");
      } else {
        alert("Login failed. Please check your credentials.");
        generateCaptcha();
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Something went wrong with the login request."
      );
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-pro">
      <div className="login-left">
        <img src={loginImage} alt="Login Illustration" />
        <h2>Welcome Back!</h2>
        <p>
          Access your bookings, manage your account, and explore new
          destinations.
        </p>
      </div>
      <div className="login-right">
        <div className="login-container-pro">
          {userType === "" ? (
            <>
              <h2>Sign in to your account</h2>
              <div className="user-type-buttons-pro">
                <button onClick={() => setUserType("user")}>
                  Login as User
                </button>
                <button onClick={() => setUserType("agency")}>
                  Login as Travel Agency
                </button>
              </div>
              <p className="register-link">
                New here?{" "}
                <span onClick={() => navigate("/register-user")}>
                  Create an account
                </span>
              </p>
            </>
          ) : (
            <>
              <h2>
                {userType === "user" ? "User Login" : "Travel Agency Login"}
              </h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Username (ID)</label>
                  <div className="input-icon">
                    <span className="input-emoji">👤</span>
                    <input
                      type="text"
                      value={id}
                      placeholder="Enter your ID"
                      onChange={(e) => setId(e.target.value)}
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
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
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
                      title="Refresh CAPTCHA"
                    >
                      ↻
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="login-btn-pro"
                  disabled={isLoading}
                >
                  {isLoading ? "Please wait..." : "Login"}
                </button>
              </form>
              <button
                className="back-button-pro"
                onClick={() => setUserType("")}
                disabled={isLoading}
              >
                ← Back
              </button>
              <p className="register-link">
                New here?{" "}
                <span onClick={() => navigate("/register-user")}>
                  Create an account
                </span>
              </p>
            </>
          )}
        </div>
        <footer className="login-footer">
          <span>
            © {new Date().getFullYear()} MyTravel.com. All rights reserved.
          </span>
        </footer>
      </div>
    </div>
  );
}

export default LoginUser;
