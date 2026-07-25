import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../assets/map.png";
import { useGSAP } from "@gsap/react/dist";
import gsap from "gsap";
import { useRideContext } from "../Context/RideContext";
import { captainDataContext } from "../Context/CaptainContext";
import Map from "../Components/Map";

const FinishRidePanel = (props) => {
  return (
    <div className="bg-black text-white px-4 font-sans w-full md:w-1/2 flex flex-col items-center rounded-t-3xl pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
      <div
        onClick={() => props.setFinishRidePanel(false)}
        className="w-[15%] h-1.5 bg-gray-600 rounded-full mx-auto mb-4 mt-5 cursor-pointer"
      ></div>

      <h1 className="text-start text-2xl font-semibold w-full  mb-6">
        Finish this Ride
      </h1>

      {/* Rider card */}
      <div className="flex items-center justify-between w-full bg-gray-900 rounded-2xl p-4 shadow-lg mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-800 rounded-full overflow-hidden border-[2px] border-white">
            <img
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1760&auto=format&fit=crop"
              alt="Rider"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Ashutosh Singh</h2>
            <h3 className="text-sm text-gray-400">Passenger</h3>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-white">2.2 KM</h2>
          <div className="mt-1 text-sm font-semibold flex items-center justify-end gap-1">
            <i className="ri-star-fill text-yellow-500"></i>
            <span className="text-white/50">4.9</span>
          </div>
        </div>
      </div>

      {/* Trip details */}
      <div className="w-full flex flex-col gap-4 px-2 mb-6">
        <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
          <i className="ri-map-pin-2-fill text-xl text-gray-300"></i>
          <div>
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm text-gray-400">Kankariya Talab, Bhopal</p>
          </div>
        </div>
        <div className="flex items-center gap-4 border-b border-gray-700 pb-4">
          <i className="ri-map-pin-fill text-xl text-gray-300"></i>
          <div>
            <h3 className="text-lg font-medium">Third Wave Coffee</h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              17th Cross Rd, PWD Quarters, 1st Sector, HSR Layout, Bengaluru
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 pb-2">
          <i className="ri-currency-line text-xl text-gray-300"></i>
          <div>
            <h3 className="text-lg font-medium">₹193.20</h3>
            <p className="text-sm text-gray-400">Cash</p>
          </div>
        </div>
      </div>

      <Link
        to="/captainhome"
        className="w-full flex items-center justify-center bg-white text-black font-bold text-lg py-3 rounded-xl active:bg-white/20 transition-colors"
      >
        Finish Ride
      </Link>
    </div>
  );
};

const CaptainRiding = () => {
  const { Ride, CaptainLiveLoaction } = useContext(captainDataContext);
  const { fetchAndDrawRoute } = useRideContext();

  const navigate = useNavigate();

  const [Routedata, setDrawedata] = useState(null);

  const { origin, destination } = Ride;

  useEffect(() => {
    if (Ride === undefined) {
      navigate("/captainhome");
    }
  }, [Ride]);

  const Draw = async (origin, destination) => {
    const data = await fetchAndDrawRoute(origin, destination);

    setDrawedata(data);
  };
  Draw(origin, destination);

  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [finishRidePanel]);

  return (
    <div className="h-screen bg-black overflow-hidden relative flex justify-center ">
      {/* Top Navbar */}
      <div className="fixed p-4 top-0 flex items-center justify-between w-full z-10">
        <div className="w-12 h-12 bg-black backdrop-blur-md flex items-center justify-center rounded-full border border-white/30 text-white shadow-lg">
          <i className="ri-menu-line text-2xl font-bold"></i>
        </div>
        <div className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          On Trip
        </div>
      </div>

      {/* Map */}
      <div className="h-4/5 w-full overflow-hidden">
        <Map LiveLocation={CaptainLiveLoaction} routeData={Routedata} />
      </div>

      {/* Bottom strip */}
      <div className="h-1/5 w-full absolute bottom-0 md:w-1/2 bg-black flex items-center justify-between px-6  z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <i className="ri-map-pin-fill text-white text-base"></i>
            <span></span>
          </div>
          <h2 className="text-white text-2xl font-bold">
            {Ride?.distance} KM{" "}
            <span className="text-gray-400 text-base font-normal">away</span>
          </h2>
          <p className="text-gray-500 text-sm">
            ~{Ride?.duration} min to destination
          </p>
        </div>

        <button
          onClick={() => setFinishRidePanel(true)}
          className="bg-white text-black font-bold px-6 py-3 rounded-xl text-base active:bg-green-400 transition-colors"
        >
          Complete Ride
        </button>
      </div>

      {/* Finish Ride Panel */}
      <div
        ref={finishRidePanelRef}
        className="translate-y-full absolute bottom-0 w-full md:flex justify-center z-30"
      >
        <FinishRidePanel setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
