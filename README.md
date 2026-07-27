# 🚗 Uber Clone — Full-Stack Ride-Hailing Application

A fully-functional, real-time **Uber-style ride-hailing application** built from scratch with a **Node.js/Express backend** and a **React 19/Vite frontend**. The platform supports two distinct user roles — **Passengers** who book rides and **Captains (Drivers)** who accept and complete them — connected in real time via **Socket.IO**.

---

## 🌟 Key Features

### For Passengers
- Register and log in securely with JWT authentication
- Live GPS tracking via browser geolocation (`watchPosition`)
- Search pickup and destination addresses with autocomplete suggestions (debounced 500 ms)
- Auto-detect current location and reverse-geocode it to fill the pickup field
- Get instant fare estimates for 3 vehicle types (Car, Auto, Bike) before booking
- Book a ride and get matched with a nearby captain within a 10 km radius in real time
- Receive live updates: driver accepted → ride confirmed → ride started
- View active ride details (captain name, vehicle, plate, fare, destination) on the `/riding` page
- Route drawn as a GeoJSON polyline on the map from pickup to destination
- Redirected back to `/home` if ride data is missing (guard on `rideInfo`)

### For Captains (Drivers)
- Register with full vehicle details (type, color, plate, capacity)
- View personal dashboard with vehicle info, capacity, and plate on the home screen
- Live GPS location tracked and sent to server every 10 seconds via Socket.IO
- Receive incoming ride requests in real time (within 10 km radius via Socket.IO `new-ride`)
- Ride request popup shows passenger details, distance from captain to pickup, and route
- Accept ride: OTP is shown to the captain, passenger is notified via `ride-confirmed`
- Tap the handle on `ConfirmRidePopUP` to toggle full trip details (collapsible)
- Start ride by entering the passenger's 6-digit OTP → `ride-started` event fires
- Active ride view (`/captain/riding`) shows live map with route, distance, and "Complete Ride"
- End ride → `ride-ended` event notifies passenger, captain returns to dashboard

### Map Features
- Interactive map powered by **Leaflet** with **Geoapify dark-matter-brown tiles**
- **No route data** → map centres on live GPS; user icon tracks GPS position
- **Route data present** → user icon snaps to route origin; destination icon placed at route end; map auto-pan paused so the full route stays visible
- Route drawn as a yellow GeoJSON polyline (`#D1FF00`) over the dark map
- Custom user icon and destination icon (local PNG assets)

### Technical Highlights
- **Real-time bidirectional communication** via Socket.IO
- **Live GPS tracking** for both passengers and captains (updates every 10 seconds)
- **Geolocation-based driver discovery** using MongoDB `$geoWithin` / `$centerSphere`
- **Route visualisation** from Geoapify Routing API drawn as GeoJSON polylines
- **Smooth panel animations** with GSAP (`useGSAP` React hook)
- **JWT blacklisting** for secure logout (auto-expires via MongoDB TTL index)
- **Cryptographically secure OTP** generation using Node.js `crypto.randomInt`
- **Address autocomplete** with debounced API calls (500 ms delay)
- **Auto port fallback** — server tries next port if the configured port is busy
- Socket.IO client uses a `useRef` singleton to prevent duplicate connections on re-renders
- All socket listeners mounted inside `useEffect` with named handler refs and `socket.off` cleanup

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
│  ├── Home (Book Ride)    ├── Dashboard (CaptainHome)    │
│  ├── Active Ride View    ├── Active Ride View           │
│  └── /riding             └── /captain/riding           │
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
│  ├── /api/captain/*        ├── update-location-user     │
│  ├── /api/maps/*           ├── update-location-captain  │
│  └── /api/ride/*           ├── new-ride                 │
│                            ├── ride-confirmed           │
│  Services                  ├── ride-started             │
│  ├── map.service (Geoapify)└── ride-ended               │
│  └── ride.service (Fare, OTP, State)                    │
└──────────────────────┬──────────────────────────────────┘
                       │ Mongoose ODM
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   MongoDB Database                       │
│                                                          │
│  Collections:                                           │
│  ├── users       (passengers + socketId + location)     │
│  ├── captains    (drivers + vehicle + socketId + loc)   │
│  ├── rides       (full trip lifecycle + OTP)            │
│  └── blacklists  (invalidated JWT tokens, TTL 24h)      │
└─────────────────────────────────────────────────────────┘
                       │ HTTPS
                       │
┌──────────────────────▼──────────────────────────────────┐
│                Geoapify Platform APIs                    │
│                                                          │
│  ├── /v1/geocode/search       (forward geocoding)       │
│  ├── /v1/geocode/autocomplete (address suggestions)     │
│  ├── /v1/geocode/reverse      (reverse geocoding)       │
│  └── /v1/routing              (distance + time + route) │
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
| GSAP | ^3.15.0 | Panel slide animations |
| @gsap/react | ^2.1.2 | GSAP React hook (`useGSAP`) |
| Leaflet | ^1.9.4 | Interactive maps |
| React-Leaflet | ^5.0.0 | React map components |
| Socket.IO Client | ^4.8.3 | Real-time connection |
| Axios | ^1.18.1 | HTTP client |
| Remixicon | ^4.9.1 | Icon library |

### External APIs
| Service | Usage |
|---------|-------|
| Geoapify Geocoding | Address to coordinates conversion |
| Geoapify Autocomplete | Location search suggestions (up to 5 results) |
| Geoapify Reverse Geocoding | Coordinates to address (current location) |
| Geoapify Routing | Distance, time, and GeoJSON route polyline |
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
│   ├── server.js              # Entry point — HTTP server + Socket.IO init
│   ├── package.json
│   ├── .env                   # Backend env vars (not committed)
│   └── src/
│       ├── app.js             # Express app, middleware, route mounting
│       ├── socket.js          # Socket.IO init, join, location, dispatch
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
        ├── App.jsx            # Routes for all pages
        ├── index.css
        ├── assets/            # map.png, mask.png, car.png, auto.png, bike.png, destinations.png
        ├── Context/
        │   ├── UserContext.jsx      # user, setuser, userLiveLocation (watchPosition)
        │   ├── CaptainContext.jsx   # captain, setCaptain, CaptainLiveLocation, Ride, setRide
        │   ├── SocketContext.jsx    # singleton socket.io-client instance (useRef)
        │   └── RideContext.jsx      # ride state, fare, panels, fetchAndDrawRoute, confirmRideSelection
        ├── pages/
        │   ├── Start.jsx
        │   ├── Home.jsx            # Passenger booking flow
        │   ├── Riding.jsx          # Passenger active ride view
        │   ├── UserSignUp.jsx
        │   ├── Userlogin.jsx
        │   ├── Userlogout.jsx
        │   ├── UserProtectedWrapper.jsx
        │   ├── CaptainSignUp.jsx
        │   ├── CaptainLogin.jsx
        │   ├── Captainlogout.jsx
        │   ├── CaptainProtectedWrapper.jsx
        │   ├── CpatainHome.jsx     # Captain dashboard + ride request handling
        │   └── CaptainRiding.jsx   # Captain active ride view + FinishRidePanel
        └── Components/
            ├── Map.jsx             # Leaflet map with route-aware user/dest icons
            ├── LocationSearchPanel.jsx
            ├── Cabs.jsx            # Vehicle selector with fare display
            ├── Confirmedride.jsx   # Slide-up: OTP shown to passenger
            ├── LookingForDriver.jsx
            ├── WaithingForDriver.jsx
            ├── RidePopUP.jsx       # Captain: new ride request popup
            ├── ConfirmRidePopUP.jsx # Captain: OTP input to start ride
            └── CaptainDetails.jsx  # Captain dashboard info panel
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
VITE_GEOAPIFY_API=your_geoapify_api_key_here
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
- Both windows must grant geolocation permission for the map to work

---

## 🔄 Complete Ride Lifecycle

```
1. Passenger fills pickup + destination → clicks "Find"
   └── GET /api/ride/getfare
       └── Returns { auto, bike, car, distance } fare estimates

2. Passenger selects vehicle type → clicks "Confirm Ride"
   └── POST /api/ride/create
       ├── Fare calculated (distance × rate + base + duration)
       ├── OTP generated (6-digit crypto.randomInt)
       ├── Ride saved to MongoDB (status: pending)
       └── Nearby captains found (10 km radius, $geoWithin)
           └── Socket.IO emits new-ride to each captain

3. Captain receives new-ride popup
   └── Shows passenger details, distance, route on map

4. Captain accepts ride
   └── POST /api/ride/confirm
       ├── Ride status → accepted
       └── Socket.IO: ride-confirmed → Passenger

5. Passenger sees captain info + OTP in WaitingForDriver panel
   └── Passenger shares OTP verbally with captain

6. Captain enters OTP in ConfirmRidePopUP
   └── GET /api/ride/start-ride?rideId=...&OTP=XXXXXX
       ├── OTP validated against stored (hidden) value
       ├── Ride status → ongoing
       └── Socket.IO: ride-started → Passenger navigates to /riding
                                  → Captain stays on /captain/riding

7. Both users see live map with GeoJSON route overlay

8. Captain taps "Complete Ride" → FinishRidePanel slides up
   └── POST /api/ride/end-ride
       ├── Ride status → completed
       └── Socket.IO: ride-ended → Passenger navigates to /home
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
| GET | `/get-distance-time` | Yes | Distance + GeoJSON route (address params) |
| GET | `/get-distance-time/coords` | Yes | Distance + GeoJSON route (coord params) |
| GET | `/get-suggestion` | Yes | Address autocomplete (5 results) |
| GET | `/current-location` | No | lat/lon → address (reverse geocode) |

### Ride (`/api/ride`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create` | Yes (user) | Create ride request |
| GET | `/getfare` | Yes (user) | Get fare estimates for all vehicle types |
| POST | `/confirm` | Yes (captain) | Accept a ride |
| GET | `/start-ride` | Yes (captain) | Start ride with OTP verification |
| POST | `/end-ride` | Yes (captain) | Complete the ride |

---

## 🔌 WebSocket Events Summary

### Client → Server
| Event | Sender | Payload |
|-------|--------|---------|
| `join` | User/Captain | `{ userId, userType: 'user' \| 'captain' }` |
| `update-location-user` | Passenger | `{ userId, location: { lat, lng } }` |
| `update-location-captain` | Captain | `{ userId, location: { lat, lng } }` |

### Server → Client
| Event | Receiver | Payload |
|-------|----------|---------|
| `new-ride` | Nearby captains (10 km) | Full ride object (user populated, OTP cleared) |
| `ride-confirmed` | Passenger | Ride object + captain info (password stripped) |
| `ride-started` | Passenger | Ride object |
| `ride-ended` | Passenger | Ride object |

---

## 🗄️ Database Schema Summary

### users collection
```
_id, fullname.firstname, fullname.lastname, email, password (hashed, select:false),
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
distance, duration, OTP (select:false), paymentId, orderId, signature,
createdAt, updatedAt
```

### blacklists collection
```
_id, token (unique), createdAt (TTL index: 24-hour auto-delete)
```

---

## 💰 Fare Calculation

Fares are calculated dynamically based on distance (km) and duration (minutes) from Geoapify routing:

| Vehicle | Base Fare | Per Km | Per Minute |
|---------|-----------|--------|------------|
| Auto | ₹50 | ₹15 | ₹2 |
| Bike | ₹20 | ₹8 | ₹1 |
| Car | ₹80 | ₹20 | ₹3 |

**Formula:** `Fare = Base + (distanceKm × perKm) + (durationMin × perMin)`

---

## 🔑 Security Features

- **Bcrypt password hashing** (salt rounds: 10) — passwords never stored in plain text
- **JWT authentication** — tokens signed with `JWT_SECRET`, expire after 24 hours
- **Token blacklisting** — invalidated tokens stored in MongoDB with 24-hour TTL auto-cleanup
- **Input validation** — all API inputs validated with `express-validator` before processing
- **Auth middleware** — protected routes check token validity and blacklist status on every request
- **CORS** — backend accepts requests from all origins (configurable)
- **Password field hidden** — `select: false` on password prevents accidental exposure in queries
- **OTP hidden** — `select: false` on OTP field; only exposed when explicitly needed via `.select('+OTP')`

---

## 📝 Documentation

- [Backend Documentation](./Backend/README.md) — API reference, models, services, socket events, setup
- [Frontend Documentation](./frontend/README.md) — Pages, components, contexts, routes, animations, setup

---

## 🛠️ Development Notes

- The backend uses **CommonJS** (`require`/`module.exports`) module format
- The frontend uses **ES Modules** (`import`/`export`) format
- Tailwind CSS v4 is configured via the `@tailwindcss/vite` Vite plugin (no `tailwind.config.js` needed)
- GSAP animations use the `useGSAP` React hook for automatic cleanup on unmount
- Socket.IO client uses a `useRef` singleton pattern (`SocketContext.jsx`) to prevent duplicate connections on re-renders
- Socket listeners are always registered inside `useEffect` with named handler functions passed to both `.on()` and `.off()` for leak-free cleanup
- Location updates emit every 10 seconds to avoid excessive database writes
- Address suggestions are debounced 500 ms to avoid excessive API calls while typing
- `$geoWithin` / `$centerSphere` requires coordinates stored as `[lat, lng]` numbers in MongoDB

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
