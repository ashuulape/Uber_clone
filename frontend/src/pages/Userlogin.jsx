import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Userlogin = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userData, setuserData] = useState({})

    const submitHandle=async(e)=>{
        e.preventDefault()
       setuserData({
        email:email,
        password:password
       })
       console.log(userData)
        setEmail('')
        setPassword('')
        
    }




  return (

    <div className="flex p-8 flex-col justify-around items-center h-screen">

        <img className='invert h-30 ' src="https://media.ffycdn.net/us/postmates/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8zMFwvYXNzZXRzXC84NFwvNTY0OFwvZDgwNzhiNTY5MDgxZGMwMDg2YTA5MzMxODRmNzRjYWYtMTYyMDcxOTg2Ni5wbmcifQ:postmates:8yzkJLajxr6_SqXPeLDmCnbN5hR-5WgmEC3pzohGaAA?width={width}&rect=2.5259622713415,0,797.47403772866,487&reference_width=800" alt="" />

        <div className='flex flex-col w-full  items-center h-screen bg-[#eeee] py-8 font-medium'>

        <form onSubmit={(e)=>submitHandle(e)}
        action="" className='bg-white flex flex-col gap-5  rounded shadow-md  w-full  py-6  '>
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
            >login</button>
           
            
            <p className='text-center'>dont have an account? <Link to="/register" className='underline text-gray-500'>  register here</Link></p>
        </form>

        
        
    </div>
            <Link to='/captain/login' type='submit'
            className='bg-black  w-full text-center text-white p-3 rounded font-semibold'
            >Sign in as Captain</Link>
    </div>
    
  )
}

export default Userlogin