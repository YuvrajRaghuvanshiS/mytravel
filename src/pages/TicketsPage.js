import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/TicketsPage.css";
import Navbar from "../components/Navbar";

function TicketsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = location.state || {};

  // State for tickets and loading
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for dropdown options
  const [agencyOptions, setAgencyOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [dateOptions, setDateOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  // Determine which filters are locked
  const isUpdateBooking = !!searchParams.updateBooking;
  // Filters state
  const [filters, setFilters] = useState({
    agencyId: searchParams.agencyId || "",
    type: searchParams.type || "",
    date: "",
    minPrice: "",
    maxPrice: "",
    availableOnly: false,
    sortBy: "",
  });

  // For search box (optional)
  const [searchInputs, setSearchInputs] = useState({
    from: searchParams.from || "",
    to: searchParams.to || "",
    date: searchParams.date || "",
  });

  // Extract unique dropdown options from ticket data
  const extractDropdownOptions = useCallback((data) => {
    const agencies = new Set();
    const types = new Set();
    const dates = new Set();
    const sources = new Set();
    const destinations = new Set();

    data.forEach((ticket) => {
      if (ticket.agencyId) agencies.add(ticket.agencyId);
      if (ticket.type) types.add(ticket.type);
      if (ticket.date) dates.add(ticket.date.split("T")[0]);
      if (ticket.source) sources.add(ticket.source);
      if (ticket.destination) destinations.add(ticket.destination);
    });

    setAgencyOptions(Array.from(agencies));
    setTypeOptions(Array.from(types));
    setDateOptions(Array.from(dates).sort());
    setSourceOptions(Array.from(sources));
    setDestinationOptions(Array.from(destinations));
  }, []);

  // Fetch tickets from API with filters
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/login-user");
        return;
      }

      // Build query params from filters
      const queryParams = {};
      if (filters.agencyId) queryParams.agencyId = filters.agencyId;
      if (filters.date) queryParams.date = filters.date;
      if (filters.type) queryParams.type = filters.type;
      if (filters.minPrice) queryParams.minPrice = filters.minPrice;
      if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
      if (filters.availableOnly) queryParams.availableOnly = "true";
      if (filters.sortBy) queryParams.sortBy = filters.sortBy;

      // Optionally, support search box as quick filters
      if (searchInputs.from) queryParams.source = searchInputs.from;
      if (searchInputs.to) queryParams.destination = searchInputs.to;
      if (searchInputs.date) queryParams.date = searchInputs.date;

      // Default type if not set
      if (!queryParams.type && searchParams.mode)
        queryParams.type = searchParams.mode.replace(/s$/, "");

      const res = await axios.get(
        `${process.env.REACT_APP_CUSTOMER_API_BASE_URL}/api/travel/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: queryParams,
        }
      );

      const apiTickets = res.data.travelOptions || [];
      setTickets(apiTickets);
      setFilteredTickets(apiTickets);
      extractDropdownOptions(apiTickets);
    } catch (error) {
      console.error("API failed to fetch tickets:", error);
      setTickets([]);
      setFilteredTickets([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [
    filters,
    searchInputs.from,
    searchInputs.to,
    searchInputs.date,
    searchParams.mode,
    navigate,
    extractDropdownOptions,
  ]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle search box changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit search box (applies as filters)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Optionally, update filters with search box values
    setFilters((prev) => ({
      ...prev,
      source: searchInputs.from,
      destination: searchInputs.to,
      date: searchInputs.date,
    }));
    // fetchTickets will be triggered by filters change
  };

  // Show a summary of active filters
  const renderFilterSummary = () => {
    const summary = [];
    if (filters.agencyId) summary.push(`Agency: ${filters.agencyId}`);
    if (filters.type) summary.push(`Type: ${filters.type}`);
    if (filters.date) summary.push(`Date: ${filters.date}`);
    if (filters.minPrice) summary.push(`Min Price: ₹${filters.minPrice}`);
    if (filters.maxPrice) summary.push(`Max Price: ₹${filters.maxPrice}`);
    if (filters.availableOnly) summary.push("Available Only");
    if (filters.sortBy) summary.push(`Sort: ${filters.sortBy}`);
    return summary.length > 0 ? (
      <div className="search-summary">
        <p>{summary.join(" | ")}</p>
      </div>
    ) : null;
  };

  return (
    <>
      <Navbar />
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
              list="from-cities"
              disabled={isUpdateBooking}
            />
            <datalist id="from-cities">
              {sourceOptions.map((src) => (
                <option key={src} value={src} />
              ))}
            </datalist>
            <input
              type="text"
              name="to"
              placeholder="To City"
              value={searchInputs.to}
              onChange={handleSearchChange}
              disabled={isUpdateBooking}
              list="to-cities"
            />
            <datalist id="to-cities">
              {destinationOptions.map((dst) => (
                <option key={dst} value={dst} />
              ))}
            </datalist>
            <input
              type="date"
              name="date"
              value={searchInputs.date}
              onChange={handleSearchChange}
              list="date-options"
            />
            <datalist id="date-options">
              {dateOptions.map((dt) => (
                <option key={dt} value={dt} />
              ))}
            </datalist>
            <button type="submit">Search</button>
          </form>

          {renderFilterSummary()}
        </header>

        <div className="tickets-container">
          <aside className="filters-section">
            <h2>Filters</h2>
            <div className="filter-group">
              <label>Agency</label>
              <select
                name="agencyId"
                value={filters.agencyId}
                onChange={handleFilterChange}
                disabled={isUpdateBooking}
              >
                <option value="">All Agencies</option>
                {agencyOptions.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                disabled={isUpdateBooking}
              >
                <option value="">All Types</option>
                {typeOptions.map((tp) => (
                  <option key={tp} value={tp}>
                    {tp.charAt(0).toUpperCase() + tp.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Date</label>
              <select
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              >
                <option value="">All Dates</option>
                {dateOptions.map((dt) => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Min Price (₹)</label>
              <input
                type="number"
                name="minPrice"
                min="0"
                max={filters.maxPrice || 20000}
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="No min"
              />
            </div>
            <div className="filter-group">
              <label>Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                min={filters.minPrice || 0}
                max="20000"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="No max"
              />
            </div>
            <div className="filter-group">
              <label>
                <input
                  type="checkbox"
                  name="availableOnly"
                  checked={filters.availableOnly}
                  onChange={handleFilterChange}
                />{" "}
                Available Only
              </label>
            </div>
            <div className="filter-group">
              <label>Sort By</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="">None</option>
                <option value="price">Price</option>
                <option value="departureTime">Departure Time</option>
              </select>
            </div>
          </aside>

          <section className="tickets-list">
            {loading ? (
              <div className="loading">Loading tickets...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="no-tickets">No tickets found</div>
            ) : (
              <>
                <div className="tickets-count">
                  {filteredTickets.length} Tickets Found
                </div>
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="ticket-card">
                    <div className="ticket-info">
                      <div className="route">
                        <h3>
                          {ticket.source} <span className="arrow">→</span>{" "}
                          {ticket.destination}
                        </h3>
                        <div className="agency-row">
                          <span className="agency-name">
                            {ticket.agencyName}
                          </span>
                          <span className={`type-badge type-${ticket.type}`}>
                            {ticket.type?.toUpperCase()}
                          </span>
                        </div>
                        <div className="agency-rating-row">
                          {typeof ticket.agencyRating === "number" &&
                          ticket.totalRatings > 0 ? (
                            <>
                              <span className="stars">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <span
                                      key={i}
                                      className={
                                        i < ticket.agencyRating
                                          ? "star filled"
                                          : "star"
                                      }
                                    >
                                      ★
                                    </span>
                                  ))}
                              </span>
                              <span className="rating-value">
                                {ticket.agencyRating}/5
                              </span>
                              <span className="rating-count">
                                ({ticket.totalRatings} rating
                                {ticket.totalRatings > 1 ? "s" : ""})
                              </span>
                            </>
                          ) : (
                            <span className="no-rating">No ratings yet</span>
                          )}
                        </div>
                      </div>
                      <div className="times">
                        <div>
                          <div className="time">
                            {ticket.departureTime?.substring(11, 16)}
                          </div>
                          <div className="small">{ticket.source}</div>
                        </div>
                        <div>
                          <div className="time">
                            {ticket.reachTime?.substring(11, 16)}
                          </div>
                          <div className="small">{ticket.destination}</div>
                        </div>
                      </div>
                      <div className="ticket-price">
                        <h3>From ₹{ticket.basePrice}</h3>
                        <div className="seats-available">
                          <span>
                            {ticket.availableSeats > 0
                              ? `${ticket.availableSeats} seat${
                                  ticket.availableSeats > 1 ? "s" : ""
                                } available`
                              : "No seats available"}
                          </span>
                        </div>
                        <button
                          className="book-button"
                          onClick={() =>
                            navigate("/book", {
                              state: isUpdateBooking
                                ? {
                                    ticket: {
                                      ...ticket,
                                      bookingID: searchParams.bookingID,
                                      seatNumbers: searchParams.seatNumbers,
                                    },
                                    isUpdate: true,
                                  }
                                : { ticket },
                            })
                          }
                          disabled={ticket.availableSeats === 0}
                        >
                          {isUpdateBooking ? "Update Seats" : "Book Now"}
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
    </>
  );
}

export default TicketsPage;
