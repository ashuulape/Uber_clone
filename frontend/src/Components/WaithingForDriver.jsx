import React from 'react'
import car from '../assets/car.png'
import auto from '../assets/auto.png'
import bike from '../assets/bike.png'
import { useRideContext } from '../Context/RideContext'

const WaitForDriver = () => {
  const { setWaitingForDriverPanel,rideInfo ,currentLocation } = useRideContext()
const vehicleType = rideInfo?.vehicleType || 'car'; 
  const VehicleImage = () => {
    if (vehicleType === 'car') {
      return car;
    } else if (vehicleType === 'auto') {
      return auto;
    } else {
      return bike;
    }
  };


  const distancebetweenPoints = async() => {
    if (!currentLocation || !rideInfo?.loaction) {
      console.warn('Current location or ride origin is not available');
      return 0;
    }


  }

  return (
     <div className='bg-black text-white px-4 font-sans h-full w-full flex flex-col items-center rounded-t-3xl pb-8'>
          {/* Top indicator handle to close */}
          <div onClick={() => {
               setWaitingForDriverPanel(false)
          }} className="w-[40%] h-2 bg-white/50 rounded-full m-5 cursor-pointer"></div>
          
          <div className="flex items-center justify-between w-full">
            <h1 className="text-start text-2xl font-semibold w-full">Meet at the pickup point</h1>
            <div className="bg-gray-800 rounded-lg px-3 py-1.5 text-lg font-bold whitespace-nowrap">
               
            </div>
          </div>
          
          {/* Driver info & Vehicle image with same animations */}
          <div className="flex items-center flex-row justify-between w-full mt-6 px-2">
            <div className="flex flex-col items-center relative h-20 w-32 justify-center">
               {/* Vehicle image with searching radar animation (from LookingForDriver) */}
               <div className="absolute w-20 h-20 bg-gray-500/50 rounded-full animate-ping"></div>
               <div className="absolute w-24 h-24 border border-gray-500/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
               <img className="h-[140%] object-cover absolute top-[-20%] z-10" src={VehicleImage()} alt="Vehicle" />
            </div>
            <div className="flex flex-col text-right">
            <h1 className="text-2xl font-bold tracking-[8px] mr-[-8px]">{rideInfo?.OTP}</h1>
              <h2 className="text-gray-400 font-semibold text-lg">{rideInfo?.captain?.fullname.firstname || 'Driver Name'}</h2>
              <h3 className="text-2xl font-bold text-white">{rideInfo?.captain?.vehicle.plate || 'Vehicle Type'}</h3>
              <p className="text-sm text-gray-500">{rideInfo?.captain?.vehicle.vehicleType || 'Vehicle Type'}</p>
              <div className="mt-1 text-sm font-semibold flex items-center justify-end gap-1">
                <i className="ri-star-fill text-yellow-500"></i> 4.9
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4 mt-6 px-2">
            {/* Origin */}
            <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
              <i className="ri-map-pin-2-fill text-xl text-gray-300"></i>
              <div>
                <h3 className="text-lg font-medium">Pickup </h3>
                <p className="text-sm text-gray-400">{rideInfo?.origin || ''}</p>
              </div>
            </div>
    
            {/* Destination */}
            <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
              <i className="ri-map-pin-fill text-xl text-gray-300"></i>
              <div>
                <h3 className="text-lg font-medium">Destination</h3>
                <p className="text-sm text-gray-400">{rideInfo?.destination || ''}</p>
              </div>
            </div>
    
            {/* Fare Details */}
            <div className="flex items-center gap-4 pb-2">
              <i className="ri-currency-line text-xl text-gray-300"></i>
              <div>
                <h3 className="text-lg font-medium">₹ {rideInfo?.fare || '0'}</h3>
                <p className="text-sm text-gray-400"> Cash</p>
              </div>
            </div>
          </div>
    
          
        </div>
  )
}

export default WaitForDriver