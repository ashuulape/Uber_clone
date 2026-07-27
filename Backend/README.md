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
    ├── socket.js              # Socket.IO initialisation & event handlers
    ├── Database/
    │   └── db.js              # MongoDB connection via Mongoose
    ├── models/
    │   ├── user.model.js      # User schema (passengers)
    │   ├── captain.model.js   # Captain schema (drivers + vehicle info)
    │   ├── ride.model.js      # Ride schema (full trip lifecycle)
    │   └── blacklist.model.js # JWT token blacklist (logout invalidation, TTL 24h)
    ├── Controlers/
    │   ├── user.conroller.js  # User CRUD & auth logic
    │   ├── captain.controller.js  # Captain CRUD & auth logic
    │   ├── map.controller.js  # Geocoding & map API proxy
    │   └── ride.controller.js # Ride lifecycle & driver dispatch via Socket.IO
    ├── services/
    │   ├── map.service.js     # Geoapify API integration (geocode, routing, autocomplete)
    │   └── ride.service.js    # Fare calculation, OTP generation, ride state transitions
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
| `bcrypt` | ^6.0.0 | Password hashing (salt rounds: 10) |
| `jsonwebtoken` | ^9.0.3 | JWT auth tokens (1-day expiry) |
| `express-validator` | ^7.3.2 | Request input validation |
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

Get a free Geoapify API key at https://www.geoapify.com/ (free tier: 3,000 requests/day)

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

The server starts on `http://localhost:3000` (or the next available port if 3000 is busy — see Auto Port Fallback).

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

**Validation:**
- `email` — valid email format
- `fullname.firstname` — string, required
- `fullname.lastname` — string, required

**Response 200:**
```json
{
  "message": "user created sucessfully",
  "user": { "...user fields (no password)" },
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
Logout user — adds token to the blacklist. Auth Required via cookie or `Authorization: Bearer <token>`.

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

`vehicleType` must be one of: `car`, `auto`, `bike`

**Validation:**
- `firstname` min 3 chars, `lastname` min 2 chars
- `password` min 6 chars
- `vehicle.color` and `vehicle.plate` min 3 chars
- `vehicle.capacity` integer ≥ 1
- `vehicle.vehicleType` enum: `car | auto | bike`

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
Get driving distance, estimated time, and GeoJSON route between two **addresses**. Returns Geoapify Routing API response.

**Query Params:**
- `origin` (string, required)
- `destination` (string, required)

**Used for:** Fare calculation, route drawing on map

---

#### GET /api/maps/get-distance-time/coords
Same as above but accepts **coordinate strings** instead of addresses. Origin must be pre-resolved coordinates.

**Query Params:**
- `origin` (string — e.g. `"12.9716,77.5946"`)
- `destination` (string — address or coordinate string)

**Used for:** Captain's route from their live location to the pickup point

---

#### GET /api/maps/get-suggestion
Autocomplete address suggestions (up to 5 results).

**Query Params:** `address` (string, required) — partial address input

**Response:** Geoapify autocomplete JSON (features array)

---

#### GET /api/maps/current-location
Reverse geocode lat/lon to a human-readable address. **Does NOT require auth.**

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
1. Calculates fare using Geoapify Routing API
2. Generates a cryptographically secure 6-digit OTP via `crypto.randomInt`
3. Saves ride to MongoDB with `status: pending`
4. Geocodes origin to coordinates
5. Finds all captains within **10 km radius** using MongoDB `$geoWithin` / `$centerSphere`
6. Emits `new-ride` Socket.IO event to every captain in radius (OTP field cleared from payload)

**Response 201:** Created ride object

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
Fare = Base + (distanceKm × perKm) + (durationMin × perMin)

Rates:
  auto  → base: ₹50,  perKm: ₹15, perMin: ₹2
  bike  → base: ₹20,  perKm: ₹8,  perMin: ₹1
  car   → base: ₹80,  perKm: ₹20, perMin: ₹3
```

---

#### POST /api/ride/confirm
Captain accepts a ride request. Auth Required (captain token).

**Request Body:**
```json
{ "rideId": "64f3a..." }
```

- Updates ride `status` → `accepted`
- Assigns `captain` field to the requesting captain
- Emits `ride-confirmed` to the passenger's socket (captain password stripped from payload)

---

#### GET /api/ride/start-ride
Start the ride after OTP verification. Auth Required (captain token).

**Query Params:**
- `rideId` (MongoDB ObjectId)
- `OTP` (6-digit string)

- Validates OTP against stored (hidden) value
- Updates `status` → `ongoing`
- Emits `ride-started` to passenger

---

#### POST /api/ride/end-ride
End the active ride. Auth Required (captain token).

**Request Body:**
```json
{ "rideId": "64f3a..." }
```

- Validates ride belongs to requesting captain and is `ongoing`
- Updates `status` → `completed`
- Emits `ride-ended` to passenger

---

## 🗄️ Database Models

### User Model
| Field | Type | Notes |
|-------|------|-------|
| `fullname.firstname` | String | Required, 3–20 chars |
| `fullname.lastname` | String | Required, 2–30 chars |
| `email` | String | Required, unique |
| `password` | String | Bcrypt hashed, `select: false` |
| `socketId` | String | Updated on each Socket.IO `join` event |
| `location.lat` | Number | Live GPS latitude (updated every 10s) |
| `location.lng` | Number | Live GPS longitude (updated every 10s) |

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
| `vehicle.color` | String | Required, 3–20 chars |
| `vehicle.plate` | String | Required, 3–20 chars |
| `vehicle.capacity` | Number | Min: 1 |
| `vehicle.vehicleType` | Enum | `car`, `auto`, or `bike` |
| `socketId` | String | Live socket connection ID (default: `""`) |
| `location.lat` | Number | Live GPS latitude |
| `location.lng` | Number | Live GPS longitude |

**Methods:**
- `generateAuthToken()` — signs a 1-day JWT token
- `ComparePassword(pw)` — bcrypt comparison
- `hashpassword(pw)` (static) — bcrypt hash with salt 10

---

### Ride Model
| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId | Ref: User (required) |
| `captain` | ObjectId | Ref: Captain (assigned on confirm) |
| `origin` | String | Pickup location address |
| `destination` | String | Drop-off location address |
| `vehicleType` | Enum | `auto`, `bike`, or `car` |
| `fare` | Number | Calculated fare in rupees (default: 0) |
| `status` | Enum | `pending` → `accepted` → `ongoing` → `completed` / `cancelled` |
| `distance` | Number | Trip distance in km (default: 0) |
| `duration` | Number | Estimated duration in minutes (default: 0) |
| `OTP` | String | 6-digit code, `select: false` — hidden from default queries |
| `paymentId` | String | Payment gateway reference |
| `orderId` | String | Order reference |
| `signature` | String | Payment signature |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

---

### Blacklist Model
| Field | Type | Notes |
|-------|------|-------|
| `token` | String | JWT token to invalidate (unique index) |
| `createdAt` | Date | Auto-expires after **24 hours** via MongoDB TTL index |

---

## 🔌 WebSocket Events (Socket.IO)

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `{ userId, userType: 'user' \| 'captain' }` | Writes socket ID to user/captain document in DB |
| `update-location-captain` | `{ userId, location: { lat, lng } }` | Updates captain GPS coordinates in DB |
| `update-location-user` | `{ userId, location: { lat, lng } }` | Updates user GPS coordinates in DB |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `new-ride` | Full ride object (user populated, OTP cleared) | Sent to all captains within 10 km radius |
| `ride-confirmed` | Ride object with captain info (password stripped) | Sent to passenger when captain accepts |
| `ride-started` | Ride object | Sent to passenger when captain starts ride |
| `ride-ended` | Ride object | Sent to passenger when captain finishes ride |

---

## 🔑 Authentication Flow

1. **Register/Login** — Server returns a **JWT token** (also set as `token` cookie)
2. **Client sends token** via `Authorization: Bearer <token>` header or `token` cookie
3. **Middleware** (`auth.middleware.js`) checks:
   - Token is not in the **blacklist** (revoked/logged-out tokens)
   - Token is a valid JWT (verified with `JWT_SECRET`)
   - Attaches `req.user` or `req.captain` for downstream handlers
4. **Logout** — Token added to blacklist, auto-expires after 24 hours via MongoDB TTL index

---

## 🌐 External APIs Used

### Geoapify Platform
All geocoding and routing is powered by [Geoapify](https://www.geoapify.com/):

| API Endpoint | Usage |
|---|---|
| `/v1/geocode/search` | Address → coordinates (forward geocoding) |
| `/v1/geocode/autocomplete` | Location autocomplete suggestions (limit 5) |
| `/v1/geocode/reverse` | Coordinates → address (reverse geocoding) |
| `/v1/routing` | Driving distance, time, and GeoJSON route between two waypoints |

---

## 🛡️ Input Validation Rules

All routes use `express-validator` middleware chains before controllers:

- Email format validation
- Password minimum length: 6 characters
- First name: string, required; Captain: min 3 chars
- Last name: string, required; Captain: min 2 chars
- `vehicleType` must be one of `car`, `auto`, `bike`
- `vehicle.color` and `vehicle.plate`: min 3 chars
- `vehicle.capacity`: integer ≥ 1
- MongoDB ObjectId format for `rideId`
- Coordinate type checks (float) for lat/lon map queries
- OTP must be exactly 6 characters (string)

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

This is implemented in `server.js` by listening for the `EADDRINUSE` error and recursively calling `startServer(port + 1)`.
