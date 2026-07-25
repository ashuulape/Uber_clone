<<<<<<< HEAD
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import image from '../assets/map.png'
import car from '../assets/car.png'
import auto from '../assets/auto.png'
import bike from '../assets/bike.png'
import { useSocketContext } from '../context/SocketContext'
import { useRideContext } from '../Context/RideContext'
import { userDataContext } from '../Context/UserContext';
import Map from '../Components/Map'
=======
import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../assets/map.png";
import car from "../assets/car.png";
import auto from "../assets/auto.png";
import bike from "../assets/bike.png";
>>>>>>> fixedBranch

import { useRideContext } from "../Context/RideContext";
import { userDataContext } from "../Context/UserContext";
import Map from "../Components/Map";
import { useState } from "react";

const Riding = () => {
<<<<<<< HEAD
  
  const navigate=useNavigate()
  const {rideInfo ,fetchAndDrawRoute}=useRideContext()
  const {socket}=useSocketContext()
  
  
  const [Drawdata, setDrawdata] = useState({})
  
  const{userLiveLocation}=useContext(userDataContext)
  const vehicleType=rideInfo?.captain?.vehicle?.vehicleType
  
  const VehicleImage = () => {
    if (vehicleType == 'car') {
        return car;
      } else if (vehicleType == 'auto') {
        return auto;
      } else {
        return bike;
      }
    };

useEffect(() => {
  socket.on('ride-ended', () => {
    navigate('/home')
  })

  return () => {
    socket.off('ride-ended')
  }
}, [socket])


    
  
    


        useEffect(() => {


          const getdata= async () => {

            const {origin,destination}=rideInfo 
            const data=await fetchAndDrawRoute(origin,destination)
            setDrawdata(data)
          }
          getdata()
          
          if(rideInfo==undefined ||rideInfo=={}   ){
            navigate('/home')
          }
        
         
        }, [rideInfo])
 
  
  return (
    <div className='h-screen bg-black overflow-hidden relative'>
          {/* Home Button Overlay */}
          <Link to='/home' className='bg-black text-white p-2 fixed left-4 top-4 z-10 backdrop-blur-md flex items-center justify-center w-12 h-12 rounded-full border border-white/30 text-white shadow-lg active:scale-95 transition-transform'>
              <i className="ri-home-5-line text-2xl font-bold"></i>
          </Link>

          {/* Map Top Half */}
          <div className='h-full w-full overflow-hidden absolute z-0'  >
                <Map LiveLocation={userLiveLocation} routeData={Drawdata} />
          </div>

          {/* Ride Details Bottom Half */}
          <div className='h-2/6 w-full bg-black px-4 py-6 text-white flex flex-col items-end justify-end absolute bottom-0 z-1'>
            
            {/* Driver info & Vehicle image */}
            <div className="flex items-center justify-between w-full px-2">
              <div className="flex flex-col items-center relative h-20 w-32 justify-center">
                 <img className="h-[140%] object-cover absolute top-[-20%] z-10" src={VehicleImage()} alt="Vehicle" />
              </div>
  
              <div className="flex flex-col text-right">
                <h2 className="text-gray-400 font-semibold text-lg">{rideInfo?.captain?.fullname?.firstname}</h2>
                <h3 className="text-2xl font-bold text-white">{rideInfo?.captain?.vehicle?.plate}</h3>
                <p className="text-sm text-gray-500">{rideInfo?.captain?.vehicle?.vehicleType}</p>
              </div>
            </div>
  
            <div className="w-full flex flex-col gap-4 mt-6 px-2 ">
              
              {/* Destination */}
              <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
                <i className="ri-map-pin-fill text-xl text-gray-300"></i>
                <div>
                  <h3 className="text-lg font-medium">Deatination</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{rideInfo?.destination}</p>
                </div>
              </div>
      
              {/* Fare Details */}
              <div className="flex items-center gap-4 pb-2">
                <i className="ri-currency-line text-xl text-gray-300"></i>
                <div>
                  <h3 className="text-lg font-medium">₹ {rideInfo?.fare}</h3>
                  <p className="text-sm text-gray-400"> Cash</p>
                </div>
              </div>
            </div>
  
            <button className="w-full bg-white text-black font-semibold text-lg py-3 rounded-xl active:bg-gray-200 mt-0">
              Make a Payment
            </button>
=======
  const navigate = useNavigate();
  const { rideInfo, fetchAndDrawRoute } = useRideContext();

  const [Routedata, setDrawedata] = useState(null);

  const { userLiveLocation } = useContext(userDataContext);
  const vehicleType = rideInfo?.captain?.vehicle?.vehicleType;

  const VehicleImage = () => {
    if (vehicleType == "car") {
      return car;
    } else if (vehicleType == "auto") {
      return auto;
    } else {
      return bike;
    }
  };

  useEffect(() => {
    if (rideInfo == undefined) {
      navigate("/home");
    }
  }, []);

  const { origin, destination } = rideInfo || null;
  const Draw = async (origin, destination) => {
    const data = await fetchAndDrawRoute(origin, destination);

    setDrawedata(data);
  };
  Draw(origin, destination);

  return (
    <div className="h-screen bg-black overflow-hidden relative flex justify-center items-end ">
      {/* Home Button Overlay */}
      <Link
        to="/home"
        className="bg-black text-white p-2 fixed left-4 top-4 z-10 backdrop-blur-md flex items-center justify-center w-12 h-12 rounded-full border border-white/30 text-white shadow-lg active:scale-95 transition-transform"
      >
        <i className="ri-home-5-line text-2xl font-bold"></i>
      </Link>

      {/* Map Top Half */}
      <div className="h-full w-full overflow-hidden absolute">
        <Map LiveLocation={userLiveLocation} routeData={Routedata} />
      </div>

      {/* Ride Details Bottom Half */}
      <div className="h-2/5 md:w-1/2 w-full  bg-black px-4 py-6 relative bottom-0  text-white flex flex-col   justify-between rounded-t-2xl">
        {/* Driver info & Vehicle image */}
        <div className="flex items-center justify-between w-full px-2">
          <div className="flex flex-col items-center relative h-20 w-32 justify-center">
            <img
              className="h-[140%] object-cover absolute top-[-20%] z-10"
              src={VehicleImage()}
              alt="Vehicle"
            />
          </div>

          <div className="flex flex-col text-right">
            <h2 className="text-gray-400 font-semibold text-lg">
              {rideInfo?.captain?.fullname?.firstname}
            </h2>
            <h3 className="text-2xl font-bold text-white">
              {rideInfo?.captain?.vehicle?.plate}
            </h3>
            <p className="text-sm text-gray-500">
              {rideInfo?.captain?.vehicle?.vehicleType}
            </p>
>>>>>>> fixedBranch
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 mt-6 px-2 flex-grow">
          {/* Destination */}
          <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
            <i className="ri-map-pin-fill text-xl text-gray-300"></i>
            <div>
              <h3 className="text-lg font-medium">Deatination</h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {rideInfo?.destination}
              </p>
            </div>
          </div>

          {/* Fare Details */}
          <div className="flex items-center gap-4 pb-2">
            <i className="ri-currency-line text-xl text-gray-300"></i>
            <div>
              <h3 className="text-lg font-medium">₹ {rideInfo?.fare}</h3>
              <p className="text-sm text-gray-400"> Cash</p>
            </div>
          </div>
        </div>

        <button className="w-full bg-white text-black font-semibold text-lg py-3 rounded-xl active:bg-gray-200 mt-auto">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
