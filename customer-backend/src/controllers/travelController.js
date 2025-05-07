import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import axios from "axios";
import { users, travelOptions, bookings } from "../db.js";
import { Mutex } from "async-mutex";

const travelLocks = new Map(); // travelID -> mutex

export const getTravelOptions = async (req, res) => {
  try {
    const {
      agencyId,
      date,
      source,
      destination,
      type,
      minPrice,
      maxPrice,
      availableOnly,
      sortBy,
    } = req.query;

    // Call the Travel Agency Backend
    const response = await axios.get(
      `${process.env.TRAVEL_AGENCY_BACKEND_URL}/api/travel/public-list`,
      {
        params: {
          agencyId,
          date,
          source,
          destination,
          type,
          minPrice,
          maxPrice,
          availableOnly,
          sortBy,
        },
      }
    );
    travelOptions.length = 0; // Clear existing entries
    travelOptions.push(...response.data["travelOptions"]); // Append new data
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching travel options:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch travel options" });
  }
};

export const createBooking = async (req, res) => {
  const { travelID, seatNumbers } = req.body;
  const userID = req.user.id;

  const user = users[userID];
  // Validate input
  if (!travelID || !seatNumbers || seatNumbers.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  // Acquire the lock for this travelID
  let mutex = travelLocks.get(travelID);
  if (!mutex) {
    mutex = new Mutex();
    travelLocks.set(travelID, mutex);
  }

  await mutex.runExclusive(async () => {
    try {
      const travel = travelOptions.find((t) => t.id === travelID);
      if (!travel) {
        return res
          .status(404)
          .json({ success: false, message: "Travel not found" });
      }

      // Validate seat numbers
      const unavailableSeats = [];
      const selectedSeats = [];

      seatNumbers.forEach((seatNum) => {
        const seat = travel.seats.find((s) => s.seatNumber === seatNum);
        if (!seat || seat.booked) {
          unavailableSeats.push(seatNum);
        } else {
          selectedSeats.push(seat);
        }
      });

      if (unavailableSeats.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Seats ${unavailableSeats.join(
            ", "
          )} are unavailable or invalid`,
        });
      }

      // Calculate total price
      const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

      // Check user balance
      if (user.balance < totalPrice) {
        return res
          .status(400)
          .json({ success: false, message: "Insufficient balance" });
      }

      // Deduct user balance
      user.balance -= totalPrice;

      // Mark seats as booked and assign passenger
      selectedSeats.forEach((seat) => {
        seat.booked = true;
        seat.passenger = user.userHash;
      });

      // Decrement availableSeats
      travel.availableSeats -= seatNumbers.length;

      // Generate transaction and booking IDs
      const transactionID = `txn_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const bookingID = `book_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Create booking record
      const booking = {
        bookingID,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        cancelledAt: "",
        userHash: user.userHash,
        isUserAnonymous: user.isAnonymous,
        userID: user.isAnonymous ? "" : user.id,
        agencyID: travel.agencyId,
        travelID,
        seatNumbers,
        totalPrice,
        transactionID,
        status: "confirmed",
        refundAmount: 0,
        penalty: 0,
        availableSeats: travel.availableSeats,
      };

      // Save booking in local DB
      bookings.push(booking);

      // Notify Travel Agency Backend
      await axios.post(
        `${process.env.TRAVEL_AGENCY_BACKEND_URL}/api/travel/receive-booking`,
        booking
      );

      const hyperledger_resp = await axios.post(
        `${process.env.HYPERLEDGER_REST_BASE_URL}/api/bookings`,
        booking,
        {
          headers: {
            "X-Api-Key": process.env.HYPERLEDGER_ORG1_APIKEY,
          },
        }
      );

      // Respond to user
      return res.status(201).json({
        success: true,
        message: "Booking confirmed",
        booking,
        hyperledger_response: hyperledger_resp.data,
      });
    } catch (err) {
      console.error("Booking error:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  });
};

export const getUserBookings = (req, res) => {
  const userId = req.user.id;
  const user = users[userId];

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const userBookings = bookings.filter((b) => b.userHash === user.userHash);

  res.status(200).json({
    success: true,
    message: `Found ${userBookings.length} booking(s)`,
    data: userBookings,
  });
};

export const updateBooking = async (req, res) => {
  const userID = req.user.id;
  const { bookingID, newTravelID, newSeatNumbers } = req.body;

  const user = users[userID];
  const booking = bookings.find(
    (b) => b.bookingID === bookingID && b.userHash === user.userHash
  );
  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  const oldTravel = travelOptions.find((t) => t.id === booking.travelID);
  const newTravel = travelOptions.find((t) => t.id === newTravelID);
  if (!oldTravel || !newTravel) {
    return res.status(404).json({
      success: false,
      message: "Old or new travel option not found",
    });
  }

  // Basic compatibility checks
  const isSameAgency = oldTravel.agencyId === newTravel.agencyId;
  const isSameRoute =
    oldTravel.source === newTravel.source &&
    oldTravel.destination === newTravel.destination &&
    oldTravel.type === newTravel.type;

  if (!isSameAgency || !isSameRoute) {
    return res.status(400).json({
      success: false,
      message: "New travel option does not match agency or route",
    });
  }

  // Validate seat numbers
  const unavailableSeats = [];
  const selectedSeats = [];

  newSeatNumbers.forEach((seatNum) => {
    const seat = newTravel.seats.find((s) => s.seatNumber === seatNum);
    if (!seat || seat.booked) {
      unavailableSeats.push(seatNum);
    } else {
      selectedSeats.push(seat); // valid and available
    }
  });

  if (unavailableSeats.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Seats ${unavailableSeats.join(
        ", "
      )} are unavailable or invalid`,
    });
  }

  // Penalty logic: ₹20 penalty if changed date within 24 hours of travel
  const now = new Date();
  const travelDate = new Date(oldTravel.date);
  const hoursLeft = (travelDate - now) / (1000 * 60 * 60);
  let penalty = 0;
  if (hoursLeft < 24) {
    penalty = 20;
  }

  const newTotalPrice =
    selectedSeats.reduce((sum, s) => sum + s.price, 0) + penalty;
  const diffAmount = newTotalPrice - booking.totalPrice;

  if (user.balance < diffAmount) {
    return res.status(400).json({
      success: false,
      message: `Insufficient balance to pay difference & penalty`,
    });
  }

  // Free old seats
  oldTravel.seats.forEach((seat) => {
    if (booking.seatNumbers.includes(seat.seatNumber)) {
      seat.booked = false;
      seat.passenger = null;
      oldTravel.availableSeats++;
    }
  });

  // Book new seats
  selectedSeats.forEach((seat) => {
    seat.booked = true;
    seat.passenger = user.userHash;
    newTravel.availableSeats--;
  });

  // Update balance
  user.balance -= diffAmount;

  // Generate transaction IDs
  const newTransactionID = `txn_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Update booking
  booking.travelID = newTravelID;
  booking.seatNumbers = newSeatNumbers;
  booking.totalPrice = newTotalPrice;
  booking.updatedAt = new Date().toISOString();
  booking.availableSeats = newTravel.availableSeats;

  try {
    // Notify agency backend
    await axios.post(
      `${process.env.TRAVEL_AGENCY_BACKEND_URL}/api/travel/receive-booking-update`,
      booking
    );

    // Update booking on blockchain
    const hyperledgerResp = await axios.post(
      `${process.env.HYPERLEDGER_REST_BASE_URL}/api/bookings`,
      booking,
      {
        headers: {
          "X-Api-Key": process.env.HYPERLEDGER_ORG1_APIKEY,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Booking updated. Penalty applied: ₹${penalty}`,
      booking,
      hyperledger_response: hyperledgerResp.data,
    });
  } catch (err) {
    console.error("Update error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const cancelBooking = async (req, res) => {
  const userID = req.user.id;
  const { bookingID } = req.body;

  const user = users[userID];
  const booking = bookings.find(
    (b) => b.bookingID === bookingID && b.userHash === user.userHash
  );

  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  const travel = travelOptions.find((t) => t.id === booking.travelID);
  if (!travel) {
    return res
      .status(404)
      .json({ success: false, message: "Associated travel option not found" });
  }

  const travelDate = new Date(travel.date);
  const now = new Date();
  const hoursLeft = (travelDate - now) / (1000 * 60 * 60);

  let penalty = 0;
  if (hoursLeft < 24) {
    penalty = 20; // ₹20 penalty for late cancellation
  }

  const refundAmount = booking.totalPrice - penalty;
  if (refundAmount > 0) {
    user.balance += refundAmount;
  }

  // Free seats
  travel.seats.forEach((s) => {
    if (booking.seatNumbers.includes(s.seatNumber)) {
      s.booked = false;
      s.passenger = null;
      travel.availableSeats++;
    }
  });

  booking.status = "cancelled";
  booking.cancelledAt = new Date().toISOString();
  booking.refundAmount = refundAmount;
  booking.penalty = penalty;

  try {
    // Notify travel agency
    await axios.post(
      `${process.env.TRAVEL_AGENCY_BACKEND_URL}/api/travel/receive-cancel-booking`,
      booking
    );

    // Update on blockchain
    const hyperledgerResp = await axios.delete(
      `${process.env.HYPERLEDGER_REST_BASE_URL}/api/bookings/${bookingID}`,
      {
        headers: {
          "X-Api-Key": process.env.HYPERLEDGER_ORG1_APIKEY,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Booking cancelled. Penalty: ₹${penalty}, Refunded: ₹${refundAmount}`,
      booking,
      hyperledger_response: hyperledgerResp.data,
    });
  } catch (err) {
    console.error("Cancellation error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const receiveBookingCancel = async (req, res) => {
  const {
    bookingID,
    cancelledAt,
    userHash,
    travelID,
    seatNumbers,
    refundAmount,
    penalty,
  } = req.body;

  if (
    !bookingID ||
    !userHash ||
    !travelID ||
    !seatNumbers ||
    typeof refundAmount !== "number" ||
    typeof penalty !== "number" ||
    !cancelledAt
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid cancellation data" });
  }

  try {
    const travel = travelOptions.find((t) => t.id === travelID);
    if (!travel) {
      return res
        .status(404)
        .json({ success: false, message: "Travel option not found" });
    }

    const user = users[userHash];
    if (user) {
      user.balance += refundAmount;
    }

    // Free seats
    seatNumbers.forEach((seatNum) => {
      const seat = travel.seats.find((s) => s.seatNumber === seatNum);
      if (seat) {
        seat.booked = false;
        seat.passenger = null;
        travel.availableSeats++;
      }
    });

    // Update booking record
    const booking = bookings.find((b) => b.bookingID === bookingID);
    if (booking) {
      booking.status = "cancelled";
      booking.cancelledAt = cancelledAt;
      booking.refundAmount = refundAmount;
      booking.penalty = penalty;
    }

    return res.status(200).json({
      success: true,
      message: "Booking cancellation recorded",
      booking,
    });
  } catch (err) {
    console.error("Cancellation update error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to record cancellation",
      error: err.message,
    });
  }
};

export const verifyBookingOnBlockchain = async (req, res) => {
  const { bookingID } = req.body;
  const userID = req.user.id;

  const user = users[userID];
  // Basic validation
  if (!bookingID) {
    return res.status(400).json({
      success: false,
      message: "Booking ID is required",
    });
  }

  try {
    // Check local booking ownership
    const localBooking = bookings.find(
      (b) => b.bookingID === bookingID && b.userHash === user.userHash
    );

    if (!localBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or access denied",
      });
    }

    // Get blockchain booking details
    const bookingResponse = await axios.get(
      `${process.env.HYPERLEDGER_REST_BASE_URL}/api/bookings/${bookingID}`,
      {
        headers: {
          "X-Api-Key": process.env.HYPERLEDGER_ORG1_APIKEY,
        },
      }
    );

    const blockchainBooking = bookingResponse.data;
    const hyperledgerTxId = blockchainBooking.hyperledgerTxId;

    if (!hyperledgerTxId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID missing from blockchain record",
      });
    }

    // Get block height information
    const heightResponse = await axios.get(
      `${process.env.HYPERLEDGER_REST_BASE_URL}/api/bookings/${hyperledgerTxId}/blockheight`,
      {
        headers: {
          "X-Api-Key": process.env.HYPERLEDGER_ORG1_APIKEY,
        },
      }
    );

    const { blockHeight, blockchainHeight } = heightResponse.data;
    const confirmationDepth = blockchainHeight - blockHeight;

    const isVerified = confirmationDepth >= 2;

    return res.status(200).json({
      success: true,
      verified: isVerified,
      verificationDetails: {
        localBookingID: localBooking.bookingID,
        blockchainTxID: hyperledgerTxId,
        blockHeight,
        blockchainHeight,
        confirmationDepth,
        verificationThreshold: 2,
        verificationTimestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error during verification",
    });
  }
};
