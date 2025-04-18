import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TrainPage.css';

function TrainPage() {
  const navigate = useNavigate();

  // State variables for search inputs
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

    // Navigate to tickets page with search parameters
    navigate(`/tickets`, {
      state: {
        mode: "train",
        from: fromCity,
        to: toCity,
        date: date,
      },
    });
  };

  return (
    <div className="user-home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">MyTravel</div>
        <div className="nav-links">
          <button onClick={() => navigate('/flights')}>Flights</button>
          <button onClick={() => navigate('/bus')}>Bus</button>
          <button>Train</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section_train">
        <div className="overlay"></div>

        <div className="hero-content">
          <div className="text-box">
            <h1>Explore Destinations by Train</h1>
            <p>Book train journeys for your next memorable trip</p>
          </div>

          {/* Search Box */}
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
