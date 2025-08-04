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

      {/* Desktop Table View */}
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
                      <button onClick={() => handleView(item)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">View</button>
                      {item.status === "Pending" && (
                        <button onClick={() => markComplete(item._id)} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Complete</button>
                      )}
                      <button onClick={() => deleteInspection(item._id)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Delete</button>
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
              <p className={`font-medium ${item.status === "Completed" ? "text-green-600" : "text-orange-500"}`}>
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
