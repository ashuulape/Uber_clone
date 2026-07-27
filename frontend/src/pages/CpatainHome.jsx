import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../Components/CaptainDetails";
import RidePopUP from "../Components/RidePopUP";
import ConfirmRidePopUP from "../Components/ConfirmRidePopUP";
import { useGSAP } from "@gsap/react/dist";
import gsap from "gsap";
import Map from "../Components/Map";
import { captainDataContext } from "../Context/CaptainContext";
import { useSocketContext } from "../Context/SocketContext";
import { Socket } from "socket.io-client";
import axios from "axios";

const CpatainHome = () => {
  const { captain, CaptainLiveLoaction, setRide, Ride } =
    useContext(captainDataContext);
  const captainName =
    [captain?.fullname?.firstname, captain?.fullname?.lastname]
      .filter(Boolean)
      .join(" ") || "Captain";

  const { socket } = useSocketContext();
  const [showRide, setShowRide] = useState(false);
  const [confirmShowRide, setConfirmShowRide] = useState(false);
  const [Drawdata, setDrawdata] = useState({});
  const RidePopUpRef = useRef(null);
  const ConfirmPopUpRef = useRef(null);

  React.useEffect(() => {
    if (!socket || !captain?._id) return;

    socket.emit("join", {
      userType: "captain",
      userId: captain._id,
    });

    const locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          socket.emit("update-location-captain", {
            userId: captain._id,
            userType: "captain",
            location: {
              lat: latitude,
              lng: longitude,
            },
          });
        });
      }
    }, 10000);

    return () => clearInterval(locationInterval);
  }, [socket, captain?._id]);

  socket.on("new-ride", (data) => {
    console.log("New ride request:", data);
    setRide(data);
    setShowRide(true);
  });

  useGSAP(() => {
    if (showRide) {
      gsap.to(RidePopUpRef.current, {
        transform: "translateY(0)",
        duration: 1,
        ease: "power3.out",
      });
    } else {
      gsap.to(RidePopUpRef.current, {
        transform: "translateY(100%)",
        duration: 1,
        ease: "power3.out",
      });
    }
  }, [showRide]);

  useGSAP(() => {
    if (confirmShowRide) {
      gsap.to(ConfirmPopUpRef.current, {
        transform: "translateY(0)",
        duration: 1,
        ease: "power3.out",
      });
    } else {
      gsap.to(ConfirmPopUpRef.current, {
        transform: "translateY(100%)",
        duration: 1,
        ease: "power3.out",
      });
    }
  }, [confirmShowRide]);

  const ConfirmRide = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/ride/confirm`,
      {
        rideId: Ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    setShowRide(false);
    setConfirmShowRide(true);
  };

  const [DistaceTime, setDistaceTime] = useState({});
  const DistanceTwoPoints = async (origin, destination) => {
    const responce = axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/maps/get-distance-time`,
      {
        params: {
          origin: origin,
          destination: destination,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    return responce.data;
  };

  return (
    <div className="h-screen bg-black/40 overflow-hidden relative">
      {/* Top Navbar */}
      <div className="fixed p-4 top-0 flex items-center justify-between w-full z-10">
        <div className="flex flex-col items-start text-white">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
            Driver
          </p>
          <p className="text-sm font-semibold text-capitalize">{captainName}</p>
        </div>

        <Link
          to="/captain/logout"
          className="w-12 h-12 bg-black backdrop-blur-md flex items-center justify-center rounded-full border border-white/30 text-white shadow-lg active:scale-95 transition-transform"
        >
          <i className="ri-logout-box-r-line text-2xl font-bold"></i>
        </Link>
      </div>

      {/* Map Background */}
      <div className="h-full w-full overflow-hidden absolute top-0 left-0 z-0">
        <Map LiveLocation={CaptainLiveLoaction} routeData={Drawdata} />
      </div>

      {/* Bottom Details Panel */}
      <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none flex justify-center  w-full">
        <div className="pointer-events-auto md:w-1/2">
          <CaptainDetails />
        </div>

        <div
          ref={RidePopUpRef}
          className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 flex justify-center translate-y-full"
        >
          <RidePopUP
            Ride={Ride}
            setDrawdata={setDrawdata}
            setShowRide={setShowRide}
            setConfirmShowRide={setConfirmShowRide}
            ConfirmRide={ConfirmRide}
            DistaceTime={DistaceTime}
            setDistaceTime={setDistaceTime}
            DistanceTwoPoints={DistanceTwoPoints}
            CaptainLiveLoaction={CaptainLiveLoaction}
          />
        </div>
        <div
          ref={ConfirmPopUpRef}
          className="pointer-events-auto absolute inset-x-0 bottom-0 z-40 translate-y-full flex justify-center"
        >
          <ConfirmRidePopUP
            Ride={Ride}
            setConfirmShowRide={setConfirmShowRide}
          />
        </div>
      </div>
    </div>
  );
};

export default CpatainHome;
