import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { captainDataContext } from "../Context/CaptainContext";

const Captainlogout = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(captainDataContext);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/captain/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("captain");
          setCaptain(null);
          navigate("/captain/login");
        }
      })
      .catch((error) => {
        console.error(
          "Captain logout error:",
          error.response?.data?.message || error.message
        );
        localStorage.removeItem("token");
        sessionStorage.removeItem("captain");
        setCaptain(null);
        navigate("/captain/login");
      });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen font-semibold text-lg">
      Logging out captain...
    </div>
  );
};

export default Captainlogout;