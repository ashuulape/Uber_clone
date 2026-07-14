# 🚗 Uber Clone — Backend

A production-style **Node.js + Express** REST API powering a full-featured ride-hailing application. The backend handles user and captain (driver) authentication, real-time ride lifecycle management via WebSockets, fare calculation, geocoding, and location services — all backed by **MongoDB**.

---

## 📁 Project Structure

```
Backend/
├── server.js                  # Entry point — starts HTTP server + Socket.IO
├── package.json
├── .env                       # Environment variables (not committed)
└── src/
    ├── app.js                 # Express app setup, middleware, route mounting
    ├── socket.js              # Socket.IO initialization & event handlers
    ├── Database/
    │   └── db.js              # MongoDB connection via Mongoose
    ├── models/
    │   ├── user.model.js      # User schema (passengers)
    │   ├── captain.model.js   # Captain schema (drivers + vehicle info)
    │   ├── ride.model.js      # Ride schema (full trip lifecycle)
    │   └── blacklist.model.js # JWT token blacklist (logout invalidation)
    ├── Controlers/
    │   ├── user.conroller.js  # User CRUD & auth logic
    │   ├── captain.controller.js  # Captain CRUD & auth logic
    │   ├── map.controller.js  # Geocoding & map API calls
    │   └── ride.controller.js # Ride lifecycle & driver dispatch
    ├── services/
    │   ├── map.service.js     # Geoapify API integration
    │   └── ride.service.js    # Fare calc, OTP, ride state transitions
    ├── Routes/
    │   ├── auth.routes.js     # /api/auth/*
    │   ├── captain.routes.js  # /api/captain/*
    │   ├── maps.routes.js     # /api/maps/*
    │   └── ride.routes.js     # /api/ride/*
    └── middlewares/
        └── auth.middleware.js # JWT verification for users & captains
```

---

## 🛠️ Tech Stack & Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | Web framework |
| `mongoose` | peer dep | MongoDB ODM |
| `socket.io` | ^4.8.3 | Real-time WebSocket communication |
| `bcrypt` | ^6.0.0 | Password hashing |
| `jsonwebtoken` | ^9.0.3 | JWT auth tokens |
| `express-validator` | ^7.3.2 | Request validation |
| `cookie-parser` | ^1.4.7 | Cookie parsing |
| `cors` | ^2.8.6 | Cross-Origin Resource Sharing |
| `dotenv` | ^17.4.2 | Environment variable loading |
| `nodemon` | ^3.1.14 | Dev auto-restart |
| `axios` | via map.service | HTTP client for Geoapify API calls |

---

## Environment Variables

Create a `.env` file in the `Backend/` root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_super_secret_jwt_key

# Geoapify (Maps and Geocoding)
GEOAPIFY_BASE_URL=https://api.geoapify.com
GEOAPIFY_API_KEY=your_geoapify_api_key
```

Get a free Geoapify API key at https://www.geoapify.com/

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### Installation

```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install

# Start the development server (with auto-reload)
npm start
```

The server starts on `http://localhost:3000` (or the next available port if 3000 is busy).

---

## 📡 API Reference

### Base URL
```
http://localhost:3000/api
```

---

### Auth Routes — `/api/auth`

#### POST /api/auth/register
Register a new user (passenger).

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response 200:**
```json
{
  "message": "user created sucessfully",
  "user": { "...user fields" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### POST /api/auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response 200:**
```json
{
  "message": "User logged in successfully",
  "user": { "...user fields" },
  "token": "..."
}
```

---

#### POST /api/auth/logout
Logout user — adds token to blacklist. Auth Required via cookie or Bearer token.

---

#### GET /api/auth/profile
Get the logged-in user profile. Auth Required.

**Response:** User document (without password field)

---

### Captain Routes — `/api/captain`

#### POST /api/captain/register
Register a new captain (driver).

**Request Body:**
```json
{
  "fullname": {
    "firstname": "Ali",
    "lastname": "Khan"
  },
  "email": "ali@example.com",
  "password": "driver123",
  "vehicle": {
    "color": "Black",
    "plate": "MH12AB1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

vehicleType must be one of: `car`, `auto`, `bike`

**Response 200:**
```json
{
  "message": "Captain created successfully",
  "captain": { "...captain fields" },
  "token": "..."
}
```

---

#### POST /api/captain/login
Login an existing captain.

**Request Body:**
```json
{
  "email": "ali@example.com",
  "password": "driver123"
}
```

---

#### GET /api/captain/profile
Get logged-in captain profile. Auth Required (captain token).

---

#### GET /api/captain/logout
Logout captain — invalidates token. Auth Required (captain token).

---

### Maps Routes — `/api/maps`

All map routes require user authentication unless noted.

#### GET /api/maps/get-coordinates
Convert an address string to lat/lon coordinates.

**Query Params:** `address` (string, required)

**Response:**
```json
[
  {
    "country": "India",
    "state": "Maharashtra",
    "address": "Bandra West, Mumbai",
    "city": "Mumbai",
    "lon": 72.8347,
    "lat": 19.0596
  }
]
```

---

#### GET /api/maps/get-distance-time
Get driving distance and estimated time between two addresses. Returns GeoJSON route data.

**Query Params:**
- `origin` (string, required)
- `destination` (string, required)

---

#### GET /api/maps/get-suggestion
Autocomplete address suggestions (up to 5 results).

**Query Params:** `address` (string, required) — partial address input

---

#### GET /api/maps/current-location
Reverse geocode lat/lon to a human-readable address. Does NOT require auth.

**Query Params:**
- `lat` (float, required)
- `lon` (float, required)

**Response:**
```json
{ "address": "23 Linking Road, Bandra West, Mumbai" }
```

---

### Ride Routes — `/api/ride`

#### POST /api/ride/create
Create a new ride request (passenger side). Auth Required (user token).

**Request Body:**
```json
{
  "origin": "Andheri Station, Mumbai",
  "destination": "Bandra Kurla Complex, Mumbai",
  "vehicleType": "car"
}
```

**Flow after creation:**
1. Calculates fare using Geoapify routing API
2. Generates a cryptographically secure 6-digit OTP
3. Saves ride to MongoDB with status `pending`
4. Finds all captains within 10 km radius using MongoDB `$geoWithin`
5. Emits `new-ride` event via Socket.IO to all captains in radius

---

#### GET /api/ride/getfare
Get fare estimates for all vehicle types. Auth Required (user token).

**Query Params:**
- `origin` (string)
- `destination` (string)

**Response:**
```json
{
  "auto": 95,
  "bike": 52,
  "car": 145,
  "distance": 8
}
```

**Fare Calculation Formula:**
```
Fare = Base + (distanceKm x perKm) + (durationMin x perMin)

Rates:
  auto  -> base: Rs 50,  perKm: Rs 15, perMin: Rs 2
  bike  -> base: Rs 20,  perKm: Rs 8,  perMin: Rs 1
  car   -> base: Rs 80,  perKm: Rs 20, perMin: Rs 3
```

---

#### POST /api/ride/confirm
Captain accepts a ride request. Auth Required (captain token).

**Request Body:**
```json
{ "rideId": "64f3a..." }
```

Updates ride status to `accepted`, emits `ride-confirmed` to the user via Socket.IO.

---

#### GET /api/ride/start-ride
Start the ride after OTP verification. Auth Required (captain token).

**Query Params:**
- `rideId` (MongoDB ObjectId)
- `OTP` (6-digit string)

Validates OTP, updates status to `ongoing`, emits `ride-started` to user.

---

#### POST /api/ride/end-ride
End the active ride. Auth Required (captain token).

**Request Body:**
```json
{ "rideId": "64f3a..." }
```

Updates status to `completed`, emits `ride-ended` to user.

---

## 🗄️ Database Models

### User Model
| Field | Type | Notes |
|-------|------|-------|
| `fullname.firstname` | String | Required, 3–20 chars |
| `fullname.lastname` | String | Required, 2–30 chars |
| `email` | String | Required, unique |
| `password` | String | Bcrypt hashed, hidden from queries by default |
| `socketId` | String | Updated on each Socket.IO connection |
| `location.lat` | Number | Live GPS latitude |
| `location.lng` | Number | Live GPS longitude |

**Methods:**
- `generateJWT()` — signs a 1-day JWT token
- `comparePassword(pw)` — bcrypt password comparison
- `hashpassword(pw)` (static) — bcrypt hash with salt 10

---

### Captain Model
| Field | Type | Notes |
|-------|------|-------|
| `fullname.firstname` | String | Required, min 3 chars |
| `fullname.lastname` | String | Required, min 2 chars |
| `email` | String | Required, unique |
| `password` | String | Bcrypt hashed |
| `status` | Enum | `active` or `inactive` (default: `inactive`) |
| `vehicle.color` | String | Required, 3-20 chars |
| `vehicle.plate` | String | Required, 3-20 chars |
| `vehicle.capacity` | Number | Min: 1 |
| `vehicle.vehicleType` | Enum | `car`, `auto`, or `bike` |
| `socketId` | String | Live socket connection ID |
| `location.lat` | Number | Live GPS latitude |
| `location.lng` | Number | Live GPS longitude |

---

### Ride Model
| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId | Ref: User (required) |
| `captain` | ObjectId | Ref: Captain (assigned on confirm) |
| `origin` | String | Pickup location address |
| `destination` | String | Drop-off location address |
| `vehicleType` | Enum | `auto`, `bike`, or `car` |
| `fare` | Number | Calculated fare in rupees |
| `status` | Enum | `pending` → `accepted` → `ongoing` → `completed` / `cancelled` |
| `distance` | Number | Trip distance in km |
| `duration` | Number | Estimated duration in minutes |
| `OTP` | String | 6-digit code (hidden from queries by default) |
| `paymentId` | String | Payment gateway reference |
| `orderId` | String | Order reference |
| `signature` | String | Payment signature |

---

### Blacklist Model
| Field | Type | Notes |
|-------|------|-------|
| `token` | String | JWT token to invalidate (unique) |
| `createdAt` | Date | Auto-expires after **24 hours** via MongoDB TTL index |

---

## 🔌 WebSocket Events (Socket.IO)

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `{ userId, userType: 'user' or 'captain' }` | Registers socket ID in DB |
| `update-location-captain` | `{ userId, location: { lat, lng } }` | Updates captain GPS in DB |
| `update-location-user` | `{ userId, location: { lat, lng } }` | Updates user GPS in DB |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `new-ride` | Full ride object (user populated) | Sent to captains within 10 km radius |
| `ride-confirmed` | Ride object with captain info | Sent to user when captain accepts |
| `ride-started` | Ride object | Sent to user when captain starts ride |
| `ride-ended` | Ride object | Sent to user when captain finishes ride |

---

## 🔑 Authentication Flow

1. **Register/Login** — Server returns a **JWT token** (also set as `token` cookie)
2. **Client sends token** via `Authorization: Bearer <token>` header or `token` cookie
3. **Middleware** (`auth.middleware.js`) checks:
   - Token is not in the **blacklist** (revoked/logged-out tokens)
   - Token is a valid JWT (verifies with `JWT_SECRET`)
   - Attaches `req.user` or `req.captain` for downstream handlers
4. **Logout** — Token added to blacklist, expires after 24 hours via MongoDB TTL

---

## 🌐 External APIs Used

### Geoapify Platform
All geocoding and routing is powered by [Geoapify](https://www.geoapify.com/):

| API Endpoint | Usage |
|---|---|
| `/v1/geocode/search` | Address → coordinates (forward geocoding) |
| `/v1/geocode/autocomplete` | Location autocomplete suggestions |
| `/v1/geocode/reverse` | Coordinates → address (reverse geocoding) |
| `/v1/routing` | Distance and driving time between two points |

---

## 🛡️ Input Validation Rules

All routes use `express-validator` middleware chains before controllers:

- Email format validation
- Password minimum length: 6 characters
- Name length constraints (firstname: 3+ chars, lastname: 2+ chars)
- Vehicle type must be one of `car`, `auto`, `bike`
- MongoDB ObjectId format for ride IDs
- Coordinate type checks (float) for map queries
- OTP must be exactly 6 characters

---

## 📝 npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `nodemon server.js` | Dev server with auto-reload |

---

## 🔧 Auto Port Fallback

If the configured port is already in use, the server automatically increments and tries the next port:

```
Port 3000 is busy, trying 3001...
Server is running on port 3001
```
