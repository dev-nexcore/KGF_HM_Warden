"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth`;

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
        toast.success("Inspection marked as completed", { autoClose: 3000 });
        fetchRecent();
        fetchStats();
      }
    } catch (err) {
      toast.error("Failed to mark as completed", { autoClose: 3000 });
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
        toast.success("Inspection deleted", { autoClose: 3000 });
        fetchRecent();
        fetchStats();
      }
    } catch (err) {
      toast.error("Failed to delete inspection", { autoClose: 3000 });
      console.error("Error deleting inspection", err);
    }
  };

  const handleView = (item) => {
    fetchInspectionById(item._id);
  };

  const clearFilters = () => {
    setFilters({ date: "", time: "", status: "", target: "" });
    toast.info("Filters cleared", { autoClose: 2000 });
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
      <ToastContainer position="top-right" autoClose={3000} />

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
      {/* <div className="bg-white p-4 rounded-xl drop-shadow-lg space-y-4 text-black">
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
      </div> */}

      {/* ── Filter Section ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Filter Inspections</h3>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FilterInput
            label="Date"
            type="date"
            value={filters.date}
            onChange={(val) => setFilters((f) => ({ ...f, date: val }))}
          />
          <FilterSelect
            label="Room"
            options={roomOptions}
            value={filters.target}
            onChange={(val) => setFilters((f) => ({ ...f, target: val }))}
          />
          <FilterSelect
            label="Status"
            options={["pending", "completed"]}
            value={filters.status}
            onChange={(val) => setFilters((f) => ({ ...f, status: val.toLowerCase() }))}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-transparent uppercase tracking-wider select-none">Action</label>
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 w-full bg-red-50  text-red-500  border border-red-200 hover:border-red-500 text-sm font-semibold rounded-lg px-4 py-2.5 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}



      {/* ── Inspections Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hidden lg:block">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Recent Inspections</h3>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {inspections.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Date", "Time", "Room No", "Title", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inspections.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-gray-400 italic">
                    No inspections found.
                  </td>
                </tr>
              ) : (
                inspections.map((item, index) => (
                  <tr key={index} className="hover:bg-[#A4B494]/10 transition-colors duration-150 group">

                    {/* Date */}
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{item.date}</td>

                    {/* Time */}
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{item.time}</td>

                    {/* Room */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {item.target}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-5 py-3.5 font-medium text-gray-800">{item.title}</td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.status?.toLowerCase() === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleView(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => item.status?.toLowerCase() === "pending" && markComplete(item._id)}
                          disabled={item.status?.toLowerCase() !== "pending"}
                          title={item.status?.toLowerCase() === "pending" ? "Mark Complete" : "Already Completed"}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${item.status?.toLowerCase() === "pending"
                            ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-600 cursor-pointer"
                            : "bg-green-50 text-green-500 cursor-not-allowed opacity-60"
                            }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>

                        <button
                          onClick={() => deleteInspection(item._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>





      {/* Mobile Card View */}
      <div className="lg:hidden grid gap-4">
        {inspections.length === 0 ? (
          <p className="text-gray-500 italic">No inspections found.</p>
        ) : (
          inspections.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <h4 className="text-md font-semibold mb-1">{item.title}</h4>
              <p><strong>Date:</strong> {item.date}</p>
              <p><strong>Time:</strong> {item.time}</p>
              <p><strong>Room:</strong> {item.target}</p>

              {/* <p className={`font-medium ${item.status === "Completed" ? "text-green-600" : "text-orange-500"}`}>
                <strong>Status:</strong> {item.status}
              </p> */}

              <p className={`font-medium ${item.status?.toLowerCase() === "completed" ? "text-green-600" : "text-yellow-500"
                }`}>
                <strong>Status:</strong> {item.status}
              </p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleView(item)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">View</button>
                {item.status === "Pending" && (
                  <button onClick={() => markComplete(item._id)} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Complete</button>
                )}
                <button onClick={() => deleteInspection(item._id)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
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
              <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



function StatCard({ label, value, color = "text-[#1a312a]" }) {
  const isColored = color !== "text-[#1a312a]" && color !== "text-gray-800";

  return (
    <div className="relative bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 overflow-hidden flex justify-between items-center hover:shadow-md transition-shadow duration-200">

      {/* Accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${isColored ? color.replace("text-", "bg-") : "bg-[#A4B494]"}`} />

      {/* Background blob */}
      <div className={`absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-10 blur-2xl ${isColored ? color.replace("text-", "bg-") : "bg-[#A4B494]"}`} />

      {/* Content */}
      <div className="pl-3 z-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
        <p className={`text-4xl font-extrabold leading-none ${color}`}>{value}</p>
      </div>
    </div>
  );
}

// function FilterInput({ label, value, onChange, type = "text" }) {
//   return (
//     <div>
//       <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="bg-gray-100 rounded px-3 py-2 w-full text-sm"
//       />
//     </div>
//   );
// }

// function FilterSelect({ label, value, onChange, options }) {
//   return (
//     <div>
//       <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="bg-gray-100 rounded px-3 py-2 w-full text-sm"
//       >
//         <option value="">All</option>
//         {options.map((opt, idx) => (
//           <option key={idx} value={opt}>
//             {opt.charAt(0).toUpperCase() + opt.slice(1)}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }





{/* ── FilterInput & FilterSelect Components ── */ }
function FilterInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
      />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
        >
          <option value="">All</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}