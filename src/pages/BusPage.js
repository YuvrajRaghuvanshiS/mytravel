import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BusPage.css';

function BusPage() {
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
        mode: "bus",
        from: fromCity,
        to: toCity,
        date: date
      }
    });
  };

  return (
    <div className="user-home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">MyTravel</div>
        <div className="nav-links">
          <button onClick={() => navigate('/flights')}>Flights</button>
          <button>Bus</button>
          <button onClick={() => navigate('/train')}>Train</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section_bus">
        <div className="overlay"></div>

        <div className="hero-content">
          <div className="text-box">
            <h1>Ride Comfortable, Travel Easy</h1>
            <p>Book safe and affordable bus tickets across cities</p>
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

            <button type="submit">Search Bus</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BusPage;
