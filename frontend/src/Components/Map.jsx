import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import userIconURL from "../assets/mask.png";
import destinationIconURL from "../assets/destinations.png";
import { Sun, Moon } from "lucide-react";

const userIcon = L.icon({
  iconUrl: userIconURL,
  iconSize: [40, 40],
  iconAnchor: [10, 20],
  popupAnchor: [0, -40],
});

const destinationIcon = L.icon({
  iconUrl: destinationIconURL,
  iconSize: [30, 30],
  iconAnchor: [10, 30],
  popupAnchor: [0, -40],
  className: `invert`,
});

// ─── Pure helpers ────────────────────────────────────────────────────────────

const isNum = (n) => typeof n === "number" && Number.isFinite(n);

const collectRoutePoints = (value) => {
  if (!Array.isArray(value)) return [];
  if (value.length === 0) return [];
  if (isNum(value[0]) && isNum(value[1])) return [value];
  return value.flatMap(collectRoutePoints);
};

const sanitizeCoordinates = (coords) => {
  if (!Array.isArray(coords)) return null;
  if (coords.length === 0) return [];
  if (isNum(coords[0]) && isNum(coords[1])) return [coords[0], coords[1]];
  const sanitized = coords
    .map(sanitizeCoordinates)
    .filter((item) => item !== null);
  return sanitized.length > 0 ? sanitized : null;
};

const sanitizeRouteData = (data) => {
  if (!data) return null;
  const features = Array.isArray(data.features)
    ? data.features
    : data.geometry
      ? [data]
      : [];
  const sanitizedFeatures = features
    .map((feature) => {
      if (!feature?.geometry?.coordinates) return null;
      const coordinates = sanitizeCoordinates(feature.geometry.coordinates);
      if (!coordinates) return null;
      return { ...feature, geometry: { ...feature.geometry, coordinates } };
    })
    .filter(Boolean);
  return sanitizedFeatures.length > 0
    ? { ...data, features: sanitizedFeatures }
    : null;
};

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Pans/centers the map to liveLocation. Only mounted when there's NO routeData. */
const LiveUpdater = ({ liveLocation }) => {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (!isNum(liveLocation?.lat) || !isNum(liveLocation?.lng)) return;
    const target = [liveLocation.lat, liveLocation.lng];

    if (!hasCentered.current) {
      map.setView(target, map.getZoom());
      hasCentered.current = true;
    } else {
      map.panTo(target, { animate: true, duration: 0.5 });
    }
  }, [liveLocation?.lat, liveLocation?.lng, map]);

  return null;
};

/** Fixes the classic "map renders blank/grey because container was 0px at mount" issue. */
const SizeFixer = () => {
  const map = useMap();
  useEffect(() => {
    // run once now, and once more after layout settles (fonts/images/flex can shift size)
    map.invalidateSize();
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

const LiveMarker = ({ lat, lng, icon }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current && isNum(lat) && isNum(lng)) {
      markerRef.current.setLatLng([lat, lng]);
    }
  }, [lat, lng]);

  if (!isNum(lat) || !isNum(lng)) return null;

  return <Marker position={[lat, lng]} icon={icon} ref={markerRef} />;
};

const ROUTE_STYLE = { color: "#B8FBFF", weight: 4 };

const RouteLayer = React.memo(({ routeData, onOriginResolved }) => {
  const safeRouteData = useMemo(
    () => sanitizeRouteData(routeData),
    [routeData],
  );

  const routeCoordinates = useMemo(
    () =>
      collectRoutePoints(
        safeRouteData?.features?.[0]?.geometry?.coordinates ??
          safeRouteData?.geometry?.coordinates ??
          [],
      ),
    [safeRouteData],
  );

  const originPoint = routeCoordinates.length > 0 ? routeCoordinates[0] : null;
  const destinationPoint =
    routeCoordinates.length > 0
      ? routeCoordinates[routeCoordinates.length - 1]
      : null;

  useEffect(() => {
    if (!onOriginResolved) return;
    onOriginResolved(
      originPoint ? { lat: originPoint[1], lng: originPoint[0] } : null,
    );
  }, [originPoint, onOriginResolved]);

  // Skip the imperative sync on the very first mount — <GeoJSON data={...}>
  // already rendered it once via props. Only needed for *updates*, since
  // react-leaflet's <GeoJSON> ignores prop changes after mount.
  const geoJsonRef = useRef(null);
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (!geoJsonRef.current) return;
    geoJsonRef.current.clearLayers();
    if (safeRouteData) geoJsonRef.current.addData(safeRouteData);
  }, [safeRouteData]);

  if (!safeRouteData || routeCoordinates.length === 0) return null;

  return (
    <>
      {destinationPoint && (
        <Marker
          position={[destinationPoint[1], destinationPoint[0]]}
          icon={destinationIcon}
        />
      )}
      <GeoJSON ref={geoJsonRef} data={safeRouteData} style={ROUTE_STYLE} />
    </>
  );
});

// ─── Main Map component ───────────────────────────────────────────────────────

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API;
if (!GEOAPIFY_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Map] VITE_GEOAPIFY_API is missing — tiles will fail to load. Check your .env file and restart the Vite dev server.",
  );
}
// const tileUrl = `https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`;

const Map = (props) => {
  const [theame, settheame] = useState(true);
  const tileUrl = theame
    ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png&api_key=${import.meta.env.VITE_MAP_KEY}`
    : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png&api_key=${import.meta.env.VITE_MAP_KEY}`;
  const liveLat = props?.LiveLocation?.lat;
  const liveLng = props?.LiveLocation?.lng;
  const hasLiveLocation = isNum(liveLat) && isNum(liveLng);

  const hasRoute = !!props?.routeData;

  const [routeOrigin, setRouteOrigin] = useState(null);
  const handleOriginResolved = useCallback((origin) => {
    setRouteOrigin(origin);
  }, []);

  const userLat = hasRoute && routeOrigin ? routeOrigin.lat : liveLat;
  const userLng = hasRoute && routeOrigin ? routeOrigin.lng : liveLng;

  const initialCenter = useRef(null);
  if (initialCenter.current === null && hasLiveLocation) {
    initialCenter.current = [liveLat, liveLng];
  }

  if (!hasLiveLocation) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <h1 className="text-center text-black/50 font-bold">Loading map...</h1>
      </div>
    );
  }

  return (
    <div className=" flex justify-center  h-[80dvh] md:h-full w-full min-h-[300px] pointer-events-auto absolute inset-0 z-0">
      <button
        onClick={() => settheame((prev) => !prev)}
        className={`fixed z-999 top-5 flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-2xl border-1 font-bold transition-colors duration-300 pointer-events-auto ${
          theame
            ? "bg-black text-white border-white"
            : "bg-white text-black border-black"
        }`}
      >
        {theame ? <Sun size={18} /> : <Moon size={18} />}
        {theame ? "Light" : "Dark"}
      </button>
      <MapContainer
        center={initialCenter.current}
        zoom={15}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <SizeFixer />

        {!hasRoute && <LiveUpdater liveLocation={props.LiveLocation} />}

        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="">UberClone</a> | '
          maxZoom={20}
          updateWhenIdle={true}
          updateWhenZooming={false}
          keepBuffer={2}
        />

        <LiveMarker lat={userLat} lng={userLng} icon={userIcon} />

        <RouteLayer
          routeData={props?.routeData}
          onOriginResolved={handleOriginResolved}
        />
      </MapContainer>
    </div>
  );
};

export default React.memo(Map);
