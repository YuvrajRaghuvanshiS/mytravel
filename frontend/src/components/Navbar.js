import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    // Check login status on mount and on route change
    const loggedInUser = localStorage.getItem("loggedInUser");
    const lsUserType = localStorage.getItem("userType");
    try {
      const userObj = JSON.parse(loggedInUser);
      setUser(userObj);
      setBalance(userObj.balance || 0);
      setUserType(JSON.parse(lsUserType).userType);
    } catch {
      setUser(null);
      setBalance(0);
      setUserType("");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userType");
    setUser(null);
    setBalance(0);
    navigate("/");
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <span role="img" aria-label="logo" className="logo-emoji">
          🌐
        </span>
        <span className="navbar-title">MyTravel.com</span>
      </div>
      <ul className="navbar-links">
        {user ? (
          userType === "agencies" ? (
            <>
              <li>
                <Link
                  to="/agency-dashboard"
                  className={
                    location.pathname.startsWith("/agency-dashboard")
                      ? "active"
                      : ""
                  }
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/add-travel"
                  className={
                    location.pathname.startsWith("/add-travel") ? "active" : ""
                  }
                >
                  Add Travel
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={
                    location.pathname.startsWith("/profile") ? "active" : ""
                  }
                >
                  Profile
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/travel"
                  className={
                    location.pathname.startsWith("/travel") ? "active" : ""
                  }
                >
                  Book Travel
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bookings"
                  className={
                    location.pathname.startsWith("/my-bookings") ? "active" : ""
                  }
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className={
                    location.pathname.startsWith("/profile") ? "active" : ""
                  }
                >
                  Profile
                </Link>
              </li>
            </>
          )
        ) : (
          <>
            <li>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/travel"
                className={
                  location.pathname.startsWith("/travel") ? "active" : ""
                }
              >
                Book Travel
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className="navbar-user-section">
        {user ? (
          user.role === "agencies" ? (
            <>
              <span className="navbar-user-info">
                👤 {user.name || "Agency"}
              </span>
              <button className="navbar-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="navbar-user-info">👤 {user.name || "User"}</span>
              <span className="navbar-wallet">
                💰 ₹{Number(balance).toFixed(2)}
              </span>
              <button className="navbar-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )
        ) : (
          <div className="navbar-auth-buttons">
            <button
              className="navbar-login-btn"
              onClick={() => navigate("/login-user")}
            >
              Login
            </button>
            <button
              className="navbar-register-btn"
              onClick={() => navigate("/register-user")}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
