# 🚗 Uber Clone — Frontend

A modern, real-time ride-hailing frontend built with **React 19 + Vite**, styled with **Tailwind CSS v4**, animated with **GSAP**, and powered by live maps via **React-Leaflet** and **Geoapify** tiles. The app supports two separate user flows: **Passengers** booking rides and **Captains (Drivers)** accepting and managing them.

---

## 📁 Project Structure

```
frontend/
├── index.html                   # HTML entry point
├── vite.config.js               # Vite + Tailwind plugin config
├── eslint.config.js             # ESLint configuration
├── package.json
├── .env                         # Environment variables
├── public/                      # Static public assets
└── src/
    ├── main.jsx                 # React root — wraps app with all providers
    ├── App.jsx                  # Route definitions (React Router v7)
    ├── index.css                # Global styles
    ├── assets/                  # Static images (map, car, bike, auto, icons)
    ├── Context/
    │   ├── UserContext.jsx      # Passenger state + live GPS tracking
    │   ├── CaptainContext.jsx   # Captain state + live GPS tracking
    │   ├── SocketContext.jsx    # Socket.IO client singleton
    │   └── RideContext.jsx      # Full ride booking state machine + API calls
    ├── pages/
    │   ├── Start.jsx            # Landing / splash page
    │   ├── UserSignUp.jsx       # Passenger registration
    │   ├── Userlogin.jsx        # Passenger login
    │   ├── Userlogout.jsx       # Passenger logout handler
    │   ├── UserProtectedWrapper.jsx  # Auth guard for passenger routes
    │   ├── Home.jsx             # Main passenger booking page (map + panels)
    │   ├── Riding.jsx           # Active ride view for passenger
    │   ├── CaptainSignUp.jsx    # Captain registration
    │   ├── CaptainLogin.jsx     # Captain login
    │   ├── Captainlogout.jsx    # Captain logout handler
    │   ├── CaptainProtectedWrapper.jsx  # Auth guard for captain routes
    │   ├── CpatainHome.jsx      # Captain dashboard (map + ride requests)
    │   └── CaptainRiding.jsx    # Active ride view for captain
    └── Components/
        ├── Map.jsx              # Leaflet map with live location + route overlay
        ├── LocationSearchPanel.jsx  # Address suggestion dropdown
        ├── Cabs.jsx             # Vehicle selector with fares
        ├── Confirmedride.jsx    # Ride confirmation panel
        ├── LookingForDriver.jsx # Waiting for driver animation panel
        ├── WaithingForDriver.jsx # Driver found / on-the-way panel
        ├── RidePopUP.jsx        # Incoming ride popup for captain
        ├── ConfirmRidePopUP.jsx # OTP display panel for captain
        └── CaptainDetails.jsx   # Captain stats panel on dashboard
```

---

## 🛠️ Tech Stack & Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.0 | UI framework |
| `react-dom` | ^19.2.0 | React DOM renderer |
| `react-router-dom` | ^7.18.1 | Client-side routing |
| `axios` | ^1.18.1 | HTTP client for API calls |
| `socket.io-client` | ^4.8.3 | Real-time WebSocket communication |

### Maps & Geolocation

| Package | Version | Purpose |
|---------|---------|---------|
| `leaflet` | ^1.9.4 | Interactive map engine |
| `react-leaflet` | ^5.0.0 | React wrapper for Leaflet |

### Animations

| Package | Version | Purpose |
|---------|---------|---------|
| `gsap` | ^3.15.0 | Animation library (panel transitions) |
| `@gsap/react` | ^2.1.2 | React hook integration for GSAP |

### Styling & Icons

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4.3.2 | Utility-first CSS framework |
| `@tailwindcss/vite` | ^4.3.2 | Vite plugin for Tailwind v4 |
| `remixicon` | ^4.9.1 | Icon library (800+ icons) |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^7.2.4 | Build tool and dev server |
| `@vitejs/plugin-react` | ^5.1.1 | React Fast Refresh for Vite |
| `eslint` | ^9.39.1 | Code linting |
| `@types/react` | ^19.2.5 | TypeScript types for React |

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend/` root:

```env
VITE_BASE_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
VITE_GEOAPIFY_KEY=your_geoapify_api_key
VITE_TOMTOM_DSK_API=your_tomtom_api_key
```

> All Vite env variables must be prefixed with `VITE_` to be accessible in the browser.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm
- Backend server running on `http://localhost:3000`

### Installation & Running

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will open at `http://localhost:5173` (Vite default).

### Build for Production

```bash
npm run build
```

Output is placed in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🧭 Application Routes

| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/` | `Start` | No | Landing / splash page |
| `/register` | `UserSignUp` | No | Passenger registration |
| `/login` | `Userlogin` | No | Passenger login |
| `/home` | `Home` | Yes (User) | Passenger main booking screen |
| `/riding` | `Riding` | Yes (User) | Active ride view for passenger |
| `/user/logout` | `Userlogout` | Yes (User) | Handles passenger logout |
| `/captain/register` | `CaptainSignUp` | No | Captain registration |
| `/captain/login` | `CaptainLogin` | No | Captain login |
| `/captainhome` | `CpatainHome` | Yes (Captain) | Captain dashboard |
| `/captain/riding` | `CaptainRiding` | Yes (Captain) | Active ride view for captain |
| `/captain/logout` | `Captainlogout` | No | Handles captain logout |
| `*` | Inline | No | 404 Not Found |

---

## 🗂️ Context Providers

All context providers are composed in `main.jsx` and wrap the entire app tree.

### UserContext (`src/Context/UserContext.jsx`)
Manages passenger state and live location tracking.

**Provides:**
- `user` — logged-in user data `{ email, fullname: { firstname, lastname } }`
- `setuser` — updates user data after login/register
- `userLiveLocation` — continuously updated `{ lat, lng }` via `navigator.geolocation.watchPosition`

---

### CaptainContext (`src/Context/CaptainContext.jsx`)
Manages captain (driver) state and location.

**Provides:**
- `captain` — logged-in captain data with vehicle info
- `setCaptain` — updates captain data
- `CaptainLiveLoaction` — current GPS position `{ lat, lng }`
- `Ride` — the current active/incoming ride object
- `setRide` — sets ride data when a new ride arrives via socket

---

### SocketContext (`src/Context/SocketContext.jsx`)
Creates and maintains a single, persistent Socket.IO connection.

**Provides:**
- `socket` — the Socket.IO client instance

**Usage:**
```jsx
import { useSocketContext } from '../Context/SocketContext'
const { socket } = useSocketContext()
```

The connection is stored in a `useRef` to prevent reconnection on re-renders. Connects to `VITE_BASE_URL` or falls back to `http://localhost:3000`.

---

### RideContext (`src/Context/RideContext.jsx`)
The central state machine for the entire passenger ride booking flow.

**Provides:**

| State | Type | Description |
|-------|------|-------------|
| `pickup` | string | Pickup location address |
| `destination` | string | Destination address |
| `currentLocation` | object | User's current GPS coords |
| `panelopen` | boolean | Location search panel visibility |
| `vehiclePanel` | boolean | Vehicle selection panel visibility |
| `confirmRidePanel` | boolean | Ride confirmation panel visibility |
| `lookingPanel` | boolean | "Looking for driver" panel visibility |
| `waitingForDriverPanel` | boolean | "Driver on the way" panel visibility |
| `suggestions` | array | Address autocomplete results |
| `activeField` | string | Which input is focused: `pickup` or `destination` |
| `fare` | object | `{ auto, bike, car, distance }` fare breakdown |
| `rideInfo` | object | Full ride details after captain confirms |
| `loading` | boolean | API call in-progress state |

**Actions:**

| Function | Description |
|----------|-------------|
| `confirmRideSelection(vehicleType)` | POSTs to `/api/ride/create` to create the ride |
| `fetchAndDrawRoute(origin, destination)` | GETs distance/time data from `/api/maps/get-distance-time` for map rendering |

---

## 📄 Pages Breakdown

### Start (`/`)
Landing page with navigation buttons to passenger and captain login/register flows. Serves as the app entry point.

---

### UserSignUp & Userlogin (`/register`, `/login`)
Form pages for passenger authentication. On success:
- Store the JWT token in `localStorage`
- Update `UserContext` with user data
- Navigate to `/home`

---

### UserProtectedWrapper
Route guard component. Checks for a valid token in `localStorage`, calls `/api/auth/profile` to validate, and redirects to `/login` if unauthenticated.

---

### Home (`/home`) — Main Passenger Screen
The most complex page in the app. Features:

- **Full-screen interactive map** (Leaflet) showing live user location and route
- **Sliding search panel** — expands to show address autocomplete suggestions
- **Vehicle selection panel** — shows fare for all 3 vehicle types
- **Ride confirmation panel** — confirms the selected ride
- **Looking for driver panel** — animated waiting state
- **Driver on the way panel** — shows matched captain's info

**Key logic:**
- Debounced address suggestions (500ms delay)
- Fetches current location on mount via `navigator.geolocation`
- Auto-fills pickup field with reverse-geocoded current location
- Emits socket `join` and `update-location-user` events (every 10 seconds)
- Listens for `ride-confirmed` event → shows captain info panel
- Listens for `ride-started` event → navigates to `/riding`
- All panel animations driven by **GSAP** (`translateY` transitions)

---

### Riding (`/riding`) — Active Ride View (Passenger)
Displayed after captain starts the ride. Shows:
- Live map with route overlay
- Captain's name, vehicle plate, and vehicle type
- Vehicle image (car/auto/bike)
- Destination address
- Fare amount
- "Make a Payment" button (placeholder)
- Navigates back to `/home` when `ride-ended` socket event fires

---

### CaptainSignUp & CaptainLogin (`/captain/register`, `/captain/login`)
Form pages for captain registration and authentication. Captain registration collects:
- Full name, email, password
- Vehicle: color, plate number, capacity, type (car/auto/bike)

On success:
- JWT stored in `localStorage`
- Updates `CaptainContext`
- Navigates to `/captainhome`

---

### CaptainProtectedWrapper
Auth guard for captain routes. Validates captain token via `/api/captain/profile`.

---

### CpatainHome (`/captainhome`) — Captain Dashboard
Captain's main screen. Features:

- **Full-screen live map** showing captain's current location
- **Captain details panel** at the bottom (earnings, hours, rating stats)
- **Incoming ride popup** — slides up when a new ride request arrives
- **Ride confirmation popup** — slides up after accepting, shows OTP to rider

**Key logic:**
- Emits `join` and `update-location-captain` socket events (every 10 seconds)
- Listens for `new-ride` socket event → shows ride request popup with passenger and route details
- `ConfirmRide()` calls `POST /api/ride/confirm` then transitions to confirmation panel
- Animations driven by **GSAP**

---

### CaptainRiding (`/captain/riding`) — Active Ride View (Captain)
Displayed during an active trip. Shows:

- Live map with route overlay for the entire trip
- Top badge: "On Trip" with green pulsing indicator
- Bottom strip: distance remaining, estimated time, "Complete Ride" button
- **Finish Ride panel** (slides up) — shows passenger info, pickup, destination, fare
- `endride()` calls `POST /api/ride/end-ride`, navigates back to `/captainhome` on success

---

## 🧩 Components Breakdown

### Map (`src/Components/Map.jsx`)
A reusable, full-featured interactive map component.

**Props:**
- `LiveLocation` — `{ lat, lng }` to center the map and show user marker
- `routeData` — GeoJSON data from Geoapify routing API to draw the route

**Features:**
- Uses **Leaflet** dark-matter tiles from Geoapify
- Custom icons for user position and destination marker
- `LiveUpdater` sub-component re-centers map whenever `LiveLocation` changes
- Sanitizes GeoJSON coordinates to prevent rendering errors
- Draws route polyline in bright yellow-green (`#D1FF00`)
- Shows both origin marker and destination pin when route is available
- Displays a "Loading map..." fallback while GPS is not yet available

---

### LocationSearchPanel (`src/Components/LocationSearchPanel.jsx`)
Dropdown list of address suggestions.

**Props:**
- `suggestions` — array of location objects
- `isLoading` — shows a spinner while fetching
- `onSelectSuggestion` — callback when user taps a suggestion

---

### Cabs (`src/Components/Cabs.jsx`)
Vehicle type selector displaying fare estimates.

Shows cards for `car`, `auto`, and `bike` with:
- Vehicle image
- Capacity info
- Calculated fare from `RideContext`
- "Find trip" button to open confirmation panel

---

### Confirmedride (`src/Components/Confirmedride.jsx`)
Ride confirmation panel. Shows:
- Pickup and destination addresses
- Selected vehicle info
- Fare amount
- "Confirm" button → calls `confirmRideSelection()` from `RideContext`, then opens "Looking for driver" panel

---

### LookingForDriver (`src/Components/LookingForDriver.jsx`)
Animated waiting panel shown while the system searches for a driver. Includes a loading animation and ride summary.

---

### WaithingForDriver (`src/Components/WaithingForDriver.jsx`)
Shown after a captain has accepted. Displays:
- Captain's name and photo
- Vehicle plate and type
- Pickup location
- Fare amount
- 4-digit OTP for ride verification

---

### RidePopUP (`src/Components/RidePopUP.jsx`)
Slides up on the captain's screen when a new ride request arrives. Shows:
- Passenger name and photo
- Pickup and destination addresses
- Distance and estimated time between captain and pickup
- "Accept" and "Ignore" buttons

---

### ConfirmRidePopUP (`src/Components/ConfirmRidePopUP.jsx`)
Shown to captain after accepting. Displays:
- Passenger info
- Trip details (origin, destination, fare)
- The **OTP** that the passenger must share with captain to start the ride
- "Confirm" button to proceed to captain riding screen

---

### CaptainDetails (`src/Components/CaptainDetails.jsx`)
Stats panel shown on the captain dashboard. Displays:
- Captain name, rating, and vehicle plate
- Earnings, hours online, and rides completed

---

## 🔄 Real-Time Communication Flow

```
Passenger Books Ride
    ↓
POST /api/ride/create
    ↓
Backend finds captains within 10km
    ↓ (Socket.IO emit: 'new-ride')
Captain sees RidePopUP
    ↓
Captain clicks "Accept"
    ↓
POST /api/ride/confirm
    ↓ (Socket.IO emit: 'ride-confirmed')
Passenger sees captain info + OTP
    ↓
Captain enters passenger OTP
    ↓
GET /api/ride/start-ride?OTP=...
    ↓ (Socket.IO emit: 'ride-started')
Both navigate to Riding screens
    ↓
Captain clicks "Complete Ride"
    ↓
POST /api/ride/end-ride
    ↓ (Socket.IO emit: 'ride-ended')
Passenger returns to /home
Captain returns to /captainhome
```

---

## 📍 Geolocation Usage

| Feature | Method | Interval |
|---------|--------|---------|
| User live map tracking | `watchPosition` | Continuous |
| User server location sync | `getCurrentPosition` | Every 10 seconds |
| Captain live map tracking | `getCurrentPosition` | On mount |
| Captain server location sync | `getCurrentPosition` | Every 10 seconds |
| Auto-fill pickup address | `getCurrentPosition` | On home page mount |

---

## 🎨 UI & Animation Details

- **Dark theme** throughout — black backgrounds with white text
- **Glassmorphism** elements — `bg-black/40 backdrop-blur-md` overlays on map
- **GSAP animations** — all bottom panels use `translateY` slide transitions with `power3.out` easing
- **Remixicon** — used for all icons (location pins, arrows, currency, vehicle types)
- **Tailwind CSS v4** — utility classes for layout, spacing, colors, and responsive design
- **Custom map tiles** — Geoapify "dark-matter-brown" style for an immersive dark map look

---

## 📝 npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Build for production |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint .` | Run ESLint on entire project |

---

## 🗺️ Map Setup Note

The map component uses Geoapify tile layers. Make sure `VITE_GEOAPIFY_KEY` is set in your `.env`. Tiles use the URL format:

```
https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}.png?apiKey=YOUR_KEY
```
