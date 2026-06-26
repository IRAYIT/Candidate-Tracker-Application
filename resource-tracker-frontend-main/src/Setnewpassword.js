import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import iray_icon from "../src/assets/images/iray-logo.jpg";

const DEFAULT_PASSWORD = "RESour$@!ce9";

function SetNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const validate = () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (newPassword === DEFAULT_PASSWORD) {
      setError("New password cannot be the same as the default password.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    setError("");
    if (!validate()) return;

    setLoading(true);
    axios
      .post("https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.net/api/v1/user/setNewPassword", {
        email: email,
        newPassword: newPassword,
      })
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          localStorage.clear();
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        setError(
          err?.response?.data || "Failed to set password. Please try again."
        );
        setLoading(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const getStrength = () => {
    if (newPassword.length === 0) return { label: "", color: "bg-gray-200", width: "w-0" };
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    const score = [newPassword.length >= 8, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (score <= 2) return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
    if (score === 3) return { label: "Fair", color: "bg-yellow-400", width: "w-2/4" };
    if (score === 4) return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-400 to-yellow-400 p-1 sm:p-2 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">

        {/* Left Panel - Form */}
        <div className="md:w-1/2 w-full p-8 md:p-12">

          {/* Icon Badge */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-yellow-400 p-3 rounded-full shadow-lg">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-center mb-1">Set New Password</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Welcome! Please set a new password to secure your account.
          </p>

          {success ? (
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="bg-green-100 rounded-full p-4">
                  <ShieldCheckIcon className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <p className="text-green-600 font-semibold text-lg">Password Updated Successfully!</p>
              <p className="text-gray-500 text-sm">Redirecting you to login...</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-green-400 h-1.5 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">

              {/* New Password */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  New Password
                </label>
                <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
                  <LockClosedIcon className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter new password"
                    className="w-full focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showNew
                      ? <EyeSlashIcon className="w-5 h-5" />
                      : <EyeIcon className="w-5 h-5" />
                    }
                  </button>
                </div>

                {/* Strength bar */}
                {newPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                    </div>
                    <p className={`text-xs font-medium ${
                      strength.label === "Weak" ? "text-red-400" :
                      strength.label === "Fair" ? "text-yellow-500" :
                      strength.label === "Good" ? "text-blue-500" : "text-green-500"
                    }`}>{strength.label}</p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                  Confirm Password
                </label>
                <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
                  <LockClosedIcon className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Confirm new password"
                    className="w-full focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirm
                      ? <EyeSlashIcon className="w-5 h-5" />
                      : <EyeIcon className="w-5 h-5" />
                    }
                  </button>
                </div>
                {/* Match indicator */}
                {confirmPassword.length > 0 && (
                  <p className={`text-xs mt-1 font-medium ${
                    newPassword === confirmPassword ? "text-green-500" : "text-red-400"
                  }`}>
                    {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Requirements hint */}
              <ul className="text-xs text-gray-400 space-y-0.5 pl-1">
                <li className={newPassword.length >= 8 ? "text-green-500" : ""}>• At least 8 characters</li>
                <li className={/[A-Z]/.test(newPassword) ? "text-green-500" : ""}>• One uppercase letter</li>
                <li className={/[0-9]/.test(newPassword) ? "text-green-500" : ""}>• One number</li>
                <li className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-500" : ""}>• One special character</li>
              </ul>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-yellow-400 text-white font-semibold py-2 px-6 rounded-md w-full transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Set New Password"
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Branding */}
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

export default SetNewPassword;