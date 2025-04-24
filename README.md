# MyTravel.com Travel Agency Backend

This component provides the backend API service for travel agency operations in the MyTravel.com ticket booking system.

## Overview

The travel agency backend is a Node.js/Express application that serves as the interface between travel agency frontend applications and the blockchain network. It handles agency-specific operations like registration, travel listing management, booking reception, and wallet operations.

## Architecture

The backend follows a Model-View-Controller (MVC) architectural pattern:

- **Controllers**: Handle request processing
- **Middleware**: Manage authentication and request validation
- **Routes**: Define API endpoints
- **Utils**: Provide helper functions

## Directory Structure

```
travel-agency-backend/
├── src/
│   ├── app.js                  # Express application setup
│   ├── server.js               # Server entry point
│   ├── db.js                   # Database connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication operations
│   │   ├── agencyController.js # Agency profile management
│   │   ├── travelController.js # Travel listing operations
│   │   └── walletController.js # Wallet and payment operations
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication endpoints
│   │   ├── agencyRoutes.js     # Agency profile endpoints
│   │   ├── travelRoutes.js     # Travel listing endpoints
│   │   └── walletRoutes.js     # Wallet endpoints
│   └── utils/
│       ├── jwt.js              # JWT token management
│       └── listings.js         # Helper for travel listings
├── docker/
│   └── Dockerfile              # For containerization
└── package.json                # Dependencies and scripts
```

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new travel agency

  ```json
  {
    "id": "agency123",
    "name": "Express Travels",
    "email": "info@expresstravels.com",
    "phone": "1234567890",
    "password": "securepassword"
  }
  ```

- **POST /api/auth/login**: Authenticate a travel agency
  ```json
  {
    "id": "agency123",
    "password": "securepassword"
  }
  ```

### Agency Profile

- **GET /api/agencies/me**: Get current agency profile
- **PUT /api/agencies/update-profile**: Update agency profile
  ```json
  {
    "name": "Express Travels International"
  }
  ```
- **DELETE /api/agencies/delete-agency**: Remove agency account

### Travel Listings

- **POST /api/travel/add**: Add a new travel listing
  ```json
  {
    "type": "train",
    "source": "Boston",
    "destination": "Chicago",
    "date": "2025-04-10",
    "departureTime": "08:00:00",
    "arrivalTime": "16:00:00",
    "reachTime": "16:30:00",
    "basePrice": 120,
    "seats": [
      { "seatNumber": "1A", "price": 150 },
      { "seatNumber": "1B", "price": 130 },
      { "seatNumber": "2A", "price": 120 }
    ]
  }
  ```
- **PUT /api/travel/update/:id**: Update a travel listing
  ```json
  {
    "date": "2025-04-12",
    "departureTime": "10:00:00",
    "arrivalTime": "18:00:00",
    "reachTime": "18:30:00",
    "basePrice": 100,
    "seats": [
      { "seatNumber": "3A", "price": 120 },
      { "seatNumber": "3B", "price": 110 }
    ]
  }
  ```
- **GET /api/travel/list**: List travel listings of current agency (with filtering)

### Booking Management

- **POST /api/travel/receive-booking**: Receive and process a new booking from customer backend
  ```json
  {
    "bookingID": "book_1745466906848_dc4ayujpp",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "cancelledAt": "",
    "userHash": "7b2952e91329fff26103b091e6f...",
    "isAnonymous": false,
    "userID": "user123", // or "" if user is anonymous
    "agencyID": "agency123",
    "travelID": 1,
    "seatNumbers": ["2A"],
    "totalPrice": 150,
    "transactionID": "txn_1745466906848_abcdef",
    "status": "confirmed",
    "refundAmount": 0,
    "penalty": 0
  }
  ```
- **GET /api/travel/get-all-bookings**: Get all bookings for the agency's travel listings
- **DELETE /api/travel/book**: Cancel/delete a booking
  ```json
  {
    "bookingID": "book_1745466906848_dc4ayujpp"
  }
  ```

### Wallet

- **POST /api/wallet/add-money**: Add money to agency wallet
  ```json
  {
    "amount": 500
  }
  ```

## Setup and Installation

### Prerequisites

- Node.js v14+
- MongoDB
- Access to the blockchain REST API

### Environment Variables

Create a `.env` file with the following variables:

```
PORT=3002
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d


CUSTOMER_BACKEND_URL=http://localhost:3001
HYPERLEDGER_ORG2_APIKEY=BC42E734-062D-4AEE-A591-5973CB763430
HYPERLEDGER_REST_BASE_URL=http://fabric-rest-sample.localho.st
```

### Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server in development mode:

   ```bash
   npm run dev
   ```

3. The API will be available at `http://localhost:3002`

### Production Deployment

Using Docker:

```bash
# Build the image
docker build -t mytravel/agency-backend:latest -f docker/Dockerfile .

# Run the container
docker run -d \
  -p 3002:3002 \
  --env-file .env \
  --name mytravel-agency-api \
  mytravel/agency-backend:latest
```

## Authentication and Authorization

The backend uses JWT (JSON Web Tokens) for authentication:

1. Agency logs in with credentials
2. Server validates credentials and issues a JWT
3. Client includes JWT in Authorization header for protected routes
4. Server verifies JWT and authorizes access

Example protected request:

```
GET /api/agencies/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Data Flow

1. Agency makes request to backend API
2. Backend validates request and authenticates agency
3. For blockchain operations, backend calls the customer network interface API
4. Backend processes response and returns data to agency

## Dynamic Pricing

The system supports dynamic pricing for travel listings:

- Base price can be adjusted based on demand
- Individual seats can have different price points
- ToDo: Special discounts can be applied based on booking time
- ToDo: Price can increase as availability decreases

## Error Handling

The API returns standard HTTP status codes:

- 200: Success
- 400: Bad request
- 401: Unauthorized
- 404: Resource not found
- 500: Server error

All error responses include a JSON object with:

```json
{
  "error": "Error description"
}
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens have expiration
- Input validation for all requests

## Database Schema

### Agencies Collection

```json
{
  "id": "agency123",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-02T00:00:00Z",
  "name": "Express Travels",
  "email": "info@expresstravels.com",
  "phone": "1234567890",
  "password": "hashed_password",
  "rating": 4.5,
  "balance": 10000
}
```

### Travel Listings Collection

```json
{
  "id": 1,
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-02T00:00:00Z",
  "agencyId": "agency123",
  "type": "train",
  "source": "Boston",
  "destination": "Chicago",
  "date": "2025-04-10",
  "departureTime": "08:00:00",
  "arrivalTime": "16:00:00",
  "reachTime": "16:30:00",
  "basePrice": 120,
  "seats": [
    { "seatNumber": "1A", "price": 150, "booked": false },
    { "seatNumber": "1B", "price": 130, "booked": false },
    { "seatNumber": "2A", "price": 120, "booked": true }
  ]
}
```
