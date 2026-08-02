import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import image from "../assets/map.png";
import { useGSAP } from "@gsap/react/dist";
import gsap from "gsap";
import { useRef } from "react";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../Components/LocationSearchPanel";
import Cabs from "../Components/Cabs";
import Confirmedride from "../Components/Confirmedride";
import LookingForDriver from "../Components/LookingForDriver";
import WaitForDriver from "../Components/WaithingForDriver";
import Map from "../Components/Map";
import { useRideContext } from "../Context/RideContext";
import { useSocketContext } from "../Context/SocketContext";
import { userDataContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

const home = () => {
  gsap.registerPlugin(useGSAP);

  const { user, userLiveLocation } = useContext(userDataContext);
  const { socket } = useSocketContext();
  const navigate = useNavigate();

  const {
    currentLocation,
    setCurrentLocation,
    pickup,
    setPickup,
    destination,
    setDestination,
    panelopen,
    setPanelopen,
    vehiclePanel,
    setVehiclePanel,
    confirmRidePanel,
    setConfirmRidePanel,
    lookingPanel,
    setLookingPanel,
    waitingForDriverPanel,
    setWaitingForDriverPanel,
    suggestions,
    setSuggestions,
    activeField,
    setActiveField,
    isFetchingSuggestions,
    setIsFetchingSuggestions,
    fare,
    setFare,
    rideInfo,
    setRideInfo,
    loading,
    setLoading,
    confirmRideSelection,
    fetchAndDrawRoute,
    routeData,
    setRouteData,
  } = useRideContext();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (socket && user) {
      socket.emit("join", { userType: "user", userId: user._id });
    }

    const locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          socket.emit("update-location-user", {
            userId: user._id,
            userType: "user",
            location: {
              lat: latitude,
              lng: longitude,
            },
          });
        });
      }
    }, 10000);

    return () => clearInterval(locationInterval);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = (ride) => {
      setLookingPanel(false);
      setWaitingForDriverPanel(true);
      setRideInfo(ride);
    };

    socket.on("ride-confirmed", handleRideConfirmed);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
    };
  }, [socket, setLookingPanel, setWaitingForDriverPanel, setRideInfo]);

  useEffect(() => {
    socket.on("ride-started", (ride) => {
      setWaitingForDriverPanel(false);
      navigate("/riding");
    });

    return () => {
      socket.off("ride-started"); // <-- is this missing?
    };
  }, [socket]);

  const debounceTimerRef = useRef(null);
  const panelRef = useRef(null);
  const arrow = useRef(null);
  const vehiclePanelRef = useRef(null);
  const ConfirmRide = useRef(null);
  const LookingRideRef = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const [Routedata, setDrawedata] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();
  };

  const fetchSuggestions = async (value, field) => {
    if (!value?.trim()) {
      setSuggestions([]);
      return;
    }

    setActiveField(field);
    setPanelopen(true);
    setIsFetchingSuggestions(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestion`,
        {
          params: { address: value },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const items = Array.isArray(response?.data?.features)
        ? response.data.features
        : Array.isArray(response?.data?.results)
          ? response.data.results
          : [];

      const normalized = items.map((item, index) => {
        const props = item.properties || item;
        const address =
          props.formatted || props.address_line1 || props.name || "";

        return {
          id:
            props.place_id ||
            props.osm_id ||
            `${props.name || "suggestion"}-${index}`,
          name:
            props.name || props.formatted || props.address_line1 || "Location",
          address,
          type: "location",
          lat: props.lat ?? item.lat,
          lon: props.lon ?? item.lon,
        };
      });

      setSuggestions(normalized);
    } catch (error) {
      console.error("Suggestion fetch failed", error);
      setSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  };
  const debouncedFetchSuggestions = (value, field) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value, field);
    }, 500);
  };
  const handleSuggestionSelect = (location) => {
    const value = location.address || location.name;

    if (activeField === "destination") {
      setDestination(value);
    } else {
      setPickup(value);
    }

    setSuggestions([]);
  };
  const Findtrip = async () => {
    const token = localStorage.getItem("token");

    if (!socket || !user?._id) {
      console.warn("Socket is not ready yet");
      return;
    }

    if (pickup && destination) {
      setLoading(true);

      setPanelopen(false);
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/ride/getfare`,
        {
          params: {
            origin: pickup,
            destination: destination,
          },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setFare(response.data);
    } catch (error) {
      console.error("Error fetching fare:", error);
    } finally {
      setLoading(false); // stop spinner, whether success or fail
    }

    if (pickup && destination) {
      setVehiclePanel(true);
      setPanelopen(false);
    }
  };
  const DefaultLocation = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to use this feature");
      return;
    }

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/maps/current-location`,
      {
        params: {
          lat: userLiveLocation.lat,
          lon: userLiveLocation.lng,
        },
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setPickup(response.data.address);
  };
  const Draw = async (origin, destination) => {
    const data = await fetchAndDrawRoute(origin, destination);

    setDrawedata(data);
  };

  useGSAP(() => {
    if (panelopen) {
      gsap.to(panelRef.current, {
        height: "50%",
        duration: 1,
        ease: "power3.out",
      });
      gsap.to(arrow.current, {
        rotate: 180,
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(panelRef.current, {
        height: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.to(arrow.current, {
        rotate: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [panelopen]);

  useGSAP(() => {
    if (vehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
        duration: 1,
        ease: "power3.out",
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
        duration: 1,
        ease: "power3.out",
      });
    }
  }, [vehiclePanel]);

  useGSAP(() => {
    if (confirmRidePanel) {
      gsap.to(ConfirmRide.current, {
        transform: "translateY(0)",
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(ConfirmRide.current, {
        transform: "translateY(100%)",
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [confirmRidePanel]);

  useGSAP(() => {
    if (lookingPanel) {
      gsap.to(LookingRideRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(LookingRideRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [lookingPanel]);

  useGSAP(() => {
    if (waitingForDriverPanel) {
      gsap.to(WaitingForDriverRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(WaitingForDriverRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
        ease: "power3.out",
      });
    }
  }, [waitingForDriverPanel]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#343134] flex items-center justify-center">
      <button
        className="absolute text-sm px-2 py-1 text-white bg-black rounded-lg font-bold top-5 right-5 z-10"
        onClick={() => {
          navigate("/user/logout");
        }}
      >
        Logout
      </button>
      <img
        className="absolute top-0  w-30 z-1 left-0"
        src="https://media.ffycdn.net/us/postmates/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8zMFwvYXNzZXRzXC84NFwvNTY0OFwvZDgwNzhiNTY5MDgxZGMwMDg2YTA5MzMxODRmNzRjYWYtMTYyMDcxOTg2Ni5wbmcifQ:postmates:8yzkJLajxr6_SqXPeLDmCnbN5hR-5WgmEC3pzohGaAA?width={width}&rect=2.5259622713415,0,797.47403772866,487&reference_width=800"
        alt=""
      />

      <div className="absolute inset-0 z-0">
        <Map LiveLocation={userLiveLocation} routeData={Routedata} />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end pt-4 rounded-2xl items-center w-full  ">
        <div className="h-fit  bg-black flex flex-col justify-start  rounded-t-3xl pointer-events-auto md:w-1/2 w-full ">
          <i
            onClick={() => {
              setPanelopen((prev) => !prev);
            }}
            ref={arrow}
            className="ri-arrow-up-s-line text-white text-center text-3xl p-2"
          ></i>

          <h2 className="text-white text-3xl text-center  font-semibold m-2">
            Find a trip
          </h2>

          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="h-fit flex flex-col px-4 gap-4 items-center w-full  text-white font-medium relative pb-8"
          >
            <div className="h-fit w-full flex flex-row px-4 gap-2  text-white font-medium relative ">
              <div className=" flex w-[5%] items-center justify-center">
                <div className="bg-white/60 relative justify-center  top-0 left-0 w-1 h-[80%] rounded-full flex">
                  <div className=" bg-white w-3 h-3 rounded-full top-0 absolute"></div>
                  <div className="w-3 h-3 bg-white rotate-180 [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)] bottom-0 absolute"></div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <input
                  onClick={() => {
                    setPanelopen(true);
                    DefaultLocation();
                  }}
                  value={pickup}
                  onChange={(e) => {
                    setPickup(e.target.value);
                    debouncedFetchSuggestions(e.target.value, "pickup");
                  }}
                  className="text-lg bg-white/10 border-[0.5px] border-white/15  py-2 rounded-lg px-4 border-0 w-full "
                  type="text"
                  placeholder="Enter your pickup location"
                />
                <input
                  onClick={() => setPanelopen(true)}
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    debouncedFetchSuggestions(e.target.value, "destination");
                  }}
                  className="text-lg bg-white/10 border-[0.5px] border-white/15  py-2 rounded-lg px-4 border-0 w-full"
                  type="text"
                  placeholder="Enter your destination"
                />
              </div>
            </div>
            <button
              onClick={() => {
                Findtrip();
                Draw(pickup, destination);
                fetchAndDrawRoute(pickup, destination);
              }}
              disabled={loading}
              className="bg-white text-black w-[80%] text-lg px-4 py-2 rounded flex items-center justify-center"
            >
              {loading ? <div className="spinner"></div> : "Find"}
            </button>
          </form>
        </div>
        <div
          ref={panelRef}
          className="bg-black h-0 relative md:w-1/2 w-full  overflow-y-hidden pointer-events-auto "
        >
          <LocationSearchPanel
            suggestions={suggestions}
            isLoading={isFetchingSuggestions}
            onSelectSuggestion={handleSuggestionSelect}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="h-fit rounded-2xl translate-y-full bg-black absolute  bottom-0 w-full md:w-1/2 z-20"
      >
        <Cabs />
      </div>
      <div
        ref={ConfirmRide}
        className="h-fit rounded-2xl translate-y-full bg-black absolute  bottom-0 w-full md:w-1/2 z-30"
      >
        <Confirmedride />
      </div>
      <div
        ref={LookingRideRef}
        className="h-fit rounded-2xl translate-y-full bg-black absolute  bottom-0 w-full md:w-1/2 z-30"
      >
        <LookingForDriver />
      </div>
      <div
        ref={WaitingForDriverRef}
        className="h-fit rounded-2xl translate-y-full bg-black absolute  bottom-0 w-full md:w-1/2 z-30"
      >
        <WaitForDriver />
      </div>
    </div>
  );
};

export default home;
