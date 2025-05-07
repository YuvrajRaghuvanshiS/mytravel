# MyTravel.com Customer Backend

This component provides the backend API service for customer operations in the MyTravel.com ticket booking system.

## Overview

The customer backend is a Node.js/Express application that serves as the interface between customer frontend applications and the blockchain network via the custom network interface API. It handles customer-specific operations like registration, authentication, profile management, ticket booking, and wallet operations.

## Architecture

The backend follows a Model-View-Controller (MVC) architectural pattern:

- **Controllers**: Handle request processing
- **Middleware**: Manage authentication and request validation
- **Routes**: Define API endpoints
- **Utils**: Provide helper functions

## Directory Structure

```
customer-backend/
├── src/
│   ├── app.js                  # Express application setup
│   ├── server.js               # Server entry point
│   ├── db.js                   # Database connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication operations
│   │   ├── userController.js   # User profile management
│   │   ├── travelController.js # Travel and booking operations
│   │   └── walletController.js # Wallet and payment operations
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication endpoints
│   │   ├── userRoutes.js       # User profile endpoints
│   │   ├── travelRoutes.js     # Travel and booking endpoints
│   │   └── walletRoutes.js     # Wallet endpoints
│   └── utils/
│       ├── hashing.js          # Password handling
│       └── jwt.js              # JWT token management
├── docker/
│   └── Dockerfile              # For containerization
└── package.json                # Dependencies and scripts
```

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new customer

  ```json
  {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "securepassword"
  }
  ```

- **POST /api/auth/login**: Authenticate a customer
  ```json
  {
    "id": "user123",
    "password": "securepassword"
  }
  ```

### User Profile

- **GET /api/users/me**: Get current user profile
- **PUT /api/users/update-profile**: Update user profile
  ```json
  {
    "name": "John Smith",
    "isAnonymous": false
  }
  ```

### Travel and Booking

- **GET /api/travel/list**: List available travel options
  - Query parameters: date, source, destination, type, minPrice, maxPrice, availableOnly, sortBy etc
- **POST /api/travel/book**: Book a ticket
  ```json
  {
    "travelID": 1,
    "seatNumbers": ["2A"]
  }
  ```
- **PUT /api/travel/book**: Update a booking
  ```json
  {
    "bookingID": "book_1745466770358_de81mnr1p",
    "newTravelID": 3,
    "newSeatNumbers": ["1A"]
  }
  ```
- **DELETE /api/travel/book**: Cancel a booking
  ```json
  {
    "bookingID": "book_1745466770358_de81mnr1p"
  }
  ```
- **POST /api/travel/verify**: Verify a booking on blockchain
  - A booking is considered as verified only if it is present on blockchain and there are at least two blocks in front of the block containing this booking
  ```json
  {
    "bookingID": "book_1745466906848_dc4ayujpp"
  }
  ```
- **GET /api/travel/get-all-bookings**: Get all bookings for the current user

### Wallet

- **POST /api/wallet/add-money**: Add money to wallet
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
PORT=3001
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

TRAVEL_AGENCY_BACKEND_URL=http://localhost:3002
HYPERLEDGER_ORG1_APIKEY=97834158-3224-4CE7-95F9-A148C886653E
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

3. The API will be available at `http://localhost:3001`

### Production Deployment

Using Docker:

```bash
# Build the image
docker build -t mytravel/customer-backend:latest -f docker/Dockerfile .

# Run the container
docker run -d \
  -p 3001:3001 \
  --env-file .env \
  --name mytravel-customer-api \
  mytravel/customer-backend:latest
```

## Authentication and Authorization

The backend uses JWT (JSON Web Tokens) for authentication:

1. User logs in with credentials
2. Server validates credentials and issues a JWT
3. Client includes JWT in Authorization header for protected routes
4. Server verifies JWT and authorizes access

Example protected request:

```
GET /api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Data Flow

1. Customer makes request to backend API
2. Backend validates request and authenticates user
3. For blockchain operations, backend calls the custom network REST API
4. Backend processes response and returns data to customer

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

### Users Collection

```json
{
  "id": "user123",
  "userHash": "7b2952e91329fff26103b091e6f...",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-02T00:00:00Z",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "hashed_password",
  "isAnonymous": false,
  "balance": 1000
}
```

### Bookings Collection

```json
{
  "bookingID": "book_1745466906848_dc4ayujpp",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z",
  "cancelledAt": "2023-01-01T00:00:00Z", // or "" if booking is not cancelled
  "userHash": "7b2952e91329fff26103b091e6f...",
  "isAnonymous": false,
  "userID": "user123", // or "" if user is anonymous
  "agencyID": "agency123",
  "travelID": 1,
  "seatNumbers": ["2A"],
  "totalPrice": 150,
  "transactionID": "txn_1745466906848_abcdef",
  "status": "confirmed",
  "refundAmount": 0, // or amount if booking is cancelled/refunded
  "penalty": 0 // or amount if penalty is applied to cancellation
}
```
