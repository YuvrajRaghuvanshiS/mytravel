import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/TicketsPage.css';

const dummyFlightTickets = [
  {
    id: 1,
    airline: "IndiGo",
    flightNumber: "6E-2134",
    from: "New Delhi",
    to: "Mumbai",
    departureDate: "2025-04-15",
    departureTime: "08:20 AM",
    arrivalTime: "10:30 AM",
    duration: "2h 10m",
    price: 4500,
    available: true,
    class: "Economy"
  },
  {
    id: 2,
    airline: "Air India",
    flightNumber: "AI-802",
    from: "New Delhi",
    to: "Bangalore",
    departureDate: "2025-04-15",
    departureTime: "10:45 AM",
    arrivalTime: "01:20 PM",
    duration: "2h 35m",
    price: 6200,
    available: true,
    class: "Economy"
  },
  {
    id: 3,
    airline: "SpiceJet",
    flightNumber: "SG-456",
    from: "Mumbai",
    to: "New Delhi",
    departureDate: "2025-04-16",
    departureTime: "07:00 AM",
    arrivalTime: "09:15 AM",
    duration: "2h 15m",
    price: 5100,
    available: false,
    class: "Economy"
  },
];

function TicketsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state || {};

  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    available: false,
    priceMax: 10000,
    departureAfter: "",
    class: "All Classes"
  });

  // Search Bar Input
  const [searchInputs, setSearchInputs] = useState({
    from: searchParams.from || "",
    to: searchParams.to || "",
    date: searchParams.date || ""
  });

  useEffect(() => {
    setTimeout(() => {
      setTickets(dummyFlightTickets);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!loading) filterTickets();
  }, [loading, filters, tickets, searchParams, searchInputs]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchInputs({ ...searchInputs, [name]: value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    filterTickets();
  };

  const filterTickets = () => {
    let result = [...tickets];
    if (searchInputs.from)
      result = result.filter(ticket => ticket.from.toLowerCase().includes(searchInputs.from.toLowerCase()));
    if (searchInputs.to)
      result = result.filter(ticket => ticket.to.toLowerCase().includes(searchInputs.to.toLowerCase()));
    if (searchInputs.date)
      result = result.filter(ticket => ticket.departureDate === searchInputs.date);
    if (filters.available)
      result = result.filter(ticket => ticket.available);
    if (filters.priceMax)
      result = result.filter(ticket => ticket.price <= filters.priceMax);
    if (filters.departureAfter) {
      result = result.filter(ticket => {
        const ticketTime = new Date(`2000-01-01T${ticket.departureTime}`);
        const filterTime = new Date(`2000-01-01T${filters.departureAfter}`);
        return ticketTime >= filterTime;
      });
    }
    if (filters.class !== "All Classes")
      result = result.filter(ticket => ticket.class === filters.class);
    setFilteredTickets(result);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({ ...filters, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="tickets-page">
      <header className="tickets-header">
        <h1>Search & Book Tickets</h1>

        {/* Integrated Search Box */}
        <form className="search-box-ticket" onSubmit={handleSearchSubmit}>
          <input type="text" name="from" placeholder="From City" value={searchInputs.from} onChange={handleSearchChange} required />
          <input type="text" name="to" placeholder="To City" value={searchInputs.to} onChange={handleSearchChange} required />
          <input type="date" name="date" value={searchInputs.date} onChange={handleSearchChange} required />
          <button type="submit">Search</button>
        </form>

        <div className="search-summary">
          <p>{searchInputs.from || "Any"} → {searchInputs.to || "Any"} | Date: {searchInputs.date || "Any"}</p>
        </div>
      </header>

      <div className="tickets-container">
        <aside className="filters-section">
          <h2>Filters</h2>
          <div className="filter-group">
            <label><input type="checkbox" name="available" checked={filters.available} onChange={handleFilterChange} /> Available Only</label>
          </div>
          <div className="filter-group">
            <label>Max Price (₹)</label>
            <input type="range" name="priceMax" min="1000" max="20000" value={filters.priceMax} onChange={handleFilterChange} />
            <span>₹{filters.priceMax}</span>
          </div>
          <div className="filter-group">
            <label>Departure After</label>
            <input type="time" name="departureAfter" value={filters.departureAfter} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <label>Class</label>
            <select name="class" value={filters.class} onChange={handleFilterChange}>
              <option>All Classes</option>
              <option>Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>
          </div>
        </aside>

        <section className="tickets-list">
          {loading ? <div className="loading">Loading tickets...</div> :
            filteredTickets.length === 0 ? <div className="no-tickets">No tickets found</div> :
              <>
                <div className="tickets-count">{filteredTickets.length} Tickets Found</div>
                {filteredTickets.map(ticket => (
                  <div key={ticket.id} className="ticket-card">
                    <div className="ticket-info">
                      <div className="route"><h3>{ticket.from} → {ticket.to}</h3><span>{ticket.duration}</span></div>
                      <div className="times">
                        <div><div className="time">{ticket.departureTime}</div><div className="small">{ticket.from}</div></div>
                        <div><div className="time">{ticket.arrivalTime}</div><div className="small">{ticket.to}</div></div>
                      </div>
                      <div className="ticket-price"><h3>₹{ticket.price}</h3><button className="book-button">Book Now</button></div>
                    </div>
                    {!ticket.available && <div className="unavailable-badge">Not Available</div>}
                  </div>
                ))}
              </>
          }
        </section>
      </div>
    </div>
  );
}

export default TicketsPage;
