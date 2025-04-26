// src/pages/AgencyDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/agencyDashboard.css";
import Navbar from "../components/Navbar";

function AgencyDashboard() {
  const [agency, setAgency] = useState(null);
  const [travelOptions, setTravelOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAgencyProfile();
    fetchAgencyListings();
  }, []);

  const fetchAgencyProfile = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_TRAVEL_AGENCY_API_BASE_URL}/api/agencies/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAgency(res.data.data);
      localStorage.setItem("loggedInUser", JSON.stringify(res.data.data));
      localStorage.setItem(
        "userType",
        JSON.stringify({ userType: "agencies" })
      );
    } catch (err) {
      console.error("Error fetching agency:", err);
      alert("Failed to load agency profile.");
    }
  };

  const fetchAgencyListings = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_TRAVEL_AGENCY_API_BASE_URL}/api/travel/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTravelOptions(res.data.travelOptions || []);
    } catch (err) {
      console.error("Error fetching listings:", err);
      alert("Failed to load your travel options.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTravel = () => {
    navigate("/add-travel");
  };

  const handleDeleteTravel = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this route?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_TRAVEL_AGENCY_API_BASE_URL}/api/travel/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Travel route deleted successfully!");
      fetchAgencyListings();
    } catch (err) {
      console.error("Error deleting route:", err);
      alert(err.response?.data?.message || "Failed to delete route.");
    }
  };

  const handleUpdateTravel = (id) => {
    navigate(`/update-travel/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="agency-dashboard">
        {agency && (
          <section className="agency-info">
            <h2>Welcome, {agency.name}</h2>
            <p>
              <strong>Email:</strong> {agency.email}
            </p>
            <p>
              <strong>Phone:</strong> {agency.phone}
            </p>
            <p>
              <strong>Wallet Balance:</strong> ₹{agency.balance.toFixed(2)}
            </p>
          </section>
        )}

        <section className="travel-section">
          <div className="travel-header">
            <h2>Your Travel Listings</h2>
            <button className="green-btn" onClick={handleAddTravel}>
              + Add Travel Route
            </button>
          </div>

          {loading ? (
            <p>Loading listings...</p>
          ) : travelOptions.length === 0 ? (
            <p>No travel listings found.</p>
          ) : (
            <ul className="travel-list">
              {travelOptions.map((item) => (
                <li key={item.id} className="travel-card">
                  <div className="travel-header-row">
                    <span className="tag">
                      {item.mode || item.type || "Mode"}
                    </span>
                    <span>
                      <strong>{item.source}</strong> →{" "}
                      <strong>{item.destination}</strong>
                    </span>
                  </div>
                  <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                  <p>Base Price: ₹{item.basePrice}</p>
                  <p>Seats Available: {item.availableSeats}</p>
                  <div className="action-btns">
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTravel(item.id)}
                    >
                      ❌ Delete Route
                    </button>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdateTravel(item.id)}
                    >
                      ✏️ Update Route
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default AgencyDashboard;
