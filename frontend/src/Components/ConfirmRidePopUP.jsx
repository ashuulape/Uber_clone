import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUP = (props) => {
  const [info, setinfo] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/ride/start-ride`,
      {
        params: {
          OTP: otp,
          rideId: props?.Ride?._id,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    if (res.status === 200) {
      props.setConfirmShowRide(false);
      navigate("/captain/riding");
    }
  };

  return (
    <div className="bg-black text-white px-4 font-sans w-full md:w-1/2 flex flex-col items-center rounded-t-3xl pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      {/* Top indicator handle to close */}
      <div
        onClick={() => {
          setinfo((prev) => !prev);
        }}
        className="w-[15%] h-1.5 bg-gray-600 rounded-full mx-auto mb-4 mt-5 cursor-pointer"
      ></div>

      <h1 className="text-start text-2xl font-semibold w-full mb-6">
        Confirm this ride to Start
      </h1>

      {/* Rider Details */}
      <div className="flex items-center justify-between w-full bg-gray-900 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border-[2px] border-white">
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1760&auto=format&fit=crop"
              alt="Rider"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {props?.Ride?.user?.fullname?.firstname +
                " " +
                props?.Ride?.user?.fullname?.lastname}
            </h2>
            <h3 className="text-sm text-gray-400">Apple Pay</h3>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-white">
            {props?.Ride?.distance} KM
          </h2>
          <div className="mt-1 text-sm font-semibold flex items-center justify-end gap-1">
            <i className="ri-star-fill text-yellow-500"></i>
            <span className="text-white/50"> 4.9</span>
          </div>
        </div>
      </div>
      {info && (
        <div className="w-full flex flex-col gap-4 mt-6 px-2">
          <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
            <i className="ri-map-pin-2-fill text-xl text-gray-300"></i>
            <div>
              <h3 className="text-lg font-medium">PickUp</h3>
              <p className="text-sm text-gray-400">{props?.Ride?.origin}</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
            <i className="ri-map-pin-fill text-xl text-gray-300"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {props?.Ride?.destination}
              </p>
            </div>
          </div>

          {/* Fare Details */}
          <div className="flex items-center gap-4 pb-2">
            <i className="ri-currency-line text-xl text-gray-300"></i>
            <div>
              <h3 className="text-lg font-medium">₹ {props?.Ride?.fare}</h3>
              <p className="text-sm text-gray-400">Cash</p>
            </div>
          </div>
        </div>
      )}

      {/* OTP Input and Button */}
      <div className="w-full mt-6">
        <form className="flex flex-col gap-4" onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 px-4 py-3 text-lg rounded-xl text-white outline-none focus:border-green-500 font-mono tracking-widest text-center"
          />
          <div className="flex md:flex-row flex-col md:gap-10 gap-2">
            <button className="w-full flex items-center justify-center bg-white text-black font-bold text-lg py-3 rounded-xl active:bg-white transition-colors">
              Confirm
            </button>

            <button
              type="button"
              onClick={() => {
                if (props.setConfirmShowRide) props.setConfirmShowRide(false);
              }}
              className="w-full bg-white/20 text-red-500 font-semibold text-lg py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmRidePopUP;
