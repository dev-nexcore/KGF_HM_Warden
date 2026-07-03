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
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    floor: "",
    roomNo: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchStats();
    fetchAllBeds(); // Load floor and roomNo filters initially
  }, []);

  useEffect(() => {
    fetchBeds();
    setCurrentPage(1);
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
          {(filters.floor || filters.roomNo || filters.status) && (
          <div className="flex flex-col justify-end">
            <button
              onClick={clearFilters}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 text-sm rounded w-full"
            >
              Clear Filters
            </button>
          </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 mt-8">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <h3 className="font-bold text-lg sm:text-xl text-gray-800">Bed Status Overview</h3>
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">In Use</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">Available</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-[#bfc8ad] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {bedList.length === 0 ? (
            <p className="text-sm text-gray-700 col-span-full">No beds found for selected filters.</p>
          ) : (
            (isMobile ? bedList.slice((currentPage - 1) * 10, currentPage * 10) : bedList).map((bed, i) => <BedCard key={i} bed={bed} />)
          )}
        </div>
        
        {isMobile && bedList.length > 10 && (
          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1} 
              className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm font-medium">Page {currentPage} of {Math.ceil(bedList.length / 10)}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(bedList.length / 10), p + 1))} 
              disabled={currentPage === Math.ceil(bedList.length / 10)} 
              className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
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
  const statusConfig = {
    "Available": { color: "text-gray-500", bg: "bg-gray-200", dot: "bg-gray-400" },
    "In Use": { color: "text-green-700", bg: "bg-green-100", dot: "bg-green-600" },
    "Damaged": { color: "text-red-700", bg: "bg-red-100", dot: "bg-red-500" },
    "In maintenance": { color: "text-yellow-700", bg: "bg-yellow-100", dot: "bg-yellow-500" },
  };

  const config = statusConfig[bed.status] || statusConfig["Available"];
  const barcodeParts = (bed.barcodeId || "").split('-');
  const bedName = barcodeParts.length >= 2 ? barcodeParts.slice(0, 2).join('-') : bed.barcodeId;
  const uniqueCode = barcodeParts.length > 2 ? barcodeParts.slice(2).join('-') : "";

  return (
    <div className="rounded-2xl p-5 bg-white shadow flex flex-col w-full relative">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-bold text-[16px] text-gray-900 leading-snug">Bed {bedName}</div>
          {uniqueCode && <div className="font-bold text-[16px] text-gray-900 leading-snug">{uniqueCode}</div>}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg}`}>
          <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
          <span className={`text-[12px] font-medium ${config.color}`}>{bed.status}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 mb-4 mt-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <path d="M3 10l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
        <span className="text-[13.5px] text-gray-500">Floor {bed.floor}, Room {bed.roomNo}</span>
      </div>
      
      <hr className="border-gray-200 mb-3" />
      
      <div className="flex justify-between items-center text-[13px] text-gray-500">
        <div>
          Status: <span className={config.color}>{bed.status}</span>
        </div>
        <div className="cursor-pointer hover:text-gray-700">
          View &rarr;
        </div>
      </div>
    </div>
  );
};
