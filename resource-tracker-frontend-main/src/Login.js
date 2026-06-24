import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import iray_icon from "../src/assets/images/iray-logo.jpg";

const DEFAULT_PASSWORD = "RESour$@!ce9";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "userName") setUserName(value);
    if (name === "password") setPassword(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  const login = () => {
    const payload = {
      email: userName,
      password: password,
    };

    setLoading(true);

    axios
      .post("https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.net/api/v1/user/login", payload)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("employeeid", res.data.id);
          localStorage.setItem("permissionid", res.data.permission.id);
          localStorage.setItem("firstName", res.data.firstName);
          localStorage.setItem("lastName", res.data.lastName);
          localStorage.setItem("resourceName", res.data.resourceName);

          // Detect default password → force password reset
          if (password === DEFAULT_PASSWORD) {
            localStorage.setItem("resetEmail", userName);
            navigate("/setnewpassword");
          } else {
            setLoginSuccess(true);
            navigate("/manageresources");
          }
        }
      })
      .catch(() => {
        setLoginError(true);
        setLoading(false);
      });
  };

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
                onKeyDown={handleKeyDown}
                placeholder="Email"
                className="w-full focus:outline-none"
              />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
              <LockClosedIcon className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder="Password"
                className="w-full focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword
                  ? <EyeSlashIcon className="w-5 h-5" />
                  : <EyeIcon className="w-5 h-5" />
                }
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-4">
              <button
                onClick={login}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-yellow-400 text-white font-semibold py-2 px-6 rounded-md w-full sm:w-auto transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <button
                className="text-sm font-semibold text-gray-700 hover:underline cursor-pointer"
                onClick={() => navigate("/forgotpassword")}
              >
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