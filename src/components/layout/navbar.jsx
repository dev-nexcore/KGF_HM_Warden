"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; //  Corrected import

export default function Navbar() {
  const [warden, setWarden] = useState(null);

  useEffect(() => {
    const fetchWarden = async () => {
      const token = localStorage.getItem("wardenToken");
      if (!token) return;

      try {
        const decoded = jwtDecode(token); //  Decode token
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
      }
    };

    fetchWarden();
  }, []);

  return (
    <nav className="flex w-full items-center justify-between px-8 py-4 pl-16 md:pl-8 bg-[#BEC5AD]">
      <div className="flex-1 pl-3">
        <h1 className="text-2xl font-semibold text-black">
          Welcome Back
          {warden ? `, ${warden.firstName} ${warden.lastName}` : ""}
        </h1>
        <p className="italic text-black text-sm -mt-1">-have a great day</p>
      </div>
      <div className="ml-auto">
        {warden?.profilePhoto ? (
          <img
            src={`${process.env.NEXT_PUBLIC_PROD_API_URL}/uploads/wardens/${warden.profilePhoto}`} //  Show uploaded image
            alt="Warden"
            className="w-12 h-12 rounded-full border border-gray-300 object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border border-gray-300 bg-white" />
        )}
      </div>
    </nav>
  );
}