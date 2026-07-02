"use client";

import { MdCheck, MdClose, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth`;

function getStatusColor(status) {
  const colors = {
    pending: "text-orange-600 bg-orange-100 border border-orange-200",
    approved: "text-green-600 bg-green-100 border border-green-200",
    rejected: "text-red-600 bg-red-100 border border-red-200",
    parent_approved: "text-purple-600 bg-purple-100 border border-purple-200",
    parent_rejected: "text-pink-600 bg-pink-100 border border-pink-200",
    warden_approved: "text-blue-600 bg-blue-100 border border-blue-200",
    warden_rejected: "text-rose-600 bg-rose-100 border border-rose-200",
  };
  return colors[status.toLowerCase()] || "text-gray-600 bg-gray-100 border border-gray-200";
}

export default function LeaveRequestsDashboard() {
  const [filters, setFilters] = useState({ student: "", status: "", date: "" });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionPopup, setActionPopup] = useState({ id: null, type: null });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchFilteredLeaves = async () => {
    setLoading(true);
    try {
      const query = {};
      const studentInput = filters.student.trim();
      if (studentInput) {
        query.studentName = studentInput;
        query.studentId = studentInput;
      }
      if (filters.status) query.status = filters.status.toLowerCase();
      if (filters.date) {
        query.startDate = filters.date;
        query.endDate = filters.date;
      }

      const res = await axios.get(`${API_BASE}/leave-filter`, {
        params: query,
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });

      setLeaveRequests(res.data);
    } catch (err) {
      toast.error("Failed to fetch leave requests.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/leave-stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });

      setStats([
        { label: "Total Requests", value: res.data.totalRequests, color: "#CBD2BB", textColor: "#000000" },
        { label: "Pending Requests", value: res.data.pendingRequests, color: "#CBD2BB", textColor: "#FF9D00" },
        { label: "Approved Requests", value: res.data.approvedRequests, color: "#CBD2BB", textColor: "#28C404" },
        { label: "Rejected Requests", value: res.data.rejectedRequests, color: "#CBD2BB", textColor: "#FF0000" },
      ]);
    } catch (err) {
      toast.error("Failed to fetch stats.");
    }
  };

  // const handleAction = async () => {
  //   const { id, type } = actionPopup;
  //   try {
  //     if (type === "delete") {
  //       await axios.delete(`${API_BASE}/leave/${id}`, {
  //         headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
  //       });
  //       toast.success("Leave request deleted.");
  //     } else {
  //       await axios.put(
  //         `${API_BASE}/${id}/status`,
  //         { status: type },
  //         { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
  //       );
  //       toast.success(`Leave request ${type} successfully.`);
  //     }
  //     setActionPopup({ id: null, type: null });
  //     fetchFilteredLeaves();
  //     fetchStats();
  //   } catch (err) {
  //     toast.error(`Failed to ${type} leave request.`);
  //   }
  // };


  const handleAction = async () => {
    if (isProcessing) return;
    const { id, type } = actionPopup;
    setIsProcessing(true);
    try {
      if (type === "delete") {
        await axios.delete(`${API_BASE}/leave/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
        });
        toast.success("Leave request deleted successfully.", { autoClose: 3000 });
      } else if (type === "approved") {
        await axios.put(
          `${API_BASE}/${id}/status`,
          { status: "approved" },
          { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
        );
        toast.success("Leave request approved successfully.", { autoClose: 3000 });
      } else if (type === "rejected") {
        await axios.put(
          `${API_BASE}/${id}/status`,
          { status: "rejected" },
          { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
        );
        toast.success("❌ Leave request rejected successfully.", { autoClose: 3000 });
      }

      setActionPopup({ id: null, type: null });
      fetchFilteredLeaves();
      fetchStats();
    } catch (err) {
      toast.error(`⚠️ Failed to ${type} leave request.`, { autoClose: 3000 });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFilters = () => {
    setFilters({ student: "", status: "", date: "" });
    setCurrentPage(1);
    toast.info("Filters cleared");
  };

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchFilteredLeaves();
    fetchStats();
  }, [filters]);

  const totalPages = Math.ceil(leaveRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = leaveRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAF5]">
        <div className="w-10 h-10 border-4 border-[#A4B494]/20 border-t-[#A4B494] rounded-full animate-spin shadow-lg"></div>
        <p className="mt-6 text-[#A4B494] font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Requests...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white min-h-screen space-y-6">

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />


      {/* Header */}
      <div className="flex items-center">
        <div className="w-1 h-6 bg-red-500 rounded-full mr-2"></div>
        <h1 className="text-2xl font-bold">Leave Request Management</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Accent bar */}
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl" style={{ backgroundColor: stat.textColor }} />

            {/* Background blob */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: stat.textColor }} />

            {/* Content */}
            <div className="pl-3 z-10 relative">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{stat.label}</p>
              <p className="text-4xl font-extrabold leading-none" style={{ color: stat.textColor }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filter Leave Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" value={filters.student} onChange={handleChange("student")} placeholder="Search Name or ID" className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-sm" />
          <select value={filters.status} onChange={handleChange("status")} className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-sm">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input type="date" value={filters.date} onChange={handleChange("date")} className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-sm" />
          <button onClick={clearFilters} className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded">Clear Filters</button>
        </div>
      </div> */}






      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Filter Leave Requests</h2>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
              </svg>
              <input
                type="text"
                value={filters.student}
                onChange={handleChange("student")}
                placeholder="Name or Student ID"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={handleChange("status")}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="parent_approved">Parent Approved</option>
                <option value="parent_rejected">Parent Rejected</option>
                <option value="warden_approved">Warden Approved</option>
                <option value="warden_rejected">Warden Rejected</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
            <div className="relative">
              <input
                type="date"
                value={filters.date}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                onChange={handleChange("date")}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition cursor-pointer [color-scheme:light] [&::-webkit-calendar-picker-indicator]:hidden"
              />
              <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>

          {/* Clear */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-transparent uppercase tracking-wider select-none">Action</label>
            <button
              onClick={clearFilters}
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

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {paginatedData.map((req) => (
          <div key={req._id} className="bg-[#F9F9F9] p-4 rounded-lg border shadow space-y-1">
            <p><strong>ID:</strong> {req.studentId?.studentId || "-"}</p>
            <p><strong>Name:</strong> {req.studentId?.firstName} {req.studentId?.lastName}</p>
            <p><strong>Type:</strong> {req.leaveType === 'Others' && req.otherLeaveType ? `Others (${req.otherLeaveType})` : req.leaveType}</p>
            <p><strong>Start:</strong> {new Date(req.startDate).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(req.endDate).toLocaleDateString()}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(req.status)}`}>{req.status}</span>
            </p>
            <div className="flex justify-end gap-3 mt-2">
              <MdRemoveRedEye size={20} onClick={() => setSelectedLeave(req)} className="text-blue-600 cursor-pointer" title="View" />
              {(req.status === "pending" || req.status === "parent_approved") ? (
                <>
                  <MdCheck size={20} onClick={() => setActionPopup({ id: req._id, type: "approved" })} className="text-green-600 cursor-pointer" title="Approve" />
                  <MdClose size={20} onClick={() => setActionPopup({ id: req._id, type: "rejected" })} className="text-red-600 cursor-pointer" title="Reject" />
                  <MdDelete size={20} className="opacity-50 cursor-not-allowed" />
                </>
              ) : (
                <MdDelete size={20} onClick={() => setActionPopup({ id: req._id, type: "delete" })} className="text-red-600 cursor-pointer" title="Delete" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      {/* <div className="hidden md:block bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#D9D9D9]">
            <tr>
              <th className="px-3 py-2 text-left">Student ID</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Start Date</th>
              <th className="px-3 py-2 text-left">End Date</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">No leave requests found.</td></tr>
            ) : (
              leaveRequests.map((req) => (
                <tr key={req._id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{req.studentId?.studentId}</td>
                  <td className="px-3 py-2">{req.studentId?.firstName} {req.studentId?.lastName}</td>
                  <td className="px-3 py-2">{req.leaveType}</td>
                  <td className="px-3 py-2">{new Date(req.startDate).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{new Date(req.endDate).toLocaleDateString()}</td>
                  <td className="px-3 py-2"><span className={`inline-block px-3 py-1 rounded-full ${getStatusColor(req.status)}`}>{req.status}</span></td>
                  <td className="px-3 py-2 flex gap-2">
                    <MdRemoveRedEye size={20} onClick={() => setSelectedLeave(req)} className="text-blue-600 cursor-pointer" />
                    {req.status === "pending" ? (
                      <>
                        <MdCheck size={20} onClick={() => setActionPopup({ id: req._id, type: "approved" })} className="text-green-600 cursor-pointer" />
                        <MdClose size={20} onClick={() => setActionPopup({ id: req._id, type: "rejected" })} className="text-red-600 cursor-pointer" />
                        <MdDelete size={20} className="opacity-50 cursor-not-allowed" />
                      </>
                    ) : (
                      <MdDelete size={20} onClick={() => setActionPopup({ id: req._id, type: "delete" })} className="text-red-600 cursor-pointer" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div> */}


      <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
        <table className="w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["Student ID", "Name", "Type", "Start Date", "End Date", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {leaveRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400 italic">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              paginatedData.map((req) => (
                <tr key={req._id} className="hover:bg-[#A4B494]/10 transition-colors duration-150 group">

                  {/* Student ID */}
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400 font-medium">
                    {req.studentId?.studentId}
                  </td>

                  {/* Name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-xs font-bold text-[#1a312a] shrink-0">
                        {req.studentId?.firstName?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">
                        {req.studentId?.firstName} {req.studentId?.lastName}
                      </span>
                    </div>
                  </td>

                  {/* Leave Type */}
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {req.leaveType === 'Others' && req.otherLeaveType ? `Others (${req.otherLeaveType})` : req.leaveType}
                    </span>
                  </td>

                  {/* Start Date */}
                  <td className="px-5 py-3.5 text-gray-600 text-xs font-mono">
                    {new Date(req.startDate).toLocaleDateString()}
                  </td>

                  {/* End Date */}
                  <td className="px-5 py-3.5 text-gray-600 text-xs font-mono">
                    {new Date(req.endDate).toLocaleDateString()}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedLeave(req)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                      >
                        <MdRemoveRedEye size={16} />
                      </button>

                      {(req.status === "pending" || req.status === "parent_approved") ? (
                        <>
                          <button
                            onClick={() => setActionPopup({ id: req._id, type: "approved" })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
                            title="Approve"
                          >
                            <MdCheck size={16} />
                          </button>
                          <button
                            onClick={() => setActionPopup({ id: req._id, type: "rejected" })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                            title="Reject"
                          >
                            <MdClose size={16} />
                          </button>
                          <button
                            disabled
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-300 cursor-not-allowed"
                          >
                            <MdDelete size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setActionPopup({ id: req._id, type: "delete" })}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                        >
                          <MdDelete size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
          <div className="text-sm text-gray-600 font-medium bg-gray-50 px-4 py-2 rounded-full">
            Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, leaveRequests.length)} of {leaveRequests.length} requests
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#A4B494] hover:text-[#A4B494] hover:shadow-sm'
              }`}
            >
              Previous
            </button>
            
            <div className="flex flex-wrap items-center justify-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg font-medium text-sm transition-all duration-200 ${
                    currentPage === i + 1
                      ? 'bg-[#A4B494] text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#A4B494] hover:text-[#A4B494]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#A4B494] hover:text-[#A4B494] hover:shadow-sm'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-[#A4B494] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                Leave Request Details
              </h3>
              <button 
                onClick={() => setSelectedLeave(null)}
                className="text-white/80 hover:text-white transition-colors bg-black/10 hover:bg-black/20 p-1.5 rounded-full"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto">
              {/* Profile Card */}
              <div className="flex items-center gap-4 p-4 mb-6 bg-gray-50 border border-gray-100 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-[#A4B494]/20 flex items-center justify-center text-lg font-bold text-[#1a312a]">
                  {selectedLeave.studentId?.firstName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">
                    {selectedLeave.studentId?.firstName} {selectedLeave.studentId?.lastName}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium font-mono">
                    ID: {selectedLeave.studentId?.studentId}
                  </p>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Leave Type
                  </label>
                  <p className="text-base font-medium text-gray-800 bg-gray-50/50 px-3 py-2 rounded border border-gray-100">
                    {selectedLeave.leaveType === 'Others' && selectedLeave.otherLeaveType 
                      ? `Others (${selectedLeave.otherLeaveType})` 
                      : selectedLeave.leaveType}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Current Status
                  </label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold capitalize ${getStatusColor(selectedLeave.status)}`}>
                      {selectedLeave.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Start Date
                  </label>
                  <p className="text-base font-medium text-gray-800 bg-gray-50/50 px-3 py-2 rounded border border-gray-100 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {new Date(selectedLeave.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    End Date
                  </label>
                  <p className="text-base font-medium text-gray-800 bg-gray-50/50 px-3 py-2 rounded border border-gray-100 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {new Date(selectedLeave.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Reason for Leave
                  </label>
                  <div className="bg-gray-50/80 p-4 rounded-lg border border-gray-100 text-gray-700 min-h-[80px] whitespace-pre-wrap">
                    {selectedLeave.reason || <span className="text-gray-400 italic">No reason provided.</span>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
              <button 
                onClick={() => setSelectedLeave(null)} 
                className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-5 py-2 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Popup */}
      {actionPopup.id && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm {actionPopup.type}</h2>
            <p>Are you sure you want to <strong>{actionPopup.type}</strong> this leave request?</p>
            <div className="mt-6 flex justify-center gap-4">
              <button 
                onClick={() => handleAction()} 
                disabled={isProcessing}
                className={`px-4 py-2 rounded text-white ${isProcessing ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isProcessing ? "Processing..." : "Yes"}
              </button>
              <button 
                onClick={() => !isProcessing && setActionPopup({ id: null, type: null })} 
                disabled={isProcessing}
                className={`px-4 py-2 rounded ${isProcessing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
