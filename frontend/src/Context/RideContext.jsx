import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'

const RideContext = createContext(null)

export const useRideContext = () => {
  const context = useContext(RideContext)

  if (!context) {
    throw new Error('useRideContext must be used within a RideProvider')
  }

  return context
}

const RideProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState({})
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelopen, setPanelopen] = useState(false)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [lookingPanel, setLookingPanel] = useState(false)
  const [waitingForDriverPanel, setWaitingForDriverPanel] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [activeField, setActiveField] = useState('pickup')
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false)
  const [fare, setFare] = useState({})
  const [rideInfo, setRideInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  

  const confirmRideSelection = async (vehicleType) => {
    const token = localStorage.getItem('token')

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/ride/create`,{
        origin: pickup,
        destination:destination,
        vehicleType,
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data
  }

  const fetchAndDrawRoute = async (origin, destination ) => {
    if (!origin?.trim() || !destination?.trim()) return null

    const token = localStorage.getItem('token')
    if (!token) return null

    setLoading(true)

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/maps/get-distance-time`, {
        params: { origin, destination },
        headers: { Authorization: `Bearer ${token}` },
      })
      

      const nextRouteData = response?.data ?? null
      
      return nextRouteData
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }

  return (
    <RideContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        pickup,
        setPickup,
        destination,
        setDestination,
        panelopen,
        setPanelopen,
        vehiclePanel,
        setVehiclePanel,
        confirmRidePanel,
        setConfirmRidePanel,
        lookingPanel,
        setLookingPanel,
        waitingForDriverPanel,
        setWaitingForDriverPanel,
        suggestions,
        setSuggestions,
        activeField,
        setActiveField,
        isFetchingSuggestions,
        setIsFetchingSuggestions,
        fare,
        setFare,
        rideInfo,
        setRideInfo,
        loading,
        setLoading,
        confirmRideSelection,
        fetchAndDrawRoute,
        
  
      }}
    >
      {children}
    </RideContext.Provider>
  )
}

export default RideProvider
