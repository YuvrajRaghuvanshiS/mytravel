// In memory database
export const users = {
  yrs: {
    id: "yrs",
    name: "Yuvraj",
    email: "yuvrajpr24@iitk.ac.in",
    phone: "8126744708",
    password: "$2b$10$I4Adw6Rw1xexMNMCcyv5V.j/Na.zYSFjw7vGeq.rOhaxpTJDC.mAa",
    isAnonymous: true,
  },
};

export let travelOptions = [
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

export const bookings = []; // Stores bookings made by users
