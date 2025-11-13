"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WardenLogin() {
  const [step, setStep] = useState(1); // 1 = Enter Warden ID, 2 = Enter OTP
  const [wardenId, setWardenId] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedNumber, setMaskedNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPunchModal, setShowPunchModal] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Step 1: Send OTP to WhatsApp
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/send-login-otp`,
        { wardenId }
      );

      setMaskedNumber(response.data.contactNumber || "your registered number");
      setStep(2);
      setResendTimer(60);
      toast.success("OTP sent to your WhatsApp!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Login
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/login`,
        { wardenId, otp }
      );

      const { token, warden } = response.data;

      localStorage.setItem("wardenToken", token);
      localStorage.setItem("wardenInfo", JSON.stringify(warden));
      setToken(token);

      
      


     
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
    } 
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setOtp("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/send-login-otp`,
        { wardenId }
      );

      setResendTimer(60);
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Go back to step 1
  const handleBack = () => {
    setStep(1);
    setOtp("");
  };

 

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

     

      <div className="min-h-screen w-full bg-white overflow-x-hidden">
        {/* Mobile View */}
        <div className="md:hidden flex flex-col min-h-screen">
          <div
            className={`bg-[#A4B494] px-4 py-8 flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            }`}
          >
            <h1
              className={`text-2xl font-extrabold mb-4 text-black transition-all duration-700 delay-300 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              Welcome Back!
            </h1>
            <div
              className={`transition-all duration-700 delay-500 ease-out transform ${
                mounted ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 rotate-12"
              }`}
            >
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-white shadow-lg">
                <img src="logo.png" alt="Kokan Global Foundation" className="w-full h-full object-cover" />
              </div>
            </div>
            <p
              className={`mt-4 text-xs font-bold text-black leading-tight transition-all duration-700 delay-700 ease-out px-2 ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              "Manage Your Hostel Smarter – Everything You Need in One Platform."
            </p>
          </div>

          <div
            className={`bg-white px-4 py-4 transition-all duration-1000 ease-out ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-6 text-black text-center transition-all duration-700 delay-200 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
              }`}
            >
              Warden Login
            </h2>

            {step === 1 ? (
              // Step 1: Enter Warden ID
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-black block">Warden ID</label>
                  <input
                    type="text"
                    value={wardenId}
                    onChange={(e) => setWardenId(e.target.value)}
                    placeholder="Enter Your Warden ID"
                    required
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent placeholder:text-gray-400 text-black"
                  />
                </div>

                <div className="pt-4 pb-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#BEC5AD] hover:bg-[#a9b29d] disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 text-sm rounded-lg shadow-md"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Enter OTP
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-600">
                    OTP sent to: <span className="font-semibold">{maskedNumber}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-black block">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit OTP"
                    required
                    maxLength={6}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent placeholder:text-gray-400 text-black text-center tracking-widest"
                  />
                </div>

                <div className="flex flex-col space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-[#BEC5AD] hover:bg-[#a9b29d] disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold py-3 text-sm rounded-lg shadow-md"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify & Login"
                    )}
                  </button>

                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-gray-600 hover:underline"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || loading}
                      className="text-blue-500 hover:underline disabled:text-gray-400"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex md:flex-row md:h-screen">
          <div
            className={`w-1/2 bg-[#A4B494] p-8 rounded-r-[5rem] flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out ${
              mounted ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            }`}
          >
            <h1
              className={`text-4xl font-extrabold mb-12 -mt-4 text-black transition-all duration-700 delay-300 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              Welcome Back!
            </h1>
            <div
              className={`transition-all duration-700 delay-500 ease-out transform ${
                mounted ? "scale-100 opacity-100 rotate-0" : "scale-75 opacity-0 rotate-12"
              }`}
            >
              <div className="w-72 h-72 rounded-xl overflow-hidden bg-white shadow-lg hover:scale-110 transition-transform duration-300">
                <img src="logo.png" alt="Kokan Global Foundation" className="w-full h-full object-cover" />
              </div>
            </div>
            <p
              className={`mt-10 text-xl font-bold text-black leading-tight transition-all duration-700 delay-700 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              "Manage Your Hostel Smarter – Everything You Need in
              <br />
              One Platform."
            </p>
          </div>

          <div
            className={`w-1/2 bg-white p-12 flex flex-col justify-center items-center transition-all duration-1000 ease-out ${
              mounted ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
          >
            <h2
              className={`text-4xl font-bold mb-10 text-black text-center transition-all duration-700 delay-200 ease-out ${
                mounted ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
              }`}
            >
              Warden Login
            </h2>

            {step === 1 ? (
              // Step 1: Enter Warden ID (Desktop)
              <form onSubmit={handleSendOTP} className="w-full max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-lg font-semibold text-black block">Warden ID</label>
                  <input
                    type="text"
                    value={wardenId}
                    onChange={(e) => setWardenId(e.target.value)}
                    placeholder="Enter Your Warden ID"
                    required
                    className="w-full px-4 py-3 rounded-[1rem] border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent placeholder:text-gray-400 text-black"
                  />
                </div>

                <div className="w-full flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-[#BEC5AD] hover:bg-[#a9b29d] disabled:bg-gray-400 text-black font-bold py-3 rounded-xl shadow-md transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Enter OTP (Desktop)
              <form onSubmit={handleVerifyOTP} className="w-full max-w-md space-y-6">
                <div className="text-center mb-3">
                  <p className="text-sm text-gray-600">
                    OTP sent to: <span className="font-semibold">{maskedNumber}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-lg font-semibold text-black block">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit OTP"
                    required
                    maxLength={6}
                    className="w-full px-4 py-3 rounded-[1rem] border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent placeholder:text-gray-400 text-black text-center tracking-widest text-xl"
                  />
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-2/3 bg-[#BEC5AD] hover:bg-[#a9b29d] disabled:bg-gray-400 text-black font-bold py-3 rounded-xl shadow-md transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify & Login"
                    )}
                  </button>

                  <div className="flex items-center space-x-4 text-sm">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-gray-600 hover:underline"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || loading}
                      className="text-blue-500 hover:underline disabled:text-gray-400"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}