import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="main-navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        <span role="img" aria-label="logo" className="logo-emoji">
          🌐
        </span>
        <span className="navbar-title">MyTravel.com</span>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/flights">Flights</Link>
        </li>
        <li>
          <Link to="/trains">Trains</Link>
        </li>
        <li>
          <Link to="/buses">Buses</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <div className="navbar-icons">
        <span className="navbar-icon" title="Wallet">
          💰
        </span>
        <span className="navbar-icon" title="Notifications">
          🔔
        </span>
        <span className="navbar-icon" title="Profile">
          👤
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
