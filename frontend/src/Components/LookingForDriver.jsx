import React from 'react'
import car from '../assets/car.png'
import { useRideContext } from '../Context/RideContext'

const LookingForDriver = () => {
  const { rideInfo } = useRideContext();


  return (
     <div className='bg-black text-white px-4 font-sans h-full w-full flex flex-col items-center rounded-t-3xl pb-8'>
          {/* Top indicator handle to close */}
          <div  className="w-[40%] h-2 bg-white/50 rounded-full m-5 cursor-pointer"></div>
          
          <h1 className="text-start text-2xl font-semibold  w-full">Looking for Driver</h1>
          
          {/* Vehicle image with searching radar animation */}
          <div className="w-full h-40 flex justify-center items-center relative mt-4">
            <div className="absolute w-24 h-24 bg-gray-500/50 rounded-full animate-ping"></div>
            <div className="absolute w-32 h-32 border border-gray-500/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <img className="h-[120%] object-cover absolute top-0 bottom-0 z-10" src={rideInfo?.vehicleImage || car} alt="Vehicle" />
          </div>
    
          <div className="w-full flex flex-col gap-4 mt-4 px-2">
            {/* Origin */}
            <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
              <i className="ri-map-pin-2-fill text-xl text-gray-300"></i>
              <div>
                <h3 className="text-lg font-medium">Pickup Location</h3>
                <p className="text-sm text-gray-400">{rideInfo?.pickup  }</p>
              </div>
            </div>
    
            {/* Destination */}
            <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
              <i className="ri-map-pin-fill text-xl text-gray-300"></i>
              <div>
                <h3 className="text-lg font-medium">Destination</h3>
                <p className="text-sm text-gray-400">{rideInfo?.destination}</p>
              </div>
            </div>
    
            {/* Fare Details */}
            <div className="flex items-center gap-4 pb-2">
              <i className="ri-currency-line text-xl text-gray-300"></i>
              <div>
                <h3 className="text-lg font-medium">₹{rideInfo?.price}</h3>
                <p className="text-sm text-gray-400"> Cash</p>
              </div>
            </div>
          </div>
    
          
        </div>
  )
}

export default LookingForDriver