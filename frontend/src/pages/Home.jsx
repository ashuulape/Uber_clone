import React, { useState } from 'react'
import image from '../assets/map.png'
import { useGSAP } from "@gsap/react/dist";
import gsap from 'gsap';
import { useRef } from 'react';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../Components/LocationSearchPanel';
import Cabs from '../Components/Cabs';
import Confirmedride from '../Components/Confirmedride';
import LookingForDriver from '../Components/LookingForDriver';
import WaitForDriver from '../Components/WaithingForDriver';


const home = () => {

  gsap.registerPlugin(useGSAP);



  const [pickup, setpickup] = useState('')
  const [destination, setdestination] = useState('')
  const [panelopen, setpanelopen] = useState(false)
  const [VehiclePanel, setVehiclePanel] = useState(false)
  const [ConfirmRidePanel, setConfirmRidePanel] = useState(false)
  const [lookingPanel, setlookingPanel] = useState(false)
  const [WaitingForDriverPanel, setWaitingForDriverPanel] = useState(false)
  const panelRef = useRef(null)
  const arrow = useRef(null)
  const vehiclePanelRef = useRef(null)
  const ConfirmRide = useRef(null)
  const LookingRideRef = useRef(null)
  const WaitingForDriverRef = useRef(null)
  
  
const submitHandler = (e) => {
  e.preventDefault();
  console.log(e.target.value);
}

useGSAP(()=>{
 if(panelopen){
   gsap.to(panelRef.current,{
    height:'70%',
    duration:1,
    ease:'power3.out'
  })
  gsap.to(arrow.current,{
    rotate:180,
    duration:0.5,
    ease:'power3.out'
  }) 

 }else{
  gsap.to(panelRef.current,{
    height:0,
    duration:1,
    ease:'power3.out'
  })
  gsap.to(arrow.current,{
    rotate:0,
    duration:0.5,
    ease:'power3.out'
  }) 

 }
},[panelopen])

useGSAP(()=>{
  if(VehiclePanel){
    gsap.to(vehiclePanelRef.current,{
      transform:"translateY(0)",
      duration:1,
      ease:'power3.out'
    })
  }
  else{
    gsap.to(vehiclePanelRef.current,{
      transform:"translateY(100%)",
      duration:1,
      ease:'power3.out'
    })
  }
},[VehiclePanel])

useGSAP(()=>{
  if(ConfirmRidePanel){
    gsap.to(ConfirmRide.current,{
      transform:"translateY(0)",
      duration:0.5,
      ease:'power3.out'
    })
  }
  else{
    gsap.to(ConfirmRide.current,{
      transform:"translateY(100%)",
      duration:0.5,
      ease:'power3.out'
    })
  }
},[ConfirmRidePanel])

useGSAP(()=>{
  if(lookingPanel){
    gsap.to(LookingRideRef.current,{
      transform:"translateY(0)",
      duration:0.5,
      ease:'power3.out'
    })
  }
  else{
    gsap.to(LookingRideRef.current,{
      transform:"translateY(100%)",
      duration:0.5,
      ease:'power3.out'
    })
  }
},[lookingPanel])

useGSAP(()=>{
  if(WaitingForDriverPanel){
    gsap.to(WaitingForDriverRef.current,{
      transform:"translateY(0)",
      duration:0.5,
      ease:'power3.out'
    })
  }
  else{
    gsap.to(WaitingForDriverRef.current,{
      transform:"translateY(100%)",
      duration:0.5,
      ease:'power3.out'
    })
  }
},[WaitingForDriverPanel])


  return (
    <div className="relative h-screen w-screen overflow-hidden">
     
        <img 
        className="absolute invert w-30 z-1"
        src="https://media.ffycdn.net/us/postmates/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8zMFwvYXNzZXRzXC84NFwvNTY0OFwvZDgwNzhiNTY5MDgxZGMwMDg2YTA5MzMxODRmNzRjYWYtMTYyMDcxOTg2Ni5wbmcifQ:postmates:8yzkJLajxr6_SqXPeLDmCnbN5hR-5WgmEC3pzohGaAA?width={width}&rect=2.5259622713415,0,797.47403772866,487&reference_width=800"
        alt=""
      />
   
      <div   className="h-screen w-screen"  >
        <img  className="h-full w-full " src={image} alt="" />
      </div>
      <div className=" flex flex-col justify-end absolute  bottom-0 w-full z-10 h-full pt-4 rounded-2xl ">
        <div
       
        className="h-fit  bg-black flex flex-col justify-start  rounded-t-3xl pointer-events-auto">
           
          

            <i onClick={()=>{setpanelopen((prev)=>!prev)}} ref={arrow} className="ri-arrow-up-s-line text-white text-center text-3xl p-2"></i>

         
           
          <h2  className="text-white text-3xl text-center  font-semibold m-2">Find a trip</h2>
         
         <form onClick={()=>setpanelopen(true)} onSubmit={(e)=>{submitHandler(e)}} className="h-fit flex flex-col px-4 gap-4 items-center w-full  text-white font-medium relative pb-8">
           <div className='h-fit w-full flex flex-row px-4 gap-2  text-white font-medium relative ' >

            <div className=" flex w-[5%] items-center justify-center">
           <div className="bg-white/60 relative justify-center  top-0 left-0 w-1 h-[80%] rounded-full flex">
              <div className=" bg-white w-3 h-3 rounded-full top-0 absolute"></div>
              <div className="w-3 h-3 bg-white rotate-180 [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)] bottom-0 absolute"></div>

           </div>
           </div>
            <div className="flex flex-col gap-4 w-full">
              <input
              value={pickup}
              onChange={(e)=>setpickup(e.target.value)}
              className="text-lg bg-white/10 border-[0.5px] border-white/15  py-2 rounded-lg px-4 border-0 w-full "
              type="text"
              placeholder="Enter your pickup location"
            />
            <input
            value={destination}
            onChange={(e)=>setdestination(e.target.value)}
              className="text-lg bg-white/10 border-[0.5px] border-white/15  py-2 rounded-lg px-4 border-0 w-full"
              type="text"
              placeholder="Enter your destination"
            />
            </div>
           </div>
            <button className="bg-white text-black w-[80%] text-lg  px-4 py-2 rounded ">Book</button>
          </form>
        </div>
        <div ref={panelRef} className="bg-black h-0 relative  overflow-y-hidden pointer-events-auto ">
            <  LocationSearchPanel setVehiclePanel={setVehiclePanel} setpanelopen={setpanelopen}/>  
        </div>
      </div> 
        <div  ref={vehiclePanelRef} className='h-fit rounded-2xl translate-y-full bg-black absolute  bottom-0 w-full z-20'>        
              <Cabs setVehiclePanel={setVehiclePanel} setConfirmRidePanel={setConfirmRidePanel} />
        </div> 
        <div ref={ConfirmRide} className='h-fit rounded-2xl translate-y-full bg-black absolute  bottom-0 w-full z-30'>
          <Confirmedride setConfirmRidePanel={setConfirmRidePanel} setlookingPanel={setlookingPanel} />
        </div>
        <div ref={LookingRideRef} className='h-fit rounded-2xl translate-y-full bg-black absolute  bottom-0 w-full z-30'>
         <LookingForDriver setlookingPanel={setlookingPanel}/>
        </div>
        <div ref={WaitingForDriverRef} className='h-fit rounded-2xl translate-y-full bg-black absolute  bottom-0 w-full z-30'>
         <WaitForDriver setWaitingForDriverPanel={setWaitingForDriverPanel}/>
        </div>

    </div>
  )
}

export default home