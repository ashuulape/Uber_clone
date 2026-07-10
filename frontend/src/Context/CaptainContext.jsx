import React, { createContext, useState ,useEffect } from 'react'

export const captainDataContext = createContext()

const CaptainContext = ({ children }) => {
  const [Ride, setRide] = useState()
    const [CaptainLiveLoaction, setCaptainLiveLoaction] = useState({})
    const [captain, setCaptain] = useState({
        email: "",
        fullname: {
            firstname: "",
            lastname: ""
        },
        vehicle: {
            color: "",
            plate: "",
            capacity: "",
            vehicleType: ""
        }
    })


    useEffect(() => {
        if (CaptainLiveLoaction?.lat && CaptainLiveLoaction?.lng) return
    
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCaptainLiveLoaction?.({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error) => {
            console.error('Error getting location:', error)
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
      }, [CaptainLiveLoaction]) 
    

    return (
        <captainDataContext.Provider value={{ captain, setCaptain, CaptainLiveLoaction ,setRide ,Ride }}>
            {children}
        </captainDataContext.Provider>
    )
}

export default CaptainContext
