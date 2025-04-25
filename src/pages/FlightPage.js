// src/pages/FlightPage.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FlightPage.css";

function FlightPage() {
  const navigate = useNavigate();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "Guest", balance: 0 });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login.");
        navigate("/login-user");
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.CUSTOMER_API_BASE_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { name, balance, email, phone, isAnonymous } = res.data.data;
        const updatedUser = { name, balance, email, phone, isAnonymous };
        setUserInfo({ name, balance });
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        localStorage.setItem("walletBalance", balance);
      } catch (err) {
        console.error("User info fetch failed:", err);
        alert("Session expired. Please login.");
        navigate("/login-user");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();

    const formattedDate = new Date(date).toISOString().slice(0, 10);
    if (!fromCity || !toCity || !date) {
      alert("Please fill all fields");
      return;
    }

    navigate("/tickets", {
      state: {
        mode: "flight", // 👈 NOTE: Not "flights"
        from: fromCity,
        to: toCity,
        date: formattedDate,
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("walletBalance");
    navigate("/");
  };

  return (
    <div className="user-home">
      <nav className="navbar">
        <div className="logo">MyTravel</div>
        <div className="nav-links">
          <button className="active">Flights</button>
          <button onClick={() => navigate("/bus")}>Bus</button>
          <button onClick={() => navigate("/train")}>Train</button>
        </div>
        <div className="user-profile">
          <span>Welcome, {userInfo.name}</span>
          <span> | Wallet: ₹{userInfo.balance}</span>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="hero-section_flight">
        <div className="overlay"></div>
        <div className="hero-content">
          <div className="text-box">
            <h1>Fly Smart, Fly Anywhere</h1>
            <p>Discover the best flight deals for your next adventure</p>
          </div>

          <form className="search-box" onSubmit={handleSearch}>
            <div className="input-group">
              <label>FROM CITY</label>
              <input
                type="text"
                placeholder="Enter source city"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>TO CITY</label>
              <input
                type="text"
                placeholder="Enter destination city"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>TRAVEL DATE</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <button type="submit">Search Flights</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FlightPage;
