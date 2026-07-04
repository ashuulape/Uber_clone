import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { captainDataContext } from '../Context/CaptainContext'
import axios from 'axios'



const CaptainSignUp =  () => {
   const navigate=useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstname, setfirstname] = useState('')
    const [lastname, setlastname] = useState('')
    const [vehicleColor, setVehicleColor] = useState('')
    const [vehiclePlate, setVehiclePlate] = useState('')
    const [vehicleCapacity, setVehicleCapacity] = useState('')
    const [vehicleType, setVehicleType] = useState('')
    
    const {setCaptain}=useContext(captainDataContext)

    const submitHandle = async (e) => {
        e.preventDefault()
        const newCaptainData = {
            fullname: { firstname: firstname, lastname: lastname },
            email: email,
            password: password,
            vehicle: {
                color: vehicleColor,
                plate: vehiclePlate,
                capacity: vehicleCapacity,
                vehicleType: vehicleType
            }
  
        }
       
         const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/api/captain/register`,newCaptainData)
      if(response.status===200){
        const data=response.data
       
        

        setCaptain(data.captain)       

        localStorage.setItem('token',data.token)
        navigate('/captainhome')

    
        

     }
     else{
        console.log(response.data)
     }
        
        setEmail('')
        setPassword('')
        setfirstname('')
        setlastname('')
        setVehicleColor('')
        setVehiclePlate('')
        setVehicleCapacity('')
        setVehicleType('')
    }

  return (
    <div className="flex p-8 flex-col justify-between items-center h-screen">

        <img className='w-16 mb-5 mt-5' src="https://imgs.search.brave.com/Xr5AE-qF9u_eA3dArDHLnzd2OmEM7V44OSXOCtcAsuk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9mcmVl/bG9nb3BuZy5jb20v/aW1hZ2VzL2FsbF9p/bWcvMTY1OTc2MTQy/NXViZXItZHJpdmVy/LWxvZ28tcG5nLnBu/Zw" alt="" />

        <div className='flex flex-col min-w-[300px] w-[600px] max-w-full items-center h-full overflow-y-auto font-medium'>

        <form onSubmit={(e)=>submitHandle(e)}
        action="" className='bg-white flex flex-col gap-5 rounded shadow-md w-full py-6 px-4 mb-5'>
            
            <h2 className='text-black/70'>What's our Captain's name</h2>
            <div className='flex gap-4 mt-[-15px]'>
             <input 
                value={firstname}
                onChange={(e)=>setfirstname(e.target.value)}
                className='border border-gray-600/50 p-2 rounded w-full '
                required
                type="text" placeholder='Firstname' 
             />
             <input 
                value={lastname}
                onChange={(e)=>setlastname(e.target.value)}
                className='border border-gray-600/50 p-2 rounded w-full'
                required
                type="text" placeholder='Lastname' 
             />
            </div>

            <h2 className='text-black/70'>What's our Captain's email</h2>
            <input 
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className='border border-gray-600/50 p-2 rounded w-full mt-[-15px]'
                required
                type="email" placeholder='Enter your email' 
            />

            <h2 className='text-black/70'>Enter Password</h2>
            <input 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className='border border-gray-600/50 p-2 rounded w-full mt-[-15px]'
                required
                type="password" placeholder='Enter your password' 
            />

            <h2 className='text-black/70'>Vehicle Details</h2>
            <div className='flex gap-4 mt-[-15px]'>
                <input 
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                    className='border border-gray-600/50 p-2 rounded w-1/2'
                    required
                    type="text" placeholder='Color' 
                />
                <input 
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className='border border-gray-600/50 p-2 rounded w-1/2'
                    required
                    type="text" placeholder='Plate' 
                />
            </div>
            <div className='flex gap-4'>
                <input 
                    value={vehicleCapacity}
                    onChange={(e) => setVehicleCapacity(e.target.value)}
                    className='border border-gray-600/50 p-2 rounded w-1/2'
                    required
                    type="number" placeholder='Capacity' 
                />
                <select 
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className='border border-gray-600/50 p-2 rounded w-1/2'
                    required
                >
                    <option value="" disabled>Select Type</option>
                    <option value="car">Car</option>
                    <option value="auto">Auto</option>
                    <option value="bike">Bike</option>
                </select>
            </div>

            <button type='submit'
                className='bg-black text-white p-3 rounded font-semibold mt-2'
            >Register as Captain</button>
           
            <p className='text-center mt-[-10px]'>
                already have an account? <Link to="/captain/login" className='underline text-gray-500'>login here</Link>
            </p>
        </form>

    </div>
    <div>
        <p className='text-[10px] mt-6 leading-tight'>
            This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service</span> apply. Created by Ashutosh Ulape
        </p>
    </div>
    </div>
  )
}

export default CaptainSignUp