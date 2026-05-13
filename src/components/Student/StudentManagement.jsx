"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentManagements from "./Management";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, onLeave: 0, checkedOut: 0 });
  const [filters, setFilters] = useState({ studentId: "", roomNo: "", status: "" });
  
  // New states for modal and tabs
  const [activeTab, setActiveTab] = useState("students"); // "students", "parents", or "workers"
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    fetchCounts();
    // Fetch parents only if the endpoint exists
    fetchParents().catch(() => {
      console.warn("Parents feature not available yet");
    });
    // Fetch workers
    fetchWorkers().catch(() => {
      console.warn("Workers feature not available yet");
    });
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

  const fetchParents = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/parents`);
      setParents(res.data.parents || []);
    } catch (err) {
      console.error("Error fetching parents:", err);
      // If endpoint doesn't exist yet, set empty array
      if (err.response?.status === 404) {
        console.warn("Parents endpoint not implemented yet");
        setParents([]);
      }
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/workers`);
      setWorkers(res.data.workers || []);
    } catch (err) {
      console.error("Error fetching workers:", err);
      // If endpoint doesn't exist yet, set empty array
      if (err.response?.status === 404) {
        console.warn("Workers endpoint not implemented yet");
        setWorkers([]);
      }
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleViewParent = (parent) => {
    setSelectedParent(parent);
    setShowViewModal(true);
  };

  const handleEditParent = (parent) => {
    setSelectedParent(parent);
    setShowEditModal(true);
  };

  const handleViewWorker = (worker) => {
    setSelectedWorker(worker);
    setShowViewModal(true);
  };

  const handleEditWorker = (worker) => {
    setSelectedWorker(worker);
    setShowEditModal(true);
  };

  const handleClearFilters = () => {
    setFilters({ studentId: "", roomNo: "", status: "" });
    toast.info("Filters cleared", { autoClose: 2000 });
  };

  const getStatusStyle = (status) => {
    if (status === "Active") return "text-green-600";
    if (status === "On Leave") return "text-orange-500";
    if (status === "Checked Out") return "text-gray-600";
    return "";
  };

  // Filter students/parents based on search query
  const filteredStudents = students.filter(s => 
    s.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactNumber?.includes(searchQuery)
  );

  const filteredParents = parents.filter(p =>
    p.parentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contactNumber?.includes(searchQuery)
  );

  const filteredWorkers = workers.filter(w =>
    w.staffId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.contactNumber?.includes(searchQuery) ||
    w.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-1 h-7 bg-red-500 mr-3"></div>
        <h2 className="text-2xl font-bold">Student Management</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab("students");
              setSearchQuery("");
            }}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "students"
                ? "bg-[#A4B494] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => {
              setActiveTab("parents");
              setSearchQuery("");
            }}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "parents"
                ? "bg-[#A4B494] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Parents
          </button>
          <button
            onClick={() => {
              setActiveTab("workers");
              setSearchQuery("");
            }}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "workers"
                ? "bg-[#A4B494] text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Workers
          </button>
        </div>

        {/* Register Button */}
        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#A4B494] text-white rounded-lg font-semibold hover:bg-[#8fa082] transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Register {activeTab === "students" ? "Student" : activeTab === "parents" ? "Parent" : "Worker"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === "students" ? "students" : activeTab === "parents" ? "parents" : "workers"}...`}
            className="w-full px-4 py-2.5 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Stats - Only show for students tab */}
      {activeTab === "students" && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Students" count={counts.total} icon="/warden/std-management/students.png" />
          <StatCard title="Active Students" count={counts.active} icon="/warden/std-management/active.png" />
          <StatCard title="On Leave" count={counts.onLeave} icon="/warden/std-management/leave-std.png" red />
          <StatCard title="Checked Out" count={counts.checkedOut} icon="/warden/std-management/leave-std.png" />
        </div>
      )}

      {/* Filters - Only show for students tab */}
      {activeTab === "students" && (
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
      )}

      {/* Students Table */}
      {activeTab === "students" && (
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
              {filteredStudents.length} students
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
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Bed</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">Contact</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Fees Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Dues</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-10 text-center text-gray-400 italic text-sm">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, i) => (
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
                      <td className="px-4 py-3.5 text-gray-600 font-medium">
                        {s.roomNo || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 font-medium">
                        {s.barcodeId || <span className="text-gray-300">Not Assigned</span>}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{s.contactNumber || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          s.feeStatus === 'Paid' ? 'bg-green-500 text-white' :
                          s.feeStatus === 'Unpaid' ? 'bg-orange-500 text-white' :
                          s.feeStatus === 'Partial' ? 'bg-yellow-500 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {s.feeStatus || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 font-medium">{s.dues || '₹ 0/-'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(s.status || "Active")}`}>
                          {s.status || "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-4 relative">
                          <button
                            onClick={() => handleViewStudent(s)}
                            className="text-black hover:text-gray-700 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                            title="View Student Details"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <div
                            style={{
                              width: "1px",
                              height: "20px",
                              backgroundColor: "#000000",
                              margin: "0 8px",
                            }}
                          />
                          <button
                            onClick={() => handleEditStudent(s)}
                            className="text-gray-800 hover:text-black flex items-center justify-center transition-colors cursor-pointer hover:scale-110 transition-transform"
                            title="Edit Student"
                          >
                            <svg
                              width="27"
                              height="26"
                              viewBox="0 0 27 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id={`mask0_221_285_${i}`}
                                style={{ maskType: "alpha" }}
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="27"
                                height="26"
                              >
                                <rect
                                  x="0.678223"
                                  y="0.0253906"
                                  width="25.7356"
                                  height="25.7356"
                                  fill="#D9D9D9"
                                />
                              </mask>
                              <g mask={`url(#mask0_221_285_${i})`}>
                                <path
                                  d="M2.82373 25.7609V21.4717H24.2701V25.7609H2.82373ZM7.113 17.1824H8.61425L16.9783 8.8451L15.4503 7.31705L7.113 15.6811V17.1824ZM4.96837 19.327V14.7697L16.9783 2.78651C17.1749 2.58991 17.4028 2.438 17.6619 2.33077C17.9211 2.22354 18.1936 2.16992 18.4796 2.16992C18.7655 2.16992 19.0425 2.22354 19.3106 2.33077C19.5787 2.438 19.82 2.59885 20.0344 2.81331L21.5089 4.31456C21.7233 4.51115 21.8797 4.74349 21.978 5.01157C22.0763 5.27965 22.1255 5.55666 22.1255 5.84261C22.1255 6.11069 22.0763 6.3743 21.978 6.63345C21.8797 6.89259 21.7233 7.1294 21.5089 7.34386L9.52572 19.327H4.96837Z"
                                  fill="#1C1B1F"
                                />
                              </g>
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

          {/* Mobile Cards */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {filteredStudents.length === 0 ? (
              <p className="px-5 py-10 text-center text-gray-400 italic text-sm">No students found.</p>
            ) : (
              filteredStudents.map((s, i) => (
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

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">Room</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">
                        {s.roomNo || "—"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">Bed</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.barcodeId || "—"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">Contact</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.contactNumber || "—"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">Fee Status</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 ${
                        s.feeStatus === 'Paid' ? 'bg-green-500 text-white' :
                        s.feeStatus === 'Unpaid' ? 'bg-orange-500 text-white' :
                        s.feeStatus === 'Partial' ? 'bg-yellow-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {s.feeStatus || 'N/A'}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">Dues</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.dues || '₹ 0/-'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewStudent(s)}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors flex-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => handleEditStudent(s)}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors flex-1"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 27 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.82373 25.7609V21.4717H24.2701V25.7609H2.82373ZM7.113 17.1824H8.61425L16.9783 8.8451L15.4503 7.31705L7.113 15.6811V17.1824ZM4.96837 19.327V14.7697L16.9783 2.78651C17.1749 2.58991 17.4028 2.438 17.6619 2.33077C17.9211 2.22354 18.1936 2.16992 18.4796 2.16992C18.7655 2.16992 19.0425 2.22354 19.3106 2.33077C19.5787 2.438 19.82 2.59885 20.0344 2.81331L21.5089 4.31456C21.7233 4.51115 21.8797 4.74349 21.978 5.01157C22.0763 5.27965 22.1255 5.55666 22.1255 5.84261C22.1255 6.11069 22.0763 6.3743 21.978 6.63345C21.8797 6.89259 21.7233 7.1294 21.5089 7.34386L9.52572 19.327H4.96837Z"
                          fill="#1C1B1F"
                        />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Parents Table */}
      {activeTab === "parents" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m6-5a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Parent List</h3>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {filteredParents.length} parents
            </span>
          </div>

          {/* Check if parents endpoint is available */}
          {parents.length === 0 && filteredParents.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m6-5a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-500 font-medium mb-2">No parents registered yet</p>
              <p className="text-gray-400 text-sm">Click "Register Parent" to add a new parent account</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Relation</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredParents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center text-gray-400 italic text-sm">
                      No parents found.
                    </td>
                  </tr>
                ) : (
                  filteredParents.map((p, i) => (
                    <tr key={i} className="hover:bg-[#A4B494]/10 transition-colors duration-150">
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-600 font-medium">{p.parentId}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-xs font-bold text-[#1a312a] shrink-0">
                            {p.firstName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{p.firstName} {p.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{p.email || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{p.contactNumber || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3.5 text-gray-600">{p.relation || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-600">{p.studentId || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewParent(p)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-150"
                            title="View Details"
                          >
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditParent(p)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#A4B494]/30 transition-colors duration-150"
                            title="Edit Parent"
                          >
                            <img src="/warden/images/edit-icon.png" alt="Edit" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {filteredParents.length === 0 ? (
              <p className="px-5 py-10 text-center text-gray-400 italic text-sm">No parents found.</p>
            ) : (
              filteredParents.map((p, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-sm font-bold text-[#1a312a] shrink-0">
                        {p.firstName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{p.firstName} {p.lastName}</p>
                        <p className="text-xs font-mono text-gray-400">{p.parentId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label: "Email", value: p.email },
                      { label: "Contact", value: p.contactNumber },
                      { label: "Relation", value: p.relation },
                      { label: "Student ID", value: p.studentId },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-400 font-medium">{label}</p>
                        <p className="text-xs font-semibold text-gray-700 mt-0.5">{value || "—"}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewParent(p)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => handleEditParent(p)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#1a312a] bg-[#A4B494]/20 hover:bg-[#A4B494]/40 px-3 py-1.5 rounded-lg transition-colors flex-1"
                    >
                      <img src="/warden/images/edit-icon.png" alt="Edit" className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
            </>
          )}
        </div>
      )}

      {/* Workers Table */}
      {activeTab === "workers" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Worker List</h3>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {filteredWorkers.length} workers
            </span>
          </div>

          {/* Check if workers endpoint is available */}
          {workers.length === 0 && filteredWorkers.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-medium mb-2">No workers registered yet</p>
              <p className="text-gray-400 text-sm">Click "Register Worker" to add your first worker</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff ID</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shift</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredWorkers.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-10 text-center text-gray-400 italic text-sm">
                          No workers found.
                        </td>
                      </tr>
                    ) : (
                      filteredWorkers.map((w, i) => (
                        <tr key={i} className="hover:bg-[#A4B494]/10 transition-colors duration-150">
                          <td className="px-4 py-3.5 font-mono text-xs text-gray-600 font-medium">{w.staffId}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-xs font-bold text-[#1a312a] shrink-0">
                                {w.firstName?.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-800">{w.firstName} {w.lastName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-600">{w.designation || <span className="text-gray-300">—</span>}</td>
                          <td className="px-4 py-3.5 text-gray-600">{w.email || <span className="text-gray-300">—</span>}</td>
                          <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{w.contactNumber || <span className="text-gray-300">—</span>}</td>
                          <td className="px-4 py-3.5 text-gray-600 text-xs">{w.shiftStart && w.shiftEnd ? `${w.shiftStart} - ${w.shiftEnd}` : <span className="text-gray-300">—</span>}</td>
                          <td className="px-4 py-3.5 text-gray-600 font-medium">₹ {w.salary || 0}/-</td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewWorker(w)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-150"
                                title="View Details"
                              >
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEditWorker(w)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#A4B494]/30 transition-colors duration-150"
                                title="Edit Worker"
                              >
                                <img src="/warden/images/edit-icon.png" alt="Edit" className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="block lg:hidden divide-y divide-gray-100">
                {filteredWorkers.length === 0 ? (
                  <p className="px-5 py-10 text-center text-gray-400 italic text-sm">No workers found.</p>
                ) : (
                  filteredWorkers.map((w, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-sm font-bold text-[#1a312a] shrink-0">
                            {w.firstName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{w.firstName} {w.lastName}</p>
                            <p className="text-xs font-mono text-gray-400">{w.staffId}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {[
                          { label: "Designation", value: w.designation },
                          { label: "Email", value: w.email },
                          { label: "Contact", value: w.contactNumber },
                          { label: "Shift", value: w.shiftStart && w.shiftEnd ? `${w.shiftStart} - ${w.shiftEnd}` : "—" },
                          { label: "Salary", value: `₹ ${w.salary || 0}/-` },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                            <p className="text-xs text-gray-400 font-medium">{label}</p>
                            <p className="text-xs font-semibold text-gray-700 mt-0.5">{value || "—"}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewWorker(w)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => handleEditWorker(w)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#1a312a] bg-[#A4B494]/20 hover:bg-[#A4B494]/40 px-3 py-1.5 rounded-lg transition-colors flex-1"
                        >
                          <img src="/warden/images/edit-icon.png" alt="Edit" className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Register {activeTab === "students" ? "Student" : activeTab === "parents" ? "Parent" : "Worker"}
              </h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <StudentManagements 
                initialTab={activeTab === "students" ? "student" : activeTab === "parents" ? "parent" : "worker"}
                onSuccess={() => {
                  setShowRegisterModal(false);
                  fetchStudents();
                  fetchParents();
                  fetchCounts();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedStudent(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Student ID</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.studentId}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Student Name</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.studentName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Contact Number</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.contactNumber || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Email</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.email || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Room Number</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.roomNo || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Bed Number (Full ID)</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.barcodeId || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Status</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.status || "Active"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Fee Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedStudent.feeStatus === 'Paid' ? 'bg-green-500 text-white' :
                    selectedStudent.feeStatus === 'Unpaid' ? 'bg-orange-500 text-white' :
                    selectedStudent.feeStatus === 'Partial' ? 'bg-yellow-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {selectedStudent.feeStatus || 'N/A'}
                  </span>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Dues</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.dues || '₹ 0/-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Emergency Contact Name</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.emergencyContactName || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Emergency Contact Number</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.emergencyContactNumber || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Admission Date</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.admissionDate ? new Date(selectedStudent.admissionDate).toLocaleDateString() : "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Parent Modal */}
      {showViewModal && selectedParent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">Parent Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedParent(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Parent ID</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.parentId}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">First Name</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.firstName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Last Name</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.lastName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Email</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.email || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Contact Number</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.contactNumber || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Relation</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.relation || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Student ID</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.studentId || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#BEC5AD] rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedStudent(null);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-lg transition-colors z-50"
            >
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Management Component with its original styling */}
            <div className="p-6">
              <StudentManagements 
                initialTab="student"
                editMode={true}
                studentData={selectedStudent}
                onSuccess={() => {
                  setShowEditModal(false);
                  setSelectedStudent(null);
                  fetchStudents();
                  fetchCounts();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Parent Modal */}
      {showEditModal && selectedParent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#BEC5AD] rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedParent(null);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-lg transition-colors z-50"
            >
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Management Component with its original styling */}
            <div className="p-6">
              <StudentManagements 
                initialTab="parent"
                editMode={true}
                parentData={selectedParent}
                onSuccess={() => {
                  setShowEditModal(false);
                  setSelectedParent(null);
                  fetchParents();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Register {activeTab === "students" ? "Student" : "Parent"}
              </h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <StudentManagements 
                initialTab={activeTab === "students" ? "student" : "parent"}
                onSuccess={() => {
                  setShowRegisterModal(false);
                  fetchStudents();
                  fetchParents();
                  fetchCounts();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

// --- Helper Components ---

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
