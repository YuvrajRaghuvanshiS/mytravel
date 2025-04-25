import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/agencyDashboard.css"; // Reuse dashboard styles

function UpdateTravelRoute() {
  const [form, setForm] = useState({
    type: "",
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
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

  const seatLayout = [
    ["1A", "1B", "", "1C", "1D"],
    ["2A", "2B", "", "2C", "2D"],
    ["3A", "3B", "", "3C", "3D"],
    ["4A", "4B", "", "4C", "4D"],
    ["5A", "5B", "", "5C", "5D"],
    ["6A", "6B", "", "6C", "6D"],
  ];

  useEffect(() => {
    fetchTravelDetails();
  }, []);

  const fetchTravelDetails = async () => {
    try {
      const res = await axios.get(
        `${process.env.TRAVEL_AGENCY_API_BASE_URL}/api/travel/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const travel = res.data.travelOptions.find((t) => t.id === parseInt(id));
      if (!travel) {
        alert("Travel route not found.");
        return navigate("/agency-dashboard");
      }

      setForm({
        type: travel.type,
        source: travel.source,
        destination: travel.destination,
        date: travel.date.split("T")[0],
        departureTime: travel.departureTime.split("T")[1].slice(0, 5),
        arrivalTime: travel.arrivalTime.split("T")[1].slice(0, 5),
        reachTime: travel.reachTime.split("T")[1].slice(0, 5),
        basePrice: travel.basePrice,
        seats: travel.seats,
      });

      setSelectedSeats(travel.seats.map((s) => s.seatNumber));
      setLoading(false);
    } catch (error) {
      console.error("Failed to load travel option", error);
      alert("Failed to load travel data.");
      navigate("/agency-dashboard");
    }
  };

  const fixTime = (timeStr) => {
    return timeStr.length === 5 ? timeStr + ":00" : timeStr;
  };

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      date: form.date,
      departureTime: fixTime(form.departureTime),
      arrivalTime: fixTime(form.arrivalTime),
      reachTime: fixTime(form.reachTime),
      basePrice: parseFloat(form.basePrice),
      seats: selectedSeats.map((seatNumber) => ({
        seatNumber,
        price: parseFloat(form.basePrice),
      })),
    };

    try {
      await axios.put(
        `${process.env.TRAVEL_AGENCY_API_BASE_URL}/api/travel/update/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Travel route updated successfully!");
      navigate("/agency-dashboard");
    } catch (error) {
      console.error("Update failed", error.response?.data || error.message);
      alert(
        error.response?.data?.message || "❌ Failed to update travel route"
      );
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="agency-dashboard">
      <div className="agency-profile">
        <h2>Update Travel Route</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          {["type", "source", "destination"].map((field) => (
            <div key={field} className="form-group">
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                name={field}
                value={form[field]}
                readOnly
                style={{ backgroundColor: "#e9ecef", color: "#6c757d" }}
              />
            </div>
          ))}

          {[
            "date",
            "departureTime",
            "arrivalTime",
            "reachTime",
            "basePrice",
          ].map((name) => (
            <div key={name} className="form-group">
              <label>
                {name
                  .replace("Time", " Time")
                  .replace("basePrice", "Base Price")}
              </label>
              <input
                type={
                  name === "basePrice"
                    ? "number"
                    : name === "date"
                    ? "date"
                    : "time"
                }
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="form-group">
            <label>Update Seats</label>
            <div className="seat-map">
              {seatLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="seat-row">
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
                        {seat}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="green-btn">
            Update Travel Route
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateTravelRoute;
