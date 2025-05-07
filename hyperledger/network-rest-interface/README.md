# MyTravel.com Blockchain REST API

This component provides a RESTful API interface to interact with the Hyperledger Fabric blockchain network for the MyTravel.com ticket booking system.

## Overview

The REST API is built using TypeScript, Express, and the Fabric Node.js SDK. It serves as an intermediary layer between the application backends and the blockchain network, abstracting the complexities of direct blockchain interaction.

## Architecture

- **Express Server**: Handles HTTP requests
- **Fabric Gateway**: Connects to the blockchain network
- **Authentication**: API key-based auth for backend services
- **Job Queues**: Job queues to accept requests from application backends and run it in the background

## Directory Structure

```
network-rest-interface/
├── src/
│   ├── auth.ts                  # Auth based on API key
│   ├── bookings.router.ts       # Booking-related endpoints
│   ├── config.ts                # Interface configurations
│   ├── fabric.ts                # Fabric connection handling
│   └── index.ts z                # Main application entry point
│   ├── jobs.router.ts           # Asynchronous job handling
│   ├── transactions.router.ts   # Transaction queries
├── scripts/
│   └── generateEnv.sh           # Environment setup script
├── Dockerfile                   # For containerization
└── package.json                 # Dependencies and scripts
```

## API Endpoints

### Booking Management

- **GET /api/bookings**: List all bookings
- **GET /api/bookings/:bookingID**: Get a specific booking
- **POST /api/bookings**: Create a new booking
- **DELETE /api/bookings/:bookingID**: Cancel a booking

### Job Management

- **GET /api/jobs/:id**: Check status of an asynchronous job

### Transaction Queries

- **GET /api/transactions/:id**: Get transaction details
- **GET /api/bookings/:hyperledgerTxId/blockheight**: Get block height for a transaction

### Health Check

- **GET /health**: API health check

## Setup and Installation

### Prerequisites

- Node.js v14+
- Docker (for containerized deployment)
- Access to the Hyperledger Fabric network
- Redis server

### Deployment
From project's root directory

```bash
./network rest-easy
```

This will:

- Create configmap
- Prepare the REST interface, which:
  - Builds the docker image of interface API
  - Load it inside the KIND cluster
- Apply the kube template to deploy the interface API

## Authentication

The API uses API key-based authentication to secure endpoints:

```
Headers:
X-Api-Key:
```

API keys are managed via configuration and mapped to specific organizations.

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

## Transaction Flow

1. Client submits request to API
2. API validates request parameters
3. API submits transaction to Fabric network
4. Transaction is processed by the network
5. API returns transaction ID and status

For long-running operations, the API uses an asynchronous job pattern:

1. Client submits request
2. API returns a job ID immediately
3. Client polls the job status endpoint
4. Once complete, the job endpoint returns the result

## Performance Considerations

- The API uses connection pools for Fabric
- Long-running operations are handled asynchronously

## Monitoring and Logging

- Winston logger provides structured logging
- Health check endpoint for monitoring
- Transaction metrics are available via dedicated endpoints
