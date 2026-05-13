"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { 
  BedDouble, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Calendar, 
  ShieldCheck, 
  MoreVertical,
  Eye,
  Building,
  UserCheck,
  DoorOpen
} from "lucide-react";

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
    fetchAllBeds();
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
    setFilters({ floor: "", roomNo: "", status: "" });
    toast.success("Filters reset.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Bed Registry</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Hostel Allotment & Capacity Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={clearFilters} className="px-8 py-4 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1F16] hover:bg-[#F8FAF5] transition-all shadow-sm flex items-center gap-2">
            <Filter size={16} /> Reset View
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumStatCard label="Occupied Units" value={bedStats.inUse} icon={<UserCheck />} color="bg-blue-50 text-blue-600" />
        <PremiumStatCard label="Vacant Capacity" value={bedStats.available} icon={<DoorOpen />} color="bg-emerald-50 text-emerald-600" />
        <PremiumStatCard label="Compromised Units" value={bedStats.damaged} icon={<AlertCircle />} color="bg-red-50 text-red-600" />
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">
        <div className="p-8 md:p-10 border-b border-[#7A8B5E]/5 grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#F8FAF5]/30">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Floor Level</label>
            <select 
              value={filters.floor}
              onChange={(e) => setFilters({...filters, floor: e.target.value})}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none appearance-none"
            >
              <option value="">All Floors</option>
              {floorOptions.map(f => <option key={f} value={f}>Floor {f}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Room Number</label>
            <select 
              value={filters.roomNo}
              onChange={(e) => setFilters({...filters, roomNo: e.target.value})}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none appearance-none"
            >
              <option value="">All Rooms</option>
              {roomOptions.map(r => <option key={r} value={r}>Room {r}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Allotment Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none appearance-none"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Damaged">Damaged</option>
              <option value="In maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Visual Bed Grid */}
        <div className="p-8 md:p-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {bedList.length === 0 ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#7A8B5E]/10">
                <BedDouble size={40} />
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">No Units Match Criteria</p>
            </div>
          ) : (
            bedList.map((bed, i) => <BedCard key={i} bed={bed} />)
          )}
        </div>
      </div>
    </div>
  );
}

function PremiumStatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 flex flex-col items-center gap-6 group hover:-translate-y-2 transition-all">
      <div className={`w-16 h-16 rounded-[24px] ${color} flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6`}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-4xl font-black text-[#1A1F16] tracking-tight">{value}</p>
      </div>
    </div>
  );
}

const BedCard = ({ bed }) => {
  const statusStyles = {
    "Available": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "In Use": "bg-blue-50 text-blue-600 border-blue-100",
    "Damaged": "bg-red-50 text-red-600 border-red-100",
    "In maintenance": "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white border border-[#7A8B5E]/10 rounded-[32px] p-6 space-y-4 hover:border-[#7A8B5E] hover:shadow-xl transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 bg-[#F8FAF5] rounded-xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/5 group-hover:bg-[#7A8B5E] group-hover:text-white transition-all">
          <BedDouble size={20} />
        </div>
        <div className={`w-3 h-3 rounded-full ${bed.status === "Available" ? 'bg-emerald-400' : bed.status === "In Use" ? 'bg-blue-400' : 'bg-red-400'} animate-pulse`}></div>
      </div>
      
      <div>
        <p className="text-xs font-black text-[#1A1F16] uppercase tracking-wider">Unit {bed.barcodeId}</p>
        <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60">F{bed.floor} • R{bed.roomNo}</p>
      </div>

      <div className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusStyles[bed.status] || 'bg-gray-50 text-gray-400'}`}>
        {bed.status}
      </div>
      
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <BedDouble size={80} />
      </div>
    </div>
  );
};
