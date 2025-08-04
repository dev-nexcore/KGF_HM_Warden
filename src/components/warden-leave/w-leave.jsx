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
  };
  return colors[status.toLowerCase()] || "text-gray-600 bg-gray-100 border border-gray-200";
}

export default function LeaveRequestsDashboard() {
  const [filters, setFilters] = useState({ student: "", status: "", date: "" });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionPopup, setActionPopup] = useState({ id: null, type: null });

  const fetchFilteredLeaves = async () => {
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
  const { id, type } = actionPopup;
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
  }
};

  const clearFilters = () => {
    setFilters({ student: "", status: "", date: "" });
    toast.info("Filters cleared");
  };

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    fetchFilteredLeaves();
    fetchStats();
  }, [filters]);

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
          <div key={stat.label} className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: stat.color }}>
            <p className="text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.textColor }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
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
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {leaveRequests.map((req) => (
          <div key={req._id} className="bg-[#F9F9F9] p-4 rounded-lg border shadow space-y-1">
            <p><strong>ID:</strong> {req.studentId?.studentId || "-"}</p>
            <p><strong>Name:</strong> {req.studentId?.firstName} {req.studentId?.lastName}</p>
            <p><strong>Type:</strong> {req.leaveType}</p>
            <p><strong>Start:</strong> {new Date(req.startDate).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(req.endDate).toLocaleDateString()}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(req.status)}`}>{req.status}</span>
            </p>
            <div className="flex justify-end gap-3 mt-2">
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
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white p-4 rounded-lg shadow overflow-x-auto">
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
      </div>

      {/* View Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Leave Request Details</h2>
            <p><strong>Name:</strong> {selectedLeave.studentId?.firstName} {selectedLeave.studentId?.lastName}</p>
            <p><strong>ID:</strong> {selectedLeave.studentId?.studentId}</p>
            <p><strong>Type:</strong> {selectedLeave.leaveType}</p>
            <p><strong>Start:</strong> {new Date(selectedLeave.startDate).toLocaleDateString()}</p>
            <p><strong>End:</strong> {new Date(selectedLeave.endDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedLeave.status}</p>
            <p><strong>Reason:</strong> {selectedLeave.reason || "N/A"}</p>
            <div className="mt-4 text-right">
              <button onClick={() => setSelectedLeave(null)} className="bg-red-500 px-4 py-2 text-white rounded">Close</button>
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
              <button onClick={() => handleAction()} className="bg-green-600 text-white px-4 py-2 rounded">Yes</button>
              <button onClick={() => setActionPopup({ id: null, type: null })} className="bg-gray-300 px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
