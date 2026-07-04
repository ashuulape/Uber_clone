import React, { createContext, useState } from 'react'

export const captainDataContext = createContext()

const CaptainContext = ({ children }) => {
    
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

    return (
        <captainDataContext.Provider value={{ captain, setCaptain }}>
            {children}
        </captainDataContext.Provider>
    )
}

export default CaptainContext
