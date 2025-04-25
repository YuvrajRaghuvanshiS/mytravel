import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../styles/bookings.css";

function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [travelOptions, setTravelOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyStatus, setVerifyStatus] = useState({}); // {bookingID: {loading, verified, details}}

  // API base URL
  const CUST_BASE_URL = process.env.REACT_APP_CUSTOMER_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [bookingsRes, travelRes] = await Promise.all([
          axios.get(`${CUST_BASE_URL}/api/travel/get-all-bookings`, {
            headers,
          }),
          axios.get(`${CUST_BASE_URL}/api/travel/list`, { headers }),
        ]);

        setBookings(bookingsRes.data.data);
        setTravelOptions(travelRes.data.travelOptions);

        // For each booking, fetch verification status
        bookingsRes.data.data.forEach((booking) => {
          fetchVerifyStatus(booking.bookingID);
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to fetch bookings. Please try again.");
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [navigate]);

  // Fetch blockchain verification for a booking
  const fetchVerifyStatus = async (bookingID) => {
    const token = localStorage.getItem("token");
    setVerifyStatus((prev) => ({
      ...prev,
      [bookingID]: { loading: true },
    }));
    try {
      const res = await axios.post(
        `${CUST_BASE_URL}/api/travel/verify`,
        { bookingID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVerifyStatus((prev) => ({
        ...prev,
        [bookingID]: {
          loading: false,
          verified: res.data.verified,
          details: res.data.verificationDetails,
        },
      }));
    } catch (err) {
      setVerifyStatus((prev) => ({
        ...prev,
        [bookingID]: {
          loading: false,
          verified: false,
          details: null,
          error: true,
        },
      }));
    }
  };

  const handleCancelBooking = async (bookingID) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    try {
      const res = await axios.delete(`${CUST_BASE_URL}/api/travel/book`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: { bookingID },
      });

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
    return isoString.split("T")[0];
  };

  // For toggling blockchain details
  const [expandedBooking, setExpandedBooking] = useState(null);

  if (loading)
    return <div className="booking-container">Loading bookings...</div>;

  return (
    <>
      <Navbar />
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
              const verify = verifyStatus[booking.bookingID] || {};
              return (
                <li
                  key={booking.bookingID}
                  className={`booking-card ${isCancelled ? "cancelled" : ""}`}
                >
                  <div className="booking-card-header">
                    <div className="route">
                      <span className="icon">
                        {travel?.type === "flight"
                          ? "✈️"
                          : travel?.type === "train"
                          ? "🚆"
                          : "🚌"}
                      </span>
                      <span>
                        <strong>{travel?.source}</strong> →{" "}
                        <strong>{travel?.destination}</strong>
                      </span>
                    </div>
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
                        <strong>Status:</strong>{" "}
                        <span
                          className={`status-badge ${
                            isCancelled ? "cancelled" : "active"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="booking-meta">
                    <span>Booking ID: {booking.bookingID}</span>
                    <span className="verify-section">
                      {verify.loading ? (
                        <span className="verify-badge pending">
                          Verifying...
                        </span>
                      ) : verify.error ? (
                        <span className="verify-badge error">
                          Verification Error
                        </span>
                      ) : verify.verified ? (
                        <span
                          className="verify-badge verified"
                          onClick={() =>
                            setExpandedBooking(
                              expandedBooking === booking.bookingID
                                ? null
                                : booking.bookingID
                            )
                          }
                        >
                          ✅ Verified on Blockchain
                        </span>
                      ) : (
                        <span
                          className="verify-badge pending"
                          onClick={() =>
                            setExpandedBooking(
                              expandedBooking === booking.bookingID
                                ? null
                                : booking.bookingID
                            )
                          }
                        >
                          ⏳ Not Yet Verified
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Refund & Penalty for cancelled bookings */}
                  {isCancelled && (
                    <div className="refund-section">
                      <span>
                        Refund:{" "}
                        <strong>₹{booking.refundAmount ?? "0.00"}</strong>
                      </span>
                      <span>
                        Penalty: <strong>₹{booking.penalty ?? "0.00"}</strong>
                      </span>
                    </div>
                  )}

                  {/* Blockchain details expandable */}
                  {expandedBooking === booking.bookingID && verify.details && (
                    <div className="blockchain-details">
                      <div>
                        <strong>Blockchain TxID:</strong>{" "}
                        <span className="mono">
                          {verify.details.blockchainTxID}
                        </span>
                      </div>
                      <div>
                        <strong>Block Height:</strong>{" "}
                        {verify.details.blockHeight}
                      </div>
                      <div>
                        <strong>Blockchain Height:</strong>{" "}
                        {verify.details.blockchainHeight}
                      </div>
                      <div>
                        <strong>Confirmations:</strong>{" "}
                        {verify.details.confirmationDepth} /{" "}
                        {verify.details.verificationThreshold}
                      </div>
                      <div>
                        <strong>Verified At:</strong>{" "}
                        {formatDate(verify.details.verificationTimestamp)}
                      </div>
                    </div>
                  )}

                  <div className="booking-actions">
                    <button
                      className="update-btn blue-btn"
                      onClick={() =>
                        navigate("/tickets", {
                          state: {
                            agencyId: travel.agencyId,
                            from: travel.source,
                            to: travel.destination,
                            type: travel.type,
                            updateBooking: true,
                            bookingID: booking.bookingID,
                            seatNumbers: booking.seatNumbers,
                            travelID: booking.travelID,
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
    </>
  );
}

export default MyBookingsPage;
