import React from 'react'
import { Link } from 'react-router-dom'
import image from '../assets/map.png'
import car from '../assets/car.png'

const Riding = () => {
  return (
    <div className='h-screen bg-black overflow-hidden'>
          {/* Home Button Overlay */}
          <Link to='/home' className='bg-black text-white p-2 fixed left-4 top-4 z-10 backdrop-blur-md flex items-center justify-center w-12 h-12 rounded-full border border-white/30 text-white shadow-lg active:scale-95 transition-transform'>
              <i className="ri-home-5-line text-2xl font-bold"></i>
          </Link>

          {/* Map Top Half */}
          <div className='h-1/2 w-full overflow-hidden'  >
                <img className='h-full w-full object-cover'  src={image} alt="Map" />
          </div>

          {/* Ride Details Bottom Half */}
          <div className='h-1/2 bg-black px-4 py-6 text-white flex flex-col justify-between'>
            
            {/* Driver info & Vehicle image */}
            <div className="flex items-center justify-between w-full px-2">
              <div className="flex flex-col items-center relative h-20 w-32 justify-center">
                 <img className="h-[140%] object-cover absolute top-[-20%] z-10" src={car} alt="Vehicle" />
              </div>
  
              <div className="flex flex-col text-right">
                <h2 className="text-gray-400 font-semibold text-lg">Sarthak</h2>
                <h3 className="text-2xl font-bold text-white">MP04 AB 1234</h3>
                <p className="text-sm text-gray-500">Maruti Suzuki Alto</p>
              </div>
            </div>
  
            <div className="w-full flex flex-col gap-4 mt-6 px-2 flex-grow">
              
              {/* Destination */}
              <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
                <i className="ri-map-pin-fill text-xl text-gray-300"></i>
                <div>
                  <h3 className="text-lg font-medium">Third Wave Coffee</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">17th Cross Rd, PWD Quarters, 1st Sector, HSR Layout, Bengaluru, Karnataka</p>
                </div>
              </div>
      
              {/* Fare Details */}
              <div className="flex items-center gap-4 pb-2">
                <i className="ri-currency-line text-xl text-gray-300"></i>
                <div>
                  <h3 className="text-lg font-medium">₹193.20</h3>
                  <p className="text-sm text-gray-400"> Cash</p>
                </div>
              </div>
            </div>
  
            <button className="w-full bg-white text-black font-semibold text-lg py-3 rounded-xl active:bg-gray-200 mt-auto">
              Make a Payment
            </button>
          </div>
         
    </div>
  )
}

export default Riding