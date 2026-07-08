import React, { useState } from 'react';
import autoImage from '../assets/auto.png'
import bikeImage from '../assets/bike.png'
import carImage from '../assets/car.png'
import 'remixicon/fonts/remixicon.css';
import { useRideContext } from '../Context/RideContext';

const VEHICLE_CONFIG = [
  {
    key: 'auto',
    name: 'Auto',
    seats: 3,
    description: 'Pay directly to driver, cash/UPI only',
    image: autoImage,
    icon: 'ri-motorbike-line',
  },
  {
    key: 'bike',
    name: 'Bike',
    seats: 1,
    description: 'Quick & affordable two-wheeler rides',
    image: bikeImage,
    icon: 'ri-bike-line',
  },
  {
    key: 'car',
    name: 'UberGo',
    seats: 4,
    description: 'Affordable compact rides',
    image:carImage,
    icon: 'ri-car-line',
  },
];

const Cabs = () => {
  const {
    setVehiclePanel,
    setConfirmRidePanel,
    fare = {},
    setRideInfo,
    pickup,
    destination,
  } = useRideContext();
  const [selected, setSelected] = useState(null);

  const distance = fare.distance ?? null;

  return (
    <div className="bg-black text-white px-4 font-sans h-full w-full flex flex-col items-center rounded-t-3xl">
      {/* Drag handle */}
      <div
        onClick={() => setVehiclePanel(false)}
        className="w-[40%] h-2 bg-white/50 rounded-full m-5 cursor-pointer"
      />

      <h1 className="text-start w-full text-2xl font-semibold mb-2">Choose a Vehicle</h1>

      {distance !== null && (
        <p className="text-start w-full text-sm text-gray-400 mb-4">
          <i className="ri-route-line mr-1" />
          {distance} km away
        </p>
      )}

      <div className="w-full max-w-md flex flex-col gap-2 pb-4">
        {VEHICLE_CONFIG.map((vehicle) => {
          const price = fare[vehicle.key];
          const isSelected = selected === vehicle.key;

          return (
            <div
              key={vehicle.key}
              onClick={() => {
                setSelected(vehicle.key);
                setRideInfo({
                  vehicleKey: vehicle.key,
                  vehicleName: vehicle.name,
                  vehicleImage: vehicle.image,
                  seats: vehicle.seats,
                  description: vehicle.description,
                  price: fare[vehicle.key],
                  distance: fare.distance,
                  pickup,
                  destination,
                });
                setConfirmRidePanel(true);
                setVehiclePanel(false);
              }}
              className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200
                ${isSelected
                  ? 'bg-white/15 outline outline-1 outline-white'
                  : 'hover:bg-white/10 active:bg-white/15'
                }`}
            >
              {/* Icon */}
              <div className="w-15 h-15 flex-shrink-0 flex items-center justify-center rounded-xl mr-3">
               <img src={vehicle.image} alt={vehicle.name} className='h-full' />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[18px] font-semibold leading-none">{vehicle.name}</h3>
                  <span className="flex items-center text-[13px] text-gray-300 gap-0.5">
                    <i className="ri-user-3-line text-[12px]" />
                    {vehicle.seats}
                  </span>
                </div>
                <p className="text-[13px] text-gray-400 mt-1 line-clamp-1">{vehicle.description}</p>
              </div>

              {/* Price */}
              <div className="ml-4 text-right">
                {price !== undefined ? (
                  <span className="text-[20px] font-bold">₹{price}</span>
                ) : (
                  <span className="text-gray-500 text-sm">N/A</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cabs;
