// src/pages/TicketsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/TicketsPage.css';

function TicketsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {};

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    available: false,
    priceMax: 10000,
    departureAfter: '',
    class: 'All Classes'
  });

  const [searchInputs, setSearchInputs] = useState({
    from: searchParams.from || '',
    to: searchParams.to || '',
    date: searchParams.date || ''
  });

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Session expired. Please log in again.');
        navigate('/login-user');
        return;
      }

      const queryParams = {
        type: (searchParams.mode || 'flight').replace(/s$/, '')
      };

      if (searchInputs.from.trim()) queryParams.source = searchInputs.from.trim();
      if (searchInputs.to.trim()) queryParams.destination = searchInputs.to.trim();
      if (searchInputs.date) queryParams.date = searchInputs.date;

      const res = await axios.get('http://localhost:3001/api/travel/list', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: queryParams
      });

      const apiTickets = res.data.travelOptions || [];
      setTickets(apiTickets);
      setFilteredTickets(apiTickets);
    } catch (error) {
      console.error('API failed to fetch tickets:', error);
      setTickets([]);
      setFilteredTickets([]);
    } finally {
      setLoading(false);
    }
  }, [navigate, searchInputs.from, searchInputs.to, searchInputs.date, searchParams.mode]);

  const filterTickets = useCallback(() => {
    let result = [...tickets];

    if (filters.available) {
      result = result.filter(ticket => ticket.availableSeats > 0);
    }

    if (filters.priceMax) {
      result = result.filter(ticket => ticket.basePrice <= filters.priceMax);
    }

    if (filters.departureAfter) {
      result = result.filter(ticket => {
        const ticketTime = new Date(`2000-01-01T${ticket.departureTime?.substring(11, 16)}`);
        const filterTime = new Date(`2000-01-01T${filters.departureAfter}`);
        return ticketTime >= filterTime;
      });
    }

    setFilteredTickets(result);
  }, [filters, tickets]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (!loading) filterTickets();
  }, [filters, tickets, filterTickets, loading]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchInputs({ ...searchInputs, [name]: value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTickets();
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({ ...filters, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="tickets-page">
      <header className="tickets-header">
        <h1>Available Tickets</h1>

        <form className="search-box-ticket" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="from"
            placeholder="From City"
            value={searchInputs.from}
            onChange={handleSearchChange}
          />
          <input
            type="text"
            name="to"
            placeholder="To City"
            value={searchInputs.to}
            onChange={handleSearchChange}
          />
          <input
            type="date"
            name="date"
            value={searchInputs.date}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>

        {(searchInputs.from || searchInputs.to || searchInputs.date) && (
          <div className="search-summary">
            <p>{searchInputs.from} → {searchInputs.to} | Date: {searchInputs.date}</p>
          </div>
        )}
      </header>

      <div className="tickets-container">
        <aside className="filters-section">
          <h2>Filters</h2>
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                name="available"
                checked={filters.available}
                onChange={handleFilterChange}
              /> Available Only
            </label>
          </div>
          <div className="filter-group">
            <label>Max Price (₹)</label>
            <input
              type="range"
              name="priceMax"
              min="100"
              max="20000"
              value={filters.priceMax}
              onChange={handleFilterChange}
            />
            <span>₹{filters.priceMax}</span>
          </div>
          <div className="filter-group">
            <label>Departure After</label>
            <input
              type="time"
              name="departureAfter"
              value={filters.departureAfter}
              onChange={handleFilterChange}
            />
          </div>
        </aside>

        <section className="tickets-list">
          {loading ? (
            <div className="loading">Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="no-tickets">No tickets found</div>
          ) : (
            <>
              <div className="tickets-count">{filteredTickets.length} Tickets Found</div>
              {filteredTickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-info">
                    <div className="route">
                      <h3>{ticket.source} → {ticket.destination}</h3>
                    </div>
                    <div className="times">
                      <div>
                        <div className="time">{ticket.departureTime?.substring(11, 16)}</div>
                        <div className="small">{ticket.source}</div>
                      </div>
                      <div>
                        <div className="time">{ticket.arrivalTime?.substring(11, 16)}</div>
                        <div className="small">{ticket.destination}</div>
                      </div>
                    </div>
                    <div className="ticket-price">
                      <h3>From ₹{ticket.basePrice}</h3>
                      <button className="book-button" onClick={() => navigate('/book', { state: { ticket } })}>
                        Book Now
                      </button>
                    </div>
                  </div>
                  {ticket.availableSeats === 0 && (
                    <div className="unavailable-badge">Not Available</div>
                  )}
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default TicketsPage;
