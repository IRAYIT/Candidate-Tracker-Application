import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EnvelopeIcon, LockClosedIcon, CheckCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import iray_icon from "../src/assets/images/iray-logo.jpg";

function Forgotpassword() {
  const [step, setStep] = useState(1);         // 1=email, 2=otp, 3=password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpTimer, setOtpTimer] = useState(0); // 15-min OTP validity countdown

  const navigate = useNavigate();

  // Countdown timer for resend OTP (30s)
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Countdown timer for OTP validity (15 min)
  useEffect(() => {
    if (otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpTimer]);

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

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const handleSendOtp = () => {
    setError("");
    if (!email.trim()) { setError("Email is required."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError("Please enter a valid email address."); return; }

    setLoading(true);
    axios
      .post(`http://localhost:8098/api/v1/user/sendOtp?email=${email}`)
      .then((res) => {
        if (res.data === "OTP sent to your email") {
          setStep(2);
          setResendTimer(30);
          setOtpTimer(15 * 60); // 15 minutes in seconds
        } else {
          setError(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.response?.data || "No account found with this email.";
        setError(msg);
        setLoading(false);
      });
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = () => {
    setError("");
    if (otp.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }

    setLoading(true);
    axios
      .post(`http://localhost:8098/api/v1/user/verifyOtp?email=${email}&otp=${otp}`)
      .then((res) => {
        if (res.data === "OTP Verified") {
          setStep(3);
        } else {
          setError("Invalid OTP. Please try again.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Invalid OTP. Please try again.");
        setLoading(false);
      });
  };

  // ── Step 3: Reset Password ────────────────────────────────────
  const handleReset = () => {
    setError("");
    if (!newPassword) { setError("New password is required."); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }

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
        const msg = err?.response?.data?.message || err?.response?.data || "Something went wrong. Please try again.";
        setError(msg);
        setLoading(false);
      });
  };

  // ── Resend OTP ────────────────────────────────────────────────
  const handleResend = () => {
    setOtp("");
    setOtpTimer(15 * 60);
    setError("");
    setLoading(true);
    axios
      .post(`http://localhost:8098/api/v1/user/sendOtp?email=${email}`)
      .then(() => { setResendTimer(30); setLoading(false); })
      .catch(() => { setError("Failed to resend OTP."); setLoading(false); });
  };

  // ── Helpers ───────────────────────────────────────────────────
  const Spinner = () => (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );

  const StepBar = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
            ${step > s ? "bg-green-500 text-white" : step === s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}>
            {step > s ? "✓" : s}
          </div>
          {i < 2 && <div className={`h-1 w-8 rounded transition-all duration-300 ${step > s ? "bg-green-500" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-400 to-yellow-400 p-1 sm:p-2 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">

        {/* Left: Form */}
        <div className="md:w-1/2 w-full p-8 md:p-12">
          <StepBar />
          <h2 className="text-3xl font-extrabold text-center mb-2">Forgot Password</h2>

          {/* ── Success ── */}
          {success ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
              <p className="text-green-600 font-semibold text-lg text-center">Password reset successfully!</p>
              <p className="text-gray-500 text-sm text-center">You can now login with your new password.</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 bg-gradient-to-r from-blue-600 to-yellow-400 text-white font-semibold py-2 px-6 rounded-md transition hover:scale-105 cursor-pointer"
              >
                Back to Login
              </button>
            </div>

          /* ── Step 1: Email ── */
          ) : step === 1 ? (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm text-center mb-4">Enter your registered email to receive an OTP.</p>

              <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
                <EnvelopeIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                  placeholder="Enter your email"
                  className="w-full focus:outline-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-4">
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-yellow-400 text-white font-semibold py-2 px-6 rounded-md w-full sm:w-auto transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <><Spinner /> Sending OTP...</> : "Send OTP →"}
                </button>
                <button className="text-sm font-semibold text-gray-700 hover:underline cursor-pointer" onClick={() => navigate("/")}>
                  Back to Login
                </button>
              </div>
            </div>

          /* ── Step 2: OTP ── */
          ) : step === 2 ? (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm text-center mb-1">
                OTP sent to <span className="font-semibold text-blue-600">{email}</span>
              </p>
              <p className="text-gray-400 text-xs text-center mb-4">Enter the 6-digit code below.</p>

              {/* Single OTP Input */}
              <div className="flex items-center border-2 rounded-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 ring-yellow-400 transition">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setOtp(val);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                  placeholder="Enter 6-digit OTP"
                  className="w-full text-center text-2xl font-bold tracking-[0.5em] focus:outline-none placeholder:text-sm placeholder:tracking-normal placeholder:font-normal"
                />
              </div>

              {/* OTP Validity Timer */}
              {otpTimer > 0 && (
                <div className="flex items-center justify-center gap-1 text-sm">
                  <span className="text-gray-500">OTP expires in:</span>
                  <span className={`font-bold ${otpTimer <= 60 ? "text-red-500" : "text-green-600"}`}>
                    {String(Math.floor(otpTimer / 60)).padStart(2, "0")}:{String(otpTimer % 60).padStart(2, "0")}
                  </span>
                </div>
              )}
              {otpTimer === 0 && (
                <p className="text-red-500 text-sm text-center font-medium">OTP expired. Please request a new one.</p>
              )}

              {/* Resend */}
              <div className="text-center text-sm text-gray-500">
                {resendTimer > 0 ? (
                  <span>Resend OTP in <span className="font-semibold text-blue-600">{resendTimer}s</span></span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-4">
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-yellow-400 text-white font-semibold py-2 px-6 rounded-md w-full sm:w-auto transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <><Spinner /> Verifying...</> : "Verify OTP →"}
                </button>
                <button
                  className="text-sm font-semibold text-gray-700 hover:underline cursor-pointer flex items-center gap-1"
                  onClick={() => { setStep(1); setError(""); setOtp(""); }}
                >
                  <ArrowLeftIcon className="w-3 h-3" /> Back
                </button>
              </div>
            </div>

          /* ── Step 3: New Password ── */
          ) : (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm text-center mb-4">
                Set a new password for <span className="font-semibold text-blue-600">{email}</span>
              </p>

              <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
                <LockClosedIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  placeholder="New Password"
                  className="w-full focus:outline-none"
                />
              </div>

              {/* Strength Bar */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-2 rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-xs text-gray-500">
                    Strength:{" "}
                    <span className={`font-semibold ${strength.label === "Weak" ? "text-red-500" : strength.label === "Fair" ? "text-yellow-500" : strength.label === "Good" ? "text-blue-500" : "text-green-600"}`}>
                      {strength.label}
                    </span>
                    <span className="ml-2 text-gray-400">(Use uppercase, numbers &amp; symbols)</span>
                  </p>
                </div>
              )}

              <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ring-yellow-400">
                <LockClosedIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReset()}
                  placeholder="Confirm New Password"
                  className="w-full focus:outline-none"
                />
              </div>

              {confirmPassword && (
                <p className={`text-xs font-medium ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-4 gap-4">
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-yellow-400 text-white font-semibold py-2 px-6 rounded-md w-full sm:w-auto transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <><Spinner /> Resetting...</> : "Reset Password"}
                </button>
                <button
                  className="text-sm font-semibold text-gray-700 hover:underline cursor-pointer flex items-center gap-1"
                  onClick={() => { setStep(2); setError(""); setNewPassword(""); setConfirmPassword(""); }}
                >
                  <ArrowLeftIcon className="w-3 h-3" /> Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Branding */}
        <div className="md:w-1/2 w-full bg-white flex flex-col items-center justify-center p-6 border-t md:border-t-0 md:border-l">
          <img src={iray_icon} alt="IRay Logo" className="w-24 md:w-auto h-auto mb-4" />
          <h3 className="text-xl md:text-2xl font-bold text-yellow-500 mb-2 text-center">CANDIDATE TRACKER</h3>
          <p className="text-gray-900 text-sm md:text-base text-center px-4">Track Smarter, Work Better</p>
        </div>

      </div>
    </div>
  );
}

export default Forgotpassword;