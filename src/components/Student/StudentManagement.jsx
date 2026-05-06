"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentManagements from "./Management";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, onLeave: 0, checkedOut: 0 });
  const [filters, setFilters] = useState({ studentId: "", roomNo: "", status: "" });
  const [editingStudent, setEditingStudent] = useState(null);
  const [newBarcodeId, setNewBarcodeId] = useState("");
  const [availableBeds, setAvailableBeds] = useState([]);

  useEffect(() => {
    fetchCounts();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchCounts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students/count`);
      setCounts({
        total: res.data.totalStudents,
        active: res.data.activeStudents,
        onLeave: res.data.onLeaveStudents,
        checkedOut: res.data.checkedOutStudents || 0,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const params = {};
      if (filters.studentId) params.studentId = filters.studentId;
      if (filters.roomNo) params.roomNo = filters.roomNo;
      if (filters.status) params.status = filters.status;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students`, { params });
      setStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleClearFilters = () => {
    setFilters({ studentId: "", roomNo: "", status: "" });
    toast.info("Filters cleared", { autoClose: 2000 });
  };

  const handleEditClick = async (student) => {
    setEditingStudent(student);
    setNewBarcodeId(student.barcodeId || "");

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students/available-bed`);
      setAvailableBeds(res.data.beds);
    } catch (err) {
      console.error("Error fetching available beds:", err);
      toast.error("Failed to fetch available beds", { autoClose: 3000 });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students/${editingStudent.studentId}`,
        { barcodeId: newBarcodeId }
      );
      toast.success(res.data.message || "Bed updated successfully!", { autoClose: 3000 });
      setEditingStudent(null);
      fetchCounts();
      fetchStudents();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || "Error updating bed.", { autoClose: 3000 });
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Active") return "text-green-600";
    if (status === "On Leave") return "text-orange-500";
    if (status === "Checked Out") return "text-gray-600";
    return "";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-1 h-7 bg-red-500 mr-3"></div>
        <h2 className="text-2xl font-bold">Student Management</h2>
      </div>

      <StudentManagements />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Students" count={counts.total} icon="/warden/std-management/students.png" />
        <StatCard title="Active Students" count={counts.active} icon="/warden/std-management/active.png" />
        <StatCard title="On Leave" count={counts.onLeave} icon="/warden/std-management/leave-std.png" red />
        <StatCard title="Checked Out" count={counts.checkedOut} icon="/warden/std-management/leave-std.png" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Filter Students</h3>
        </div>

        {/* Filters */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Student ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</label>
            <div className="relative">
              <select
                value={filters.studentId}
                onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
              >
                {["", ...students.map((s) => s.studentId)].map((opt, i) => (
                  <option key={i} value={opt}>{opt || "All IDs"}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Room No */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Room No</label>
            <div className="relative">
              <select
                value={filters.roomNo}
                onChange={(e) => setFilters({ ...filters, roomNo: e.target.value })}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
              >
                {["", ...students.map((s) => s.roomNo).filter(Boolean)].map((opt, i) => (
                  <option key={i} value={opt}>{opt || "All Rooms"}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
              >
                {["", "Active", "On Leave", "Checked Out"].map((opt, i) => (
                  <option key={i} value={opt}>{opt || "All Statuses"}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* Clear Button */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-transparent uppercase tracking-wider select-none">Action</label>
            <button
              onClick={handleClearFilters}
              className="flex items-center justify-center gap-2 w-full bg-red-50  text-red-500 border border-red-200 hover:border-red-500 text-sm font-semibold rounded-lg px-4 py-2.5 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          </div>
        </div>
      </div>



      {/* Student Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m6-5a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Student List</h3>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {students.length} students
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Student ID</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Room</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Bed</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">Contact</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-gray-400 italic text-sm">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((s, i) => (
                  <tr key={i} className="hover:bg-[#A4B494]/10 transition-colors duration-150 group">
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-600 font-medium">{s.studentId}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-xs font-bold text-[#1a312a] shrink-0">
                          {s.studentName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{s.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{s.roomNo || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5 text-gray-600">{s.barcodeId || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(s.status || "Active")}`}>
                        {s.status || "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{s.contactNumber || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleEditClick(s)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#A4B494]/30 transition-colors duration-150 group-hover:bg-[#A4B494]/20"
                      >
                        <img src="/warden/images/edit-icon.png" alt="Edit" className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block lg:hidden divide-y divide-gray-100">
          {students.length === 0 ? (
            <p className="px-5 py-10 text-center text-gray-400 italic text-sm">No students found.</p>
          ) : (
            students.map((s, i) => (
              <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-sm font-bold text-[#1a312a] shrink-0">
                      {s.studentName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{s.studentName}</p>
                      <p className="text-xs font-mono text-gray-400">{s.studentId}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(s.status || "Active")}`}>
                    {s.status || "Active"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: "Room", value: s.roomNo },
                    { label: "Bed", value: s.barcodeId },
                    { label: "Contact", value: s.contactNumber },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">{label}</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{value || "—"}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleEditClick(s)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#1a312a] bg-[#A4B494]/20 hover:bg-[#A4B494]/40 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <img src="/warden/images/edit-icon.png" alt="Edit" className="w-3.5 h-3.5" />
                  Edit Bed
                </button>
              </div>
            ))
          )}
        </div>
      </div>




      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Update Bed for {editingStudent.studentName}
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <label className="block text-left">
                Select New Bed:
                <select
                  value={newBarcodeId}
                  onChange={(e) => setNewBarcodeId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">-- Choose available bed --</option>
                  {availableBeds.map((bed) => (
                    <option key={bed._id} value={bed.barcodeId}>
                      Room {bed.roomNo} — {bed.barcodeId}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  disabled={!newBarcodeId}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Helper Components ---

// function StatCard({ title, count, icon, red }) {
//   return (
//     <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex justify-between items-center shadow relative">
//       <div>
//         <div className="text-sm font-semibold">{title}</div>
//         <div className={`text-3xl font-bold ${red ? "text-red-600" : "text-black"}`}>{count}</div>
//       </div>
//       {icon && (
//         <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-full border flex items-center justify-center">
//           <img src={icon} alt={title} className="object-contain w-full h-full" />
//         </div>
//       )}
//     </div>
//   );
// }

function StatCard({ title, count, icon, red }) {
  return (
    <div className="relative bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 overflow-hidden flex justify-between items-center group hover:shadow-md transition-shadow duration-200">

      {/* Accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${red ? "bg-red-400" : "bg-[#A4B494]"}`} />

      {/* Background blob */}
      <div className={`absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-10 blur-2xl ${red ? "bg-red-400" : "bg-[#A4B494]"}`} />

      {/* Content */}
      <div className="pl-3 z-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{title}</p>
        <p className={`text-4xl font-extrabold leading-none ${red ? "text-red-500" : "text-[#1a312a]"}`}>
          {count}
        </p>
      </div>

      {/* Icon */}
      {icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 z-10 ${red ? "bg-red-50" : "bg-[#A4B494]/20"}`}>
          <img src={icon} alt={title} className="w-6 h-6 object-contain" />
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-800 mb-1 block">{label}</label>
      <select value={value} onChange={onChange} className="bg-gray-100 rounded p-2 w-full text-sm">
        {options.map((opt, index) => (
          <option key={index} value={opt}>{opt || `All ${label}`}</option>
        ))}
      </select>
    </div>
  );
}
