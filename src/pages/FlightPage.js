import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FlightPage.css';

function FlightPage() {
  const navigate = useNavigate();
  
  // State variables to store user input
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");

  // Function to handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Navigate to tickets page with search parameters
    navigate(`/tickets`, {
      state: {
        mode: "flights",
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
          <button>Flights</button>
          <button onClick={() => navigate('/bus')}>Bus</button>
          <button onClick={() => navigate('/train')}>Train</button>
        </div>
      </nav>

      {/* Hero Section */}
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
                placeholder="Enter city or airport" 
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label>TO CITY</label>
              <input 
                type="text" 
                placeholder="Enter city or airport" 
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
