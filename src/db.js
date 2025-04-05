const agencies = {
  yrs: {
    id: "yrs",
    name: "Yuvraj",
    email: "yuvrajpr24@iitk.ac.in",
    phone: "8126744709",
    password: "$2b$10$NnacO/LElmHebTtyCDJ8o.bz/U.3R2g7rAqi28Lf9btXixNeLJGyW",
  },
  sbasia: {
    id: "sbasia",
    name: "Sahil",
    email: "bsahil24@iitk.ac.in",
    phone: "8126744709",
    password: "$2b$10$CyuezS77H4tSeR4Y6MaqQex5ogHYraKtnxj5Ez9i1v5Zn4mFQHSNK",
  },
}; // Stores registered travel agencies

const travelOptions = [
  {
    id: 1,
    agencyId: "sbasia",
    type: "train",
    source: "Boston",
    destination: "Chicago",
    date: "2025-04-10T00:00:00.000Z",
    departureTime: "2025-04-10T08:00:00.000Z",
    arrivalTime: "2025-04-10T16:00:00.000Z",
    reachTime: "2025-04-10T16:30:00.000Z",
    basePrice: 120,
    seats: [
      {
        seatNumber: "1A",
        price: 150,
        booked: false,
        passenger: null,
      },
      {
        seatNumber: "1B",
        price: 130,
        booked: false,
        passenger: null,
      },
      {
        seatNumber: "2A",
        price: 120,
        booked: false,
        passenger: null,
      },
    ],
    availableSeats: 3,
  },
  {
    id: 2,
    agencyId: "yrs",
    type: "train",
    source: "Boston",
    destination: "Chicago",
    date: "2025-04-10T00:00:00.000Z",
    departureTime: "2025-04-10T08:00:00.000Z",
    arrivalTime: "2025-04-10T16:00:00.000Z",
    reachTime: "2025-04-10T16:30:00.000Z",
    basePrice: 120,
    seats: [
      {
        seatNumber: "1A",
        price: 150,
        booked: false,
        passenger: null,
      },
      {
        seatNumber: "1B",
        price: 130,
        booked: false,
        passenger: null,
      },
      {
        seatNumber: "2A",
        price: 120,
        booked: false,
        passenger: null,
      },
    ],
    availableSeats: 3,
  },
]; // Stores travel options added by agencies

module.exports = { agencies, travelOptions };
