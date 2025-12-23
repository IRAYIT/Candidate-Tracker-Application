import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import iray_icon from "../src/assets/images/iray-logo.jpg";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "userName") setUserName(value);
    if (name === "password") setPassword(value);
  };

  const login = () => {
    const payload = {
      email: userName,
      password: password,
    };

    axios
    //  .post("https://resourcetracker.gotracrat.in:8098/api/v1/user/login", payload)
    .post("http://localhost:8098/api/v1/user/login", payload)
      .then((res) => {
        if (res.status === 200) {
            console.log(res.data);
          localStorage.setItem("employeeid", res.data.id);
          localStorage.setItem("permissionid", res.data.permission.id);
          localStorage.setItem("firstName",res.data.firstName);
          localStorage.setItem("lastName",res.data.lastName);
          localStorage.setItem("resourceName",res.data.resourceName);
          //localStorage.setItem("employeeid",res.data.id);
          setLoginSuccess(true);
        }
      })
      .catch(() => {
        setLoginError(true);
      });

      localStorage.setItem("employeeid", "1");
  localStorage.setItem("permissionid", "1");
  localStorage.setItem("firstName", "Dev");
  localStorage.setItem("lastName", "User");
  localStorage.setItem("resourceName", "Developer");

  setLoginSuccess(true);
  };

  if (loginSuccess) {
    navigate("/manageresources");

  };

  if (loginSuccess) {
    navigate("/manageresources");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-400 to-yellow-400 p-1 sm:p-2 md:p-4">
  <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
      
        <div className="md:w-1/2 w-full p-8 md:p-12">
          <h2 className="text-3xl font-extrabold text-center mb-6 cursor-pointer">Login</h2>

          <div className="space-y-4">
        
            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
              <UserIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                name="userName"
                value={userName}
                onChange={onChange}
                placeholder="Email"
                className="w-full focus:outline-none"
              />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
              <LockClosedIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
                className="w-full focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-4">
              <button
                onClick={login}
                className="bg-gradient-to-r from-blue-600 to-yellow-400 text-white font-semibold py-2 px-6 rounded-md w-full sm:w-auto transition hover:scale-105 cursor-pointer"
              >
                Login
              </button>
              <button className="text-sm font-semibold text-gray-700 hover:underline cursor-pointer" onClick={() => navigate('/forgotpassword')}>
                Forgot password?
              </button>
            </div>

            {loginError && (
              <p className="text-red-500 text-sm text-center">
                Login failed. Please try again.
              </p>
            )}
          </div>
        </div>

        <div className="md:w-1/2 w-full bg-white flex flex-col items-center justify-center p-6 border-t md:border-t-0 md:border-l">
          <img src={iray_icon} alt="IRay Logo" className="w-24 md:w-auto h-auto mb-4" />
          <h3 className="text-xl md:text-2xl font-bold text-yellow-500 mb-2 text-center">
            CANDIDATE TRACKER
          </h3>
          <p className="text-gray-900 text-sm md:text-base text-center px-4">
            Track Smarter, Work Better
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
