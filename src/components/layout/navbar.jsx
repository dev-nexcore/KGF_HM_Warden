// KGF_HM_Warden\src\components\layout\navbar.jsx

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function Navbar() {
  const [warden, setWarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWarden = async () => {
      const token = localStorage.getItem("wardenToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const wardenId = decoded.id;

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/profile/${wardenId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWarden(res.data);
      } catch (err) {
        console.error("Error fetching warden profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarden();
  }, []);

  const handleProfileClick = () => {
    router.push('/warden-profile');
  };

  return (
<<<<<<< HEAD
    <nav className="flex w-full items-center justify-between px-6 md:px-10 py-5 bg-white border-b border-[#7A8B5E]/10 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-1 h-8 bg-[#7A8B5E] rounded-full"></div>
        <div>
          <h1 className="text-xl font-bold text-[#1A1F16] font-outfit leading-none">
            Welcome back{warden ? `, ${warden.firstName}` : ""}
          </h1>
          <p className="text-[10px] text-[#7A8B5E] font-medium uppercase tracking-wider mt-1">Operational Oversight Active</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        {/* Quick Search - Desktop */}
        <div className="hidden lg:flex relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/30" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-xl pl-11 pr-4 py-2.5 text-xs font-medium text-[#1A1F16] focus:outline-none focus:border-[#7A8B5E] transition-all w-60"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 bg-white border border-[#7A8B5E]/10 rounded-xl text-[#1A1F16] hover:bg-[#F8FAF5] transition-all shadow-sm">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Profile Avatar */}
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-[#7A8B5E]/10 rounded-2xl hover:border-[#7A8B5E] transition-all shadow-sm group"
        >
          <div className="w-9 h-9 bg-[#F8FAF5] rounded-xl flex items-center justify-center overflow-hidden border border-[#7A8B5E]/5 shadow-inner">
            {!loading && warden?.profilePhoto ? (
              <img
                src={`${process.env.NEXT_PUBLIC_PROD_API_URL}/uploads/wardens/${warden.profilePhoto}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-[#7A8B5E]" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[10px] font-bold text-[#1A1F16] uppercase tracking-wide">{warden ? `${warden.firstName} ${warden.lastName}` : "Warden"}</p>
            <p className="text-[8px] font-bold text-[#7A8B5E] uppercase tracking-wider opacity-60">Senior Admin</p>
          </div>
        </button>
      </div>
=======
    // <nav className="flex w-full items-center justify-between px-8 py-4 pl-16 md:pl-8 bg-[#BEC5AD]">
    <nav className="flex w-full items-center justify-between px-4 md:px-8 py-4 bg-[#BEC5AD]">
      <div className="flex-1 pl-3">
        <h1 className="text-2xl font-semibold text-black">
          Welcome Back
          {warden ? `, ${warden.firstName} ${warden.lastName}` : ""}
        </h1>
        <p className="italic text-black text-sm -mt-1">-have a great day</p>
      </div>
      
      {/* Profile Image/Icon - Clickable */}
      <button
        onClick={handleProfileClick}
        className="ml-auto w-12 h-12 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 overflow-hidden group cursor-pointer"
        aria-label="View Profile"
      >
        {!loading && warden?.profilePhoto ? (
          <img
            src={`${process.env.NEXT_PUBLIC_PROD_API_URL}/uploads/wardens/${warden.profilePhoto}`}
            alt="Warden Profile"
            className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-200"
          />
        ) : (
          <User className="w-7 h-7 text-gray-600 group-hover:text-[#A4B494] transition-colors duration-200" />
        )}
      </button>
>>>>>>> parent of b475873 (feat: initialize warden dashboard and management modules with student OCR registration support)
    </nav>
  );
}