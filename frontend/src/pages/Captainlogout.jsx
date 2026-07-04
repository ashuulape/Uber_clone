 import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';

 
 const Captainlogout = () => {

    const navigate = useNavigate();
        const token = localStorage.getItem('token')
        
    
    
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/captain/logout`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
    .then((response)=>{
            if(response.status===200){
            localStorage.removeItem('token')
            navigate('/')
        }})
        .catch(()=>{
            navigate('/captainhome')
            alert('something went wrong try to logout later')
        })
   return (
    <></>
   )
 }
 
 export default Captainlogout