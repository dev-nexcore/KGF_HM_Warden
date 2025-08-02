// // components/InspectionManagement.jsx
// "use client";

// export default function InspectionManagement() {
//   const inspections = [
//     { date: '05-07-2025', block: 'A', room: '101/B1', inspector: 'Warden Chinu', status: 'Completed' },
//     { date: '05-07-2025', block: 'B', room: '203/B2', inspector: 'Warden Chinu', status: 'Pending' },
//     { date: '05-07-2025', block: 'C', room: '305/B1', inspector: 'Warden Chinu', status: 'Completed' },
//   ];

//   const getStatusStyle = (status) => (status === 'Completed' ? 'text-green-600' : 'text-orange-500');

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center mb-4">
//         <div className="w-1 h-7 bg-red-500 mr-3"></div>
//         <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold">Inspection Management</h2>
//       </div>

//       {/* Cards */}
//       {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black ">
//         <Card label="Total Inspection" value="75" />
//         <Card label="Pending Inspection" value="5" color="text-orange-500" />
//         <Card label="Completed Inspection" value="70" color="text-green-600" />
//       </div> */}

//       {/* Total Inspections */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
//         <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
//           <div>
//             <div className="text-sm font-semibold">Total Inspections</div>
//             <div className="text-3xl font-bold text-black">75</div>
//           </div>
//         </div>

//         {/* Pending Inspection */}
//         <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
//           <div>
//             <div className="text-sm font-semibold">Pending Inspection</div>
//             <div className="text-3xl font-bold text-orange-500">5</div>
//           </div>
//         </div>

//         {/* Complete inspection */}
//         <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
//           <div>
//             <div className="text-sm font-semibold">Completed Inspection</div>
//             <div className="text-3xl font-bold text-green-600">70</div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
// <div className="bg-white p-4 rounded-xl drop-shadow-lg space-y-4">
//   <h3 className="text-md font-semibold mb-2 text-black">Filter Inspections</h3>
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-black">
    
//     {/* Block */}
//     <div>
//       <label className="block text-sm font-semibold text-gray-800 mb-1">Block</label>
//       <select className="bg-gray-100 rounded px-3 py-2 w-full text-sm text-black">
//         <option>All Blocks</option>
//         <option>Block A</option>
//         <option>Block B</option>
//         <option>Block C</option>
//       </select>
//     </div>

//     {/* Status */}
//     <div>
//       <label className="block text-sm font-semibold text-gray-800 mb-1">Status</label>
//       <select className="bg-gray-100 rounded px-3 py-2 w-full text-sm text-black">
//         <option>All Status</option>
//         <option>Completed</option>
//         <option>Pending</option>
//       </select>
//     </div>

//    {/* Date with icon */}
// <div className="relative">
//   <label className="block text-sm font-semibold text-gray-800 mb-1">Date</label>
//   <div className="flex items-center bg-gray-100 rounded px-2 relative">
//     {/* Visible selected date display */}
//     <span
//       id="selected-date"
//       className="px-2 py-2 text-sm text-black w-full"
//     >
//       Select Date
//     </span>
//     {/* Hidden but functional date input */}
//     <input
//       type="date"
//       id="custom-date"
//       className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
//       onChange={(e) => {
//         document.getElementById("selected-date").innerText =
//           e.target.value || "Select Date";
//       }}
//     />
//     {/* Custom calendar icon */}
//     <img
//       src="/images/calendar-icon.png"
//       alt="Calendar"
//       className="w-6 h-6 ml-2 opacity-70 cursor-pointer"
//       onClick={() =>
//         document.getElementById("custom-date").showPicker?.() ||
//         document.getElementById("custom-date").click()
//       }
//     />
//   </div>
// </div>



// {/* Time with icon */}
// <div className="relative">
//   <label className="block text-sm font-semibold text-gray-800 mb-1">Time</label>
//   <div className="flex items-center bg-gray-100 rounded px-2 relative">
//     {/* Display selected time */}
//     <span
//       id="selected-time"
//       className="px-2 py-2 text-sm text-black w-full"
//     >
//       Select Time
//     </span>
//     {/* Hidden functional time input */}
//     <input
//       type="time"
//       id="custom-time"
//       className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
//       onChange={(e) => {
//         const time = e.target.value;
//         document.getElementById("selected-time").innerText = time || "Select Time";
//       }}
//     />
//     {/* Custom icon */}
//     <img
//       src="/images/clock-icon.png"
//       alt="Clock"
//       className="w-6 h-6 ml-2 opacity-70 cursor-pointer"
//       onClick={() =>
//         document.getElementById("custom-time").showPicker?.() ||
//         document.getElementById("custom-time").click()
//       }
//     />
//   </div>
// </div>


//     {/* Filter button with icon */}
//     <div>
//       <label className="block text-sm font-semibold text-gray-800 mb-1 invisible">.</label>
//       <button className="flex items-center justify-center gap-2 bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600 w-full lg:w-auto">
//         <span>Apply Filters</span>
//         <img src="/images/filter-icon.png" alt="Filter" className="w-3 h-3" />
//       </button>
//     </div>
//   </div>
// </div>

//       {/* Table for Desktop */}
//       <div className="bg-white p-4 rounded-xl drop-shadow-lg text-black hidden lg:block">
//         <h3 className="text-md font-semibold mb-4 text-black">Recent Inspections</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm min-w-[600px] text-center">
//             <thead className="bg-gray-100 text-center">
//               <tr>
//                 <th className="p-2">Date</th>
//                 <th className="p-2">Block</th>
//                 <th className="p-2">Room/Bed</th>
//                 <th className="p-2">Inspector</th>
//                 <th className="p-2">Status</th>
//                 <th className="p-2">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {inspections.map((item, index) => (
//                 <tr key={index} className="hover:bg-gray-50 text-black">
//                   <td className="p-2">{item.date}</td>
//                   <td className="p-2">{item.block}</td>
//                   <td className="p-2">{item.room}</td>
//                   <td className="p-2">{item.inspector}</td>
//                   <td className={`p-2 font-medium ${getStatusStyle(item.status)}`}>{item.status}</td>
//                   <td className="p-2 space-x-3 text-black">
//                     <a href="/edit-student" className="inline-block p-2  rounded ">
//                       <img src="/images/edit-icon.png" alt="Edit" className="w-5 h-5" />
//                     </a>
//                     <a href="/delete-student" className="inline-block p-2">
//                       <img src="/images/delete-icon.png" alt="Delete" className="w-5 h-5" />
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Card View for Mobile */}
//       <div className="block lg:hidden space-y-4 text-black">
//         {inspections.map((item, index) => (
//           <div key={index} className="rounded-lg p-3 shadow-sm bg-gray-50">
//             <p><strong>Date:</strong> {item.date}</p>
//             <p><strong>Block:</strong> {item.block}</p>
//             <p><strong>Room:</strong> {item.room}</p>
//             <p><strong>Inspector:</strong> {item.inspector}</p>
//             <p className={`font-semibold ${getStatusStyle(item.status)}`}><strong>Status:</strong> {item.status}</p>
//             <div className="flex space-x-3 mt-3">
//               <a href={`/edit-inspection/${index}`}>
//                 <img 
//                   src="/images/edit-icon.png" 
//                   alt="Edit" 
//                   className="w-5 h-5 p-1"
//                 />
//               </a>
//               <a href={`/delete-icon/${index}`}>
//                 <img 
//                   src="/images/delete-icon.png" 
//                   alt="Delete" 
//                   className="w-5 h-5 p-1"
//                 />
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function Card({ label, value, color = 'text-gray-800' }) {
//   return (
//     <div className="bg-[#dce0d4] w-64 h-32 mx-auto p-4 rounded-3xl shadow transition duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col justify-center text-center">
//       <p className="text-base font-medium">{label}</p>
//       <p className={`text-3xl font-bold ${color}`}>{value}</p>
//     </div>
//   );
// }






"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/wardenauth";

export default function InspectionManagement() {
  const [inspections, setInspections] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [filters, setFilters] = useState({ date: "", time: "", status: "", target: "" });
  const [roomOptions, setRoomOptions] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecent = async () => {
    try {
      const res = await axios.get(`${API_BASE}/recent-inspections`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });
      if (res.data.success) {
        setInspections(res.data.inspections);
        const uniqueTargets = [...new Set(res.data.inspections.map((item) => item.target))];
        setRoomOptions(uniqueTargets);
      }
    } catch (err) {
      console.error("Error fetching recent inspections", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/inspection-stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });
      if (res.data.success) setStats(res.data.stats);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const fetchFiltered = async () => {
    try {
      const res = await axios.get(`${API_BASE}/filtered-inspections`, {
        params: filters,
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });
      if (res.data.success) setInspections(res.data.inspections);
    } catch (err) {
      console.error("Error fetching filtered inspections", err);
    }
  };

  const fetchInspectionById = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/recent-inspections/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });
      if (res.data.success) {
        setSelectedInspection(res.data.inspection);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching inspection by ID", err);
    }
  };

  const markComplete = async (id) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/recent-inspections/complete/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
        }
      );
      if (res.data.success) {
        fetchRecent();
        fetchStats();
      }
    } catch (err) {
      console.error("Error marking inspection complete", err);
    }
  };

  const deleteInspection = async (id) => {
    if (!confirm("Are you sure you want to delete this inspection?")) return;
    try {
      const res = await axios.delete(`${API_BASE}/recent-inspections/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });
      if (res.data.success) {
        fetchRecent();
        fetchStats();
      }
    } catch (err) {
      console.error("Error deleting inspection", err);
    }
  };

  const handleView = (item) => {
    fetchInspectionById(item._id);
  };

  const clearFilters = () => {
    setFilters({ date: "", time: "", status: "", target: "" });
    fetchRecent();
  };

  useEffect(() => {
    if (filters.date || filters.status || filters.target || filters.time) {
      fetchFiltered();
    } else {
      fetchRecent();
    }
  }, [filters]);

  useEffect(() => {
    fetchRecent();
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-1 h-7 bg-red-500 mr-3"></div>
        <h2 className="text-lg md:text-xl font-bold">Inspection Management</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
        <StatCard label="Total Inspections" value={stats.total} />
        <StatCard label="Pending Inspections" value={stats.pending} color="text-orange-500" />
        <StatCard label="Completed Inspections" value={stats.completed} color="text-green-600" />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl drop-shadow-lg space-y-4 text-black">
        <h3 className="text-md font-semibold mb-2">Filter Inspections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <FilterInput label="Date" type="date" value={filters.date} onChange={(val) => setFilters((f) => ({ ...f, date: val }))} />
          <FilterInput label="Time (e.g. 09 or 09:30)" type="text" value={filters.time} onChange={(val) => setFilters((f) => ({ ...f, time: val }))} />
          <FilterSelect label="Room" options={roomOptions} value={filters.target} onChange={(val) => setFilters((f) => ({ ...f, target: val }))} />
          <FilterSelect label="Status" options={["pending", "completed"]} value={filters.status} onChange={(val) => setFilters((f) => ({ ...f, status: val.toLowerCase() }))} />
          <div className="flex items-end">
            <button onClick={clearFilters} className="bg-gray-200 text-black rounded px-4 py-2 text-sm w-full hover:bg-gray-300">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-xl drop-shadow-lg text-black hidden lg:block">
        <h3 className="text-md font-semibold mb-4">Recent Inspections</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px] text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Room No</th>
                <th className="p-2">Title</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inspections.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-gray-500 italic">No inspections found.</td>
                </tr>
              ) : (
                inspections.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.time}</td>
                    <td className="p-2">{item.target}</td>
                    <td className="p-2">{item.title}</td>
                    <td className={`p-2 font-medium ${item.status === "Completed" ? "text-green-600" : "text-orange-500"}`}>
                      {item.status}
                    </td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleView(item)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        View
                      </button>
                      {item.status === "Pending" && (
                        <button onClick={() => markComplete(item._id)} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          Complete
                        </button>
                      )}
                      <button onClick={() => deleteInspection(item._id)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Full Details */}
      {isModalOpen && selectedInspection && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Inspection Details</h2>
            <p><strong>Title:</strong> {selectedInspection.title}</p>
            <p><strong>Room:</strong> {selectedInspection.target}</p>
            <p><strong>Area:</strong> {selectedInspection.area}</p>
            <p><strong>Status:</strong> {selectedInspection.status}</p>
            <p><strong>Date:</strong> {new Date(selectedInspection.datetime).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {new Date(selectedInspection.datetime).toLocaleTimeString()}</p>
            <p><strong>Instructions:</strong> {selectedInspection.instructions}</p>
            <p><strong>Created At:</strong> {new Date(selectedInspection.createdAt).toLocaleString()}</p>
            <div className="mt-4 text-right">
              <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color = "text-gray-800" }) {
  return (
    <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 shadow">
      <div className="text-sm font-semibold">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function FilterInput({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-100 rounded px-3 py-2 w-full text-sm"
      />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-100 rounded px-3 py-2 w-full text-sm"
      >
        <option value="">All</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
