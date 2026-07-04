import React from 'react'
import car from '../assets/car.png'

const Confirmedride = (props) => {
  return (
    <div className='bg-black text-white px-4 font-sans h-full w-full flex flex-col items-center rounded-t-3xl pb-8'>
      {/* Top indicator handle to close */}
      <div onClick={() => props.setConfirmRidePanel(false)} className="w-[40%] h-2 bg-white/50 rounded-full m-5 cursor-pointer"></div>
      
      <h1 className="text-start text-2xl font-semibold  w-full">Confirm your ride</h1>
      
      {/* Vehicle image */}
      <div className="w-full h-40 flex justify-center items-center relative ">
        <img className="h-[120%] object-cover absolute top-0 bottom-0" src={car} alt="Vehicle" />
      </div>

      <div className="w-full flex flex-col gap-4 mt-4 px-2">
        {/* Origin */}
        <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
          <i className="ri-map-pin-2-fill text-xl text-gray-300"></i>
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm text-gray-400">Kankariya Talab, Bhopal</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
          <i className="ri-map-pin-fill text-xl text-gray-300"></i>
          <div>
            <h3 className="text-lg font-medium">Third Wave Coffee</h3>
            <p className="text-sm text-gray-400">17th Cross Rd, PWD Quarters, 1st Sector, HSR Layout, Bengaluru, Karnataka</p>
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

      <button onClick={() => {
        props.setlookingPanel(true)
        props.setConfirmRidePanel(false)
      }} className="w-full mt-6 bg-white text-black font-semibold text-lg py-3 rounded-xl active:bg-gray-200">
        Confirm
      </button>
    </div>
  )
}

export default Confirmedride
