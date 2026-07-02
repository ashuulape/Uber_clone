import React, { createContext, useState } from 'react'

export const  userDataContext =createContext()

const UserContext = ({children}) => {

const [userData, setuserData] = useState({

    email:"",
    fullname:{
        firstname:"",
        lastname:""
    },

})
    
  return (
    <userDataContext.Provider value={[userData, setuserData]} >
        {children}
    </userDataContext.Provider>
  )
}

export default UserContext