"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Bed, ArrowUpRight, Filter, RefreshCw, X } from "lucide-react";

// ─── Sub-components ───────────────────────────────────────────────────────────

const PremiumStatCard = ({ label, value, icon, accent = "text-[#1A1F16]" }) => (
  <div className="bg-[#BEC5AD] p-6 rounded-[32px] border border-white/20 shadow-lg shadow-black/5 flex flex-col items-center gap-4 group hover:-translate-y-1 transition-all">
    <div className={`w-14 h-14 rounded-[20px] bg-white text-[#A4B494] flex items-center justify-center shadow-md transition-transform group-hover:rotate-6 group-hover:bg-[#A4B494] group-hover:text-white`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="text-center">
      <p className="text-[10px] font-black text-[#1A1F16]/40 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className={`text-3xl font-black tracking-tight ${accent}`}>{value}</h3>
    </div>
  </div>
);

const InputFilter = ({ label, value, onChange, options = [] }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-[#1A1F16]/40 uppercase tracking-[0.2em]">{label}</label>
    <div className="relative group">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3.5 text-xs font-bold text-[#1A1F16] focus:border-white focus:bg-white outline-none transition-all shadow-sm"
      >
        <option value="">All {label}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#1A1F16]/30">
        <Filter size={14} />
      </div>
    </div>
  </div>
);

const BedCard = ({ bed }) => {
  const statusStyles = {
    "Available": "bg-emerald-500",
    "In Use": "bg-[#1A1F16]",
    "Damaged": "bg-red-500",
    "In maintenance": "bg-amber-500",
  };

  const badgeColor = statusStyles[bed.status] || "bg-gray-400";

  return (
    <div className="group bg-white rounded-[32px] p-6 border border-[#A4B494]/10 shadow-xl shadow-black/5 flex flex-col gap-4 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl">
      <div className={`absolute top-0 right-0 w-16 h-16 ${badgeColor} rounded-bl-full opacity-10 transition-opacity group-hover:opacity-20`}></div>
      
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-[18px] ${badgeColor} flex items-center justify-center text-white shadow-lg`}>
          <Bed size={22} />
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${badgeColor}`}>
          {bed.status}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-black text-[#1A1F16] tracking-tight">ID: {bed.barcodeId}</h4>
        <p className="text-[10px] text-[#A4B494] font-black uppercase tracking-widest mt-1">Floor {bed.floor} • Room {bed.roomNo}</p>
      </div>

      <div className="pt-4 border-t border-[#A4B494]/5 mt-auto flex justify-between items-center">
        <span className="text-[9px] font-black text-[#A4B494] uppercase tracking-widest">Action Required: None</span>
        <ArrowUpRight className="w-4 h-4 text-[#A4B494]/30 group-hover:text-[#A4B494] transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </div>
  );
};

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

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchAllBeds(), fetchBeds()]);
      setLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    fetchBeds();
  }, [filters]);

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
      const floors = [...new Set(beds.map(b => b.floor))].sort();
      const rooms = [...new Set(beds.map(b => b.roomNo))].sort();
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
    setFilters({ floor: "", roomNo: "", status: "" });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAF5]">
        <div className="w-10 h-10 border-4 border-[#A4B494]/20 border-t-[#A4B494] rounded-full animate-spin shadow-lg"></div>
        <p className="mt-6 text-[#A4B494] font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Scanning Inventory...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-[#F8FAF5] min-h-screen p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* ── Page Title ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-red-500 rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Inventory Grid</h1>
            <p className="text-[10px] text-[#A4B494] font-black uppercase tracking-[0.25em] mt-1">Bed Allotment System</p>
          </div>
        </div>
        <button 
          onClick={clearFilters}
          className="p-4 bg-white border border-[#A4B494]/10 rounded-2xl text-[#1A1F16] hover:bg-[#A4B494]/5 transition-all shadow-sm flex items-center gap-3 font-black text-[10px] uppercase tracking-widest"
        >
          <RefreshCw size={16} /> Reset Filters
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <PremiumStatCard label="Occupied" value={bedStats.inUse} icon={<Bed />} />
        <PremiumStatCard label="Available" value={bedStats.available} icon={<Bed />} />
        <PremiumStatCard label="Inoperable" value={bedStats.damaged} icon={<Bed />} accent="text-red-600" />
      </div>

      {/* ── Filters Section ── */}
      <div className="bg-[#A4B494] p-8 rounded-[32px] shadow-2xl relative overflow-hidden border border-white/20">
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <InputFilter label="Floors" value={filters.floor} onChange={(e) => setFilters({ ...filters, floor: e.target.value })} options={floorOptions} />
          <InputFilter label="Room No" value={filters.roomNo} onChange={(e) => setFilters({ ...filters, roomNo: e.target.value })} options={roomOptions} />
          <InputFilter label="Status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} options={["Available", "In Use", "Damaged", "In maintenance"]} />
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"></div>
      </div>

      {/* ── Bed Status Overview ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#1A1F16] uppercase tracking-[0.25em] italic">Status Overview</h3>
          <span className="text-[10px] font-black text-[#A4B494] uppercase tracking-widest bg-[#A4B494]/10 px-3 py-1 rounded-full">
            {bedList.length} Units Found
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bedList.length === 0 ? (
            <div className="col-span-full py-20 bg-white rounded-[32px] border-2 border-dashed border-[#A4B494]/20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#A4B494]/40 mb-4 shadow-inner">
                <Search size={32} />
              </div>
              <p className="text-[10px] font-black text-[#A4B494] uppercase tracking-[0.3em]">No Units Match Current Filters</p>
            </div>
          ) : (
            bedList.map((bed, i) => <BedCard key={i} bed={bed} />)
          )}
        </div>
      </div>

    </main>
  );
}
