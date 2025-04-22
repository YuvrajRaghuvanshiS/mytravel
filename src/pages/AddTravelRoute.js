import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/agencyDashboard.css";

function AddTravelRoute() {
  const [form, setForm] = useState({
    type: "flight", // default mode
    source: "",
    destination: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    reachTime: "",
    basePrice: "",
    seats: [],
  });

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const seatLayout = [
    ["1A", "1B", "", "1C", "1D"],
    ["2A", "2B", "", "2C", "2D"],
    ["3A", "3B", "", "3C", "3D"],
    ["4A", "4B", "", "4C", "4D"],
    ["5A", "5B", "", "5C", "5D"],
    ["6A", "6B", "", "6C", "6D"],
  ];

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      basePrice: parseFloat(form.basePrice),
      seats: selectedSeats.map((seatNumber) => ({
        seatNumber,
        price: parseFloat(form.basePrice),
      })),
    };

    try {
      const response = await axios.post("http://localhost:3002/api/travel/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Travel route added successfully!");
      navigate("/agency-dashboard");
    } catch (error) {
      console.error("Failed to add travel route", error);
      alert(error.response?.data?.message || "Error: Could not add travel route");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="agency-dashboard">
      <div className="agency-profile">
        <h2>Add Travel Route</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Mode of Travel</label>
            <div className="radio-options">
              {["flight", "bus", "train"].map((mode) => (
                <label key={mode} style={{ marginRight: "1rem" }}>
                  <input
                    type="radio"
                    name="type"
                    value={mode}
                    checked={form.type === mode}
                    onChange={handleChange}
                  />{" "}
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {[
            ["source", "Source"],
            ["destination", "Destination"],
            ["date", "Date"],
            ["departureTime", "Departure Time (HH:MM:SS)"],
            ["arrivalTime", "Arrival Time (HH:MM:SS)"],
            ["reachTime", "Reach Time (HH:MM:SS)"],
            ["basePrice", "Base Price"],
          ].map(([name, label]) => (
            <div key={name} className="form-group">
              <label>{label}</label>
              <input
                type={name === "basePrice" ? "number" : name === "date" ? "date" : "text"}
                name={name}
                value={form[name]}
                placeholder={name.includes("Time") ? "e.g. 08:00:00" : undefined}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label>Select Seats</label>
            <div className="seat-map">
              {seatLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                  {row.map((seat, i) =>
                    seat === "" ? (
                      <div key={i} className="seat-space" />
                    ) : (
                      <div
                        key={seat}
                        className={`seat-box ${selectedSeats.includes(seat) ? "selected" : ""}`}
                        onClick={() => toggleSeat(seat)}
                      >
                        {seat}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="green-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Travel Route"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTravelRoute;
