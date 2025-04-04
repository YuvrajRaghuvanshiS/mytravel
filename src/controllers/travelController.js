const { travelOptions } = require("../db");

exports.addTravelOption = (req, res) => {
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

    if (departure >= arrival || arrival >= reach) {
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

exports.updateTravelOption = (req, res) => {
  const { id } = req.params;
  const { price, seats } = req.body;
  const travel = travelOptions.find((t) => t.id === parseInt(id));

  if (!travel)
    return res
      .status(404)
      .json({ success: false, message: "Travel option not found" });

  if (price) travel.price = price;
  if (seats) travel.availableSeats = seats;

  res
    .status(200)
    .json({ success: true, message: "Travel option updated", travel });
};

exports.removeTravelOption = (req, res) => {
  const { id } = req.params;
  const index = travelOptions.findIndex((t) => t.id === parseInt(id));

  if (index === -1)
    return res
      .status(404)
      .json({ success: false, message: "Travel option not found" });

  travelOptions.splice(index, 1);
  res.status(200).json({ success: true, message: "Travel option removed" });
};
