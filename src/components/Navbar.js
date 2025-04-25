import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px",
        background: "rgba(0,0,0,0.6)",
        color: "white",
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 10,
      }}
    >
      <h2>MyTravel.com</h2>
      <div>
        <Link
          to="/login-user"
          style={{
            color: "white",
            textDecoration: "none",
            marginRight: "20px",
          }}
        >
          Login
        </Link>
        <Link
          to="/register-user"
          style={{ color: "white", textDecoration: "none" }}
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
