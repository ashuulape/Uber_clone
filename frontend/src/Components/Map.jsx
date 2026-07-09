import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useRideContext } from '../Context/RideContext'
import L from 'leaflet'
import userIconURL from '../assets/mask.png'
import destinationIconURL from '../assets/destinations.png'

const Map = (props) => {

const userIcon = L.icon({
  iconUrl: userIconURL,
  iconSize: [40, 40],       // width, height
  iconAnchor: [10, 20],     // point that touches the location
  popupAnchor: [0, -40]     // popup position
});
const destinationIcon = L.icon({
  iconUrl: destinationIconURL,
  iconSize: [30, 30],       // width, height
  iconAnchor: [10, 30],     // point that touches the location
  popupAnchor: [0, -40],
  className: "invert"     // popup position
});

  const { routeData } = useRideContext() || props?.routeData


  const collectRoutePoints = (value) => {
    if (!Array.isArray(value)) return []
    if (value.length === 0) return []

    if (typeof value[0] === 'number' && typeof value[1] === 'number') {
      return Number.isFinite(value[0]) && Number.isFinite(value[1]) ? [value] : []
    }

    return value.flatMap(collectRoutePoints)
  }

  const sanitizeRouteData = (data) => {
    if (!data) return null

    const sanitizeCoordinates = (coords) => {
      if (!Array.isArray(coords)) return null
      if (coords.length === 0) return []
      if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        return Number.isFinite(coords[0]) && Number.isFinite(coords[1]) ? [coords[0], coords[1]] : null
      }

      const sanitized = coords.map(sanitizeCoordinates).filter((item) => item !== null)
      return sanitized.length > 0 ? sanitized : null
    }

    const features = Array.isArray(data.features) ? data.features : data.geometry ? [data] : []
    const sanitizedFeatures = features
      .map((feature) => {
        if (!feature?.geometry?.coordinates) return null

        const coordinates = sanitizeCoordinates(feature.geometry.coordinates)
        if (!coordinates) return null

        return {
          ...feature,
          geometry: {
            ...feature.geometry,
            coordinates,
          },
        }
      })
      .filter(Boolean)

    return sanitizedFeatures.length > 0 ? { ...data, features: sanitizedFeatures } : null
  }

  const safeRouteData = sanitizeRouteData(routeData)
  const routeCoordinates = collectRoutePoints(safeRouteData?.features?.[0]?.geometry?.coordinates ?? safeRouteData?.geometry?.coordinates ?? [])
  const hasRouteCoordinates = routeCoordinates.length > 0
  const originPoint = hasRouteCoordinates ? routeCoordinates[0] : null
  const destinationPoint = hasRouteCoordinates ? routeCoordinates[routeCoordinates.length - 1] : null

  

  if (!props?.LiveLocation?.lat || !props?.LiveLocation?.lng) return (
  <div className="h-full w-full flex items-center justify-center">
    <h1 className='text-center text-black/50 font-bold'>Loading map...</h1>
    </div>
)

  return (
    <div className="h-full w-full pointer-events-auto">
      <MapContainer
        center={[props?.LiveLocation.lat, props?.LiveLocation.lng]}
        zoom={12}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}.png?apiKey=7667017314a245bf853910009f4771ac`}
          maxZoom={20}
        />
        {hasRouteCoordinates ? (
          <>
            {originPoint && (
              <Marker
                key={`origin-${originPoint[1]}-${originPoint[0]}`}
                position={[originPoint[1], originPoint[0]]}
                icon={userIcon}
              />
            )}
            {destinationPoint && (
              <Marker
                key={`dest-${destinationPoint[1]}-${destinationPoint[0]}`}
                position={[destinationPoint[1], destinationPoint[0]]}
                icon={destinationIcon}
              />
            )}
            <GeoJSON data={safeRouteData} style={{ color: '#D1FF00', weight: 4 }} />
          </>
        ) : (
          <Marker position={[props?.LiveLocation?.lat, props?.LiveLocation?.lng]} icon={userIcon} />
        )}

      </MapContainer>
    </div>
  )
}

export default Map