import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/travelPage.css";
import heroFlight from "../images/flight.jpg";
import heroTrain from "../images/train.jpg";
import heroBus from "../images/bus.webp";

const HERO_IMAGES = {
  flight: heroFlight,
  train: heroTrain,
  bus: heroBus,
};

const TRAVEL_MODES = [
  { key: "flight", label: "Flights", icon: "✈️" },
  { key: "train", label: "Trains", icon: "🚆" },
  { key: "bus", label: "Buses", icon: "🚌" },
];

function TravelPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("flight");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "Guest", balance: 0 });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_CUSTOMER_API_BASE_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const { name, balance, email, phone, isAnonymous } = res.data.data;
        setUserInfo({ name, balance });
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ name, balance, email, phone, isAnonymous })
        );
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
    if (!fromCity || !toCity || !date) {
      alert("Please fill all fields");
      return;
    }
    const formattedDate = new Date(date).toISOString().slice(0, 10);

    // Optionally, you could prefetch tickets here

    navigate("/tickets", {
      state: {
        mode,
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

  // Dynamic hero text and placeholder based on mode
  const heroContent = {
    flight: {
      title: "Fly Smart, Fly Anywhere",
      desc: "Discover the best flight deals for your next adventure.",
      from: "Enter city or station",
      to: "Enter city or station",
      searchBtn: "Search Flights",
    },
    train: {
      title: "Explore Destinations by Train",
      desc: "Book train journeys for your next memorable trip.",
      from: "Enter city or station",
      to: "Enter city or station",
      searchBtn: "Search Trains",
    },
    bus: {
      title: "Ride Comfortable, Travel Easy",
      desc: "Book safe and affordable bus tickets across cities.",
      from: "Enter city or station",
      to: "Enter city or station",
      searchBtn: "Search Buses",
    },
  };

  return (
    <>
      <Navbar />
      <div
        className="travel-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(11,94,215,0.55),rgba(11,94,215,0.55)), url(${HERO_IMAGES[mode]})`,
        }}
      >
        <div className="travel-hero-content">
          <div className="travel-navbar">
            {TRAVEL_MODES.map((m) => (
              <button
                key={m.key}
                className={`travel-tab ${mode === m.key ? "active" : ""}`}
                onClick={() => setMode(m.key)}
              >
                <span className="travel-tab-icon">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
          <h1>{heroContent[mode].title}</h1>
          <p>{heroContent[mode].desc}</p>
          <form className="travel-search-form" onSubmit={handleSearch}>
            <div className="input-group">
              <label>FROM CITY</label>
              <input
                type="text"
                placeholder={heroContent[mode].from}
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>TO CITY</label>
              <input
                type="text"
                placeholder={heroContent[mode].to}
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
            <button type="submit">{heroContent[mode].searchBtn}</button>
          </form>
        </div>
        <div className="travel-userbar">
          <span>
            Welcome, <strong>{userInfo.name}</strong>
          </span>
          <span className="divider">|</span>
          <span>
            Wallet: <strong>₹{userInfo.balance}</strong>
          </span>
          <button className="userbar-btn" onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button className="userbar-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <section className="travel-features">
        <h2>Why Book With Us?</h2>
        <div className="travel-features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure Booking</h3>
            <p>Blockchain-powered ticketing for tamper-proof security.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Instant Confirmation</h3>
            <p>Book and get your tickets in seconds, hassle-free.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💬</span>
            <h3>24/7 Support</h3>
            <p>Our team is always here to help, day or night.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎫</span>
            <h3>Best Deals</h3>
            <p>Get exclusive offers and the best prices on every booking.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default TravelPage;
