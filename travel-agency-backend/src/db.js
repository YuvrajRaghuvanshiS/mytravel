export const agencies = {
  akashtravels: {
    id: "akashtravels",
    createdAt: "2025-04-27T07:04:29.727Z",
    updatedAt: "2025-04-27T07:04:29.727Z",
    name: "Akash Travels",
    email: "akashtravelsgmail.com",
    phone: "9620995313",
    password: "$2b$10$fo7wMJwlGrOns72Cb9CEyuLfOoFnRNJiIWC9zOsYkldAgBxrKhGnC",
    gstNumber: "27DWWZW7364F1Z5",
    contactPerson: "Akash Singh",
    address: "4336 Reese Ferry, Mumbai, Maharashtra, India - 400001",
    agencyType: "private",
    balance: 1000,
    rating: {
      totalRatings: 95,
      totalScore: 364,
    },
  },
  rajdhaniexpress: {
    id: "rajdhaniexpress",
    createdAt: "2025-04-27T07:04:29.809Z",
    updatedAt: "2025-04-27T07:04:29.809Z",
    name: "Rajdhani Express",
    email: "rajdhaniexpressgmail.com",
    phone: "9241253803",
    password: "$2b$10$LkPtaEKCnw1.6MATv4ppgeEJLASUCavbr24BXKohMi6HSYi4XtRNa",
    gstNumber: "27DRIZV7761F1Z5",
    contactPerson: "Deepak Kumar",
    address: "67477 Vida Springs, Delhi, Delhi, India - 110001",
    agencyType: "private",
    balance: 1000,
    rating: {
      totalRatings: 64,
      totalScore: 315,
    },
  },
  goindiatours: {
    id: "goindiatours",
    createdAt: "2025-04-27T07:04:29.894Z",
    updatedAt: "2025-04-27T07:04:29.894Z",
    name: "Go India Tours",
    email: "goindiatoursgmail.com",
    phone: "9212183864",
    password: "$2b$10$PiqS2WKAO2koRQvmBH4Plevj5RoSXVY2LcHxc3wh3nKeI2u4kIZBO",
    gstNumber: "27FOWCX6307F1Z5",
    contactPerson: "Sunita Sharma",
    address: "9052 Kristy Garden, Bengaluru, Karnataka, India - 560001",
    agencyType: "private",
    balance: 1000,
    rating: {
      totalRatings: 100,
      totalScore: 329,
    },
  },
  vijayroadways: {
    id: "vijayroadways",
    createdAt: "2025-04-27T07:04:29.967Z",
    updatedAt: "2025-04-27T07:04:29.967Z",
    name: "Vijay Roadways",
    email: "vijayroadwaysgmail.com",
    phone: "9355249409",
    password: "$2b$10$ClnitS3PaozTOd5al5uW8OyCVpsly.H4CDNwzIBFP5cYh1ibfqUH2",
    gstNumber: "27NRNPD8266F1Z5",
    contactPerson: "Vijay Verma",
    address: "8028 East Street, Chennai, Tamil Nadu, India - 600001",
    agencyType: "private",
    balance: 1000,
    rating: {
      totalRatings: 43,
      totalScore: 75,
    },
  },
  shreeganeshholidays: {
    id: "shreeganeshholidays",
    createdAt: "2025-04-27T07:04:30.038Z",
    updatedAt: "2025-04-27T07:04:30.038Z",
    name: "Shree Ganesh Holidays",
    email: "shreeganeshholidaysgmail.com",
    phone: "9709935072",
    password: "$2b$10$S.mCXcK4IBrQTLeDP8Tp/e2k2Ht1hE8DCQDbY5mYQxvmgUEIPX2TG",
    gstNumber: "27PNZVE6561F1Z5",
    contactPerson: "Rajendra Singh",
    address: "379 Heather Close, Kolkata, West Bengal, India - 700001",
    agencyType: "private",
    balance: 1000,
    rating: {
      totalRatings: 87,
      totalScore: 103,
    },
  },
};

export let travelOptions = [
  {
    id: 1,
    agencyId: "akashtravels",
    type: "flight",
    source: "IIT Delhi",
    destination: "IIT Kanpur",
    date: "2025-04-30T00:00:00.000Z",
    departureTime: "2025-04-30T08:10:00.000Z",
    arrivalTime: "2025-04-30T08:00:00.000Z",
    reachTime: "2025-04-30T13:00:00.000Z",
    basePrice: 2000,
    seats: [
      {
        seatNumber: "1B",
        price: 2000,
      },
      {
        seatNumber: "1A",
        price: 2000,
      },
      {
        seatNumber: "1D",
        price: 2000,
      },
      {
        seatNumber: "1C",
        price: 2000,
      },
      {
        seatNumber: "2A",
        price: 2000,
      },
      {
        seatNumber: "2B",
        price: 2000,
      },
      {
        seatNumber: "2C",
        price: 2000,
      },
      {
        seatNumber: "2D",
        price: 2000,
      },
      {
        seatNumber: "3A",
        price: 2000,
      },
      {
        seatNumber: "3B",
        price: 2000,
      },
      {
        seatNumber: "3C",
        price: 2000,
      },
      {
        seatNumber: "3D",
        price: 2000,
      },
      {
        seatNumber: "4A",
        price: 2000,
      },
      {
        seatNumber: "4B",
        price: 2000,
      },
      {
        seatNumber: "4C",
        price: 2400,
      },
      {
        seatNumber: "4D",
        price: 2400,
      },
      {
        seatNumber: "5A",
        price: 2500,
      },
      {
        seatNumber: "5B",
        price: 2500,
      },
      {
        seatNumber: "5C",
        price: 2600,
      },
      {
        seatNumber: "5D",
        price: 2600,
      },
    ],
    availableSeats: 20,
  },
  {
    id: 2,
    agencyId: "akashtravels",
    type: "bus",
    source: "IIT Delhi",
    destination: "IIT Rorkee",
    date: "2025-04-30T00:00:00.000Z",
    departureTime: "2025-04-30T00:20:00.000Z",
    arrivalTime: "2025-04-30T00:00:00.000Z",
    reachTime: "2025-04-30T06:00:00.000Z",
    basePrice: 1000,
    seats: [
      {
        seatNumber: "1A",
        price: 1500,
      },
      {
        seatNumber: "1C",
        price: 1500,
      },
      {
        seatNumber: "1D",
        price: 1500,
      },
      {
        seatNumber: "2A",
        price: 1500,
      },
      {
        seatNumber: "2B",
        price: 1500,
      },
      {
        seatNumber: "2C",
        price: 1500,
      },
      {
        seatNumber: "2D",
        price: 1500,
      },
      {
        seatNumber: "3A",
        price: 1000,
      },
      {
        seatNumber: "3B",
        price: 1000,
      },
      {
        seatNumber: "3C",
        price: 1400,
      },
      {
        seatNumber: "3D",
        price: 1400,
      },
      {
        seatNumber: "4B",
        price: 1000,
      },
      {
        seatNumber: "4A",
        price: 1000,
      },
      {
        seatNumber: "4C",
        price: 1000,
      },
      {
        seatNumber: "4D",
        price: 1000,
      },
      {
        seatNumber: "5C",
        price: 1000,
      },
      {
        seatNumber: "5D",
        price: 1000,
      },
      {
        seatNumber: "5A",
        price: 1000,
      },
      {
        seatNumber: "5B",
        price: 1000,
      },
      {
        seatNumber: "1B",
        price: 1500,
      },
    ],
    availableSeats: 20,
  },
  {
    id: 3,
    agencyId: "akashtravels",
    type: "train",
    source: "IIT Bombay",
    destination: "IIT Kanpur",
    date: "2025-05-01T00:00:00.000Z",
    departureTime: "2025-05-01T01:25:00.000Z",
    arrivalTime: "2025-05-01T01:10:00.000Z",
    reachTime: "2025-05-01T09:00:00.000Z",
    basePrice: 1200,
    seats: [
      {
        seatNumber: "1A",
        price: 1200,
      },
      {
        seatNumber: "1B",
        price: 1200,
      },
      {
        seatNumber: "2A",
        price: 1200,
      },
      {
        seatNumber: "2B",
        price: 1200,
      },
      {
        seatNumber: "3A",
        price: 1300,
      },
      {
        seatNumber: "3B",
        price: 1300,
      },
      {
        seatNumber: "4A",
        price: 1400,
      },
      {
        seatNumber: "4B",
        price: 1400,
      },
      {
        seatNumber: "5A",
        price: 1500,
      },
      {
        seatNumber: "5B",
        price: 1500,
      },
      {
        seatNumber: "1C",
        price: 1200,
      },
      {
        seatNumber: "1D",
        price: 1200,
      },
      {
        seatNumber: "2C",
        price: 1200,
      },
      {
        seatNumber: "2D",
        price: 1200,
      },
      {
        seatNumber: "3C",
        price: 1300,
      },
      {
        seatNumber: "3D",
        price: 1300,
      },
      {
        seatNumber: "4C",
        price: 1400,
      },
      {
        seatNumber: "4D",
        price: 1400,
      },
      {
        seatNumber: "5C",
        price: 1500,
      },
      {
        seatNumber: "5D",
        price: 1500,
      },
      {
        seatNumber: "6A",
        price: 1800,
      },
      {
        seatNumber: "6B",
        price: 1800,
      },
      {
        seatNumber: "6C",
        price: 1900,
      },
      {
        seatNumber: "6D",
        price: 1900,
      },
    ],
    availableSeats: 24,
  },
  {
    id: 4,
    agencyId: "rajdhaniexpress",
    type: "flight",
    source: "IIT Rorkee",
    destination: "IIT Kanpur",
    date: "2025-04-29T00:00:00.000Z",
    departureTime: "2025-04-29T17:10:00.000Z",
    arrivalTime: "2025-04-29T17:00:00.000Z",
    reachTime: "2025-04-29T23:00:00.000Z",
    basePrice: 2500,
    seats: [
      {
        seatNumber: "1B",
        price: 2500,
      },
      {
        seatNumber: "1A",
        price: 2500,
      },
      {
        seatNumber: "1C",
        price: 2500,
      },
      {
        seatNumber: "1D",
        price: 2500,
      },
      {
        seatNumber: "2A",
        price: 2500,
      },
      {
        seatNumber: "2B",
        price: 2500,
      },
      {
        seatNumber: "2D",
        price: 2500,
      },
      {
        seatNumber: "2C",
        price: 2500,
      },
      {
        seatNumber: "3C",
        price: 2500,
      },
      {
        seatNumber: "3D",
        price: 2500,
      },
      {
        seatNumber: "3A",
        price: 2500,
      },
      {
        seatNumber: "3B",
        price: 2500,
      },
      {
        seatNumber: "4A",
        price: 2500,
      },
      {
        seatNumber: "4B",
        price: 2500,
      },
      {
        seatNumber: "4C",
        price: 2500,
      },
      {
        seatNumber: "4D",
        price: 2500,
      },
      {
        seatNumber: "6A",
        price: 2500,
      },
      {
        seatNumber: "6B",
        price: 2500,
      },
      {
        seatNumber: "6C",
        price: 2500,
      },
      {
        seatNumber: "6D",
        price: 2500,
      },
    ],
    availableSeats: 20,
  },
  {
    id: 5,
    agencyId: "rajdhaniexpress",
    type: "train",
    source: "IIT Rorkee",
    destination: "IIT Bombay",
    date: "2025-04-30T00:00:00.000Z",
    departureTime: "2025-04-30T05:20:00.000Z",
    arrivalTime: "2025-04-30T05:00:00.000Z",
    reachTime: "2025-04-30T15:00:00.000Z",
    basePrice: 1500,
    seats: [
      {
        seatNumber: "1A",
        price: 1500,
      },
      {
        seatNumber: "1B",
        price: 1500,
      },
      {
        seatNumber: "1C",
        price: 1500,
      },
      {
        seatNumber: "1D",
        price: 1500,
      },
      {
        seatNumber: "2A",
        price: 1600,
      },
      {
        seatNumber: "2B",
        price: 1600,
      },
      {
        seatNumber: "2C",
        price: 1600,
      },
      {
        seatNumber: "2D",
        price: 1600,
      },
      {
        seatNumber: "3A",
        price: 1700,
      },
      {
        seatNumber: "3C",
        price: 1700,
      },
      {
        seatNumber: "3B",
        price: 1700,
      },
      {
        seatNumber: "3D",
        price: 1700,
      },
      {
        seatNumber: "4A",
        price: 1800,
      },
      {
        seatNumber: "4B",
        price: 1800,
      },
      {
        seatNumber: "4C",
        price: 1800,
      },
      {
        seatNumber: "4D",
        price: 1800,
      },
      {
        seatNumber: "5A",
        price: 1500,
      },
      {
        seatNumber: "5B",
        price: 1500,
      },
      {
        seatNumber: "5C",
        price: 1500,
      },
      {
        seatNumber: "5D",
        price: 1500,
      },
    ],
    availableSeats: 20,
  },
  {
    id: 6,
    agencyId: "rajdhaniexpress",
    type: "bus",
    source: "IIT Bombay",
    destination: "IIT Kharagpur",
    date: "2025-05-01T00:00:00.000Z",
    departureTime: "2025-05-01T02:20:00.000Z",
    arrivalTime: "2025-05-01T02:00:00.000Z",
    reachTime: "2025-05-01T13:00:00.000Z",
    basePrice: 800,
    seats: [
      {
        seatNumber: "1A",
        price: 800,
      },
      {
        seatNumber: "1B",
        price: 800,
      },
      {
        seatNumber: "2A",
        price: 900,
      },
      {
        seatNumber: "2B",
        price: 900,
      },
      {
        seatNumber: "3A",
        price: 1000,
      },
      {
        seatNumber: "3B",
        price: 1000,
      },
      {
        seatNumber: "4A",
        price: 1100,
      },
      {
        seatNumber: "4B",
        price: 1100,
      },
      {
        seatNumber: "5A",
        price: 1000,
      },
      {
        seatNumber: "5B",
        price: 1000,
      },
      {
        seatNumber: "5C",
        price: 1000,
      },
      {
        seatNumber: "4C",
        price: 1200,
      },
      {
        seatNumber: "4D",
        price: 1200,
      },
      {
        seatNumber: "5D",
        price: 1000,
      },
      {
        seatNumber: "3D",
        price: 1000,
      },
      {
        seatNumber: "3C",
        price: 1000,
      },
      {
        seatNumber: "2C",
        price: 900,
      },
      {
        seatNumber: "2D",
        price: 900,
      },
      {
        seatNumber: "1D",
        price: 800,
      },
      {
        seatNumber: "1C",
        price: 800,
      },
    ],
    availableSeats: 20,
  },
  {
    id: 7,
    agencyId: "goindiatours",
    type: "flight",
    source: "IIT Bombay",
    destination: "IIT Madras",
    date: "2025-04-29T00:00:00.000Z",
    departureTime: "2025-04-29T13:10:00.000Z",
    arrivalTime: "2025-04-29T13:00:00.000Z",
    reachTime: "2025-04-29T20:00:00.000Z",
    basePrice: 3000,
    seats: [
      {
        seatNumber: "1A",
        price: 3000,
      },
      {
        seatNumber: "1B",
        price: 3000,
      },
      {
        seatNumber: "1C",
        price: 3000,
      },
      {
        seatNumber: "1D",
        price: 3000,
      },
      {
        seatNumber: "2D",
        price: 3000,
      },
      {
        seatNumber: "2C",
        price: 3000,
      },
      {
        seatNumber: "2B",
        price: 3000,
      },
      {
        seatNumber: "2A",
        price: 3000,
      },
      {
        seatNumber: "3A",
        price: 3000,
      },
      {
        seatNumber: "3B",
        price: 3000,
      },
      {
        seatNumber: "3C",
        price: 3000,
      },
      {
        seatNumber: "3D",
        price: 3000,
      },
      {
        seatNumber: "4C",
        price: 3000,
      },
      {
        seatNumber: "4D",
        price: 3000,
      },
      {
        seatNumber: "4B",
        price: 3000,
      },
      {
        seatNumber: "4A",
        price: 3000,
      },
      {
        seatNumber: "5A",
        price: 3000,
      },
      {
        seatNumber: "5B",
        price: 3000,
      },
      {
        seatNumber: "5C",
        price: 3000,
      },
      {
        seatNumber: "5D",
        price: 3000,
      },
    ],
    availableSeats: 20,
  },
  {
    id: 8,
    agencyId: "goindiatours",
    type: "bus",
    source: "IIT Kharagpur",
    destination: "IIT Bombay",
    date: "2025-04-30T00:00:00.000Z",
    departureTime: "2025-04-30T09:20:00.000Z",
    arrivalTime: "2025-04-30T09:00:00.000Z",
    reachTime: "2025-04-30T14:00:00.000Z",
    basePrice: 1500,
    seats: [
      {
        seatNumber: "1A",
        price: 1500,
      },
      {
        seatNumber: "1B",
        price: 1500,
      },
      {
        seatNumber: "1C",
        price: 1500,
      },
      {
        seatNumber: "1D",
        price: 1500,
      },
      {
        seatNumber: "2A",
        price: 1500,
      },
      {
        seatNumber: "2B",
        price: 1500,
      },
      {
        seatNumber: "2C",
        price: 1500,
      },
      {
        seatNumber: "2D",
        price: 1500,
      },
      {
        seatNumber: "3A",
        price: 2000,
      },
      {
        seatNumber: "3B",
        price: 2000,
      },
      {
        seatNumber: "3C",
        price: 2000,
      },
      {
        seatNumber: "3D",
        price: 2000,
      },
      {
        seatNumber: "4C",
        price: 2200,
      },
      {
        seatNumber: "4D",
        price: 2200,
      },
      {
        seatNumber: "4A",
        price: 2200,
      },
      {
        seatNumber: "4B",
        price: 2200,
      },
    ],
    availableSeats: 16,
  },
  {
    id: 9,
    agencyId: "goindiatours",
    type: "train",
    source: "IIT Rorkee",
    destination: "IIT Kharagpur",
    date: "2025-05-01T00:00:00.000Z",
    departureTime: "2025-05-01T10:15:00.000Z",
    arrivalTime: "2025-05-01T10:00:00.000Z",
    reachTime: "2025-05-01T20:00:00.000Z",
    basePrice: 2000,
    seats: [
      {
        seatNumber: "2A",
        price: 2500,
      },
      {
        seatNumber: "2B",
        price: 2500,
      },
      {
        seatNumber: "2C",
        price: 2600,
      },
      {
        seatNumber: "2D",
        price: 2600,
      },
      {
        seatNumber: "3A",
        price: 2400,
      },
      {
        seatNumber: "3B",
        price: 2400,
      },
      {
        seatNumber: "3C",
        price: 2450,
      },
      {
        seatNumber: "3D",
        price: 2450,
      },
      {
        seatNumber: "4A",
        price: 2300,
      },
      {
        seatNumber: "4B",
        price: 2300,
      },
      {
        seatNumber: "4C",
        price: 2300,
      },
      {
        seatNumber: "4D",
        price: 2300,
      },
      {
        seatNumber: "5A",
        price: 2000,
      },
      {
        seatNumber: "5B",
        price: 2000,
      },
      {
        seatNumber: "5C",
        price: 2000,
      },
      {
        seatNumber: "5D",
        price: 2000,
      },
      {
        seatNumber: "6D",
        price: 2000,
      },
      {
        seatNumber: "6C",
        price: 2000,
      },
      {
        seatNumber: "6B",
        price: 2000,
      },
      {
        seatNumber: "6A",
        price: 2000,
      },
    ],
    availableSeats: 20,
  },
  {
    id: 10,
    agencyId: "shreeganeshholidays",
    type: "flight",
    source: "IIT Kanpur",
    destination: "IIT Kharagpur",
    date: "2025-05-01T00:00:00.000Z",
    departureTime: "2025-05-01T13:30:00.000Z",
    arrivalTime: "2025-05-01T13:00:00.000Z",
    reachTime: "2025-05-01T16:00:00.000Z",
    basePrice: 3500,
    seats: [
      {
        seatNumber: "1A",
        price: 3500,
      },
      {
        seatNumber: "1B",
        price: 3500,
      },
      {
        seatNumber: "1C",
        price: 45000,
      },
      {
        seatNumber: "1D",
        price: 3500,
      },
      {
        seatNumber: "2A",
        price: 3500,
      },
      {
        seatNumber: "2B",
        price: 3500,
      },
      {
        seatNumber: "2C",
        price: 45000,
      },
      {
        seatNumber: "2D",
        price: 3500,
      },
      {
        seatNumber: "3D",
        price: 4000,
      },
      {
        seatNumber: "3C",
        price: 45000,
      },
      {
        seatNumber: "3B",
        price: 4000,
      },
      {
        seatNumber: "3A",
        price: 4000,
      },
      {
        seatNumber: "4A",
        price: 4000,
      },
      {
        seatNumber: "4B",
        price: 4000,
      },
      {
        seatNumber: "4C",
        price: 45000,
      },
      {
        seatNumber: "4D",
        price: 4000,
      },
    ],
    availableSeats: 16,
  },
  {
    id: 11,
    agencyId: "shreeganeshholidays",
    type: "bus",
    source: "IIT Delhi",
    destination: "IIT Rorkee",
    date: "2025-04-29T00:00:00.000Z",
    departureTime: "2025-04-29T12:15:00.000Z",
    arrivalTime: "2025-04-29T12:00:00.000Z",
    reachTime: "2025-04-29T18:00:00.000Z",
    basePrice: 1500,
    seats: [
      {
        seatNumber: "1A",
        price: 1500,
      },
      {
        seatNumber: "2A",
        price: 1500,
      },
      {
        seatNumber: "1B",
        price: 1500,
      },
      {
        seatNumber: "2B",
        price: 1500,
      },
      {
        seatNumber: "3A",
        price: 1500,
      },
      {
        seatNumber: "3B",
        price: 1500,
      },
      {
        seatNumber: "4A",
        price: 1500,
      },
      {
        seatNumber: "4B",
        price: 1500,
      },
      {
        seatNumber: "5A",
        price: 2000,
      },
      {
        seatNumber: "5B",
        price: 2000,
      },
      {
        seatNumber: "6A",
        price: 2000,
      },
      {
        seatNumber: "6B",
        price: 2000,
      },
      {
        seatNumber: "1C",
        price: 2500,
      },
      {
        seatNumber: "1D",
        price: 2500,
      },
      {
        seatNumber: "2D",
        price: 1500,
      },
      {
        seatNumber: "2C",
        price: 2500,
      },
    ],
    availableSeats: 16,
  },
  {
    id: 12,
    agencyId: "shreeganeshholidays",
    type: "train",
    source: "IIT Delhi",
    destination: "IIT Kanpur",
    date: "2025-04-30T00:00:00.000Z",
    departureTime: "2025-04-30T17:10:00.000Z",
    arrivalTime: "2025-04-30T17:00:00.000Z",
    reachTime: "2025-04-30T23:50:00.000Z",
    basePrice: 1200,
    seats: [
      {
        seatNumber: "1A",
        price: 1200,
      },
      {
        seatNumber: "1B",
        price: 1200,
      },
      {
        seatNumber: "1C",
        price: 1200,
      },
      {
        seatNumber: "1D",
        price: 1200,
      },
      {
        seatNumber: "2A",
        price: 1200,
      },
      {
        seatNumber: "2B",
        price: 1200,
      },
      {
        seatNumber: "2C",
        price: 1200,
      },
      {
        seatNumber: "2D",
        price: 1200,
      },
      {
        seatNumber: "3A",
        price: 1200,
      },
      {
        seatNumber: "3B",
        price: 1200,
      },
      {
        seatNumber: "3C",
        price: 1200,
      },
      {
        seatNumber: "3D",
        price: 1200,
      },
      {
        seatNumber: "4A",
        price: 1800,
      },
      {
        seatNumber: "4B",
        price: 1800,
      },
      {
        seatNumber: "4C",
        price: 1800,
      },
      {
        seatNumber: "4D",
        price: 1800,
      },
      {
        seatNumber: "5A",
        price: 1800,
      },
      {
        seatNumber: "5B",
        price: 1800,
      },
      {
        seatNumber: "5C",
        price: 1800,
      },
      {
        seatNumber: "5D",
        price: 1800,
      },
      {
        seatNumber: "6A",
        price: 1800,
      },
      {
        seatNumber: "6B",
        price: 1800,
      },
      {
        seatNumber: "6C",
        price: 1800,
      },
      {
        seatNumber: "6D",
        price: 1800,
      },
    ],
    availableSeats: 24,
  },
  {
    id: 13,
    agencyId: "vijayroadways",
    type: "flight",
    source: "IIT Bombay",
    destination: "IIT Delhi",
    date: "2025-04-29T00:00:00.000Z",
    departureTime: "2025-04-29T00:45:00.000Z",
    arrivalTime: "2025-04-29T00:30:00.000Z",
    reachTime: "2025-04-29T05:00:00.000Z",
    basePrice: 3500,
    seats: [
      {
        seatNumber: "1A",
        price: 3800,
      },
      {
        seatNumber: "1B",
        price: 3500,
      },
      {
        seatNumber: "1C",
        price: 3500,
      },
      {
        seatNumber: "1D",
        price: 3800,
      },
      {
        seatNumber: "2A",
        price: 3800,
      },
      {
        seatNumber: "2B",
        price: 3500,
      },
      {
        seatNumber: "2C",
        price: 3500,
      },
      {
        seatNumber: "2D",
        price: 3800,
      },
      {
        seatNumber: "3A",
        price: 3800,
      },
      {
        seatNumber: "3B",
        price: 3500,
      },
      {
        seatNumber: "3C",
        price: 3500,
      },
      {
        seatNumber: "3D",
        price: 3800,
      },
      {
        seatNumber: "4A",
        price: 3800,
      },
      {
        seatNumber: "4B",
        price: 3500,
      },
      {
        seatNumber: "4C",
        price: 3500,
      },
      {
        seatNumber: "5A",
        price: 3800,
      },
      {
        seatNumber: "5B",
        price: 3500,
      },
      {
        seatNumber: "5C",
        price: 3500,
      },
      {
        seatNumber: "5D",
        price: 3800,
      },
      {
        seatNumber: "6A",
        price: 3800,
      },
      {
        seatNumber: "6B",
        price: 3500,
      },
      {
        seatNumber: "6C",
        price: 3500,
      },
      {
        seatNumber: "6D",
        price: 3800,
      },
      {
        seatNumber: "4D",
        price: 3800,
      },
    ],
    availableSeats: 24,
  },
  {
    id: 14,
    agencyId: "vijayroadways",
    type: "bus",
    source: "IIT Delhi",
    destination: "IIT Rorkee",
    date: "2025-05-01T00:00:00.000Z",
    departureTime: "2025-05-01T17:20:00.000Z",
    arrivalTime: "2025-05-01T17:00:00.000Z",
    reachTime: "2025-05-01T21:30:00.000Z",
    basePrice: 1000,
    seats: [
      {
        seatNumber: "1A",
        price: 1100,
      },
      {
        seatNumber: "1B",
        price: 1000,
      },
      {
        seatNumber: "1C",
        price: 1100,
      },
      {
        seatNumber: "1D",
        price: 1000,
      },
      {
        seatNumber: "2A",
        price: 1100,
      },
      {
        seatNumber: "2B",
        price: 1100,
      },
      {
        seatNumber: "2C",
        price: 1100,
      },
      {
        seatNumber: "2D",
        price: 1100,
      },
      {
        seatNumber: "3A",
        price: 1200,
      },
      {
        seatNumber: "3B",
        price: 1200,
      },
      {
        seatNumber: "3C",
        price: 1200,
      },
      {
        seatNumber: "3D",
        price: 1200,
      },
      {
        seatNumber: "4A",
        price: 1300,
      },
      {
        seatNumber: "4B",
        price: 1300,
      },
      {
        seatNumber: "4C",
        price: 1300,
      },
      {
        seatNumber: "4D",
        price: 1300,
      },
      {
        seatNumber: "5A",
        price: 1000,
      },
      {
        seatNumber: "5B",
        price: 1000,
      },
      {
        seatNumber: "5C",
        price: 1000,
      },
      {
        seatNumber: "5D",
        price: 1000,
      },
    ],
    availableSeats: 20,
  },
  {
    id: 15,
    agencyId: "vijayroadways",
    type: "train",
    source: "IIT Kanpur",
    destination: "IIT Bombay",
    date: "2025-04-30T00:00:00.000Z",
    departureTime: "2025-04-30T14:30:00.000Z",
    arrivalTime: "2025-04-30T14:00:00.000Z",
    reachTime: "2025-04-30T21:50:00.000Z",
    basePrice: 1400,
    seats: [
      {
        seatNumber: "1A",
        price: 1400,
      },
      {
        seatNumber: "1B",
        price: 1400,
      },
      {
        seatNumber: "1C",
        price: 1400,
      },
      {
        seatNumber: "1D",
        price: 1400,
      },
      {
        seatNumber: "2D",
        price: 1400,
      },
      {
        seatNumber: "2C",
        price: 1400,
      },
      {
        seatNumber: "2B",
        price: 1400,
      },
      {
        seatNumber: "2A",
        price: 1400,
      },
      {
        seatNumber: "3A",
        price: 1400,
      },
      {
        seatNumber: "3B",
        price: 1400,
      },
      {
        seatNumber: "3C",
        price: 1400,
      },
      {
        seatNumber: "3D",
        price: 1400,
      },
      {
        seatNumber: "4D",
        price: 1600,
      },
      {
        seatNumber: "4C",
        price: 1600,
      },
      {
        seatNumber: "5B",
        price: 1500,
      },
      {
        seatNumber: "5A",
        price: 1500,
      },
      {
        seatNumber: "5C",
        price: 1500,
      },
      {
        seatNumber: "5D",
        price: 1500,
      },
    ],
    availableSeats: 18,
  },
  {
    id: 16,
    agencyId: "akashtravels",
    type: "flight",
    source: "IIT Delhi",
    destination: "IIT Kanpur",
    date: "2025-04-28T00:00:00.000Z",
    departureTime: "2025-04-28T08:05:00.000Z",
    arrivalTime: "2025-04-28T08:00:00.000Z",
    reachTime: "2025-04-28T14:00:00.000Z",
    basePrice: 200,
    seats: [
      {
        seatNumber: "1A",
        price: 200,
      },
      {
        seatNumber: "1B",
        price: 200,
      },
      {
        seatNumber: "2B",
        price: 200,
      },
    ],
    availableSeats: 3,
  },
];

export const bookings = []; // Stores bookings made by users
