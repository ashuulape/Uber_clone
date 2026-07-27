import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  className: "invert",
});

// ─── Pure helpers ────────────────────────────────────────────────────────────

const collectRoutePoints = (value) => {
  if (!Array.isArray(value)) return [];
  if (value.length === 0) return [];
  if (typeof value[0] === "number" && typeof value[1] === "number") {
    return Number.isFinite(value[0]) && Number.isFinite(value[1])
      ? [value]
      : [];
  }
  return value.flatMap(collectRoutePoints);
};

const sanitizeCoordinates = (coords) => {
  if (!Array.isArray(coords)) return null;
  if (coords.length === 0) return [];
  if (typeof coords[0] === "number" && typeof coords[1] === "number") {
    return Number.isFinite(coords[0]) && Number.isFinite(coords[1])
      ? [coords[0], coords[1]]
      : null;
  }
  const sanitized = coords.map(sanitizeCoordinates).filter((item) => item !== null);
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

/**
 * Pans / centers the map to liveLocation.
 * Only mounted when there is NO routeData so the map doesn't fight the route view.
 */
const LiveUpdater = ({ liveLocation }) => {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (!liveLocation?.lat || !liveLocation?.lng) return;
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

/**
 * A marker whose Leaflet instance is updated imperatively so GPS-tick
 * position changes are cheap and don't cause a full remount.
 */
const LiveMarker = ({ lat, lng, icon }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current && lat != null && lng != null) {
      markerRef.current.setLatLng([lat, lng]);
    }
  }, [lat, lng]);

  if (lat == null || lng == null) return null;

  return <Marker position={[lat, lng]} icon={icon} ref={markerRef} />;
};

/**
 * Renders the GeoJSON route line + a destination icon at the last coordinate.
 * Calls onOriginResolved({ lat, lng }) with the first coordinate so the
 * parent can reposition the user icon to the actual route origin.
 *
 * GeoJSON uses [lng, lat] order; Leaflet needs [lat, lng].
 */
const RouteLayer = React.memo(({ routeData, onOriginResolved }) => {
  const safeRouteData = useMemo(() => sanitizeRouteData(routeData), [routeData]);

  const routeCoordinates = useMemo(
    () =>
      collectRoutePoints(
        safeRouteData?.features?.[0]?.geometry?.coordinates ??
          safeRouteData?.geometry?.coordinates ??
          [],
      ),
    [safeRouteData],
  );

  // GeoJSON coords are [lng, lat] → index 0 = lng, index 1 = lat
  const originPoint      = routeCoordinates.length > 0 ? routeCoordinates[0] : null;
  const destinationPoint = routeCoordinates.length > 0 ? routeCoordinates[routeCoordinates.length - 1] : null;

  // Bubble the resolved origin up to the Map component
  useEffect(() => {
    if (!onOriginResolved) return;
    onOriginResolved(
      originPoint ? { lat: originPoint[1], lng: originPoint[0] } : null,
    );
  }, [originPoint, onOriginResolved]);

  if (!safeRouteData || routeCoordinates.length === 0) return null;

  return (
    <>
      {destinationPoint && (
        <Marker
          position={[destinationPoint[1], destinationPoint[0]]}
          icon={destinationIcon}
        />
      )}
      <GeoJSON data={safeRouteData} style={{ color: "#D1FF00", weight: 4 }} />
    </>
  );
});

// ─── Main Map component ───────────────────────────────────────────────────────

const tileUrl = `https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_API}`;

const Map = (props) => {
  // GPS live location (always available once geolocation resolves)
  const liveLat = props?.LiveLocation?.lat;
  const liveLng = props?.LiveLocation?.lng;

  const hasRoute = !!props?.routeData;

  // When a route is active, RouteLayer resolves the first coordinate and
  // passes it back here so we can move the user icon to the route origin.
  const [routeOrigin, setRouteOrigin] = useState(null);
  const handleOriginResolved = useCallback((origin) => {
    setRouteOrigin(origin);
  }, []);

  /**
   * User icon position logic:
   *   • routeData present  → use route's first coordinate (origin of the trip)
   *   • no routeData       → use live GPS location
   */
  const userLat = hasRoute && routeOrigin ? routeOrigin.lat : liveLat;
  const userLng = hasRoute && routeOrigin ? routeOrigin.lng : liveLng;

  if (!liveLat || !liveLng) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <h1 className="text-center text-black/50 font-bold">Loading map...</h1>
      </div>
    );
  }

  return (
    <div className="h-full w-full pointer-events-auto absolute z-0">
      <MapContainer
        center={[liveLat, liveLng]}
        zoom={12}
        className="h-full w-full"
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        {/*
          Only auto-pan to the GPS position when there is no route.
          When a route is drawn the user can freely pan/zoom the map.
        */}
        {!hasRoute && <LiveUpdater liveLocation={props.LiveLocation} />}

        <TileLayer
          url={tileUrl}
          maxZoom={15}
          updateWhenIdle={true}
          updateWhenZooming={false}
          keepBuffer={2}
        />

        {/* User icon — route origin when route exists, live GPS otherwise */}
        <LiveMarker lat={userLat} lng={userLng} icon={userIcon} />

        {/* Route line + destination icon; also resolves origin coords back up */}
        <RouteLayer
          routeData={props?.routeData}
          onOriginResolved={handleOriginResolved}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
