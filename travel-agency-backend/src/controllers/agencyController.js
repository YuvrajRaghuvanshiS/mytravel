import { agencies, travelOptions, bookings } from "../db.js";
import axios from "axios";

export const getAgencyInfo = (req, res) => {
  const agencyId = req.user.id;
  const agency = agencies[agencyId];

  if (!agency) {
    return res
      .status(404)
      .json({ success: false, message: "Agency not found" });
  }

  res.status(200).json({
    success: true,
    data: {
      id: agency.id,
      name: agency.name,
      email: agency.email,
      phone: agency.phone,
      gstNumber: agency.gstNumber,
      contactPerson: agency.contactPerson,
      address: agency.address,
      agencyType: agency.agencyType,
      balance: agency.balance,
    },
  });
};

export const updateAgencyProfile = async (req, res) => {
  const agencyId = req.user.id; // from JWT
  const { name, email, phone } = req.body;

  if (!agencies[agencyId]) {
    return res
      .status(404)
      .json({ success: false, message: "Agency not found" });
  }

  if (!name && !email && !phone) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update",
    });
  }

  // Update fields if provided
  if (name) agencies[agencyId].name = name;
  if (email) agencies[agencyId].email = email;
  if (phone) agencies[agencyId].phone = phone;

  return res.status(200).json({
    success: true,
    message: "Agency profile updated successfully.",
    data: {
      id: agencies[agencyId].id,
      name: agencies[agencyId].name,
      email: agencies[agencyId].email,
      phone: agencies[agencyId].phone,
    },
  });
};

export const deleteAgencyAccount = async (req, res) => {
  const agencyId = req.user.id; // from JWT

  if (!agencyId || !agencies[agencyId]) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized agency" });
  }

  const now = new Date();
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const agency = agencies[agencyId];

  const affectedTravels = travelOptions.filter((t) => t.agencyId === agencyId);
  const activeBookings = bookings.filter((b) => {
    const travel = affectedTravels.find((t) => t.id === b.travelID);
    if (!travel) return false;

    const travelDate = new Date(travel.date);
    return (
      travelDate >= now && // Skip past bookings
      b.status === "confirmed"
    );
  });

  let totalRefund = 0;
  let totalPenalty = 0;
  const cancelledBookings = [];

  for (const booking of activeBookings) {
    const travel = affectedTravels.find((t) => t.id === booking.travelID);
    if (!travel) continue;

    const travelDate = new Date(travel.date);
    let penalty = 0;

    if (travelDate <= oneWeekLater) {
      penalty = 30; // ₹30 penalty for short-notice cancellations
    }

    const refundAmount = booking.totalPrice + penalty;
    totalRefund += refundAmount;
    totalPenalty += penalty;

    agency.balance -= refundAmount; // refund user from agency balance

    // Free seats
    travel.seats.forEach((s) => {
      if (booking.seatNumbers.includes(s.seatNumber)) {
        s.booked = false;
        s.passenger = null;
        travel.availableSeats++;
      }
    });

    // Update booking
    booking.status = "cancelled";
    booking.cancelledAt = new Date().toISOString();
    booking.penalty = penalty;
    booking.refundAmount = refundAmount;

    cancelledBookings.push(booking);

    // Notify customer backend
    try {
      await axios.post(
        `${process.env.CUSTOMER_BACKEND_URL}/api/travel/receive-cancel-booking`,
        {
          bookingID: booking.bookingID,
          userHash: booking.userHash,
          travelID: travel.id,
          seatNumbers: booking.seatNumbers,
          refundAmount,
          penalty,
          cancelledAt: booking.cancelledAt,
        }
      );

      // Update on blockchain
      await axios.delete(
        `${process.env.HYPERLEDGER_REST_BASE_URL}/api/bookings/${booking.bookingID}`,
        {
          headers: {
            "X-Api-Key": process.env.HYPERLEDGER_ORG2_APIKEY,
          },
        }
      );
    } catch (err) {
      console.error(
        `Error processing booking ${booking.bookingID}:`,
        err.message
      );
    }
  }

  // Remove agency and travel options
  delete agencies[agencyId];
  travelOptions.splice(
    0,
    travelOptions.length,
    ...travelOptions.filter((t) => t.agencyId != agencyId)
  );

  return res.status(200).json({
    success: true,
    message: `Agency ${agencyId} deleted successfully.`,
    totalBookingsCancelled: cancelledBookings.length,
    penaltyCollected: totalPenalty,
    cancelledBookings,
  });
};
