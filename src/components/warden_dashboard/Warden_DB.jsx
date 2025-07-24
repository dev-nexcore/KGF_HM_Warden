import React from "react";
import {
  FiUsers,
  FiCheckSquare,
  FiXCircle,
  FiLayers,
  FiAlertCircle
} from "react-icons/fi";

export default function MainContent() {
  return (
    <main className="flex-1 bg-[#f5f8f1] px-4 md:px-6 py-4">
      <section className="mb-8">
        {/* Section Header */}
        <div className="flex items-center mb-4">
          <div className="w-1 h-7 bg-red-500 mr-3"></div>
          <h2 className="text-lg md:text-xl font-bold">Dashboard</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          <StatCard label="Total Students" value="75" icon={<FiUsers />} />
          <StatCard label="Occupied Beds" value="70" valueClass="text-[#e0b300]" icon={<FiCheckSquare />} />
          <StatCard label="Vacant Beds" value="3" icon={<FiLayers />} />
          <StatCard label="Damaged Beds" value="2" valueClass="text-[#c83939]" icon={<FiXCircle />} />
          <StatCard label="Total Beds" value="75" icon={<FiLayers />} />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Upcoming Inspections" value="2" icon={<FiAlertCircle />} />
        </div>
      </section>

      {/* Recent Activities Section */}
      <section>
        <div className="bg-[#d9ddce] rounded-xl shadow">
          <h3 className="text-base md:text-lg font-semibold mb-2 p-4">Recent Activities</h3>
          <ul className="divide-y divide-gray-300 bg-white rounded-b-xl px-4">
            <Activity desc="Student Ayesha Ali Khan checked in to Bed 101" time="10:30 AM" />
            <Activity desc="Student Mohammed Shariq Shaikh checked out from Bed 205" time="09:30 AM" />
            <Activity desc="Student Nida Fatima Konkan checked in to Bed 310" time="08:45 AM" />
          </ul>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, valueClass = "", icon = null }) {
  return (
    <div className="bg-[#bfc8ad] rounded-lg p-4 relative shadow w-full h-full">
      {icon && (
        <div className="absolute top-3 right-3 text-2xl text-[#1a312a]">
          {icon}
        </div>
      )}
      <div className="flex flex-col items-center text-center">
        <span className="text-sm md:text-md font-medium">{label}</span>
        <span className={`text-xl md:text-2xl mt-2 font-semibold ${valueClass}`}>{value}</span>
      </div>
    </div>
  );
}

function Activity({ desc, time }) {
  return (
    <li className="flex justify-between items-center py-3 text-sm md:text-base">
      <span>{desc}</span>
      <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
    </li>
  );
}
