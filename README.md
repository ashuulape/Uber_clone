# 🚗 Uber Clone — Full-Stack Ride-Hailing Application

A fully-functional, real-time **Uber-style ride-hailing application** built from scratch with a **Node.js/Express backend** and a **React/Vite frontend**. The platform supports two distinct user roles — **Passengers** who book rides and **Captains (Drivers)** who accept and complete them — connected in real time via **Socket.IO**.

---

## 🌟 Key Features

### For Passengers
- Register and log in securely with JWT authentication
- View live location on an interactive map
- Search pickup and destination addresses with autocomplete suggestions
- Get instant fare estimates for 3 vehicle types (Car, Auto, Bike)
- Book a ride and get matched with a nearby captain in real time
- Receive live updates: driver accepted, driver on the way, ride started
- View active ride details (captain info, vehicle, fare, destination)
- Payment summary screen after ride completion

### For Captains (Drivers)
- Register with full vehicle details (type, color, plate, capacity)
- View personal dashboard with earnings, trips, and ratings
- Receive incoming ride requests in real time within a 10 km radius
- Accept rides and see passenger details with route info
- Display OTP to passenger to verify and start the ride
- Navigate active trips on a live map with route overlay
- Complete rides with a single tap

### Technical Highlights
- **Real-time bidirectional communication** via Socket.IO
- **Live GPS tracking** for both passengers and captains (updates every 10 seconds)
- **Geolocation-based driver discovery** using MongoDB `$geoWithin` queries
- **Interactive maps** with Leaflet and Geoapify dark-matter tiles
- **Route visualization** from Geoapify Routing API drawn as GeoJSON polylines
- **Smooth panel animations** with GSAP (GreenSock) throughout the app
- **JWT blacklisting** for secure logout (auto-expires via MongoDB TTL)
- **Cryptographically secure OTP** generation using Node.js `crypto` module
- **Address autocomplete** with debounced API calls (500ms delay)
- **Auto port fallback** — server tries next port if configured port is busy

---

## 🏗️ Architecture Overview

```
Uber Clone/
├── Backend/        # Node.js + Express REST API + Socket.IO
│   └── README.md   # Full backend documentation
└── frontend/       # React 19 + Vite SPA
    └── README.md   # Full frontend documentation
```

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Vite/React)               │
│                                                          │
│  Passenger Flow          Captain Flow                   │
│  ├── Start Page          ├── Start Page                 │
│  ├── Login/Register      ├── Login/Register             │
│  ├── Home (Book Ride)    ├── Dashboard                  │
│  └── Active Ride View    └── Active Ride View           │
│                                                          │
│  Contexts: User | Captain | Socket | Ride               │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (Axios) + WebSocket (Socket.IO)
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    Backend (Express)                     │
│                                                          │
│  REST API Routes           Socket.IO Events             │
│  ├── /api/auth/*           ├── join                     │
│  ├── /api/captain/*        ├── update-location-*        │
│  ├── /api/maps/*           ├── new-ride                 │
│  └── /api/ride/*           ├── ride-confirmed           │
│                            ├── ride-started             │
│  Services                  └── ride-ended               │
│  ├── map.service (Geoapify)                             │
│  └── ride.service (Fare, OTP, State)                    │
└──────────────────────┬──────────────────────────────────┘
                       │ Mongoose ODM
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   MongoDB Database                       │
│                                                          │
│  Collections:                                           │
│  ├── users       (passengers)                           │
│  ├── captains    (drivers + vehicle info)               │
│  ├── rides       (trip lifecycle)                       │
│  └── blacklists  (invalidated JWT tokens, TTL 24h)      │
└─────────────────────────────────────────────────────────┘
                       │ HTTPS
                       │
┌──────────────────────▼──────────────────────────────────┐
│                Geoapify Platform APIs                    │
│                                                          │
│  ├── /v1/geocode/search      (forward geocoding)        │
│  ├── /v1/geocode/autocomplete (address suggestions)     │
│  ├── /v1/geocode/reverse     (reverse geocoding)        │
│  └── /v1/routing             (distance + time + route)  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Full Tech Stack

### Backend
| Technology | Version | Role |
|------------|---------|------|
| Node.js | v18+ | Runtime environment |
| Express | ^5.2.1 | Web framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | peer dep | MongoDB ODM |
| Socket.IO | ^4.8.3 | Real-time WebSockets |
| JWT (jsonwebtoken) | ^9.0.3 | Authentication tokens |
| bcrypt | ^6.0.0 | Password hashing |
| express-validator | ^7.3.2 | Request validation |
| cookie-parser | ^1.4.7 | Cookie support |
| cors | ^2.8.6 | Cross-origin requests |
| dotenv | ^17.4.2 | Environment config |
| nodemon | ^3.1.14 | Dev auto-restart |
| axios | via service | Geoapify HTTP calls |

### Frontend
| Technology | Version | Role |
|------------|---------|------|
| React | ^19.2.0 | UI framework |
| Vite | ^7.2.4 | Build tool + dev server |
| React Router DOM | ^7.18.1 | Client-side routing |
| Tailwind CSS | ^4.3.2 | Utility-first styling |
| GSAP | ^3.15.0 | Panel animations |
| @gsap/react | ^2.1.2 | GSAP React hook |
| Leaflet | ^1.9.4 | Interactive maps |
| React-Leaflet | ^5.0.0 | React map components |
| Socket.IO Client | ^4.8.3 | Real-time connection |
| Axios | ^1.18.1 | HTTP client |
| Remixicon | ^4.9.1 | Icon library |

### External APIs
| Service | Usage |
|---------|-------|
| Geoapify Geocoding | Address to coordinates conversion |
| Geoapify Autocomplete | Location search suggestions |
| Geoapify Reverse Geocoding | Coordinates to address (current location) |
| Geoapify Routing | Distance, time, and GeoJSON route data |
| Geoapify Map Tiles | Dark-matter-brown map tiles for Leaflet |

---

## 📁 Repository Structure

```
Uber_clone/
│
├── README.md                  ← You are here (root docs)
│
├── Backend/
│   ├── README.md              ← Full backend documentation
│   ├── server.js              # Entry point
│   ├── package.json
│   ├── .env                   # Backend env vars (not committed)
│   └── src/
│       ├── app.js
│       ├── socket.js
│       ├── Database/
│       │   └── db.js
│       ├── models/
│       │   ├── user.model.js
│       │   ├── captain.model.js
│       │   ├── ride.model.js
│       │   └── blacklist.model.js
│       ├── Controlers/
│       │   ├── user.conroller.js
│       │   ├── captain.controller.js
│       │   ├── map.controller.js
│       │   └── ride.controller.js
│       ├── services/
│       │   ├── map.service.js
│       │   └── ride.service.js
│       ├── Routes/
│       │   ├── auth.routes.js
│       │   ├── captain.routes.js
│       │   ├── maps.routes.js
│       │   └── ride.routes.js
│       └── middlewares/
│           └── auth.middleware.js
│
└── frontend/
    ├── README.md              ← Full frontend documentation
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env                   # Frontend env vars (not committed)
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── assets/
        ├── Context/
        │   ├── UserContext.jsx
        │   ├── CaptainContext.jsx
        │   ├── SocketContext.jsx
        │   └── RideContext.jsx
        ├── pages/
        │   ├── Start.jsx
        │   ├── Home.jsx
        │   ├── Riding.jsx
        │   ├── UserSignUp.jsx
        │   ├── Userlogin.jsx
        │   ├── Userlogout.jsx
        │   ├── UserProtectedWrapper.jsx
        │   ├── CaptainSignUp.jsx
        │   ├── CaptainLogin.jsx
        │   ├── Captainlogout.jsx
        │   ├── CaptainProtectedWrapper.jsx
        │   ├── CpatainHome.jsx
        │   └── CaptainRiding.jsx
        └── Components/
            ├── Map.jsx
            ├── LocationSearchPanel.jsx
            ├── Cabs.jsx
            ├── Confirmedride.jsx
            ├── LookingForDriver.jsx
            ├── WaithingForDriver.jsx
            ├── RidePopUP.jsx
            ├── ConfirmRidePopUP.jsx
            └── CaptainDetails.jsx
```

---

## ⚙️ Environment Configuration

### Backend `.env` (place in `Backend/`)
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_super_secret_jwt_key_here

GEOAPIFY_BASE_URL=https://api.geoapify.com
GEOAPIFY_API_KEY=your_geoapify_api_key_here
```

### Frontend `.env` (place in `frontend/`)
```env
VITE_BASE_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
VITE_GEOAPIFY_KEY=your_geoapify_api_key_here
VITE_TOMTOM_DSK_API=your_tomtom_api_key_here
```

> Get a free Geoapify API key at https://www.geoapify.com/ (free tier: 3,000 requests/day)

---

## 🚀 Quick Start — Running Locally

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/Uber_clone.git
cd Uber_clone
```

### Step 2: Set Up MongoDB
Make sure MongoDB is running locally or provide an Atlas connection string:
```bash
# Local MongoDB
mongod --dbpath /your/data/path

# OR use MongoDB Atlas URI in Backend/.env:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net
```

### Step 3: Set Up Backend
```bash
cd Backend
npm install

# Create and configure your .env file (see above)
# Then start the server:
npm start
```
Backend starts at: `http://localhost:3000`

### Step 4: Set Up Frontend (new terminal)
```bash
cd frontend
npm install

# Create and configure your .env file (see above)
# Then start the dev server:
npm run dev
```
Frontend starts at: `http://localhost:5173`

### Step 5: Open the App
- Open `http://localhost:5173` in your browser
- To test the full flow, open two separate browser windows/tabs:
  - **Window 1** — Register/login as a **Passenger**
  - **Window 2** — Register/login as a **Captain**

---

## 🔄 Complete Ride Lifecycle

```
1. Passenger books ride
   └── POST /api/ride/create
       ├── Fare calculated (distance × rate + base)
       ├── OTP generated (6-digit secure random)
       ├── Ride saved to MongoDB (status: pending)
       └── Nearby captains found (10km radius)

2. Captain receives notification (Socket.IO: new-ride)
   └── Ride popup slides up with passenger & route info

3. Captain accepts
   └── POST /api/ride/confirm
       ├── Ride status → accepted
       └── Passenger notified (Socket.IO: ride-confirmed)

4. Passenger sees captain info + OTP
   └── Passenger shares OTP with captain

5. Captain enters OTP to start ride
   └── GET /api/ride/start-ride?OTP=XXXXXX
       ├── OTP validated
       ├── Ride status → ongoing
       └── Both navigate to active ride screens (Socket.IO: ride-started)

6. Trip in progress
   └── Both users see live map with route overlay

7. Captain ends ride
   └── POST /api/ride/end-ride
       ├── Ride status → completed
       └── Passenger navigates to /home (Socket.IO: ride-ended)
```

---

## 📡 API Endpoints Summary

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register passenger |
| POST | `/login` | No | Login passenger |
| POST | `/logout` | Yes | Logout (blacklists token) |
| GET | `/profile` | Yes | Get passenger profile |

### Captain (`/api/captain`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Register captain |
| POST | `/login` | No | Login captain |
| GET | `/profile` | Yes (captain) | Get captain profile |
| GET | `/logout` | Yes (captain) | Logout captain |

### Maps (`/api/maps`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/get-coordinates` | Yes | Address → lat/lon |
| GET | `/get-distance-time` | Yes | Distance + route between 2 points |
| GET | `/get-suggestion` | Yes | Address autocomplete |
| GET | `/current-location` | No | lat/lon → address |

### Ride (`/api/ride`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create` | Yes (user) | Create ride request |
| GET | `/getfare` | Yes (user) | Get fare estimates |
| POST | `/confirm` | Yes (captain) | Accept a ride |
| GET | `/start-ride` | Yes (captain) | Start ride with OTP |
| POST | `/end-ride` | Yes (captain) | Complete the ride |

---

## 🔌 WebSocket Events Summary

### Client → Server
| Event | Sender | Payload |
|-------|--------|---------|
| `join` | User/Captain | `{ userId, userType }` |
| `update-location-user` | Passenger | `{ userId, location: { lat, lng } }` |
| `update-location-captain` | Captain | `{ userId, location: { lat, lng } }` |

### Server → Client
| Event | Receiver | Payload |
|-------|----------|---------|
| `new-ride` | Nearby captains | Full ride object |
| `ride-confirmed` | Passenger | Ride + captain info |
| `ride-started` | Passenger | Ride object |
| `ride-ended` | Passenger | Ride object |

---

## 🗄️ Database Schema Summary

### users collection
```
_id, fullname.firstname, fullname.lastname, email, password (hashed),
socketId, location.lat, location.lng
```

### captains collection
```
_id, fullname.firstname, fullname.lastname, email, password (hashed),
status (active/inactive), vehicle.color, vehicle.plate, vehicle.capacity,
vehicle.vehicleType (car/auto/bike), socketId, location.lat, location.lng
```

### rides collection
```
_id, user (ref), captain (ref), origin, destination, vehicleType,
fare, status (pending/accepted/ongoing/completed/cancelled),
distance, duration, OTP (hidden), paymentId, orderId, signature,
createdAt, updatedAt
```

### blacklists collection
```
_id, token (unique), createdAt (TTL: 24 hours auto-delete)
```

---

## 💰 Fare Calculation

Fares are calculated dynamically based on distance (km) and duration (minutes) from Geoapify routing:

| Vehicle | Base Fare | Per Km | Per Minute |
|---------|-----------|--------|------------|
| Auto | Rs 50 | Rs 15 | Rs 2 |
| Bike | Rs 20 | Rs 8 | Rs 1 |
| Car | Rs 80 | Rs 20 | Rs 3 |

Formula: `Fare = Base + (distance × perKm) + (duration × perMin)`

---

## 🔑 Security Features

- **Bcrypt password hashing** (salt rounds: 10) — passwords never stored in plain text
- **JWT authentication** — tokens signed with `JWT_SECRET`, expire after 24 hours
- **Token blacklisting** — invalidated tokens stored in MongoDB with 24-hour TTL auto-cleanup
- **Input validation** — all API inputs validated with `express-validator` before processing
- **Auth middleware** — protected routes check token validity and blacklist status
- **CORS configuration** — backend configured to accept requests from specified origins
- **Password field hidden** — `select: false` on password field prevents accidental exposure in queries

---

## 📝 Documentation

Detailed documentation for each part of the project:

- [Backend Documentation](./Backend/README.md) — API reference, models, services, socket events, setup
- [Frontend Documentation](./frontend/README.md) — Pages, components, contexts, routes, animations, setup

---

## 🛠️ Development Notes

- The backend uses **CommonJS** (`require`/`module.exports`) module format
- The frontend uses **ES Modules** (`import`/`export`) format
- Tailwind CSS v4 is configured via the `@tailwindcss/vite` Vite plugin (no `tailwind.config.js` needed)
- GSAP animations are registered with `useGSAP` React hook for proper cleanup
- The Socket.IO client uses a `useRef` singleton pattern to prevent multiple connections on re-renders
- Location updates are batched every 10 seconds to avoid excessive database writes
- Address suggestions are debounced 500ms to avoid excessive API calls while typing

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -m "Add my feature"`
4. Push to your branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📜 License

This project is built for educational purposes as a full-stack development learning project.
