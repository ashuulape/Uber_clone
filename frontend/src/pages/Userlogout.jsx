import axios from 'axios'
import React from 'react'
import {useNavigate} from 'react-router-dom';


const Userlogout = () => {
const navigate = useNavigate();
    const token = localStorage.getItem('token')
    

    axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`,{
        headers:{
            Authorization:token
        }
    })
.then((response)=>{
        if(response.status===200){
        localStorage.removeItem('token')
        navigate('/')
    }})
  return (
    <div></div>
  )
}

export default Userlogout