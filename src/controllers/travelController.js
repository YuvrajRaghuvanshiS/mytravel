const { travelOptions } = require("../db");

exports.addTravelOption = (req, res) => {
  const { agencyId, type, source, destination, date, time, price, seats } =
    req.body;

  if (
    !agencyId ||
    !type ||
    !source ||
    !destination ||
    !date ||
    !time ||
    !price ||
    !seats
  ) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const newTravel = {
    id: travelOptions.length + 1,
    agencyId,
    type,
    source,
    destination,
    date,
    time,
    price,
    seats,
    availableSeats: seats,
  };
  travelOptions.push(newTravel);

  res
    .status(201)
    .json({ success: true, message: "Travel option added", travel: newTravel });
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
