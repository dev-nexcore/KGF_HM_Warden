"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WardenLogin() {
  const [wardenId, setWardenId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPunchModal, setShowPunchModal] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/login`, {
      wardenId,
      password,
    });

    const { token, warden } = response.data;

    localStorage.setItem("wardenToken", token);
    localStorage.setItem("wardenInfo", JSON.stringify(warden));
    setToken(token);

    // ✅ Get punch status
    const punchStatus = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/punch-status`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { punchedIn, punchedOut } = punchStatus.data;

    if (!punchedIn) {
      toast.success("Login successful! Punch in required.");
      setShowPunchModal(true); // ✅ Show modal only if not punched in
    } else if (punchedIn && !punchedOut) {
      toast.success("Login successful! Already punched in.");
      setShowPunchModal(false);
      router.push("/warden-dashboard");
    } else if (punchedIn && punchedOut) {
      toast.success("Already punched in and out. Redirecting...");
      setShowPunchModal(false); // ✅ Important
      router.push("/warden-dashboard");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed.");
  } finally {
    setLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit(e);
  };

  const handlePunchIn = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/attendance/punch-in`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Punched in successfully!");
      setTimeout(() => {
        setShowPunchModal(false);
        router.push("/warden-dashboard");
      }, 1000);
    } catch (error) {
      if (error.response?.data?.message === "Already punched in for today") {
        toast.info("Already punched in. Redirecting...");
        setTimeout(() => {
          router.push("/warden-dashboard");
        }, 1500);
      } else {
        toast.error(error.response?.data?.message || "Punch in failed.");
      }
    }
  };
  

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ✅ Punch In Modal */}
      {showPunchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-white/10">
          <div className="bg-white/30 border border-white/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl max-w-md w-full text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Mark Your Attendance</h2>
            <p className="mb-6 text-gray-800">Please punch in to continue to your dashboard.</p>
            <button
              onClick={handlePunchIn}
              className="bg-[#BEC5AD] hover:bg-[#a9b29d] text-black font-bold px-6 py-2 rounded-lg shadow"
            >
              Punch In
            </button>
          </div>
        </div>
      )}

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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-black block">User ID</label>
                <input
                  type="text"
                  value={wardenId}
                  onChange={(e) => setWardenId(e.target.value)}
                  placeholder="Enter Your User ID"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent placeholder:text-gray-400 text-black"
                  onKeyDown={handleKeyPress}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-black block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Your Password"
                    className="w-full px-3 py-2.5 pr-10 text-sm rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent placeholder:text-gray-400 text-black"
                    onKeyDown={handleKeyPress}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer hover:text-[#A4B494]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <p
                  onClick={() => router.push("/forgotpassword")}
                  className="text-xs text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  Forget Password?
                </p>
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
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
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

            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
              <div className="space-y-2">
                <label className="text-lg font-semibold text-black block">User ID</label>
                <input
                  type="text"
                  value={wardenId}
                  onChange={(e) => setWardenId(e.target.value)}
                  placeholder="Enter Your User ID"
                  className="w-full px-4 py-3 rounded-[1rem] border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent placeholder:text-gray-400 text-black"
                  onKeyDown={handleKeyPress}
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-semibold text-black block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Your Password"
                    className="w-full px-4 py-3 pr-12 rounded-[1rem] border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent placeholder:text-gray-400 text-black"
                    onKeyDown={handleKeyPress}
                  />
                  <div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer hover:text-[#A4B494]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <p
                  onClick={() => router.push("/forgotpassword")}
                  className="text-sm text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  Forget Password?
                </p>
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
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
