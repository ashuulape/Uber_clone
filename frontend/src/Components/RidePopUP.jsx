import React from 'react'

const RidePopUP = (props) => {
  return (
   <div className='bg-black text-white px-4 font-sans w-full flex flex-col items-center rounded-t-3xl pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]'>
        {/* Top indicator handle to close */}
        <div onClick={() => {
            if (props.setRidePopupPanel) props.setRidePopupPanel(false)
        }} className="w-[15%] h-1.5 bg-gray-600 rounded-full mx-auto mb-4 mt-5 cursor-pointer"></div>
        
        <h1 className="text-start text-2xl font-semibold w-full">New Ride Available!</h1>
        
        {/* Rider Details */}
        <div className='flex items-center justify-between w-full mt-6 bg-gray-900 rounded-2xl p-4 shadow-lg'>
            <div className='flex items-center gap-4'>
                <div className='w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border-[2px] border-white'>
                    <img className='h-full w-full object-cover' src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1760&auto=format&fit=crop" alt="Rider" />
                </div>
                <div>
                    <h2 className='text-lg font-semibold'>Ashutosh Singh</h2>
                    <h3 className='text-sm text-gray-400'>Apple Pay</h3>
                </div>
            </div>
            <div className='text-right'>
                <h2 className='text-xl font-bold text-white'>2.2 KM</h2>
                <div className="mt-1 text-sm font-semibold flex items-center justify-end gap-1">
                  <i className="ri-star-fill text-yellow-500"></i><span className='text-white/50'> 4.9</span>
                </div>
            </div>
        </div>

       <div className="w-full flex flex-col gap-4 mt-6 px-2">
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
              <p className="text-sm text-gray-400 line-clamp-2">17th Cross Rd, PWD Quarters, 1st Sector, HSR Layout, Bengaluru, Karnataka</p>
            </div>
          </div>
  
          {/* Fare Details */}
          <div className="flex items-center gap-4 pb-2">
            <i className="ri-currency-line text-xl text-gray-300"></i>
            <div>
              <h3 className="text-lg font-medium">₹193.20</h3>
              <p className="text-sm text-gray-400">Cash</p>
            </div>
          </div>
        </div>
  
        <div className="flex flex-col w-full mt-8 gap-4">
          <button onClick={() => {
              if (props.setConfirmShowRide) props.setConfirmShowRide(true)
              if (props.setShowRide) props.setShowRide(false)
          }} className="w-full bg-white text-black font-bold text-lg py-3 rounded-xl active:bg-green-400 transition-colors">
            Accept
          </button>
          <button onClick={() => {
              if (props.setShowRide) props.setShowRide(false)
          }} className="w-full bg-white/20 text-red-500 font-semibold text-lg py-3 rounded-xl active:bg-gray-700 transition-colors">
            Ignore
          </button>
          
        </div>
      </div>
  )
}

export default RidePopUP