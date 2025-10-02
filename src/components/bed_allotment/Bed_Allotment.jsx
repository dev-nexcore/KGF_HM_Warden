"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BedAllotment() {
  const [bedStats, setBedStats] = useState({
    totalBeds: 0,
    available: 0,
    inUse: 0,
    inMaintenance: 0,
    damaged: 0,
  });

  const [bedList, setBedList] = useState([]);
  const [floorOptions, setFloorOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);

  const [filters, setFilters] = useState({
    floor: "",
    roomNo: "",
    status: "",
  });

  useEffect(() => {
    fetchStats();
    fetchAllBeds(); // Load floor and roomNo filters initially
  }, []);

  useEffect(() => {
    fetchBeds();
  }, [filters]); // Auto-fetch beds when filter changes

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/bed-stats`);
      setBedStats(res.data);
    } catch (err) {
      console.error("Error fetching bed stats:", err);
    }
  };

  const fetchAllBeds = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/bed-status`);
      const beds = res.data;

      // Extract unique floor and roomNo
      const floors = [...new Set(beds.map(b => b.floor))];
      const rooms = [...new Set(beds.map(b => b.roomNo))];

      setFloorOptions(floors);
      setRoomOptions(rooms);
    } catch (err) {
      console.error("Error fetching all beds for filter:", err);
    }
  };

  const fetchBeds = async () => {
    try {
      const params = {};
      if (filters.floor) params.floor = filters.floor;
      if (filters.roomNo) params.roomNo = filters.roomNo;
      if (filters.status) params.status = filters.status;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/bed-status`, { params });
      setBedList(res.data);
    } catch (err) {
      console.error("Error fetching beds:", err);
    }
  };

  const clearFilters = () => {
    setFilters({
      floor: "",
      roomNo: "",
      status: "",
    });
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-4 flex items-center">
        <span className="border-l-4 border-red-600 mr-2 h-6 inline-block"></span>
        Bed Allotment
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <BedStatCard title="Occupied Beds" count={bedStats.inUse} icon="/warden/bed-allotment/bed.png" />
        <BedStatCard title="Vacant Beds" count={bedStats.available} icon="/warden/bed-allotment/bed.png" />
        <BedStatCard title="Damaged Beds" count={bedStats.damaged} icon="/warden/bed-allotment/d-bed.png" red />
      </div>

      <div className="bg-white rounded-3xl drop-shadow-lg p-6 mb-6">
        <h3 className="font-bold text-lg mb-4 flex items-center">Filter Beds</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputFilter
            label="Floors"
            value={filters.floor}
            onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
            options={floorOptions}
          />
          <InputFilter
            label="Room Numbers"
            value={filters.roomNo}
            onChange={(e) => setFilters({ ...filters, roomNo: e.target.value })}
            options={roomOptions}
          />
          <InputFilter
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={["Available", "In Use", "Damaged", "In maintenance"]}
          />
          <div className="flex flex-col justify-end">
            <button
              onClick={clearFilters}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 text-sm rounded w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl drop-shadow-lg p-6">
        <h3 className="mb-4 font-semibold">Bed Status Overview</h3>
        <div className="rounded-xl bg-[#bfc8ad] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bedList.length === 0 ? (
            <p className="text-sm text-gray-700 col-span-full">No beds found for selected filters.</p>
          ) : (
            bedList.map((bed, i) => <BedCard key={i} bed={bed} />)
          )}
        </div>
      </div>
    </div>
  );
}

const BedStatCard = ({ title, count, icon, red }) => (
  <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <div className={`text-3xl font-bold ${red ? "text-red-600" : "text-black"}`}>{count}</div>
    </div>
    <div className="absolute top-0 right-0 rounded-full shadow w-12 h-12 flex items-center justify-center">
      <img src={icon} alt={title} className="w-full h-full object-contain" />
    </div>
  </div>
);

const InputFilter = ({ label, value, onChange, options = [] }) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold mb-1 block">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="rounded bg-gray-100 px-4 py-2 outline-none w-full"
    >
      <option value="">All {label}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const BedCard = ({ bed }) => {
  const statusStyles = {
    "Available": "gray-400",
    "In Use": "green-500",
    "Damaged": "red-500",
    "In maintenance": "yellow-500",
  };

  const badgeColor = statusStyles[bed.status] || "gray-300";

  return (
    <div className="rounded-3xl p-4 bg-white border border-gray-300 shadow flex flex-col min-w-[210px] relative">
      <span className={`absolute top-0 right-0 border-2 w-9 h-9 rounded-full bg-${badgeColor} inline-block`}></span>
      <div className="font-semibold text-[16px] mb-1">Bed {bed.barcodeId}</div>
      <div className="text-xs mb-2">Floor {bed.floor}, Room {bed.roomNo}</div>
      <div className="mt-auto">
        <span className="text-xs">
          Status: <span className={`text-${badgeColor}`}>{bed.status}</span>
        </span>
      </div>
    </div>
  );
};
