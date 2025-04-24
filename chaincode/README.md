# MyTravel.com Blockchain Chaincode

This directory contains the smart contracts (chaincode) that implement the business logic for the MyTravel.com ticket booking system on Hyperledger Fabric.

## Overview

The chaincode is written in TypeScript using the Fabric Contract API. It provides functionality for:

- Creating and maintaining travel records
- Managing ticket bookings
- Processing payments
- Verifying ticket validity
- Handling refunds

## Chaincode Structure

```
chaincode/
├── src/
│   ├── booking.ts              # Booking data model
│   ├── bookingContract.ts      # Main contract implementation
│   └── index.ts                # Entry point
├── types/                      # TypeScript type definitions
├── Dockerfile                  # For chaincode as a service (CCaaS)
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

### Key Components

- **booking.ts**: Defines the data structure for bookings
- **bookingContract.ts**: Implements the contract methods for managing bookings
- **index.ts**: Exports the contract for Fabric to use

## Smart Contract Functions

The chaincode implements the following functions:

### Booking Management

- `recordBooking(ctx, bookingData)`: Creates/updates a booking
- `readBooking(ctx, bookingId)`: Retrieves a booking by ID
- `bookingExists(ctx, bookingId)`: Checks whether a booking exists in world state
- `getAllBookings(ctx)`: Lists all bookings
- `deleteBooking(ctx, bookingId)`: Cancels/deletes a booking

## Development Guide

### Prerequisites

- Node.js v14+
- npm or yarn
- TypeScript knowledge

### Setup Development Environment

1. Install dependencies:

   ```bash
   npm install
   ```

## Deployment

The chaincode is deployed as a Kubernetes service using Chaincode as a Service (CCaaS) approach. From project's root directory

```bash
./network chaincode deploy chaincode chaincode/
```

This will:

1. Build the chaincode container
2. Deploy it to Kubernetes
3. Install and approve the chaincode on both of the organizations
4. Commit the chaincode definition to the channel

## Transaction Flow

1. Client submits transaction via Interface API
2. Transaction is endorsed by peers
3. Transaction is ordered and added to the blockchain
4. State database is updated with the new booking information
