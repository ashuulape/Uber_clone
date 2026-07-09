import React, { createContext, useEffect, useState } from 'react'
import { useSocketContext } from '../Context/SocketContext'
export const  userDataContext =createContext()

const UserContext = ({children}) => {

const { socket  } = useSocketContext()
const [userLiveLocation, setuserLiveLocation] = useState({})
const [user, setuser] = useState({

    email:"",
    fullname:{
        firstname:"",
        lastname:""
    },

}) 



useEffect(() => {
    if (userLiveLocation?.lat && userLiveLocation?.lng) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setuserLiveLocation?.({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        console.error('Error getting location:', error)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )

    
  }, [socket, user?.id]) 

// console.log(userLiveLocation);

  
  
    
  return (
    <userDataContext.Provider value={{user, setuser ,userLiveLocation }} >
        {children}
    </userDataContext.Provider>
  )
}

export default UserContext