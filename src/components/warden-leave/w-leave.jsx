"use client";

import { MdCheck, MdClose, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  ClipboardCheck, Search, Filter, RefreshCw, X, 
  Activity, Calendar, User, ArrowUpRight 
} from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth`;

function getStatusColor(status) {
  const colors = {
    pending: "text-amber-600 bg-amber-50 border border-amber-100",
    approved: "text-emerald-600 bg-emerald-50 border border-emerald-100",
    rejected: "text-rose-600 bg-rose-50 border border-rose-100",
  };
  return colors[status.toLowerCase()] || "text-gray-600 bg-gray-100 border border-gray-200";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const PremiumStatCard = ({ label, value, color = "text-[#1A1F16]" }) => (
  <div className="bg-[#BEC5AD] p-6 rounded-[32px] border border-white/20 shadow-lg shadow-black/5 flex flex-col items-center gap-2 group hover:-translate-y-1 transition-all">
    <p className="text-[10px] font-black text-[#1A1F16]/40 uppercase tracking-[0.2em]">{label}</p>
    <h3 className={`text-3xl font-black tracking-tight ${color}`}>{value}</h3>
  </div>
);

export default function LeaveRequestsDashboard() {
  const [filters, setFilters] = useState({ student: "", status: "", date: "" });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionPopup, setActionPopup] = useState({ id: null, type: null });
  const [loading, setLoading] = useState(true);

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
        { label: "Total Volume", value: res.data.totalRequests, color: "text-[#1A1F16]" },
        { label: "Pending Review", value: res.data.pendingRequests, color: "text-amber-600" },
        { label: "Authorized", value: res.data.approvedRequests, color: "text-emerald-600" },
        { label: "Declined", value: res.data.rejectedRequests, color: "text-rose-600" },
      ]);
    } catch (err) {
      toast.error("Failed to fetch stats.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    const { id, type } = actionPopup;
    try {
      if (type === "delete") {
        await axios.delete(`${API_BASE}/leave/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
        });
        toast.success("Record deleted.");
      } else {
        await axios.put(
          `${API_BASE}/${id}/status`,
          { status: type },
          { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
        );
        toast.success(`Request ${type}.`);
      }

      setActionPopup({ id: null, type: null });
      fetchFilteredLeaves();
      fetchStats();
    } catch (err) {
      toast.error(`Operation failed.`);
    }
  };

  const clearFilters = () => {
    setFilters({ student: "", status: "", date: "" });
  };

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  useEffect(() => {
    fetchFilteredLeaves();
    fetchStats();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAF5]">
        <div className="w-10 h-10 border-4 border-[#A4B494]/20 border-t-[#A4B494] rounded-full animate-spin shadow-lg"></div>
        <p className="mt-6 text-[#A4B494] font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Syncing Requests...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-[#F8FAF5] min-h-screen p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── Page Title ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-red-500 rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Leave Board</h1>
            <p className="text-[10px] text-[#A4B494] font-black uppercase tracking-[0.25em] mt-1">Permission Control Center</p>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <PremiumStatCard key={stat.label} label={stat.label} value={stat.value} color={stat.color} />
        ))}
      </div>

      {/* ── Filters Section ── */}
      <div className="bg-[#A4B494] p-8 rounded-[32px] shadow-2xl relative overflow-hidden border border-white/20">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Search Resident</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input
                type="text"
                value={filters.student}
                onChange={handleChange("student")}
                placeholder="Name or Student ID"
                className="w-full bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-[#1A1F16] focus:bg-white outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Status Filter</label>
            <select
              value={filters.status}
              onChange={handleChange("status")}
              className="w-full appearance-none bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-xs font-bold text-[#1A1F16] focus:bg-white outline-none transition-all shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em]">Date Range</label>
            <input
              type="date"
              value={filters.date}
              onChange={handleChange("date")}
              className="w-full bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 text-xs font-bold text-[#1A1F16] focus:bg-white outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* ── Table View ── */}
      <div className="bg-white rounded-[32px] border border-[#A4B494]/10 shadow-xl shadow-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#A4B494]/10 border-b border-[#A4B494]/5">
                {["Resident", "Type", "Duration", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#A4B494]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A4B494]/5">
              {leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-[10px] font-black text-[#A4B494] uppercase tracking-[0.3em]">
                    No active requests found
                  </td>
                </tr>
              ) : (
                leaveRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-[#F8FAF5] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#A4B494]/20 flex items-center justify-center text-xs font-black text-[#1A1F16]">
                          {req.studentId?.firstName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#1A1F16] tracking-tight">{req.studentId?.firstName} {req.studentId?.lastName}</p>
                          <p className="text-[9px] font-black text-[#A4B494] uppercase tracking-widest">{req.studentId?.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-widest bg-white border border-[#A4B494]/10 px-3 py-1 rounded-full">
                        {req.leaveType}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[10px] font-black text-[#1A1F16] uppercase tracking-widest">
                        {new Date(req.startDate).toLocaleDateString()} → {new Date(req.endDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLeave(req)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F8FAF5] border border-[#A4B494]/10 text-[#A4B494] hover:bg-[#A4B494] hover:text-white transition-all shadow-sm"
                        >
                          <MdRemoveRedEye size={18} />
                        </button>
                        {req.status === "pending" ? (
                          <>
                            <button
                              onClick={() => setActionPopup({ id: req._id, type: "approved" })}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            >
                              <MdCheck size={18} />
                            </button>
                            <button
                              onClick={() => setActionPopup({ id: req._id, type: "rejected" })}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                            >
                              <MdClose size={18} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setActionPopup({ id: req._id, type: "delete" })}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          >
                            <MdDelete size={18} />
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
      </div>

      {/* View Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-[#A4B494] p-8 text-white relative">
              <h2 className="text-2xl font-black italic tracking-tight uppercase">Request Profile</h2>
              <button 
                onClick={() => setSelectedLeave(null)}
                className="absolute top-8 right-8 p-2 bg-white/20 rounded-xl hover:bg-white/40 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-[#A4B494] uppercase tracking-widest mb-1">Resident</p>
                  <p className="font-black text-[#1A1F16]">{selectedLeave.studentId?.firstName} {selectedLeave.studentId?.lastName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#A4B494] uppercase tracking-widest mb-1">ID Ref</p>
                  <p className="font-black text-[#1A1F16]">{selectedLeave.studentId?.studentId}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-[#A4B494] uppercase tracking-widest mb-1">Stated Reason</p>
                <p className="text-sm font-medium text-[#1A1F16]/60 bg-[#F8FAF5] p-4 rounded-[24px] border border-[#A4B494]/10 leading-relaxed">
                  {selectedLeave.reason || "No formal reason provided in system log."}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLeave(null)}
                className="w-full py-5 bg-[#1A1F16] text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-black/20"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Action Popup */}
      {actionPopup.id && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-amber-50 rounded-[32px] flex items-center justify-center text-amber-500 mx-auto border border-amber-100">
              <Activity size={40} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tight text-[#1A1F16]">Confirm Action</h2>
              <p className="text-xs font-medium text-[#1A1F16]/40 mt-2">Are you sure you want to proceed with <span className="text-[#1A1F16] font-black uppercase tracking-widest">{actionPopup.type}</span>?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleAction} className="py-4 bg-[#1A1F16] text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg">Confirm</button>
              <button onClick={() => setActionPopup({ id: null, type: null })} className="py-4 bg-[#F8FAF5] text-[#1A1F16] border border-[#A4B494]/10 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-[#A4B494]/5 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
