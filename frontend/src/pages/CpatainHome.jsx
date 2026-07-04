import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import image from '../assets/map.png'
import CaptainDetails from '../Components/CaptainDetails'
import RidePopUP from '../Components/RidePopUP'
import ConfirmRidePopUP from '../Components/ConfirmRidePopUP'
import { useGSAP } from '@gsap/react/dist'
import gsap from 'gsap'

const CpatainHome = () => {

  const [showRide,setShowRide] = useState(true)
  const [confirmShowRide, setConfirmShowRide] = useState(false)
const RidePopUpRef = useRef(null)
const ConfirmPopUpRef = useRef(null)
  

  
useGSAP(()=>{
 if(showRide){
   gsap.to(RidePopUpRef.current,{
    transform:'translateY(0)',
    duration:1,
    ease:'power3.out'
  })
 
 }else{
  gsap.to(RidePopUpRef.current,{
    transform:'translateY(100%)',
    duration:1,
    ease:'power3.out'
  })
 

 }
 },[showRide])

useGSAP(()=>{
  if(confirmShowRide){
    gsap.to(ConfirmPopUpRef.current,{
     transform:'translateY(0)',
     duration:1,
     ease:'power3.out'
   })
  }else{
   gsap.to(ConfirmPopUpRef.current,{
     transform:'translateY(100%)',
     duration:1,
     ease:'power3.out'
   })
  }
 },[confirmShowRide])



  return (
    <div className='h-screen bg-black overflow-hidden relative'>
        {/* Top Navbar */}
        <div className='fixed p-4 top-0 flex items-center justify-between w-full z-10'>
            <div className='w-12 h-12 bg-black backdrop-blur-md flex items-center justify-center rounded-full border border-white/30 text-white shadow-lg active:scale-95 transition-transform'>
                <i className="ri-menu-line text-2xl font-bold"></i>
            </div>

            <img className='invert h-15 ' src="https://media.ffycdn.net/us/postmates/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8zMFwvYXNzZXRzXC84NFwvNTY0OFwvZDgwNzhiNTY5MDgxZGMwMDg2YTA5MzMxODRmNzRjYWYtMTYyMDcxOTg2Ni5wbmcifQ:postmates:8yzkJLajxr6_SqXPeLDmCnbN5hR-5WgmEC3pzohGaAA?width={width}&rect=2.5259622713415,0,797.47403772866,487&reference_width=800" alt="" />

            
            <Link to='/captain/logout' className='w-12 h-12 bg-black backdrop-blur-md flex items-center justify-center rounded-full border border-white/30 text-white shadow-lg active:scale-95 transition-transform'>
                <i className="ri-logout-box-r-line text-2xl font-bold"></i>
            </Link>
        </div>

        {/* Map Background */}
        <div className='h-[60%] w-full overflow-hidden'>
            <img className='h-full w-full object-cover' src={image} alt="Map" />
        </div>

        {/* Bottom Details Panel */}
       <CaptainDetails/>

       <div ref={RidePopUpRef} className='h-fit rounded-2xl translate-y-full bg-black absolute  bottom-0 w-full z-30'>
            <RidePopUP setShowRide={setShowRide} setConfirmShowRide={setConfirmShowRide} />
       </div>
       <div ref={ConfirmPopUpRef} className='h-fit rounded-2xl translate-y-full bg-black absolute  bottom-0 w-full z-40'>
            <ConfirmRidePopUP setConfirmShowRide={setConfirmShowRide} />
       </div>
    </div>
  )
}

export default CpatainHome