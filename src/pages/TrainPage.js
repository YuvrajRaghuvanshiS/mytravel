// src/pages/TrainPage.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TrainPage.css";

function TrainPage() {
  const navigate = useNavigate();

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "Guest", balance: 0 });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/users/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const { name, balance, email, phone, isAnonymous } = res.data.data;
        const updatedUser = { name, balance, email, phone, isAnonymous };

        setUserInfo({ name, balance });

        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
        localStorage.setItem("walletBalance", balance);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        alert("Session expired. Please log in again.");
        navigate("/login-user");
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formattedDate = new Date(date).toISOString().slice(0, 10);

    try {
      // Make the API call to prefetch ticket data
      const response = await axios.get(
        "http://localhost:3001/api/travel/list",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            source: fromCity,
            destination: toCity,
            date: formattedDate,
            type: "train",
          },
        },
      );

      const travelOptions = response.data.travelOptions || [];

      navigate(`/tickets`, {
        state: {
          mode: "train",
          from: fromCity,
          to: toCity,
          date: formattedDate,
          preFetchedTickets: travelOptions,
        },
      });
    } catch (err) {
      console.error("Error fetching travel options:", err);
      alert("Failed to load tickets. Please try again later.");
    }
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
          <button onClick={() => navigate("/flights")}>Flights</button>
          <button onClick={() => navigate("/bus")}>Bus</button>
          <button className="active">Train</button>
        </div>

        <div className="user-profile">
          <span>Welcome, {userInfo.name}</span>
          <span> | Wallet: ₹{userInfo.balance}</span>
          <button onClick={() => navigate("/profile")}>Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="hero-section_train">
        <div className="overlay"></div>

        <div className="hero-content">
          <div className="text-box">
            <h1>Explore Destinations by Train</h1>
            <p>Book train journeys for your next memorable trip</p>
          </div>

          <form className="search-box" onSubmit={handleSearch}>
            <div className="input-group">
              <label>FROM CITY</label>
              <input
                type="text"
                placeholder="Enter city or station"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>TO CITY</label>
              <input
                type="text"
                placeholder="Enter city or station"
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

            <button type="submit">Search Trains</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TrainPage;
