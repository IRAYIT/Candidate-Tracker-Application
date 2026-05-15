import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EnvelopeIcon, LockClosedIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import iray_icon from "../src/assets/images/iray-logo.jpg";

function Forgotpassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "25%" };
    if (score === 2) return { label: "Fair", color: "bg-yellow-400", width: "50%" };
    if (score === 3) return { label: "Good", color: "bg-blue-400", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getPasswordStrength(newPassword);

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!newPassword) {
      setError("New password is required.");
      return false;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleReset = () => {
    setError("");
    if (!validate()) return;

    setLoading(true);

    axios
      .post("http://localhost:8098/api/v1/user/forgotPassword", {
        email,
        password: newPassword,
      })
      .then((res) => {
        if (res.data === "Password Changed Successfully") {
          setSuccess(true);
        } else {
          setError(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data ||
          "Invalid Email. Please Enter Correct Email";
        setError(msg);
        setLoading(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleReset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-400 to-yellow-400 p-1 sm:p-2 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">

        {/* Left: Form */}
        <div className="md:w-1/2 w-full p-8 md:p-12">
          <h2 className="text-3xl font-extrabold text-center mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            Enter your email and set a new password.
          </p>

          {success ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
              <p className="text-green-600 font-semibold text-lg text-center">
                Password reset successfully!
              </p>
              <p className="text-gray-500 text-sm text-center">
                You can now login with your new password.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 bg-gradient-to-r from-blue-600 to-yellow-400 text-white font-semibold py-2 px-6 rounded-md transition hover:scale-105 cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Email */}
              <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your email"
                  className="w-full focus:outline-none"
                />
              </div>

              {/* New Password */}
              <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
                <LockClosedIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="New Password"
                  className="w-full focus:outline-none"
                />
              </div>

              {/* Password Strength Bar */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Strength:{" "}
                    <span
                      className={`font-semibold ${
                        strength.label === "Weak"
                          ? "text-red-500"
                          : strength.label === "Fair"
                          ? "text-yellow-500"
                          : strength.label === "Good"
                          ? "text-blue-500"
                          : "text-green-600"
                      }`}
                    >
                      {strength.label}
                    </span>
                    <span className="ml-2 text-gray-400">
                      (Use uppercase, numbers &amp; symbols)
                    </span>
                  </p>
                </div>
              )}

              {/* Confirm Password */}
              <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
                <LockClosedIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Confirm New Password"
                  className="w-full focus:outline-none"
                />
              </div>

              {/* Match Indicator */}
              {confirmPassword && (
                <p className={`text-xs font-medium ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-4">
                <button
                  onClick={handleReset}
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
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>

                <button
                  className="text-sm font-semibold text-gray-700 hover:underline cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Back to Login
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Right: Branding */}
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

export default Forgotpassword;