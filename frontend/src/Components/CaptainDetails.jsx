import React from 'react'

const CaptainDetails = () => {
  return (
     <div className='h-[40%] bg-black px-4 pt-6 text-white flex flex-col justify-between rounded-t-3xl relative -mt-6 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]'>
            
            {/* Top Drag Indicator */}
            <div className="w-[15%] h-1.5 bg-gray-600 rounded-full mx-auto mb-4"></div>

            {/* Captain Summary Details */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-600'>
                        <img className='h-full w-full object-cover' src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1760&auto=format&fit=crop" alt="Captain" />
                    </div>
                    <div>
                        <h2 className='text-lg font-semibold'>Sarthak Singh</h2>
                        <h3 className='text-sm text-gray-400'>Basic Level</h3>
                    </div>
                </div>
                <div className='text-right'>
                    <h2 className='text-2xl font-bold'>₹295.20</h2>
                    <h3 className='text-sm text-gray-400'>Earned Today</h3>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className='flex justify-between mt-6 bg-gray-900/40 backdrop-blur-md border border-white/30 rounded-2xl p-4 shadow-lg shadow-gray-900/50'>
                <div className='flex flex-col items-center gap-1 w-1/3'>
                    <i className="ri-timer-2-line text-3xl text-gray-300"></i>
                    <h2 className='text-xl font-bold'>10.2</h2>
                    <h3 className='text-[10px] text-gray-400 tracking-wider font-semibold'>HOURS ONLINE</h3>
                </div>
                <div className='flex flex-col items-center gap-1 w-1/3 border-x border-gray-700'>
                    <i className="ri-speed-up-line text-3xl text-gray-300"></i>
                    <h2 className='text-xl font-bold'>30 KM</h2>
                    <h3 className='text-[10px] text-gray-400 tracking-wider font-semibold'>TOTAL DISTANCE</h3>
                </div>
                <div className='flex flex-col items-center gap-1 w-1/3'>
                    <i className="ri-booklet-line text-3xl text-gray-300"></i>
                    <h2 className='text-xl font-bold'>20</h2>
                    <h3 className='text-[10px] text-gray-400 tracking-wider font-semibold'>TOTAL JOBS</h3>
                </div>
            </div>

        </div>
  )
}

export default CaptainDetails