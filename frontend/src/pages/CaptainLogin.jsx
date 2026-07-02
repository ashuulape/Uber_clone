import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainLogin = () => {
   const [email, setEmail] = useState("")
      const [password, setPassword] = useState("")
      const [captainData, setcaptainData] = useState({})
  
      const submitHandle=async(e)=>{
          e.preventDefault()
         setcaptainData({
          email:email,
          password:password
         })
         console.log(captainData)
          setEmail('')
          setPassword('')
          
      }
  
  
  
  
    return (
  
      <div className="flex p-8 flex-col justify-around items-center h-screen">
  
        <img className='w-16 mb-5 mt-5' src="https://imgs.search.brave.com/Xr5AE-qF9u_eA3dArDHLnzd2OmEM7V44OSXOCtcAsuk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9mcmVl/bG9nb3BuZy5jb20v/aW1hZ2VzL2FsbF9p/bWcvMTY1OTc2MTQy/NXViZXItZHJpdmVy/LWxvZ28tcG5nLnBu/Zw" alt="" />
  
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
             
              
              <p className='text-center'>dont have an account? <Link to="/captain/register" className='underline text-gray-500'>  Join as a Captain</Link></p>
          </form>
  
          
          
      </div>
              <Link to='/login' type='submit'
              className='bg-black  w-full text-center text-white p-3 rounded font-semibold'
              >Sign in as User</Link>
      </div>
      
    )
}

export default CaptainLogin