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
  const [blockchainBookings, setBlockchainBookings] = useState({}); // {bookingID: bookingObject}

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

        // For each booking, fetch verification status and blockchain booking
        bookingsRes.data.data.forEach((booking) => {
          fetchVerifyStatusAndBlockchain(booking.bookingID);
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

  // Fetch blockchain verification and blockchain booking for a booking
  const fetchVerifyStatusAndBlockchain = async (bookingID) => {
    const token = localStorage.getItem("token");
    setVerifyStatus((prev) => ({
      ...prev,
      [bookingID]: { loading: true },
    }));
    try {
      // Verification status
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

    // Blockchain booking object
    try {
      const blockchainRes = await axios.get(
        // `http://fabric-rest-sample.localho.st/api/bookings/${bookingID}`,
        `http://206.1.53.15:3003/api/bookings/${bookingID}`,
        {
          headers: {
            "X-Api-Key": "97834158-3224-4CE7-95F9-A148C886653E",
          },
        }
      );
      console.log(blockchainRes);
      setBlockchainBookings((prev) => ({
        ...prev,
        [bookingID]: blockchainRes.data,
      }));
    } catch (err) {
      console.log(err);
      setBlockchainBookings((prev) => ({
        ...prev,
        [bookingID]: null,
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
                  {/* Top: Route and Price */}
                  <div className="booking-card-header">
                    <div className="route-main">
                      <span className="icon">
                        {travel?.type === "flight"
                          ? "✈️"
                          : travel?.type === "train"
                          ? "🚆"
                          : "🚌"}
                      </span>
                      <span className="route-cities">
                        <span className="city">{travel?.source}</span>
                        <span className="arrow">→</span>
                        <span className="city">{travel?.destination}</span>
                      </span>
                    </div>
                    <span className="price">₹{booking.totalPrice}</span>
                  </div>

                  {/* Agency, Type, Status */}
                  <div className="booking-card-agency">
                    <span className="agency-name">
                      {"Agency: "}
                      {travel?.agencyId || "Agency"}
                    </span>
                    <span className="type-badge">
                      {travel?.type?.toUpperCase()}
                    </span>
                    <span
                      className={`status-badge ${
                        isCancelled ? "cancelled" : "active"
                      }`}
                      style={{ marginLeft: 12 }}
                    >
                      {booking.status}
                    </span>
                    <span className="verify-section" style={{ marginLeft: 75 }}>
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

                  {/* Blockchain Details and Booking Object */}
                  {expandedBooking === booking.bookingID && (
                    <div className="blockchain-details">
                      {verify.details && (
                        <>
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
                            {verify.details.verificationTimestamp
                              ? new Date(
                                  verify.details.verificationTimestamp
                                ).toLocaleString()
                              : "N/A"}
                          </div>
                        </>
                      )}

                      {blockchainBookings[booking.bookingID] && (
                        <div className="blockchain-booking-details">
                          <h4>Booking Data on Blockchain</h4>
                          <div>
                            <strong>Agency ID:</strong>{" "}
                            {blockchainBookings[booking.bookingID].agencyID}
                          </div>
                          <div>
                            <strong>Available Seats:</strong>{" "}
                            {
                              blockchainBookings[booking.bookingID]
                                .availableSeats
                            }
                          </div>
                          <div>
                            <strong>Booking ID:</strong>{" "}
                            {blockchainBookings[booking.bookingID].bookingID}
                          </div>
                          <div>
                            <strong>Status:</strong>{" "}
                            {blockchainBookings[booking.bookingID].status}
                          </div>
                          <div>
                            <strong>Seat Numbers:</strong>{" "}
                            {blockchainBookings[booking.bookingID].seatNumbers}
                          </div>
                          <div>
                            <strong>Total Price:</strong> ₹
                            {blockchainBookings[booking.bookingID].totalPrice}
                          </div>
                          <div>
                            <strong>Penalty:</strong> ₹
                            {blockchainBookings[booking.bookingID].penalty}
                          </div>
                          <div>
                            <strong>Refund Amount:</strong> ₹
                            {blockchainBookings[booking.bookingID].refundAmount}
                          </div>
                          <div>
                            <strong>Is User Anonymous:</strong>{" "}
                            {blockchainBookings[booking.bookingID]
                              .isUserAnonymous
                              ? "Yes"
                              : "No"}
                          </div>
                          <div>
                            <strong>User Hash:</strong>{" "}
                            {blockchainBookings[booking.bookingID].userHash}
                          </div>
                          <div>
                            <strong>Created At:</strong>{" "}
                            {new Date(
                              blockchainBookings[booking.bookingID].createdAt
                            ).toLocaleString()}
                          </div>
                          <div>
                            <strong>Updated At:</strong>{" "}
                            {new Date(
                              blockchainBookings[booking.bookingID].updatedAt
                            ).toLocaleString()}
                          </div>
                          <div>
                            <strong>Cancelled At:</strong>{" "}
                            {blockchainBookings[booking.bookingID].cancelledAt
                              ? new Date(
                                  blockchainBookings[
                                    booking.bookingID
                                  ].cancelledAt
                                ).toLocaleString()
                              : "N/A"}
                          </div>
                          <div>
                            <strong>Travel ID:</strong>{" "}
                            {blockchainBookings[booking.bookingID].travelID}
                          </div>
                          <div>
                            <strong>Hyperledger TxID:</strong>{" "}
                            {
                              blockchainBookings[booking.bookingID]
                                .hyperledgerTxId
                            }
                          </div>
                          <div>
                            <strong>Transaction ID:</strong>{" "}
                            {
                              blockchainBookings[booking.bookingID]
                                .transactionID
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="divider"></div>

                  {/* Details */}
                  <div className="booking-details">
                    <div>
                      <p>
                        <strong>Booking ID:</strong> {booking.bookingID}
                      </p>
                      <p>
                        <strong>Travel ID:</strong> {booking.travelID}
                      </p>
                      <p>
                        <strong>Date:</strong> {formatDate(travel?.date)}
                      </p>
                      <p>
                        <strong>Departure:</strong>{" "}
                        {travel?.departureTime
                          ?.replace("T", " ")
                          .substring(0, 16)}
                      </p>
                      <p>
                        <strong>Arrival:</strong>{" "}
                        {travel?.arrivalTime
                          ?.replace("T", " ")
                          .substring(0, 16)}
                      </p>
                      <p>
                        <strong>Created At:</strong>{" "}
                        {booking.createdAt
                          ? new Date(booking.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Updated At:</strong>{" "}
                        {booking.updatedAt
                          ? new Date(booking.updatedAt).toLocaleString()
                          : "N/A"}
                      </p>
                      {booking.cancelledAt && (
                        <p>
                          <strong>Cancelled At:</strong>{" "}
                          {new Date(booking.cancelledAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <p>
                        <strong>Seats:</strong> {booking.seatNumbers.join(", ")}
                      </p>
                      <p>
                        <strong>Price/Seat:</strong>{" "}
                        {booking.seatNumbers.length > 0
                          ? `₹${(
                              booking.totalPrice / booking.seatNumbers.length
                            ).toFixed(2)}`
                          : "-"}
                      </p>
                      <p>
                        <strong>Total Price:</strong> ₹{booking.totalPrice}
                      </p>
                      {typeof booking.refundAmount !== "undefined" &&
                        isCancelled && (
                          <p>
                            <strong>Refund:</strong>{" "}
                            <span className="refund-amount">
                              ₹{booking.refundAmount}
                            </span>
                          </p>
                        )}
                      {typeof booking.penalty !== "undefined" &&
                        isCancelled && (
                          <p>
                            <strong>Penalty:</strong>{" "}
                            <span className="penalty-amount">
                              ₹{booking.penalty}
                            </span>
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="divider"></div>

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
