"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  ArrowUpRight, 
  MoreVertical,
  Eye,
  Check,
  X,
  Trash2,
  PlaneTakeoff,
  AlertCircle
} from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth`;

export default function LeaveRequestsDashboard() {
  const [filters, setFilters] = useState({ student: "", status: "", date: "" });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionPopup, setActionPopup] = useState({ id: null, type: null });
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      toast.error("Fetch failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/leave-stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });
      setStats([
        { label: "Total Requests", value: res.data.totalRequests, icon: <ClipboardList />, color: "bg-blue-50 text-blue-600" },
        { label: "Pending", value: res.data.pendingRequests, icon: <Clock />, color: "bg-amber-50 text-amber-600" },
        { label: "Approved", value: res.data.approvedRequests, icon: <CheckCircle2 />, color: "bg-emerald-50 text-emerald-600" },
        { label: "Rejected", value: res.data.rejectedRequests, icon: <XCircle />, color: "bg-red-50 text-red-600" },
      ]);
    } catch (err) {
      toast.error("Stats failed.");
    }
  };

  const handleAction = async () => {
    const { id, type } = actionPopup;
    try {
      if (type === "delete") {
        await axios.delete(`${API_BASE}/leave/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
        });
        toast.success("Leave purged.");
      } else {
        await axios.put(
          `${API_BASE}/${id}/status`,
          { status: type },
          { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
        );
        toast.success(`Leave ${type}.`);
      }
      setActionPopup({ id: null, type: null });
      fetchFilteredLeaves();
      fetchStats();
    } catch (err) {
      toast.error("Action failed.");
    }
  };

  const clearFilters = () => {
    setFilters({ student: "", status: "", date: "" });
    toast.success("Filters reset.");
  };

  useEffect(() => {
    fetchFilteredLeaves();
    fetchStats();
  }, [filters]);

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Excursion Log</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Management & Records Terminal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E]" />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={filters.student}
              onChange={(e) => setFilters({...filters, student: e.target.value})}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all"
            />
          </div>
          <button onClick={clearFilters} className="p-4 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16]/40 hover:text-[#1A1F16] transition-all shadow-sm group">
            <Filter className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 flex flex-col items-center gap-6 group hover:-translate-y-2 transition-all">
            <div className={`w-16 h-16 rounded-[24px] ${stat.color} flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6`}>
              {React.cloneElement(stat.icon, { size: 32 })}
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-[#1A1F16] tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">
        <div className="flex border-b border-[#7A8B5E]/5 bg-[#F8FAF5]/50">
          <div className="flex-1 px-10 py-6">
            <h3 className="text-sm font-black text-[#1A1F16] uppercase tracking-[0.2em]">Deployment Queue</h3>
          </div>
          <div className="flex gap-4 px-10 items-center">
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="bg-transparent text-[10px] font-black uppercase tracking-widest text-[#7A8B5E] outline-none"
            >
              <option value="">Status: All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/10">
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Resident</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Timeline</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Classification</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Directives</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((req, i) => (
                <tr key={i} className="border-b border-[#7A8B5E]/5 hover:bg-[#F8FAF5] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F8FAF5] rounded-2xl flex items-center justify-center text-[#7A8B5E] font-black text-xs border border-[#7A8B5E]/10 shadow-inner">
                        {req.studentId?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#1A1F16] tracking-tight">{req.studentId?.firstName} {req.studentId?.lastName}</p>
                        <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60">{req.studentId?.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-[#1A1F16] flex items-center gap-2 italic"><Calendar size={12} className="text-[#7A8B5E]" /> {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-3 py-1 bg-[#F8FAF5] border border-[#7A8B5E]/10 text-[#7A8B5E] rounded-lg text-[10px] font-black uppercase tracking-widest">{req.leaveType}</span>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      req.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                      req.status === "approved" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      "bg-red-50 text-red-600 border-red-100"
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedLeave(req)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm">
                        <Eye size={18} />
                      </button>
                      {req.status === "pending" ? (
                        <>
                          <button onClick={() => setActionPopup({ id: req._id, type: "approved" })} className="p-3 bg-[#1A1F16] text-white rounded-2xl hover:bg-[#2A3324] transition-all shadow-lg">
                            <Check size={18} />
                          </button>
                          <button onClick={() => setActionPopup({ id: req._id, type: "rejected" })} className="p-3 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition-all shadow-sm">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setActionPopup({ id: req._id, type: "delete" })} className="p-3 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaveRequests.length === 0 && (
            <div className="py-32 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#7A8B5E]/10">
                <PlaneTakeoff size={40} />
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">No Active Leave Cycles</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {Math.ceil(leaveRequests.length / itemsPerPage) > 1 && (
          <div className="p-10 border-t border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/30">
            <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, leaveRequests.length)} of {leaveRequests.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl disabled:opacity-20"
              >
                <X size={14} className="rotate-45" />
              </button>
              <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-widest px-4">{currentPage} / {Math.ceil(leaveRequests.length / itemsPerPage)}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(leaveRequests.length / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(leaveRequests.length / itemsPerPage)}
                className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl disabled:opacity-20"
              >
                <Check size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#1A1F16]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl border border-[#7A8B5E]/10 animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 shadow-sm">
                  <PlaneTakeoff size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1A1F16] italic uppercase tracking-tight">Authorization Check</h2>
                  <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">Movement Verification</p>
                </div>
              </div>
              <button onClick={() => setSelectedLeave(null)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="flex items-center gap-6 p-6 bg-[#F8FAF5] rounded-[32px] border border-[#7A8B5E]/10">
                <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center text-2xl font-black text-[#7A8B5E] border border-[#7A8B5E]/5">
                  {selectedLeave.studentId?.firstName?.charAt(0)}
                </div>
                <div>
                  <p className="text-xl font-black text-[#1A1F16] uppercase italic tracking-tight">{selectedLeave.studentId?.firstName} {selectedLeave.studentId?.lastName}</p>
                  <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Resident ID: {selectedLeave.studentId?.studentId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Departure</p>
                  <div className="bg-[#F8FAF5] p-5 rounded-2xl border border-[#7A8B5E]/5 font-bold text-[#1A1F16]">{new Date(selectedLeave.startDate).toDateString()}</div>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Arrival</p>
                  <div className="bg-[#F8FAF5] p-5 rounded-2xl border border-[#7A8B5E]/5 font-bold text-[#1A1F16]">{new Date(selectedLeave.endDate).toDateString()}</div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Stated Objective</p>
                <div className="bg-[#F8FAF5] p-6 rounded-[32px] border border-[#7A8B5E]/10 text-sm text-[#1A1F16]/70 leading-relaxed italic">
                  "{selectedLeave.reason || "No objective stated."}"
                </div>
              </div>
            </div>

            <div className="p-10 bg-[#F8FAF5]/50 border-t border-[#7A8B5E]/5 flex justify-end gap-4">
              <button onClick={() => setSelectedLeave(null)} className="px-8 py-4 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1A1F16]/40 hover:text-[#1A1F16] transition-all">Dismiss</button>
              {selectedLeave.status === "pending" && (
                <button 
                  onClick={() => { setActionPopup({ id: selectedLeave._id, type: "approved" }); setSelectedLeave(null); }}
                  className="px-8 py-4 bg-[#1A1F16] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-black transition-all"
                >
                  Authorize Leave
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {actionPopup.id && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#1A1F16]/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border border-[#7A8B5E]/20 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-[#F8FAF5] rounded-[32px] flex items-center justify-center text-[#7A8B5E] mx-auto mb-8 border border-[#7A8B5E]/10">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-[#1A1F16] italic uppercase tracking-tight mb-4">Confirm Action</h2>
            <p className="text-sm text-[#7A8B5E] font-medium leading-relaxed mb-10">Are you certain you wish to mark this request as <span className="font-black text-[#1A1F16] uppercase tracking-widest">{actionPopup.type}</span>? This decision will be logged permanently.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActionPopup({ id: null, type: null })} className="px-6 py-4 bg-[#F8FAF5] text-[#1A1F16]/40 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-[#1A1F16] transition-all">Cancel</button>
              <button onClick={handleAction} className="px-6 py-4 bg-[#1A1F16] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-black transition-all">Proceed</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
