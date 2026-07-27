# 🚗 Uber Clone — Frontend

A **React 19 + Vite** single-page application that provides both the **Passenger** and **Captain (Driver)** interfaces for the Uber Clone ride-hailing platform. Built with Tailwind CSS v4, GSAP panel animations, Leaflet maps with Geoapify tiles, and Socket.IO for real-time ride updates.

---

## 📁 Project Structure

```
frontend/
├── index.html
├── vite.config.js
├── package.json
├── .env                       # Frontend env vars (not committed)
└── src/
    ├── main.jsx               # React root — wraps App in all Providers
    ├── App.jsx                # React Router route definitions
    ├── index.css              # Global styles + Tailwind imports
    ├── assets/
    │   ├── map.png            # Placeholder map image (Start page background)
    │   ├── mask.png           # User/Captain avatar icon on the map
    │   ├── destinations.png   # Destination pin icon on the map
    │   ├── car.png            # Car vehicle image (Riding page)
    │   ├── auto.png           # Auto-rickshaw vehicle image
    │   └── bike.png           # Bike vehicle image
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

## ⚙️ Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_BASE_URL=http://localhost:3000
VITE_GEOAPIFY_API=your_geoapify_api_key_here
```

> `VITE_GEOAPIFY_API` is used directly in `Map.jsx` to authenticate Geoapify map tile requests.

---

## 🚀 Getting Started

```bash
cd frontend
npm install
npm run dev
```

Dev server starts at: `http://localhost:5173`

### npm Scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🗺️ Routes

Defined in [App.jsx](./src/App.jsx):

| Path | Component | Protection |
|------|-----------|-----------|
| `/` | `Start` | Public |
| `/register` | `UserSignUp` | Public |
| `/login` | `Userlogin` | Public |
| `/home` | `Home` | User auth required |
| `/riding` | `Riding` | User auth required |
| `/user/logout` | `Userlogout` | User auth required |
| `/captain/register` | `CaptainSignUp` | Public |
| `/captain/login` | `CaptainLogin` | Public |
| `/captain/logout` | `Captainlogout` | Public |
| `/captainhome` | `CpatainHome` | Captain auth required |
| `/captain/riding` | `CaptainRiding` | Captain auth required |
| `*` | 404 page | — |

Protected routes are wrapped with `UserProtectedWrapper` or `CaptainProtectedWrapper`, which verify the JWT token via the profile API endpoints and redirect to login if unauthenticated.

---

## 🧠 State Management — Contexts

### `UserContext` ([UserContext.jsx](./src/Context/UserContext.jsx))
Global state for the logged-in **passenger**.

| Exported Value | Type | Description |
|----------------|------|-------------|
| `user` | Object | `{ email, fullname: { firstname, lastname } }` |
| `setuser` | Function | Updates user state after login |
| `userLiveLocation` | Object | `{ lat, lng }` — updated continuously via `navigator.geolocation.watchPosition` |

---

### `CaptainContext` ([CaptainContext.jsx](./src/Context/CaptainContext.jsx))
Global state for the logged-in **captain**.

| Exported Value | Type | Description |
|----------------|------|-------------|
| `captain` | Object | `{ email, fullname, vehicle: { color, plate, capacity, vehicleType } }` |
| `setCaptain` | Function | Updates captain state after login |
| `CaptainLiveLoaction` | Object | `{ lat, lng }` — one-time `getCurrentPosition` on mount |
| `Ride` | Object | The current active ride object (set when `new-ride` arrives) |
| `setRide` | Function | Updates the active ride |

---

### `SocketContext` ([SocketContext.jsx](./src/Context/SocketContext.jsx))
Provides a singleton Socket.IO client instance to the entire app.

- Uses `useRef` to ensure the socket is created **only once** (not on every render)
- Connects to `VITE_BASE_URL` with `transports: ['websocket', 'polling']`
- Exposes `{ socket }` via context

**Usage:**
```jsx
const { socket } = useSocketContext();
socket.on('some-event', handler);
```

---

### `RideContext` ([RideContext.jsx](./src/Context/RideContext.jsx))
Global state for the passenger's booking flow and ride data.

| Exported Value | Type | Description |
|----------------|------|-------------|
| `pickup` / `setPickup` | String | Pickup address input |
| `destination` / `setDestination` | String | Destination address input |
| `panelopen` / `setPanelopen` | Boolean | Location search panel visibility |
| `vehiclePanel` / `setVehiclePanel` | Boolean | Vehicle selector panel visibility |
| `confirmRidePanel` / `setConfirmRidePanel` | Boolean | Confirm ride panel visibility |
| `lookingPanel` / `setLookingPanel` | Boolean | "Looking for driver" panel visibility |
| `waitingForDriverPanel` / `setWaitingForDriverPanel` | Boolean | "Waiting for driver" panel visibility |
| `suggestions` / `setSuggestions` | Array | Address autocomplete results |
| `activeField` / `setActiveField` | String | `'pickup'` or `'destination'` |
| `isFetchingSuggestions` | Boolean | Loading spinner for suggestions |
| `fare` / `setFare` | Object | `{ auto, bike, car, distance }` |
| `rideInfo` / `setRideInfo` | Object | Full ride object after captain confirms |
| `loading` / `setLoading` | Boolean | Fare fetch loading state |
| `confirmRideSelection(vehicleType)` | Function | Posts to `/api/ride/create` |
| `fetchAndDrawRoute(origin, dest)` | Function | Fetches GeoJSON route from `/api/maps/get-distance-time` |
| `fetchAndDrawRouteBycoords(origin, dest)` | Function | Fetches GeoJSON route from `/api/maps/get-distance-time/coords` |

---

## 📄 Pages

### `Start.jsx` — `/`
Landing page with links to login and register for both passengers and captains.

---

### `Home.jsx` — `/home` (Passenger)
The main passenger booking screen. Contains the full booking flow.

**Socket.IO events handled:**
- Emits `join` with `{ userType: 'user', userId }` on mount
- Emits `update-location-user` every 10 seconds
- Listens for `ride-confirmed` → shows WaitingForDriver panel, stores ride info
- Listens for `ride-started` → navigates to `/riding`

**UI panels (GSAP slide animations):**
1. **Location Search Panel** — slides up when input focused, shows `LocationSearchPanel`
2. **Vehicle Panel** — `Cabs` component slides up after fare is fetched
3. **Confirm Ride Panel** — `Confirmedride` component (shows OTP to passenger)
4. **Looking for Driver Panel** — `LookingForDriver` component
5. **Waiting for Driver Panel** — `WaithingForDriver` component (shows captain info)

**`Findtrip()` function flow:**
1. Guard: requires `socket`, `user._id`, `pickup`, and `destination`
2. Sets `loading = true`, closes search panel
3. Calls `GET /api/ride/getfare` → stores fare in context
4. On success only, opens vehicle panel (`setVehiclePanel(true)`)
5. `finally` resets `loading = false`

---

### `Riding.jsx` — `/riding` (Passenger)
Active ride view for the passenger.

- Redirects to `/home` if `rideInfo` is null (guard on context)
- Draws route on map using `fetchAndDrawRoute(origin, destination)` on mount
- Shows captain name, vehicle plate, vehicle type, destination, and fare
- Shows vehicle image (car/auto/bike) based on `rideInfo.captain.vehicle.vehicleType`
- "Make a Payment" button (UI placeholder — payment not yet integrated)

---

### `CpatainHome.jsx` — `/captainhome` (Captain)
Captain's dashboard and ride-request handler.

**Socket.IO events handled:**
- Emits `join` with `{ userType: 'captain', userId: captain._id }` on mount
- Emits `update-location-captain` every 10 seconds
- Listens for `new-ride` → stores ride in `CaptainContext`, shows `RidePopUP`

**UI panels:**
- **`CaptainDetails`** — always visible at the bottom (vehicle stats)
- **`RidePopUP`** — slides up when a new ride arrives
- **`ConfirmRidePopUP`** — slides up when captain confirms, shows OTP input

---

### `CaptainRiding.jsx` — `/captain/riding` (Captain)
Active ride view for the captain.

- Redirects to `/captainhome` if `Ride` is null
- Draws route on map from `origin` to `destination` using `fetchAndDrawRoute`
- Displays rider's name, distance, rating, pickup, destination, and fare
- Bottom strip shows distance KM and "Complete Ride" button
- **`FinishRidePanel`** — slides up on "Complete Ride" tap; shows trip summary and links to `/captainhome`

---

### Auth Pages
| Page | Route | Description |
|------|-------|-------------|
| `UserSignUp` | `/register` | Passenger registration form |
| `Userlogin` | `/login` | Passenger login form |
| `Userlogout` | `/user/logout` | Calls logout API, clears token, redirects |
| `CaptainSignUp` | `/captain/register` | Captain registration with vehicle details |
| `CaptainLogin` | `/captain/login` | Captain login form |
| `Captainlogout` | `/captain/logout` | Captain logout, clears token |

---

## 🧩 Components

### `Map.jsx`
The Leaflet map component. Accepts `LiveLocation` and `routeData` props.

**Behaviour:**

| Condition | User Icon Position | Destination Icon | Map Auto-pan |
|-----------|--------------------|-----------------|--------------|
| No `routeData` | GPS (`LiveLocation`) | Hidden | ✅ Yes |
| `routeData` present | Route's **first** coordinate (origin) | Route's **last** coordinate | ❌ Paused |

**Internal components:**
- **`LiveUpdater`** — pans/centres the map to live GPS; only mounted when no route is active
- **`LiveMarker`** — updates marker position imperatively via Leaflet instance for cheap GPS-tick updates
- **`RouteLayer`** — renders GeoJSON polyline (`#D1FF00`, weight 4) and destination icon; resolves route origin via `onOriginResolved` callback
- **`sanitizeRouteData`** — cleans NaN/invalid coordinates before passing to Leaflet GeoJSON

**Map tiles:** Geoapify `dark-matter-brown` via `VITE_GEOAPIFY_API`

---

### `LocationSearchPanel.jsx`
Renders autocomplete suggestion list.
- Shows a spinner while `isLoading` is true
- Each suggestion is clickable and calls `onSelectSuggestion(location)`

---

### `Cabs.jsx`
Vehicle selector shown after fare is fetched.
- Lists 3 vehicles: Car, Auto, Bike
- Shows fare and distance for each
- Highlights the selected vehicle with an outline
- "Confirm Ride" button calls `confirmRideSelection(vehicleType)` then opens `confirmRidePanel`

---

### `Confirmedride.jsx`
Shown to the passenger while the backend is searching for a captain.
- Displays pickup, destination, and fare
- "Cancel" closes the panel

---

### `LookingForDriver.jsx`
Animated "searching for driver" panel.

---

### `WaithingForDriver.jsx`
Shown after captain accepts. Displays:
- Captain's name, phone, vehicle colour/plate
- Passenger OTP (to share with captain verbally)
- Pickup and destination addresses
- Fare

---

### `RidePopUP.jsx`
Captain-side popup that appears when a new ride request arrives.
- Shows passenger name, rating, fare, distance from captain to pickup
- On "Accept": draws route from captain's current location to the pickup (`fetchAndDrawRoute`), then calls `ConfirmRide()`
- On "Reject": dismisses the panel

---

### `ConfirmRidePopUP.jsx`
Captain-side panel to enter the 6-digit OTP and start the ride.
- **Handle tap** → toggles collapsible trip detail section (origin, destination, fare)
- OTP input field
- **"Confirm"** → submits to `GET /api/ride/start-ride`
- **"Cancel"** → closes the panel

---

### `CaptainDetails.jsx`
Captain's always-visible bottom info panel on the dashboard.
- Shows captain avatar (`mask.png`), full name, and email
- Earnings today (static `₹0` — earnings not yet integrated)
- Stats grid: Vehicle Type | Capacity | Plate

---

## 🎬 Animations

All sliding panels use **GSAP** via the `useGSAP` hook:

| Panel | Open | Close |
|-------|------|-------|
| Location search | `height: 50%` | `height: 0` |
| Arrow icon | `rotate: 180°` | `rotate: 0°` |
| Vehicle / Confirm / Looking / Waiting panels | `translateY(0)` | `translateY(100%)` |
| Captain RidePopUP / ConfirmPopUp | `translateY(0)` | `translateY(100%)` |
| FinishRidePanel | `translateY(0)` | `translateY(100%)` |

---

## 🔌 Socket.IO Integration Pattern

All socket listeners follow this clean pattern to avoid memory leaks:

```jsx
useEffect(() => {
  if (!socket) return;

  const handleEvent = (data) => {
    // handle data
  };

  socket.on('event-name', handleEvent);

  return () => {
    socket.off('event-name', handleEvent); // named ref ensures correct cleanup
  };
}, [socket]);
```

Socket emits `join` once on mount, and location updates are emitted every 10 seconds via `setInterval` (cleared on unmount).

---

## 📦 Dependencies

### Production
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.0 | UI framework |
| `react-dom` | ^19.2.0 | React DOM renderer |
| `react-router-dom` | ^7.18.1 | Client-side routing |
| `axios` | ^1.18.1 | HTTP client for API calls |
| `socket.io-client` | ^4.8.3 | Real-time WebSocket connection |
| `gsap` | ^3.15.0 | Panel animations |
| `@gsap/react` | ^2.1.2 | `useGSAP` hook for React |
| `leaflet` | ^1.9.4 | Interactive map library |
| `react-leaflet` | ^5.0.0 | React wrapper for Leaflet |
| `tailwindcss` | ^4.3.2 | Utility-first CSS |
| `@tailwindcss/vite` | ^4.3.2 | Tailwind v4 Vite plugin |
| `remixicon` | ^4.9.1 | Icon library (used via CSS class names) |

### Dev
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^7.2.4 | Build tool and dev server |
| `@vitejs/plugin-react` | ^5.1.1 | React fast refresh for Vite |
| `eslint` | ^9.39.1 | Linting |
| `eslint-plugin-react-hooks` | ^7.0.1 | React hooks lint rules |
| `eslint-plugin-react-refresh` | ^0.4.24 | React Refresh lint rules |

---

## 🛠️ Development Notes

- Tailwind CSS v4 requires no `tailwind.config.js` — configured entirely via the `@tailwindcss/vite` plugin
- The Socket.IO client is instantiated **once** in `SocketContext` using `useRef`, preventing duplicate connections across re-renders
- `RideContext` manages all passenger-side state; `CaptainContext` manages all captain-side state
- GeoJSON from Geoapify uses `[lng, lat]` coordinate order; Leaflet uses `[lat, lng]` — `RouteLayer` handles this conversion internally
- `sanitizeRouteData` in `Map.jsx` filters out any `NaN` or invalid coordinates before passing data to Leaflet's `GeoJSON` component
- Vehicle images (car/auto/bike) are local PNG assets imported in `Riding.jsx`
- `remixicon` is imported as a CSS file (`remixicon/fonts/remixicon.css`) and used via class names (e.g., `ri-map-pin-fill`)
- The `home` component in `Home.jsx` is intentionally lowercase (not a React convention error — it is exported as `default` and imported as `Home` in `App.jsx`)
