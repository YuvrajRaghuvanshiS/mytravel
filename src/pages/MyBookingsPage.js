// src/pages/MyBookingsPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/bookings.css";

function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [travelOptions, setTravelOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [bookingsRes, travelRes] = await Promise.all([
          axios.get(
            `${process.env.CUSTOMER_API_BASE_URL}/api/travel/get-all-bookings`,
            {
              headers,
            }
          ),
          axios.get(`${process.env.CUSTOMER_API_BASE_URL}/api/travel/list`, {
            headers,
          }),
        ]);

        setBookings(bookingsRes.data.data);
        setTravelOptions(travelRes.data.travelOptions);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to fetch bookings. Please try again.");
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCancelBooking = async (bookingID) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    try {
      const res = await axios.delete(
        `${process.env.CUSTOMER_API_BASE_URL}/api/travel/book`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: { bookingID },
        }
      );

      if (res.data.success) {
        alert("Booking cancelled successfully");
        setBookings((prev) => prev.filter((b) => b.bookingID !== bookingID));
      } else {
        alert(res.data.message || "Cancellation failed");
      }
    } catch (err) {
      console.error("Cancellation failed:", err.response?.data || err.message);
      alert(
        err.response?.data?.message || "Cancellation failed due to server error"
      );
    }
  };

  const getTravelDetails = (travelID) => {
    return travelOptions.find((t) => t.id === travelID);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    return isoString.split("T")[0]; // Format: yyyy-mm-dd
  };

  if (loading)
    return <div className="booking-container">Loading bookings...</div>;

  return (
    <div className="booking-container">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="no-bookings">You have not made any bookings yet.</p>
      ) : (
        <ul className="booking-list">
          {bookings.map((booking) => {
            const travel = getTravelDetails(booking.travelID);
            const isCancelled =
              booking.status && booking.status.toLowerCase() === "cancelled";
            return (
              <li key={booking.bookingID} className="booking-card">
                <div className="booking-header">
                  <span className="route">
                    <strong>{travel?.source}</strong> →{" "}
                    <strong>{travel?.destination}</strong>
                  </span>
                  <span className="price">₹{booking.totalPrice}</span>
                </div>
                <div className="booking-details">
                  <div>
                    <p>
                      <strong>Departure:</strong>{" "}
                      {formatDate(travel?.departureTime)}
                    </p>
                    <p>
                      <strong>Arrival:</strong>{" "}
                      {formatDate(travel?.arrivalTime)}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(travel?.date)}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Type:</strong>{" "}
                      {travel?.type?.toUpperCase() || "N/A"}
                    </p>
                    <p>
                      <strong>Seats:</strong> {booking.seatNumbers.join(", ")}
                    </p>
                    <p>
                      <strong>Status:</strong> {booking.status}
                    </p>
                  </div>
                </div>
                <p className="booking-meta">Booking ID: {booking.bookingID}</p>
                <div className="booking-actions">
                  <button
                    className="update-btn blue-btn"
                    onClick={() =>
                      navigate("/book", {
                        state: {
                          ticket: {
                            id: booking.travelID,
                            source: travel?.source,
                            destination: travel?.destination,
                            departureTime: travel?.departureTime,
                            arrivalTime: travel?.arrivalTime,
                            basePrice:
                              booking.totalPrice / booking.seatNumbers.length,
                            seatNumbers: booking.seatNumbers,
                            bookingID: booking.bookingID,
                            type: travel?.type,
                            date: travel?.date,
                            seats: travel?.seats,
                          },
                          isUpdate: true,
                        },
                      })
                    }
                    disabled={isCancelled}
                  >
                    Update
                  </button>
                  <button
                    className="cancel-btn red-btn"
                    onClick={() => handleCancelBooking(booking.bookingID)}
                    disabled={isCancelled}
                  >
                    Cancel
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <button className="back-btn" onClick={() => navigate("/profile")}>
        ← Back to Profile
      </button>
    </div>
  );
}

export default MyBookingsPage;
