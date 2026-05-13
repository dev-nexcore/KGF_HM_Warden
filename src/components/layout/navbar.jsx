"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { User, Bell, Search, ShieldCheck } from "lucide-react";

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
    <nav className="flex w-full items-center justify-between px-6 md:px-10 py-6 bg-[#F8FAF5] border-b border-[#7A8B5E]/5 sticky top-0 z-50 backdrop-blur-md bg-white/80">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-8 bg-[#7A8B5E] rounded-full shadow-sm"></div>
        <div>
          <h1 className="text-xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">
            Welcome back{warden ? `, ${warden.firstName}` : ""}
          </h1>
          <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">Operational Oversight Active</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Quick Search - Desktop */}
        <div className="hidden lg:flex relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E] transition-colors" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-white border border-[#7A8B5E]/10 rounded-2xl pl-12 pr-6 py-3 text-xs font-bold text-[#1A1F16] focus:outline-none focus:border-[#7A8B5E] transition-all w-64 placeholder:text-gray-300"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-[#F8FAF5] hover:border-[#7A8B5E] transition-all group shadow-sm">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Profile Avatar */}
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-[#7A8B5E]/10 rounded-3xl hover:border-[#7A8B5E] transition-all shadow-sm group"
          aria-label="View Profile"
        >
          <div className="w-10 h-10 bg-[#F8FAF5] rounded-2xl flex items-center justify-center overflow-hidden border border-[#7A8B5E]/5 shadow-inner">
            {!loading && warden?.profilePhoto ? (
              <img
                src={`${process.env.NEXT_PUBLIC_PROD_API_URL}/uploads/wardens/${warden.profilePhoto}`}
                alt="Profile"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <User className="w-5 h-5 text-[#7A8B5E]" />
            )}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[10px] font-black text-[#1A1F16] uppercase tracking-wider">{warden ? `${warden.firstName} ${warden.lastName}` : "Warden"}</p>
            <p className="text-[8px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] opacity-60">Senior Admin</p>
          </div>
        </button>
      </div>
    </nav>
  );
}