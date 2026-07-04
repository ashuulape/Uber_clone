import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { captainDataContext } from '../Context/CaptainContext'
import axios from 'axios'
import { useState } from 'react'

const CaptainProtectedWrapper = ({children}) => {
    const navigate=useNavigate()
    const {setCaptain}=useContext(captainDataContext)
    const [isLoading, setisLoading] = useState(true)



    
    const token= localStorage.getItem('token')
    useEffect(()=>{
        if(!token ){
            navigate('/captain/login')
            return
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/api/captain/profile`,{headers:{Authorization:`Bearer ${token}`}})
        .then((response)=>{ 
            if(response.status===200){
                setisLoading(false)
                const data=response.data
                setCaptain(data)
            }
        })
        .catch((err)=>{
            console.log(err.response?.data?.message || err.message)
            localStorage.removeItem('token')
            setisLoading(false)
            navigate('/captain/login')
        })
    },[token])

    if(isLoading){
        return <div>Loading...</div>
    }



      return (
   <>
   {children}
   </>
      )
}

export default CaptainProtectedWrapper