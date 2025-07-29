"use client";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

function WardenLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [wardenId, setWardenId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/wardenauth/login", {
        wardenId,
        password,
      });

      const { token, warden } = response.data;

      localStorage.setItem("wardenToken", token);
      localStorage.setItem("wardenInfo", JSON.stringify(warden));

      toast.success("Login successful!");

      setTimeout(() => {
        router.push("/warden-dashboard");
      }, 1500);
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col md:flex-row min-h-screen bg-white overflow-hidden font-['Inter']">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-[#A4B494] p-8 md:p-12 md:rounded-r-[5rem] flex flex-col items-center justify-center text-center transition-all duration-300">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-black">Welcome Back!</h1>
          <Image src="/logo.png" alt="Logo" className="w-48 h-48 object-contain rounded-md" width={300} height={300} />
          <p className="mt-6 text-lg font-semibold text-black ">
            "Manage Your Hostel Smarter – Everything You Need in <br /> One Platform."
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex flex-col justify-center items-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black text-center w-full">
            Warden Login
          </h2>

          <div className="flex flex-col items-center w-full">
            {/* User ID */}
            <label className="text-md font-semibold text-black mb-1 w-3/4 text-left">
              User ID
            </label>
            <input
              type="text"
              placeholder="Enter Your User ID"
              className="w-3/4 mb-4 px-4 py-3 rounded-[1rem] border border-gray-300 shadow-[0px_4px_20px_0px_#00000040] focus:outline-none placeholder:text-gray-500"
              value={wardenId}
              onChange={(e) => setWardenId(e.target.value)}
            />

            {/* Password */}
            <label className="text-md font-semibold text-black mb-1 w-3/4 text-left">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              className="w-3/4 mb-2 px-4 py-3 rounded-[1rem] border border-gray-300 shadow-[0px_4px_20px_0px_#00000040] focus:outline-none placeholder:text-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Forgot Password */}
            <div className="w-3/4 flex justify-end mb-6">
              <a href="/forgotpassword" className="text-sm text-blue-600 hover:underline">
                Forget Password?
              </a>
            </div>

            {/* Login Button */}
            <div className="w-3/4 flex justify-center">
              <button
                onClick={handleLogin}
                className="w-1/2 bg-[#BEC5AD] hover:bg-[#a9b29d] text-black font-bold py-3 rounded-xl shadow-md transition duration-200 cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default WardenLogin;