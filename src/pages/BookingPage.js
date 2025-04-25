import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BookingPage.css";

const seatLayout = [
  ["1A", "1B", "", "1C", "1D"],
  ["2A", "2B", "", "2C", "2D"],
  ["3A", "3B", "", "3C", "3D"],
  ["4A", "4B", "", "4C", "4D"],
  ["5A", "5B", "", "5C", "5D"],
  ["6A", "6B", "", "6C", "6D"],
];

function BookingPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ticket = state?.ticket;
  const isUpdate = state?.isUpdate || false;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [seatPriceMap, setSeatPriceMap] = useState({});
  const [loading, setLoading] = useState(false);

  // Build seat price map, booked/available seats
  useEffect(() => {
    if (ticket?.seats) {
      const seatMap = {};
      ticket.seats.forEach((s) => {
        seatMap[s.seatNumber] = s.price;
      });
      setSeatPriceMap(seatMap);

      const booked = ticket.seats
        .filter(
          (s) =>
            s.booked &&
            !(
              isUpdate &&
              ticket.seatNumbers &&
              ticket.seatNumbers.includes(s.seatNumber)
            )
        )
        .map((s) => s.seatNumber);
      const available = ticket.seats.map((s) => s.seatNumber);
      setBookedSeats(booked);
      setAvailableSeats(available);
    }
    if (isUpdate && ticket?.seatNumbers) {
      setSelectedSeats(ticket.seatNumbers);
    }
  }, [ticket, isUpdate]);

  const isAvailable = (seatNum) =>
    availableSeats.includes(seatNum) && !bookedSeats.includes(seatNum);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  // Calculate total price based on selected seats
  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (seatPriceMap[seat] || ticket.basePrice),
    0
  );

  const handleConfirm = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!token || !user) {
      alert("Session expired. Please log in again.");
      navigate("/login-user");
      return;
    }

    try {
      setLoading(true);

      // Optionally, re-fetch latest seat status
      await axios.get(`${process.env.CUSTOMER_API_BASE_URL}/api/travel/list`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          type: ticket.type,
          source: ticket.source,
          destination: ticket.destination,
          date: ticket.date,
        },
      });

      let response;

      if (isUpdate) {
        response = await axios.put(
          `${process.env.CUSTOMER_API_BASE_URL}/api/travel/book`,
          {
            bookingID: ticket.bookingID,
            newTravelID: ticket.id,
            newSeatNumbers: selectedSeats,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        response = await axios.post(
          `${process.env.CUSTOMER_API_BASE_URL}/api/travel/book`,
          {
            travelID: ticket.id,
            seatNumbers: selectedSeats,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        alert(
          isUpdate
            ? "✅ Booking updated successfully!"
            : "🎉 Booking successful!"
        );
        navigate("/my-bookings");
      } else {
        alert(response.data.message || "Booking failed");
      }
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      alert(
        err.response?.data?.message || "Booking failed due to server error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!ticket)
    return (
      <div className="booking-page">
        <div className="no-ticket">No ticket data found.</div>
      </div>
    );

  return (
    <div className="booking-page">
      <h2>{isUpdate ? "Update Your Booking" : "Confirm Your Booking"}</h2>
      <div className="ticket-detail">
        <p>
          <strong>Route:</strong> {ticket.source} → {ticket.destination}
        </p>
        <p>
          <strong>Departure:</strong>{" "}
          {ticket.departureTime?.replace("T", " ").substring(0, 16)}
        </p>
        <p>
          <strong>Arrival:</strong>{" "}
          {ticket.arrivalTime?.replace("T", " ").substring(0, 16)}
        </p>
        <p>
          <strong>Agency:</strong> {ticket.agencyId}
        </p>
        <p>
          <strong>Type:</strong> {ticket.type}
        </p>
      </div>

      <div className="seat-selection">
        <label>
          <strong>Select Seat(s):</strong>
        </label>
        <div className="seat-map">
          {seatLayout.map((row, i) => (
            <div key={i} className="seat-row">
              {row.map((seat, j) =>
                seat === "" ? (
                  <div key={j} className="seat-gap" />
                ) : (
                  <div
                    key={seat}
                    className={`seat ${!isAvailable(seat) ? "booked" : ""} ${
                      selectedSeats.includes(seat) ? "selected" : ""
                    }`}
                    onClick={() => isAvailable(seat) && toggleSeat(seat)}
                  >
                    <div className="seat-label">{seat}</div>
                    <div className="seat-price">
                      ₹{seatPriceMap[seat] || ticket.basePrice}
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
        <div className="selected-summary">
          {selectedSeats.length > 0 ? (
            <>
              <div>
                Selected:{" "}
                {selectedSeats.map((s) => (
                  <span key={s} className="selected-seat">
                    {s}
                  </span>
                ))}
              </div>
              <div className="total-price">
                Total Price: <span>₹{totalPrice}</span>
              </div>
            </>
          ) : (
            <div className="no-seat-selected">No seat selected</div>
          )}
        </div>
      </div>

      <button
        className="confirm-button"
        onClick={handleConfirm}
        disabled={loading || selectedSeats.length === 0}
      >
        {loading
          ? isUpdate
            ? "Updating..."
            : "Booking..."
          : isUpdate
          ? "Update Booking"
          : "Confirm Booking"}
      </button>
    </div>
  );
}

export default BookingPage;
