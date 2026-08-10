import React, { useContext } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userDataContext } from "../Context/UserContext";
import axios from "axios";

const Userlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setuser } = useContext(userDataContext);
  const [err, seterr] = useState(null);
  const navigate = useNavigate();

  const submitHandle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    seterr(null);

    const userData = {
      email: email,
      password: password,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        userData,
        { validateStatus: () => true },
      );

      if (response.status === 200) {
        const data = response.data;
        setuser(data.user);
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        seterr("invalid credentials! try again");
      }
    } catch (error) {
      seterr("something went wrong, please try again");
    } finally {
      setIsLoading(false);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex p-8 flex-col justify-around items-center h-screen ">
      <img
        className="invert h-30 "
        src="https://media.ffycdn.net/us/postmates/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8zMFwvYXNzZXRzXC84NFwvNTY0OFwvZDgwNzhiNTY5MDgxZGMwMDg2YTA5MzMxODRmNzRjYWYtMTYyMDcxOTg2Ni5wbmcifQ:postmates:8yzkJLajxr6_SqXPeLDmCnbN5hR-5WgmEC3pzohGaAA?width={width}&rect=2.5259622713415,0,797.47403772866,487&reference_width=800"
        alt=""
      />

      <div className="flex flex-col min-w-[300px] w-[600px] max-w-full  items-center h-screen  py-8 font-medium ">
        <form
          onSubmit={(e) => submitHandle(e)}
          action=""
          className="bg-white flex flex-col gap-5  rounded shadow-[10 10 10 10]
            w-full md:px-10 px-0   py-6  "
        >
          <h2 className="text-black/70">Whats your email</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-600/50 p-2 rounded w-full mt-[-15px]"
            required
            type="email"
            placeholder="Enter your email"
          />

          <h2 className="text-black/70">Enter Password</h2>

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-600/50 p-2 rounded w-full mt-[-15px]"
            required
            type="password"
            placeholder="Enter your password"
          />
          {err && (
            <h1 className="text-lg text-red-600 font-semibold w-full  text-center">
              *{err}*
            </h1>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-black text-white p-3 rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              "login"
            )}
          </button>

          <p className="text-center">
            dont have an account?{" "}
            <Link to="/register" className="underline text-gray-500">
              {" "}
              register here
            </Link>
          </p>
        </form>
      </div>
      <Link
        to="/captain/login"
        type="submit"
        className="bg-black   text-center text-white p-3 rounded font-semibold  min-w-[300px] w-[600px] max-w-full"
      >
        Sign in as Captain
      </Link>
    </div>
  );
};

export default Userlogin;
