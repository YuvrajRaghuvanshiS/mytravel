import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import axios from "axios";

import { users, travelOptions, bookings } from "../db.js";

export const getTravelOptions = async (req, res) => {
  try {
    const {
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

  // Validate input
  if (!travelID || !seatNumbers || seatNumbers.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    // Find the travel option
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

    // Calculate total price
    const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

    // Check user balance
    if (users[userID].balance < totalPrice) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    // Deduct user balance
    users[userID].balance -= totalPrice;

    // Mark seats as booked and assign passenger
    selectedSeats.forEach((seat) => {
      seat.booked = true;
      seat.passenger = userID;
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
      userID,
      travelID,
      seatNumbers,
      totalPrice,
      transactionID,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Save booking in local DB
    bookings.push(booking);

    // Notify Travel Agency Backend
    await axios.post(
      `${process.env.TRAVEL_AGENCY_BACKEND_URL}/api/travel/receive-booking`,
      booking
    );

    const hyperledger_resp = await axios.post(
      `${process.env.HYPPERLEDGER_REST_BASE_URL}/api/bookings`,
      {
        bookingID,
        userID,
        travelID,
        seatNumbers,
        totalPrice,
        transactionID,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
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
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserBookings = (req, res) => {
  const userId = req.user.id;
  const user = users[userId];

  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const userBookings = bookings.filter((b) => b.userID === userId);

  res.status(200).json({
    success: true,
    message: `Found ${userBookings.length} booking(s)`,
    data: userBookings,
  });
};
