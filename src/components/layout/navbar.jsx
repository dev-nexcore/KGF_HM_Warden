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
    <nav className="flex w-full items-center justify-between px-8 py-4 pl-16 md:pl-8 bg-[#BEC5AD]">
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
    </nav>
  );
}