# MyTravel.com - Blockchain-Based Ticket Booking Platform

MyTravel.com is a comprehensive ticket booking system that leverages blockchain technology to ensure secure, transparent, and immutable transaction records. This platform integrates traditional web application architecture with Hyperledger Fabric blockchain infrastructure, providing a hybrid web2-web3 solution for customers and travel agencies. The system enables real-time booking management, dynamic pricing, and decentralized transaction verification while maintaining user privacy through anonymized blockchain interactions.

---

## Project Architecture Overview

The platform follows a modular microservices architecture with four core components:

### 1. Customer Backend Service (Node.js/Express)

Handles customer-facing operations including:

- User registration and JWT-based authentication
- Travel listing discovery and filtering
- Booking management with blockchain verification
- Digital wallet operations
- Profile management with anonymous mode support

### 2. Travel Agency Backend Service (Node.js/Express)

Manages agency-specific functionalities:

- Agency registration and authentication
- Travel route creation/updation
- Seat inventory management
- Booking reconciliation
- Financial settlements

### 3. React Frontend Application

Provides unified user interface for:

- Customer booking flow
- Agency dashboard
- Real-time seat maps
- Transaction history
- Wallet management

### 4. Hyperledger Fabric Blockchain Network

Enterprise-grade distributed ledger infrastructure containing:

- Raft-based ordering service
- Org1 (Agencies) and Org2 (Customers) peer nodes
- Chaincode smart contracts for booking lifecycle management
- REST API gateway for application integration
- Kubernetes-based deployment

---

## Key System Features

### Blockchain Integration Layer

All booking transactions get recorded on an immutable ledger through custom chaincode implementing:

- `recordBooking()` for transaction creation
- `readBooking()` for verification
- `bookingExists()` for conflict prevention
- Cryptographic user hashing for privacy

### Hybrid Authentication System

Combines traditional JWT authentication with blockchain identity management:

- Standard email/password login
- Anonymous mode with blockchain-generated user hashes
- API key authentication for inter-service communication

### Dynamic Pricing Engine

Supports multi-level pricing strategies:

- Base price per travel route
- Seat-class differential pricing
- Time-based surge pricing
- Last-minute discounts

### Wallet System Architecture

Implements dual-layer financial management:

- Traditional balance storage in MongoDB
- Blockchain-verified transaction history
- Cross-service settlement via REST APIs

---

## Development Environment Setup

### Prerequisites

| Component          | Version | Installation Guide                                    |
| ------------------ | ------- | ----------------------------------------------------- |
| Node.js            | ≥14.x   | [Official Download](https://nodejs.org)               |
| Docker             | ≥20.10  | [Docker Docs](https://docs.docker.com)                |
| Kubernetes         | ≥1.25   | [K8s Docs](https://kubernetes.io/docs)                |
| Hyperledger Fabric | ≥2.4    | [HLF Docs](https://hyperledger-fabric.readthedocs.io) |

### Installation Workflow

1. **Clone Repository**

   ```bash
   git clone https://github.com/your-username/mytravel.git
   cd mytravel
   ```

2. **Backend Services Setup**

   ```bash
   # Customer Backend
   cd customer-backend
   npm install
   cp .env.example .env
   npm run dev

   # Agency Backend
   cd ../travel-agency-backend
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Frontend Application**

   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Blockchain Network Deployment**
   ```bash
   cd ../hyperledger
   ./reset
   ```

---

## Data Models

### Booking Schema (Database + Blockchain)

```typescript
interface Booking {
  bookingID: string;
  userHash: string;
  agencyID: string;
  travelID: string;
  seatNumbers: string[];
  status: "pending" | "confirmed" | "cancelled";
  blockchainTxId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Security Implementation

### Data Protection Measures

1. **Sensitive Data Encryption**

   - AES-256 for PII fields
   - bcrypt for password hashing

2. **Network Security**

   - Mutual TLS for blockchain peers
   - Kubernetes network policies

3. **Access Control**
   - RBAC for Kubernetes cluster
   - Attribute-based access in chaincode
   - JWT role claims

---

## Monitoring & Maintenance

### Blockchain Network Monitoring

```bash
# Peer node status
kubectl -n test-network exec org1-peer1-0 -- \
  peer channel getinfo -c mychannel

# Chaincode logs
kubectl -n test-network logs deploy/chaincode-booking
```

---

## License

This project is developed as part of CS731 Blockchain course requirements at IIT Kanpur. The codebase is available for educational purposes with proper attribution to the original authors. Commercial use requires written permission.
