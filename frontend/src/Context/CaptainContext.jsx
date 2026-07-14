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
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCaptainLiveLoaction?.({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
      }, []) 
    

    return (
        <captainDataContext.Provider value={{ captain, setCaptain, CaptainLiveLoaction ,setRide ,Ride  }}>
            {children}
        </captainDataContext.Provider>
    )
}

export default CaptainContext
