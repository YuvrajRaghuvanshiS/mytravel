import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBox.css';

function SearchBox({ mode = "flights" }) {
  const navigate = useNavigate();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/tickets`, {
      state: {
        mode: mode,
        from: fromCity,
        to: toCity,
        date: date
      }
    });
  };

  return (
    <form className="search-box-container" onSubmit={handleSearch}>
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

      <button type="submit" className="search-btn">Search Flights</button>
    </form>
  );
}

export default SearchBox;
