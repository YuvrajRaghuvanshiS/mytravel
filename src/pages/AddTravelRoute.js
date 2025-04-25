import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/addTravelRoute.css";

const seatLayout = [
  ["1A", "1B", "", "1C", "1D"],
  ["2A", "2B", "", "2C", "2D"],
  ["3A", "3B", "", "3C", "3D"],
  ["4A", "4B", "", "4C", "4D"],
  ["5A", "5B", "", "5C", "5D"],
  ["6A", "6B", "", "6C", "6D"],
];

function AddTravelRoute() {
  const [form, setForm] = useState({
    type: "flight",
    source: "",
    destination: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    reachTime: "",
    basePrice: "",
  });

  // { seatNumber: price }
  const [seatPrices, setSeatPrices] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [rowPrices, setRowPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Handle selecting/unselecting seats
  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
      setSeatPrices((prev) => {
        const copy = { ...prev };
        delete copy[seatNumber];
        return copy;
      });
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
      setSeatPrices((prev) => ({
        ...prev,
        [seatNumber]: form.basePrice ? Number(form.basePrice) : "",
      }));
    }
  };

  // Set price for all seats in a row
  const handleRowPriceChange = (rowIdx, price) => {
    setRowPrices((prev) => ({ ...prev, [rowIdx]: price }));
    const row = seatLayout[rowIdx].filter((s) => s);
    setSeatPrices((prev) => {
      const updated = { ...prev };
      row.forEach((seat) => {
        if (selectedSeats.includes(seat)) updated[seat] = price;
      });
      return updated;
    });
  };

  // Set price for individual seat
  const handleSeatPriceChange = (seat, price) => {
    setSeatPrices((prev) => ({
      ...prev,
      [seat]: price,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      basePrice: parseFloat(form.basePrice),
      seats: selectedSeats.map((seatNumber) => ({
        seatNumber,
        price: parseFloat(seatPrices[seatNumber] || form.basePrice),
      })),
    };

    try {
      await axios.post(
        `${process.env.TRAVEL_AGENCY_API_BASE_URL}/api/travel/add`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Travel route added successfully!");
      navigate("/agency-dashboard");
    } catch (error) {
      console.error("Failed to add travel route", error);
      alert(
        error.response?.data?.message || "Error: Could not add travel route"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="main-div">
      <div className="inner-div">
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
            ["arrivalTime", "Arrival Time (HH:MM:SS)"],
            ["departureTime", "Departure Time (HH:MM:SS)"],
            ["reachTime", "Reach Time (HH:MM:SS)"],
            ["basePrice", "Default Base Price"],
          ].map(([name, label]) => (
            <div key={name} className="form-group">
              <label>{label}</label>
              <input
                type={
                  name === "basePrice"
                    ? "number"
                    : name === "date"
                    ? "date"
                    : "text"
                }
                name={name}
                value={form[name]}
                placeholder={
                  name.includes("Time") ? "e.g. 08:00:00" : undefined
                }
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label>
              Select Seats & Set Prices
              <span className="seat-hint">
                {" "}
                (Click to select. Set price for row or each seat.)
              </span>
            </label>
            <div className="seat-map">
              {seatLayout.map((row, rowIdx) => (
                <div key={rowIdx} className="seat-row">
                  {/* Row price input */}
                  <div className="row-price-input">
                    <input
                      type="number"
                      min="0"
                      placeholder="Row Price"
                      value={rowPrices[rowIdx] || ""}
                      onChange={(e) =>
                        handleRowPriceChange(rowIdx, e.target.value)
                      }
                      disabled={row
                        .filter(Boolean)
                        .every((seat) => !selectedSeats.includes(seat))}
                    />
                  </div>
                  {row.map((seat, i) =>
                    seat === "" ? (
                      <div key={i} className="seat-space" />
                    ) : (
                      <div
                        key={seat}
                        className={`seat-box ${
                          selectedSeats.includes(seat) ? "selected" : ""
                        }`}
                        onClick={() => toggleSeat(seat)}
                      >
                        <span>{seat}</span>
                        {selectedSeats.includes(seat) && (
                          <input
                            type="number"
                            min="0"
                            className="seat-price-input"
                            value={seatPrices[seat] || ""}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              handleSeatPriceChange(seat, e.target.value)
                            }
                            placeholder="Price"
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="green-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit Travel Route"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTravelRoute;
