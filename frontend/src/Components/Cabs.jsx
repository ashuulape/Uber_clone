import React from 'react';
import 'remixicon/fonts/remixicon.css';

const Cabs = () => {
  const cabs = [
    {
      id: 1,
      name: 'Auto',
      seats: 3,
      time: '2:47am',
      duration: '3 min',
      description: 'Pay directly to driver, cash/UPI only',
      price: '₹70.40',
      image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png',
      selected: true,
      icon: null,
    },
    {
      id: 2,
      name: 'Uber Go AC',
      seats: 4,
      time: '2:47am',
      duration: '3 min',
      description: 'Affordable compact rides',
      price: '₹95.46',
      image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1568070387/assets/b5/0a5191-836e-42bf-ad5d-6cb3100ec425/original/UberX.png',
     
      icon: <i className="ri-snowy-line"></i>,
    },
    {
      id: 3,
      name: 'UberXL',
      seats: 6,
      time: '2:47am',
      duration: '3 min',
      description: 'Comfortable SUVs',
      price: '₹158.95',
      image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1569046531/assets/e2/852615-609b-498a-9426-8051781293fb/original/uberXL.png',
      
      icon: null,
    },
    {
      id: 4,
      name: 'Go Priority',
      seats: 4,
      time: '2:46am',
      duration: '2 min',
      description: 'Priority pickup',
      price: '₹132.02',
      image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1568070387/assets/b5/0a5191-836e-42bf-ad5d-6cb3100ec425/original/UberX.png',
      selected: false,
      icon: <i className="ri-flashlight-fill"></i>,
    },
  ];

  return (
    <div className="bg-clack text-white pt-10 px-4 font-sans h-full w-full ">
      <div className="max-w-md mx-auto flex flex-col gap-2">
        {cabs.map((cab) => (
          <div
            key={cab.id}
            className="flex items-start justify-between p-3 rounded-[20px] cursor-pointer active:outline-1"
             
          >
            <div className="flex gap-4 w-full">
              <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center mt-1">
                <img
                  src={cab.image}
                  alt={cab.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col justify-start">
                <div className="flex items-center gap-2">
                  <h3 className="text-[22px] font-medium flex items-center gap-1.5 leading-none">
                    {cab.icon && <span className="text-white text-[20px]">{cab.icon}</span>}
                    {cab.name}
                  </h3>
                  <div className="flex items-center text-[15px] font-medium text-gray-300">
                    <i className="ri-user-3-line mr-1 text-[13px]"></i>
                    {cab.seats}
                  </div>
                </div>
                <div className="text-[15px] font-medium text-gray-200 mt-1">
                  {cab.time} <span className="text-gray-400 font-bold mx-1">·</span> {cab.duration}
                </div>
                <div className="text-[13px] text-gray-400 mt-1 line-clamp-1">
                  {cab.description}
                </div>
              </div>
            </div>
            <div className="text-[22px] font-medium ml-4 whitespace-nowrap">
              {cab.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cabs;
