import axios from "axios";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import userdata, { userDataContext } from "../Context/UserContext";

const Userlogout = async () => {
  const { setUser } = useContext(userDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  try {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
      {}, // empty body — backend doesn't need one, it reads the cookie
      {
        withCredentials: true, // REQUIRED — sends the httpOnly cookie so req.cookies.token works
      },
    );

    // clear frontend state too
    setUser(null);
    localStorage.removeItem("user"); // or sessionStorage, whichever you're using
    navigate("/login"); // or wherever you want to redirect
  } catch (error) {
    console.error(
      "Logout failed:",
      error.response?.data?.message || error.message,
    );
  }
  return <div></div>;
};

export default Userlogout;
