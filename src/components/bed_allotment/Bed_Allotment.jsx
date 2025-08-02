// export default function BedAllotment() {
//   return (
//     <div className="p-6">
//       {/* Header */}
//       <h2 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-2xl mb-4 flex items-center">
//         <span className="border-l-4 border-red-600 mr-2 h-6 inline-block"></span>
//         Bed Allotment
//       </h2>

//       {/* Statistics */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
//         {/* Occupied Beds */}
//         <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
//           <div>
//             <div className="text-sm font-semibold">Occupied Beds</div>
//             <div className="text-3xl font-bold text-black">70</div>
//           </div>
//           <div className="absolute top-0 right-0 rounded-full shadow w-12 h-12 flex items-center justify-center">
//             <img 
//               src="/bed-allotment/bed.png" 
//               alt="Occupied Beds" 
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </div>

//         {/* Vacant Beds */}
//         <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
//           <div>
//             <div className="text-sm font-semibold">Vacant Beds</div>
//             <div className="text-3xl font-bold text-black">3</div>
//           </div>
//           <div className="absolute top-0 right-0 rounded-full shadow w-12 h-12 flex items-center justify-center">
//             <img 
//               src="/bed-allotment/bed.png" 
//               alt="Vacant Beds" 
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </div>

//         {/* Damaged Beds */}
//         <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
//           <div>
//             <div className="text-sm font-semibold">Damaged Beds</div>
//             <div className="text-3xl font-bold text-red-600">2</div>
//           </div>
//           <div className="absolute top-0 right-0 bg-white rounded-full border-1 shadow w-12 h-12 flex items-center justify-center">
//             <img 
//               src="/bed-allotment/d-bed.png" 
//               alt="Damaged Beds" 
//               className="w-9 h-9 object-contain"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Filter Beds */}
//       <div className="bg-white rounded-3xl drop-shadow-lg p-6 mb-6">
//         {/* Filter Beds Heading */}
//         <h3 className="font-bold text-lg mb-4 flex items-center">
//           Filter Beds
//         </h3>
        
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="flex flex-col">
//             <label className="text-xs font-semibold mb-1 block">Block</label>
//             <select className="rounded bg-gray-100 px-4 py-2 outline-none w-full">
//               <option>All Blocks</option>
//               <option>Block A</option>
//               <option>Block B</option>
//               <option>Block C</option>
//             </select>
//           </div>
//           <div className="flex flex-col">
//             <label className="text-xs font-semibold mb-1 block">Floor</label>
//             <select className="rounded bg-gray-100 px-4 py-2 outline-none w-full">
//               <option>All Floors</option>
//               <option>Floor 1</option>
//               <option>Floor 2</option>
//               <option>Floor 3</option>
//             </select>
//           </div>
//           <div className="flex flex-col">
//             <label className="text-xs font-semibold mb-1 block">Room Number</label>
//             <select className="rounded bg-gray-100 px-4 py-2 outline-none w-full">
//               <option>All Rooms</option>
//               <option>Room 101</option>
//               <option>Room 102</option>
//               <option>Room 103</option>
//             </select>
//           </div>
//           <div className="flex flex-col justify-end">
//             <button className="flex items-center justify-center gap-2 bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600 w-full">
//               <span>Apply Filters</span>
//               <img src="/images/filter-icon.png" alt="Filter" className="w-3 h-3" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Bed Status Overview */}
//       <div className="bg-white rounded-xl drop-shadow-lg p-6">
//         <h3 className="mb-4 font-semibold">Bed Status Overview</h3>
//         <div className="rounded-xl bg-[#bfc8ad] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
//           {/* Bed cards with dot moved to top-right, text stays at bottom */}
//           <div className="rounded-3xl p-4 bg-white border-2 border-green-500 shadow flex flex-col min-w-[210px] relative">
//             <span className="absolute top-0 right-0 w-9 h-9 border-2 rounded-full bg-green-500 inline-block"></span>
//             <div className="font-semibold text-[16px] mb-1">Bed A101-1</div>
//             <div className="text-xs mb-2">Block A, Floor 1, Room 101</div>
//             <div className="mt-auto">
//               <span className="text-xs">
//                 Status: <span className="text-green-600">Occupied</span>
//               </span>
//             </div>
//           </div>

//           <div className="rounded-3xl p-4 bg-white border border-gray-300 shadow flex flex-col min-w-[210px] relative">
//             <span className="absolute top-0 border-2 right-0 w-9 h-9 rounded-full bg-gray-400 inline-block"></span>
//             <div className="font-semibold text-[16px] mb-1">Bed A101-2</div>
//             <div className="text-xs mb-2">Block A, Floor 1, Room 101</div>
//             <div className="mt-auto">
//               <span className="text-xs">
//                 Status: <span className="text-gray-800">Vacant</span>
//               </span>
//             </div>
//           </div>

//           <div className="rounded-3xl p-4 bg-white border border-red-300 shadow flex flex-col min-w-[210px] relative">
//             <span className="absolute top-0 border-2 right-0 w-9 h-9 rounded-full bg-red-500 inline-block"></span>
//             <div className="font-semibold text-[16px] mb-1">Bed B203-1</div>
//             <div className="text-xs mb-2">Block B, Floor 2, Room 203</div>
//             <div className="mt-auto">
//               <span className="text-xs">
//                 Status: <span className="text-red-600">Damaged</span>
//               </span>
//             </div>
//           </div>

//           <div className="rounded-3xl p-4 bg-white border border-green-300 shadow flex flex-col min-w-[210px] relative">
//             <span className="absolute top-0 right-0 border-2 w-9 h-9 rounded-full bg-green-500 inline-block"></span>
//             <div className="font-semibold text-[16px] mb-1">Bed C305-1</div>
//             <div className="text-xs mb-2">Block C, Floor 3, Room 305</div>
//             <div className="mt-auto">
//               <span className="text-xs">
//                 Status: <span className="text-green-600">Occupied</span>
//               </span>
//             </div>
//           </div>

//           <div className="rounded-3xl p-4 bg-white border border-gray-300 shadow flex flex-col min-w-[210px] relative">
//             <span className="absolute top-0 right-0 border-2 w-9 h-9 rounded-full bg-gray-400 inline-block"></span>
//             <div className="font-semibold text-[16px] mb-1">Bed C205-2</div>
//             <div className="text-xs mb-2">Block C, Floor 2, Room 205</div>
//             <div className="mt-auto">
//               <span className="text-xs">
//                 Status: <span className="text-gray-800">Vacant</span>
//               </span>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }








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
      const res = await axios.get("http://localhost:5000/api/wardenauth/bed-stats");
      setBedStats(res.data);
    } catch (err) {
      console.error("Error fetching bed stats:", err);
    }
  };

  const fetchAllBeds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wardenauth/bed-status");
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

      const res = await axios.get("http://localhost:5000/api/wardenauth/bed-status", { params });
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
        <BedStatCard title="Occupied Beds" count={bedStats.inUse} icon="/bed-allotment/bed.png" />
        <BedStatCard title="Vacant Beds" count={bedStats.available} icon="/bed-allotment/bed.png" />
        <BedStatCard title="Damaged Beds" count={bedStats.damaged} icon="/bed-allotment/d-bed.png" red />
      </div>

      <div className="bg-white rounded-3xl drop-shadow-lg p-6 mb-6">
        <h3 className="font-bold text-lg mb-4 flex items-center">Filter Beds</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputFilter
            label="Floor"
            value={filters.floor}
            onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
            options={floorOptions}
          />
          <InputFilter
            label="Room Number"
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
      <option value="">All {label}s</option>
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
