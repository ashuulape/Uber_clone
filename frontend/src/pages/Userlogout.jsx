import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../Context/UserContext";

const Userlogout = () => {
  const { setuser } = useContext(userDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("user");
          setuser(null);
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error(
          "Logout error:",
          error.response?.data?.message || error.message
        );
        localStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setuser(null);
        navigate("/login");
      });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen font-semibold text-lg">
      Logging out...
    </div>
  );
};

export default Userlogout;
