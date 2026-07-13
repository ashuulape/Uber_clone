import React, { createContext, useEffect, useState } from 'react'

export const  userDataContext =createContext()

const UserContext = ({children}) => {


const [userLiveLocation, setuserLiveLocation] = useState({})
const [user, setuser] = useState({

    email:"",
    fullname:{
        firstname:"",
        lastname:""
    },

}) 



  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setuserLiveLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        console.error('Error getting location:', error)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

// console.log(userLiveLocation);

  
  
    
  return (
    <userDataContext.Provider value={{user, setuser ,userLiveLocation }} >
        {children}
    </userDataContext.Provider>
  )
}

export default UserContext