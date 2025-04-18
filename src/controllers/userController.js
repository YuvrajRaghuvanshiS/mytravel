import { users } from "../db.js";

export const getCustomerInfo = (req, res) => {
  const userId = req.user.id;
  console.log("User ID:", userId);
  console.log(users);
  const user = users[userId];

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
};

export const updateCustomerProfile = async (req, res) => {
  const userId = req.user.id; // from JWT
  const { name, email, phone, isAnonymous } = req.body;

  if (!users[userId]) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!name && !email && !phone && !isAnonymous) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update",
    });
  }

  if (typeof isAnonymous !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isAnonymous must be a boolean (true or false)",
    });
  }

  // Update fields if provided
  if (name) users[userId].name = name;
  if (email) users[userId].email = email;
  if (phone) users[userId].phone = phone;
  if (typeof isAnonymous !== "boolean") users[userId].isAnonymous = isAnonymous;

  return res.status(201).json({
    success: true,
    message: "Customer profile updated successfully.",
    data: {
      id: users[userId].id,
      name: users[userId].name,
      email: users[userId].email,
      phone: users[userId].phone,
      isAnonymous: users[userId].isAnonymous,
    },
  });
};

export const deleteUserAccount = async (req, res) => {
  const userID = req.user.id;
  const user = users[userID];

  if (!user) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized user" });
  }

  const now = new Date();
  let totalRefund = 0;
  let totalPenalty = 0;
  const cancelledBookings = [];

  // Find all active (confirmed, future) bookings for this user
  const userBookings = bookings.filter(
    (b) => b.userHash === user.userHash && b.status === "confirmed"
  );

  for (const booking of userBookings) {
    const travel = travelOptions.find((t) => t.id === booking.travelID);
    if (!travel) continue;

    const travelDate = new Date(travel.date);
    if (travelDate < now) continue; // skip past bookings

    // Penalty logic: ₹20 penalty if cancelled within 24 hours of travel
    const hoursLeft = (travelDate - now) / (1000 * 60 * 60);
    let penalty = 0;
    if (hoursLeft < 24) penalty = 20;

    const refundAmount = booking.totalPrice - penalty;
    if (refundAmount > 0) user.balance -= refundAmount;

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
    booking.refundAmount = refundAmount;
    booking.penalty = penalty;
    booking.availableSeats = travel.availableSeats;

    totalRefund += refundAmount > 0 ? refundAmount : 0;
    totalPenalty += penalty;
    cancelledBookings.push(booking);

    // Notify travel agency backend
    try {
      await axios.post(
        `${process.env.TRAVEL_AGENCY_BACKEND_URL}/api/travel/receive-cancel-booking`,
        booking
      );

      // Update on blockchain
      await axios.delete(
        `${process.env.HYPERLEDGER_REST_BASE_URL}/api/bookings/${booking.bookingID}`,
        {
          headers: {
            "X-Api-Key": process.env.HYPERLEDGER_ORG1_APIKEY,
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

  // Remove user from users DB
  delete users[userID];

  return res.status(200).json({
    success: true,
    message: `User ${userID} deleted successfully.`,
    totalBookingsCancelled: cancelledBookings.length,
    totalRefunded: totalRefund,
    totalPenalty,
    cancelledBookings,
  });
};
