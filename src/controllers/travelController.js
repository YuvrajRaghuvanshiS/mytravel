import { agencies, travelOptions, bookings } from "../db.js";
import { travelOptionsFilter } from "../utils/listings.js";
import axios from "axios";

export const addTravelOption = (req, res) => {
  const agencyId = req.user.id; // Extract agency ID from JWT
  const {
    type,
    source,
    destination,
    date,
    departureTime,
    arrivalTime,
    reachTime,
    basePrice,
    seats,
  } = req.body;

  // Validate required fields
  if (
    !agencyId ||
    !type ||
    !source ||
    !destination ||
    !date ||
    !departureTime ||
    !arrivalTime ||
    !reachTime ||
    !basePrice ||
    !seats
  ) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // Validate basic data types
  if (
    typeof type !== "string" ||
    typeof source !== "string" ||
    typeof destination !== "string" ||
    typeof basePrice !== "number" ||
    !Array.isArray(seats)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid data types" });
  }

  // Convert date fields to Date objects
  try {
    const travelDate = new Date(date);
    const departure = new Date(`${date}T${departureTime}`);
    const arrival = new Date(`${date}T${arrivalTime}`);
    const reach = new Date(`${date}T${reachTime}`);

    if (
      isNaN(travelDate) ||
      isNaN(departure) ||
      isNaN(arrival) ||
      isNaN(reach)
    ) {
      throw new Error();
    }

    if (arrival >= departure || arrival >= reach) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid travel timings" });
    }

    // Validate seats array
    for (let seat of seats) {
      if (
        typeof seat.seatNumber !== "string" ||
        typeof seat.price !== "number" ||
        seat.price < basePrice
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid seat data. Each seat must have a valid number and price >= base price.",
        });
      }
    }

    const newTravel = {
      id: travelOptions.length + 1,
      agencyId,
      type,
      source,
      destination,
      date: travelDate, // Store as a Date object
      departureTime: departure,
      arrivalTime: arrival,
      reachTime: reach,
      basePrice,
      seats,
      availableSeats: seats.length,
    };

    travelOptions.push(newTravel);

    res.status(201).json({
      success: true,
      message: "Travel option added",
      travel: newTravel,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid date or time format" });
  }
};

export const updateTravelOption = (req, res) => {
  const { id } = req.params;
  const {
    type,
    source,
    destination,
    date,
    departureTime,
    arrivalTime,
    reachTime,
    basePrice,
    seats,
  } = req.body;

  const travel = travelOptions.find((t) => t.id === parseInt(id));

  if (!travel) {
    return res
      .status(404)
      .json({ success: false, message: "Travel option not found" });
  }

  // Validate data types before updating
  if (type && typeof type !== "string")
    return res.status(400).json({ success: false, message: "Invalid type" });
  if (source && typeof source !== "string")
    return res.status(400).json({ success: false, message: "Invalid source" });
  if (destination && typeof destination !== "string")
    return res
      .status(400)
      .json({ success: false, message: "Invalid destination" });
  if (basePrice && (typeof basePrice !== "number" || basePrice <= 0)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid base price" });
  }
  if (seats && !Array.isArray(seats))
    return res
      .status(400)
      .json({ success: false, message: "Seats should be an array" });

  try {
    // Convert date fields to Date objects
    if (date) {
      const travelDate = new Date(date);
      if (isNaN(travelDate)) throw new Error();
      travel.date = travelDate;
    }

    if (departureTime || arrivalTime || reachTime) {
      const depTime = departureTime
        ? new Date(`${date || travel.date}T${departureTime}`)
        : travel.departureTime;
      const arrTime = arrivalTime
        ? new Date(`${date || travel.date}T${arrivalTime}`)
        : travel.arrivalTime;
      const rechTime = reachTime
        ? new Date(`${date || travel.date}T${reachTime}`)
        : travel.reachTime;

      if (isNaN(depTime) || isNaN(arrTime) || isNaN(rechTime))
        throw new Error();
      if (depTime >= arrTime || arrTime >= rechTime) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid travel timings" });
      }

      travel.departureTime = depTime;
      travel.arrivalTime = arrTime;
      travel.reachTime = rechTime;
    }

    // Validate and update seats
    if (seats) {
      for (let seat of seats) {
        if (
          typeof seat.seatNumber !== "string" ||
          typeof seat.price !== "number" ||
          seat.price < (basePrice || travel.basePrice)
        ) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid seat data" });
        }
      }
      travel.seats = seats;
      travel.availableSeats = seats.length;
    }

    // Update other fields
    if (type) travel.type = type;
    if (source) travel.source = source;
    if (destination) travel.destination = destination;
    if (basePrice) travel.basePrice = basePrice;

    res
      .status(200)
      .json({ success: true, message: "Travel option updated", travel });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid date or time format" });
  }
};

export const removeTravelOption = (req, res) => {
  const { id } = req.params;
  const index = travelOptions.findIndex((t) => t.id === parseInt(id));

  if (index === -1)
    return res
      .status(404)
      .json({ success: false, message: "Travel option not found" });

  travelOptions.splice(index, 1);
  res.status(200).json({ success: true, message: "Travel option removed" });
};

export const getAgencyTravelOptions = (req, res) => {
  const agencyId = req.user.id; // Extract agency ID from JWT
  let {
    date,
    source,
    destination,
    type,
    minPrice,
    maxPrice,
    availableOnly,
    sortBy,
  } = req.query;

  let agencyTravels = travelOptionsFilter(
    agencyId,
    date,
    source,
    destination,
    type,
    minPrice,
    maxPrice,
    availableOnly,
    sortBy
  );

  res.status(200).json({ success: true, travelOptions: agencyTravels });
};

export const getPublicAgencyTravelOptions = (req, res) => {
  let {
    date,
    source,
    destination,
    type,
    minPrice,
    maxPrice,
    availableOnly,
    sortBy,
  } = req.query;

  let agencyId = null;

  let agencyTravels = travelOptionsFilter(
    agencyId,
    date,
    source,
    destination,
    type,
    minPrice,
    maxPrice,
    availableOnly,
    sortBy
  );

  res.status(200).json({ success: true, travelOptions: agencyTravels });
};

export const receiveBooking = async (req, res) => {
  const {
    bookingID,
    createdAt,
    updatedAt,
    cancelledAt,
    userHash,
    isUserAnonymous,
    userID,
    agencyID,
    travelID,
    seatNumbers,
    totalPrice,
    transactionID,
    status,
    refundAmount,
    penalty,
  } = req.body;

  // Validate input
  if (
    !bookingID ||
    !createdAt ||
    !updatedAt ||
    !userHash ||
    !agencyID ||
    !travelID ||
    !seatNumbers ||
    !totalPrice ||
    !transactionID ||
    !status
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid booking data" });
  }

  try {
    // Fetch travel option
    const travelOption = travelOptions.find((option) => option.id === travelID);
    if (!travelOption) {
      return res
        .status(404)
        .json({ success: false, message: "Travel option not found" });
    }

    // Update seats availability
    seatNumbers.forEach((seatNum) => {
      const seat = travelOption.seats.find((s) => s.seatNumber === seatNum);
      seat.booked = true;
      seat.passenger = userID;
    });

    // Credit agency wallet
    const agency = agencies[travelOption.agencyId];
    if (agency) {
      agency.balance += totalPrice;
    }

    // Save booking record
    const booking = {
      bookingID,
      createdAt,
      updatedAt,
      cancelledAt,
      userHash,
      isUserAnonymous,
      userID,
      agencyID,
      travelID,
      seatNumbers,
      totalPrice,
      transactionID,
      status,
      refundAmount,
      penalty,
    };
    bookings.push(booking);

    res
      .status(200)
      .json({ success: true, message: "Booking recorded", booking });
  } catch (error) {
    console.error("Error recording booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record booking",
      error: error.message,
    });
  }
};

export const receiveBookingUpdate = async (req, res) => {
  const { bookingID, updatedAt, travelID, seatNumbers, totalPrice } = req.body;

  if (!bookingID || !updatedAt || !travelID || !seatNumbers || !totalPrice) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid booking update data" });
  }

  try {
    // Find existing booking
    const booking = bookings.find((b) => b.bookingID === bookingID);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Original booking not found" });
    }

    const oldTravel = travelOptions.find((t) => t.id === booking.travelID);
    const newTravel = travelOptions.find((t) => t.id === travelID);

    if (!oldTravel || !newTravel) {
      return res.status(404).json({
        success: false,
        message: "Old or new travel option not found",
      });
    }

    // Free old seats
    booking.seatNumbers.forEach((seatNum) => {
      const seat = oldTravel.seats.find((s) => s.seatNumber === seatNum);
      if (seat) {
        seat.booked = false;
        seat.passenger = null;
        oldTravel.availableSeats++;
      }
    });

    // Book new seats
    seatNumbers.forEach((seatNum) => {
      const seat = newTravel.seats.find((s) => s.seatNumber === seatNum);
      if (seat) {
        seat.booked = true;
        seat.passenger = booking.userHash; // use old userHash
        newTravel.availableSeats--;
      }
    });

    // Adjust agency balance
    const agency = agencies[newTravel.agencyId];
    if (agency) {
      const diff = totalPrice - booking.totalPrice;
      agency.balance += diff;
    }

    // Update booking fields
    booking.travelID = travelID;
    booking.seatNumbers = seatNumbers;
    booking.totalPrice = totalPrice;
    booking.updatedAt = updatedAt;

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: err.message,
    });
  }
};

export const receiveBookingCancel = async (req, res) => {
  const {
    bookingID,
    cancelledAt,
    travelID,
    seatNumbers,
    refundAmount,
    penalty,
  } = req.body;

  if (
    !bookingID ||
    !cancelledAt ||
    !travelID ||
    !seatNumbers ||
    typeof refundAmount !== "number" ||
    typeof penalty !== "number"
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

    const agency = agencies[travel.agencyId];
    if (agency) {
      agency.balance -= refundAmount;
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

export const cancelBooking = async (req, res) => {
  const agencyID = req.user.id;
  const { bookingID } = req.body;

  const booking = bookings.find((b) => b.bookingID === bookingID);
  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  const travel = travelOptions.find((t) => t.id === booking.travelID);
  if (!travel || travel.agencyId !== agencyID) {
    return res.status(403).json({
      success: false,
      message:
        "Unauthorized. Travel option not found or does not belong to this agency.",
    });
  }

  const travelDate = new Date(travel.date);
  const now = new Date();
  const hoursLeft = (travelDate - now) / (1000 * 60 * 60);

  let penalty = 0;
  if (hoursLeft < 24) {
    penalty = 20; // ₹20 penalty for late cancellation
  }

  const refundAmount = booking.totalPrice + penalty;
  if (refundAmount > 0) {
    agencies[agencyID].balance -= refundAmount;
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
    // Notify customer backend and update user balance
    await axios.post(
      `${process.env.CUSTOMER_BACKEND_URL}/api/travel/receive-cancel-booking`,
      booking
    );

    // Update on blockchain
    const hyperledgerResp = await axios.delete(
      `${process.env.HYPERLEDGER_REST_BASE_URL}/api/bookings/${bookingID}`,
      {
        headers: {
          "X-Api-Key": process.env.HYPERLEDGER_ORG2_APIKEY,
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
