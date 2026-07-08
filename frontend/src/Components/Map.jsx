import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup ,Polyline } from 'react-leaflet'
import L from "leaflet"
import 'leaflet/dist/leaflet.css'


const Map =  () => {

const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  if (!userLocation) return <p>Loading map...</p>;






  return (
    <div className="h-full w-full pointer-events-auto">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}.png?apiKey=7667017314a245bf853910009f4771ac`}
          maxZoom={20}
        />
        <Marker position={[userLocation.lat, userLocation.lng]} />
      </MapContainer>
    </div>
  )
}

export default Map