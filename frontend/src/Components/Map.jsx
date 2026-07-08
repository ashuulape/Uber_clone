import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const Map = ({ setLocation, location }) => {
  useEffect(() => {
    if (location?.lat && location?.lng) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation?.({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        console.error('Error getting location:', error)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [location, setLocation])

  if (!location?.lat || !location?.lng) return (
  <div className="h-full w-full flex items-center justify-center">
    <h1 className='text-center text-black/50 font-bold'>Loading map...</h1>
    </div>
)


  return (
    <div className="h-full w-full pointer-events-auto">
      <MapContainer
        center={[location.lat, location.lng]}
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
        <Marker position={[location.lat, location.lng]} />
      </MapContainer>
    </div>
  )
}

export default Map