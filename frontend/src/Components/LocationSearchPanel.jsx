import React from 'react'

const LocationSearchPanel = () => {
  // Dummy data matching the user's provided screenshot
  const locations = [
    {
      id: 1,
      name: 'Kolhapur',
      address: 'Maharashtra',
      distance: '25 mi',
      type: 'recent',
    },
    {
      id: 2,
      name: 'Ichalkaranji',
      address: 'Maharashtra',
      distance: '8.9 mi',
      type: 'recent',
    },
    {
      id: 3,
      name: 'Pune International Airport',
      address: 'Civil Enclave, Area, Lohegaon, Pune, ...',
      distance: '142 mi',
      type: 'location',
    },
    {
      id: 4,
      name: 'Maharashtra',
      address: 'Pune',
      distance: '139 mi',
      type: 'location',
    },
    {
      id: 5,
      name: 'Pune Station',
      address: 'HH Prince Aga Khan Rd, Agarkar Naga...',
      distance: '139 mi',
      type: 'location',
    },
  ]

  return (
    <div className="bg-black h-fit w-full overflow-y-auto px-5 py-3 flex flex-col gap-1 select-none">
      {locations.map((loc) => (
        <div
          key={loc.id}
          className="flex items-start gap-4 active:bg-zinc-900 p-2 rounded-xl transition-all duration-200 cursor-pointer"
        >
          {/* Left Icon and Distance Column */}
          <div className="flex flex-col items-center justify-center min-w-[50px]">
            <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white border border-zinc-800">
              {loc.type === 'recent' ? (
                <i className="ri-time-line text-lg text-gray-300"></i>
              ) : (
                <i className="ri-map-pin-line text-lg text-gray-300"></i>
              )}
            </div>
            <span className="text-[11px] text-zinc-500 font-medium mt-1.5 whitespace-nowrap">
              {loc.distance}
            </span>
          </div>

          {/* Right Text Column */}
          <div className="flex-1 flex flex-col h-full  justify-center border-b border-zinc-900  pr-2 min-w-0">
            <h4 className="text-lg font-semibold text-zinc-100 leading-tight truncate">
              {loc.name}
            </h4>
            <p className="text-[13px] text-zinc-400 mt-1 font-thin truncate">
              {loc.address}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LocationSearchPanel