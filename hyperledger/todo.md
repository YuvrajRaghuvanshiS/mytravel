### 🏁 **Basic Setup & Project Structure**

- ✅ Initialize GitHub repositories for Hyperledger network ([mytravel-k8s](https://github.com/YuvrajRaghuvanshiS/mytravel-k8s)), Customer backend ([customer-backend](https://github.com/YuvrajRaghuvanshiS/customer-backend)), Travel Agency backend ([travel-agency-backend](https://github.com/YuvrajRaghuvanshiS/travel-agency-backend))
- ❌ Document project structure and goals in README

---

### ✅ **Hyperledger Fabric Setup**

- ✅ Set up `mytravel-k8s` with required organizations and peers
- ✅ Define channel and chaincode deployment process
- ✅ Create and register `appUser` identities for customers and providers
- ✅ Configure Network REST Interface to invoke chaincode using Fabric SDK, this is difference from the backend.
- ✅ Chaincode functions for:
  - ✅ Booking creation
  - ❌ Booking cancellation
  - ❌ Booking update (date/reschedule)
  - ❌ Service provider management
  - ❌ Transport option management
  - ❌ Ledger queries (available seats, pricing, etc.)
- ✅ Simulate dummy payment and integrate with ledger confirmation
- ❌ Add block confirmation check (2 succeeding blocks before confirming)

---

### ✅ **Service Provider Module**

- ✅ Register new provider
- ❌ Add/update/delete transport listings (flights/trains/buses)
- ❌ Cancel travel listings and trigger 100% refund (dummy payment logic)
- ✅ Filter and sort travel options (by mode, rating, price)

---

### ✅ **Customer Module**

- ✅ Register new customer
- ✅ Book ticket (A → B with date/time, transport selection)
- ❌ Cancel booking
- ❌ Reschedule booking (with penalty logic)
- ❌ View bookings
- ✅ Make booking data verifiable on-chain
- ❌ Toggle profile visibility (anonymous/public)

---

### ✅ **Smart Contract (Chaincode)**

- ❌ Define transport asset schema
- ✅ Define booking asset schema
- ❌ Define customer/provider profile schemas
- 🏁 Add access control:
  - ✅ Customers can’t view others' bookings
  - ✅ Providers can’t view customer personal info (and vice versa)
- ✅ Enforce overbooking and double-booking prevention
- ❌ Add event listeners for chaincode events (ticket confirmed, refund processed)
- ✅ Optimize chaincode for performance and scalability

---

### ❌ **Web UI**

- ❌ Customer login/register
- ❌ Provider login/register
- ❌ Dashboard for bookings (customer)
- ❌ Dashboard for transport listings (provider)
- ❌ Booking form with dynamic options and pricing
- ❌ Booking history and status (confirmed, canceled, refunded)
- ❌ Sorting and filtering options
- ❌ Profile settings (privacy toggle)
- ❌ Responsive, user-friendly design

---

### ❌ **System Features & Scalability**

- ✅ Handles 1000+ daily users and 2500+ bookings (mock load):
  - ✅ Use Kubernetes to dynmaically deploy nodes in case of extra load
  - ✅ Use jobs and scheduling so API doesn not keep on waiting for a transaction to fully commit (after consensus)
- ❌ Ensure blockchain confirms bookings only after proper ledger updates
- ❌ Use pagination and lazy loading in UI for large datasets
- ❌ Ensure 3+ travel options per route (per mode)
- ❌ Design a **dynamic pricing algorithm**
  - ❌ Maximize provider profit
  - ❌ Ensure customer affordability
- ❌ Handle rating-based sorting of travel listings

---

### ❌ **Testing**

- ❌ Unit test chaincode functions
- ❌ API integration tests (REST backend)
- ❌ End-to-end test workflows (book, cancel, refund)
- ❌ Simulate failed transactions (e.g., double-booking attempts)
- ❌ Handle race conditions and concurrent bookings

---

### ❌ **Documentation & Report**

- ❌ Project Report (architecture, features, flow diagrams)
- ❌ README (setup, dependencies, deployment steps)
- ❌ API documentation (Swagger or Postman)
- ❌ Feature attribution if in a team (who built what)
- ❌ Mention system limitations clearly

---

### ❌ **Extra / Bonus Features**

- ✅ Filtering of tickets by price, provider, availability ✅ (10 bonus)
- ❌ Deploy on AWS/GCP (within free-tier) ✅ (20 bonus)
- ❌ Design a useful blockchain feature (e.g., ticket history traceability, NFT ticketing?) ✅ (10 bonus)
