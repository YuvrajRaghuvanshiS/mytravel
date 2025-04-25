import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function LoginUser() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // 'user' or 'agency'
  // CAPTCHA states
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Generate new CAPTCHA when form is loaded or refreshed
  useEffect(() => {
    generateCaptcha();
  }, [userType]);

  // Generate a simple math CAPTCHA
  const generateCaptcha = () => {
    // Generate random numbers between 1 and 20
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    // Randomly choose between addition and subtraction
    // For subtraction, ensure num1 > num2 to avoid negative results
    const isAddition = Math.random() > 0.5;

    let question, answer;

    if (isAddition) {
      question = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
    } else {
      // If num1 < num2, swap them for subtraction
      const [larger, smaller] = num1 > num2 ? [num1, num2] : [num2, num1];
      question = `${larger} - ${smaller} = ?`;
      answer = larger - smaller;
    }

    console.log("Generated CAPTCHA:", question, "Answer:", answer);
    setCaptchaQuestion(question);
    setCaptchaAnswer(answer);
    setCaptchaInput("");
    setCaptchaVerified(false);
  };

  // Verify the CAPTCHA input
  const verifyCaptcha = () => {
    const userInput = Number(captchaInput);
    console.log(
      "Verifying CAPTCHA - User input:",
      userInput,
      "Expected:",
      captchaAnswer,
    );

    if (userInput === captchaAnswer) {
      setCaptchaVerified(true);
      return true;
    }

    console.log("CAPTCHA verification failed");
    generateCaptcha(); // Generate a new CAPTCHA if incorrect
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

      // Verify CAPTCHA first
      if (!verifyCaptcha()) {
        alert("Incorrect CAPTCHA. Please try again.");
        setIsLoading(false);
        return;
      }

      // Update these URLs to match your actual backend
      const loginURL =
        userType === "user"
          ? "http://localhost:3001/api/auth/login"
          : "http://localhost:3002/api/auth/login";

      const response = await axios.post(loginURL, { id, password });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ id, role: userType }),
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
          "Something went wrong with the login request.",
      );
      // Generate new CAPTCHA after failed login
      generateCaptcha();
    } finally {
      setIsLoading(false);
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
              <button onClick={() => setUserType("agency")}>
                Login as Travel Agency
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>
              {userType === "user" ? "User Login" : "Travel Agency Login"}
            </h2>

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

              {/* CAPTCHA Section */}
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

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? "Please wait..." : "Login"}
              </button>
            </form>

            <button
              className="back-button"
              onClick={() => setUserType("")}
              disabled={isLoading}
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginUser;
