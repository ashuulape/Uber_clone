import React from 'react'
import 'remixicon/fonts/remixicon.css'

const Confirmedride = ({ setConfirmRidePanel, setlookingPanel, rideInfo, SelectRideAndConfirm }) => {
  if (!rideInfo) return null;

  const {
    vehicleName,
    vehicleImage,
    seats,
    description,
    price,
    distance,
    pickup,
    destination,
    vehicleKey
  } = rideInfo;




  return (
    <div className='bg-black text-white px-4 font-sans h-full w-full flex flex-col items-center rounded-t-3xl pb-8'>
      {/* Drag handle / close */}
      <div
        onClick={() => setConfirmRidePanel(false)}
        className="w-[40%] h-2 bg-white/50 rounded-full m-5 cursor-pointer"
      />

      <h1 className="text-start text-2xl font-semibold w-full">Confirm your ride</h1>

      {/* Vehicle image + name */}
      <div className="w-full h-40 flex flex-col justify-center items-center relative mt-2">
        <img
          className="h-[110%] object-contain absolute top-0"
          src={vehicleImage}
          alt={vehicleName}
        />
      </div>

      {/* Vehicle meta */}
      <div className="w-full flex items-center gap-3 mb-4 mt-2 px-2">
        <span className="text-gray-300 font-medium text-base">{vehicleName}</span>
        <span className="flex items-center text-gray-400 text-sm gap-1">
          <i className="ri-user-3-line text-xs" />
          {seats}
        </span>
        {distance && (
          <span className="flex items-center text-gray-400 text-sm gap-1 ml-auto">
            <i className="ri-route-line text-xs" />
            {distance} km
          </span>
        )}
      </div>

      <div className="w-full flex flex-col gap-4 px-2">
        {/* Pickup */}
        <div className="flex items-start gap-4 border-b border-gray-700 pb-4">
          <i className="ri-map-pin-2-fill text-xl text-gray-300 mt-0.5" />
          <div>
            <h3 className="text-base font-medium">Pickup</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{pickup || '—'}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-4 border-b border-gray-700 pb-4">
          <i className="ri-map-pin-fill text-xl text-gray-300 mt-0.5" />
          <div>
            <h3 className="text-base font-medium">Destination</h3>
            <p className="text-sm text-gray-400 line-clamp-2">{destination || '—'}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-center gap-4 pb-2">
          <i className="ri-currency-line text-xl text-gray-300" />
          <div>
            <h3 className="text-lg font-bold">₹{price ?? '—'}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => {

          SelectRideAndConfirm(vehicleKey)          
          setlookingPanel(true);
          setConfirmRidePanel(false);

        }}
        className="w-full mt-6 bg-white text-black font-semibold text-lg py-3 rounded-xl active:bg-gray-200 transition-colors"
      >
        Confirm {vehicleName}
      </button>
    </div>
  );
};

export default Confirmedride;
