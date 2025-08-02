// 'use client';

// export default function ForgetPassword() {
//   return (
//     <div className="min-h-screen bg-[#a1ad92] flex items-center justify-center px-4">
//       <div className="bg-white rounded-2xl shadow-md w-full max-w-4xl px-16 py-14 min-h-[500px] flex flex-col justify-center">
//         <h1 className="text-3xl font-bold text-center mb-10 text-black">Forget Password</h1>

//         <form className="space-y-6 max-w-md mx-auto w-full">
//           <div>
//             <label htmlFor="email" className="block text-sm font-semibold mb-2 text-left text-black">
//               Email ID
//             </label>
//             <input
//               id="email"
//               type="email"
//               placeholder="Enter Your Email ID"
//               className="w-full px-4 py-3 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] focus:outline-none text-[#000000]"
//             />
//           </div>

//           <div className="text-center">
//             <button
//               type="submit"
//               className="bg-[#b8bfa5] text-black font-semibold px-15 py-1.5 rounded-lg shadow-md hover:opacity-90 transition-all duration-200"
//             >
//               Send OTP
//             </button>
//           </div>
//         </form>

//         <div className="text-center mt-6">
//           <p className="text-sm text-gray-700 hover:underline cursor-pointer">Back To Login</p>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/wardenauth"; // Change if needed

export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post(`${API_BASE}/forgot-password`, { email });
      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post(`${API_BASE}/verify-otp`, { email, otp });
      setMessage("OTP verified. You can now reset your password.");
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post(`${API_BASE}/reset-password`, { email, otp, newPassword });
      setMessage("Password reset successfully. You can now log in.");
      setStep(4);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#a1ad92] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-4xl px-16 py-14 min-h-[500px] flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-center mb-10 text-black">Forgot Password</h1>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6 max-w-md mx-auto w-full">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-black">Email ID</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                required
                className="w-full px-4 py-3 rounded-xl shadow focus:outline-none text-black"
              />
            </div>

            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div className="text-center">
              <button
                type="submit"
                className="bg-[#b8bfa5] text-black font-semibold px-10 py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                Send OTP
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 max-w-md mx-auto w-full">
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold mb-2 text-black">Enter OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your email"
                required
                className="w-full px-4 py-3 rounded-xl shadow focus:outline-none text-black"
              />
            </div>

            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div className="text-center">
              <button
                type="submit"
                className="bg-[#b8bfa5] text-black font-semibold px-10 py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6 max-w-md mx-auto w-full">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold mb-2 text-black">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="w-full px-4 py-3 rounded-xl shadow focus:outline-none text-black"
              />
            </div>

            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <div className="text-center">
              <button
                type="submit"
                className="bg-[#b8bfa5] text-black font-semibold px-10 py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="text-center space-y-4">
            <p className="text-green-600 text-xl font-semibold">✅ Password has been reset!</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-[#b8bfa5] text-black font-semibold px-10 py-2 rounded-lg shadow hover:opacity-90 transition"
            >
              Go to Login
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <p
            className="text-sm text-gray-700 hover:underline cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            Back To Login
          </p>
        </div>
      </div>
    </div>
  );
}
