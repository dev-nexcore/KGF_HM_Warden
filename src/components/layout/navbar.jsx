// KGF_HM_Warden\src\components\layout\navbar.jsx

"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Bell } from "lucide-react";

export default function Navbar() {
  const [warden, setWarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <nav className="relative z-[99] flex items-center justify-between px-3 sm:px-4 md:px-6 py-4 bg-[#BEC5AD] h-20 min-h-[80px]">
      {/* Left Menu Spacer */}
      <div className="w-12 sm:w-14"></div>
      
      {/* Center Text */}
      <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex flex-col items-center justify-center md:items-start md:justify-start min-w-0 w-full max-w-[calc(100%-180px)] sm:max-w-[calc(100%-220px)] md:max-w-none">
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black leading-tight text-center md:text-left truncate w-full">
          Welcome Back{warden ? `, ${warden.firstName} ${warden.lastName}` : ""}
        </h1>
        <p className="italic text-black text-[10px] sm:text-xs md:text-sm mt-0.5 text-center md:text-left">
          - have a great day
        </p>
      </div>
      {/* Right Side Actions */}
      <div className="relative flex items-center gap-3 sm:gap-4 flex-shrink-0 ml-auto">
        {/* Notification Bell */}
        <button
          onClick={() => setShowPopup(!showPopup)}
          className="relative"
          aria-label="View Notifications"
        >
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>

        {/* Notification Popup */}
        {showPopup && (
          <div
            ref={popupRef}
            className="absolute right-[-10px] sm:right-0 top-12 sm:top-16 w-[300px] sm:w-80 bg-white rounded-xl shadow-xl z-50 p-4"
          >
            <div className="bg-[#A4B494] text-black px-4 py-3 rounded-t-xl flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm">Notifications</p>
                <p className="text-xs">Stay updated</p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-black hover:text-gray-700"
                aria-label="Close Notifications"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col items-center py-6">
              <Image
                src="/photos/bell1.png"
                width={35}
                height={35}
                alt="bell"
                className="mb-2"
              />
              <p className="font-semibold text-sm">All caught up!</p>
              <p className="text-xs text-gray-500">No new notifications to show</p>
              <Link
                href="/notifications"
                className="mt-4 px-4 py-2 text-black bg-[#A4B494] rounded-md text-sm hover:bg-[#92A385] transition-colors"
              >
                View History
              </Link>
            </div>
          </div>
        )}

        {/* Profile Image/Icon - Clickable */}
        <button
          onClick={handleProfileClick}
          className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 overflow-hidden group cursor-pointer"
          aria-label="View Profile"
        >
          {!loading && warden?.profilePhoto ? (
            <img
              src={`${process.env.NEXT_PUBLIC_PROD_API_URL}/uploads/wardens/${warden.profilePhoto}`}
              alt="Warden Profile"
              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-200"
            />
          ) : (
            <User className="w-6 h-6 md:w-7 md:h-7 text-gray-600 group-hover:text-[#A4B494] transition-colors duration-200" />
          )}
        </button>
      </div>
    </nav>
  );
}