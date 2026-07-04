import React, { useContext } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {userDataContext} from '../Context/UserContext'



const UserSignUp = () => {
    
   const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
   const [firstname, setfirstname] = useState('')
   const [lastname, setlastname] = useState('')
    

    const navigate=useNavigate()

    const{setuser}=useContext(userDataContext)

    const submitHandle=async(e)=>{
        e.preventDefault()
       
        const newUser={
        fullname:{firstname:firstname,lastname:lastname},
        email:email,
        password:password,
        }
        
     const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`,newUser)
      if(response.status===200){
        const data=response.data

        setuser(
           data.user
        )
        localStorage.setItem('token',data.token)
        navigate('/home')

     }
     else{
        console.log(response.data)
     }


        setEmail('')
        setPassword('')
        setfirstname('')
        setlastname('')
        
    }




  return (

    <div className="flex p-8 flex-col justify-around items-center h-screen">

        <img className='invert h-30 ' src="https://media.ffycdn.net/us/postmates/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8zMFwvYXNzZXRzXC84NFwvNTY0OFwvZDgwNzhiNTY5MDgxZGMwMDg2YTA5MzMxODRmNzRjYWYtMTYyMDcxOTg2Ni5wbmcifQ:postmates:8yzkJLajxr6_SqXPeLDmCnbN5hR-5WgmEC3pzohGaAA?width={width}&rect=2.5259622713415,0,797.47403772866,487&reference_width=800" alt="" />

        <div className='flex flex-col min-w-[300px] w-[600px] max-w-full  items-center h-screen  py-8 font-medium '>

        <form onSubmit={(e)=>submitHandle(e)}
        action="" className='bg-white flex flex-col gap-5  rounded shadow-md  w-full  py-6  '>
            <h2 className='text-black/70'>Whats your name</h2>
           <div className='flex gap-4 mt-[-15px]'>
             <input 
            value={firstname}
            onChange={(e)=>setfirstname(e.target.value)}
            className='border border-gray-600/50 p-2 rounded w-full '
            required
            type="text" placeholder='firstname' />

            
            <input 
           value={lastname}
            onChange={(e)=>setlastname(e.target.value)}
            className='border border-gray-600/50 p-2 rounded w-full'
            required
            type="text" placeholder='lastname' />
            
            </div>

            <h2 className='text-black/70'>Whats your email</h2>
            <input 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className='border border-gray-600/50 p-2 rounded w-full mt-[-15px]'
            required
            type="email" placeholder='Enter your email' />


            <h2 className='text-black/70'>Enter Password</h2>

            <input 
             value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className='border border-gray-600/50 p-2 rounded w-full mt-[-15px]'
            required
            type="password" placeholder='Enter your password' />
            <button type='submit'
            className='bg-black text-white p-3 rounded font-semibold'
            >Register</button>
           
            
            <p className='text-center'>already have an account? <Link to="/login" className='underline text-gray-500'>  login here</Link></p>
        </form>

        
        
    </div>
    <div>
        <p className='text-[10px] mt-6 leading-tight'>
            This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service</span> apply.Created by Ashutosh Ulape
        </p>
    </div>
    </div>
    
  )
}

export default UserSignUp