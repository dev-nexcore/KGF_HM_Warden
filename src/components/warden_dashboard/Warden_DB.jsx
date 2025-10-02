"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MainContent() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBeds: 0,
    inUseBeds: 0,
    availableBeds: 0,
    damagedBeds: 0,
    upcomingInspections: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/warden-dashboard`);
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <main className="flex-1 px-4 md:px-6 py-4">
      <section className="mb-8">
        {/* Section Header */}
        <div className="flex items-center mb-4">
          <div className="w-1 h-7 bg-red-500 mr-3"></div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold">Dashboard</h2>
        </div>

        {/* Stats Grid - First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Total Students */}
          <div className="bg-[#dce0d4] rounded-3xl p-4 relative shadow w-full h-24 flex flex-col">
            <img src="/warden/dashboard-icons/t-students.png" alt="Users Icon" className="absolute top-0 right-0 w-9 h-9 object-contain" />
            <span className="text-sm md:text-md font-semibold pr-10">Total Students</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold">{stats.totalStudents}</span>
          </div>

          {/* Occupied Beds */}
          <div className="bg-[#dce0d4] rounded-3xl p-4 relative shadow w-full h-24 flex flex-col">
            <img src="/warden/dashboard-icons/bed.png" alt="Occupied Bed Icon" className="absolute top-0 right-0 w-9 h-9 object-contain" />
            <span className="text-sm md:text-md font-semibold pr-10">Occupied Beds</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold text-[#e0b300]">{stats.inUseBeds}</span>
          </div>

          {/* Vacant Beds */}
          <div className="bg-[#dce0d4] rounded-3xl p-4 relative shadow w-full h-24 flex flex-col">
            <img src="/warden/dashboard-icons/bed.png" alt="Vacant Bed Icon" className="absolute top-0 right-0 w-9 h-9 object-contain" />
            <span className="text-sm md:text-md font-semibold pr-10">Vacant Beds</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold">{stats.availableBeds}</span>
          </div>

          {/* Damaged Beds */}
          <div className="bg-[#dce0d4] rounded-3xl p-4 relative shadow w-full h-24 flex flex-col">
            <img src="/warden/dashboard-icons/bed.png" alt="Damaged Bed Icon" className="absolute top-0 right-0 w-9 h-9 object-contain" />
            <span className="text-sm md:text-md font-semibold pr-10">Damaged Beds</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold text-[#c83939]">{stats.damagedBeds}</span>
          </div>
        </div>

        {/* Stats Grid - Second Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Beds */}
          <div className="bg-[#dce0d4] rounded-3xl p-4 relative shadow w-full h-24 flex flex-col">
            <img src="/warden/dashboard-icons/bed.png" alt="Total Beds Icon" className="absolute top-0 right-0 w-9 h-9 object-contain" />
            <span className="text-sm md:text-md font-semibold pr-10">Total Beds</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold">{stats.totalBeds}</span>
          </div>

          {/* Upcoming Inspections */}
          <div className="bg-[#dce0d4] rounded-3xl p-4 relative shadow w-full h-24 flex flex-col">
            <span className="text-sm md:text-md font-semibold">Upcoming Inspections</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold">{stats.upcomingInspections.length}</span>
          </div>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section>
        <div className="bg-[#d9ddce] rounded-xl drop-shadow-lg">
          <h3 className="text-base md:text-lg font-semibold mb-2 p-4">Recent Activities</h3>
          <ul className="bg-white rounded-b-xl px-4">
            {stats.upcomingInspections.map((inspection, idx) => (
              <li key={idx} className="flex justify-between items-start py-3 text-sm md:text-base">
                <span>{inspection.module || "Inspection"} scheduled</span>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {new Date(inspection.datetime).toLocaleString()}
                </span>
              </li>
            ))}
            {stats.upcomingInspections.length === 0 && (
              <li className="py-3 text-sm text-gray-500">No upcoming inspections</li>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
