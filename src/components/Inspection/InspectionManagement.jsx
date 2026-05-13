"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { 
  ScanSearch, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  ShieldCheck, 
  MoreVertical,
  Eye,
  Trash2,
  Check,
  X,
  AlertCircle,
  Building,
  Target
} from "lucide-react";

const API_BASE = `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth`;

export default function InspectionManagement() {
  const [inspections, setInspections] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [filters, setFilters] = useState({ date: "", time: "", status: "", target: "" });
  const [roomOptions, setRoomOptions] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      toast.error("Fetch failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/inspection-stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });
      if (res.data.success) setStats(res.data.stats);
    } catch (err) {
      toast.error("Stats failed.");
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
      toast.error("Filter failed.");
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
      toast.error("Details failed.");
    }
  };

  const handleView = (item) => {
    fetchInspectionById(item._id);
  };

  const markComplete = async (id) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/recent-inspections/complete/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
      );
      if (res.data.success) {
        toast.success("Inspection verified.");
        fetchRecent();
        fetchStats();
      }
    } catch (err) {
      toast.error("Verification failed.");
    }
  };

  const deleteInspection = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/recent-inspections/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });
      if (res.data.success) {
        toast.success("Record purged.");
        fetchRecent();
        fetchStats();
      }
    } catch (err) {
      toast.error("Purge failed.");
    }
  };

  const clearFilters = () => {
    setFilters({ date: "", time: "", status: "", target: "" });
    toast.success("Filters reset.");
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
    <div className="min-h-screen bg-[#F8FAF5] p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Security Audit</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Management & Records Terminal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E]" />
            <input 
              type="text" 
              placeholder="Live search audits..." 
              value={filters.target}
              onChange={(e) => setFilters({...filters, target: e.target.value})}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all"
            />
          </div>
          <button onClick={clearFilters} className="p-4 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16]/40 hover:text-[#1A1F16] transition-all shadow-sm group">
            <Filter className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumStatCard label="Total Inspections" value={stats.total} icon={<ScanSearch />} color="bg-blue-50 text-blue-600" />
        <PremiumStatCard label="Pending Audit" value={stats.pending} icon={<Clock />} color="bg-amber-50 text-amber-600" />
        <PremiumStatCard label="Verified Logs" value={stats.completed} icon={<CheckCircle2 />} color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">
        <div className="p-8 md:p-10 border-b border-[#7A8B5E]/5 grid grid-cols-1 md:grid-cols-3 gap-8 bg-[#F8FAF5]/30">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Scheduled Date</label>
            <input 
              type="date" 
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Audit Status</label>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none appearance-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={clearFilters}
              className="w-full py-4 bg-[#1A1F16] text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
            >
              Reset Audit Filters
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/10">
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Audit Schedule</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Target Location</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Objective</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Compliance</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Directives</th>
              </tr>
            </thead>
            <tbody>
              {inspections
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((item, i) => (
                <tr key={i} className="border-b border-[#7A8B5E]/5 hover:bg-[#F8FAF5] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F8FAF5] rounded-xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 group-hover:bg-[#7A8B5E] group-hover:text-white transition-all">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#1A1F16] tracking-tight">{item.date}</p>
                        <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60">{item.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Building size={10} /> Room {item.target}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-black text-[#1A1F16] truncate italic max-w-xs">"{item.title}"</p>
                  </td>
                  <td className="px-10 py-8">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      item.status?.toLowerCase() === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {item.status?.toLowerCase() === "completed" ? <ShieldCheck size={10} /> : <Clock size={10} />}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleView(item)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm">
                        <Eye size={18} />
                      </button>
                      {item.status?.toLowerCase() === "pending" && (
                        <button onClick={() => markComplete(item._id)} className="p-3 bg-[#1A1F16] text-white rounded-2xl hover:bg-[#2A3324] transition-all shadow-lg">
                          <Check size={18} />
                        </button>
                      )}
                      <button onClick={() => deleteInspection(item._id)} className="p-3 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition-all shadow-sm">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {inspections.length === 0 && (
            <div className="py-32 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#7A8B5E]/10">
                <Target size={40} />
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">No Active Audit Cycles</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {Math.ceil(inspections.length / itemsPerPage) > 1 && (
          <div className="p-10 border-t border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/30">
            <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, inspections.length)} of {inspections.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl disabled:opacity-20"
              >
                <X size={14} className="rotate-45" />
              </button>
              <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-widest px-4">{currentPage} / {Math.ceil(inspections.length / itemsPerPage)}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(inspections.length / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(inspections.length / itemsPerPage)}
                className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl disabled:opacity-20"
              >
                <Check size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedInspection && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#1A1F16]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl border border-[#7A8B5E]/10 animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 shadow-sm">
                  <ScanSearch size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1A1F16] italic uppercase tracking-tight">Audit Findings</h2>
                  <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">Field Observation Dossier</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Target Location</p>
                  <div className="bg-[#F8FAF5] p-5 rounded-2xl border border-[#7A8B5E]/5 font-bold text-[#1A1F16] flex items-center gap-2"><Building size={16} className="text-[#7A8B5E]" /> Room {selectedInspection.target}</div>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Audit Area</p>
                  <div className="bg-[#F8FAF5] p-5 rounded-2xl border border-[#7A8B5E]/5 font-bold text-[#1A1F16] uppercase tracking-wider">{selectedInspection.area}</div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Inspection Directives</p>
                <div className="bg-[#F8FAF5] p-6 rounded-[32px] border border-[#7A8B5E]/10 text-sm text-[#1A1F16]/70 leading-relaxed italic">
                  "{selectedInspection.instructions || "No specific directives issued."}"
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-[#F8FAF5] rounded-3xl border border-[#7A8B5E]/5">
                <div>
                  <p className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest">Compliance Status</p>
                  <p className="text-lg font-black text-[#1A1F16] uppercase italic">{selectedInspection.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest">Verified At</p>
                  <p className="text-sm font-bold text-[#1A1F16]">{new Date(selectedInspection.datetime).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-[#F8FAF5]/50 border-t border-[#7A8B5E]/5 flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1A1F16]/40 hover:text-[#1A1F16] transition-all">Dismiss</button>
              {selectedInspection.status?.toLowerCase() === "pending" && (
                <button 
                  onClick={() => { markComplete(selectedInspection._id); setIsModalOpen(false); }}
                  className="px-8 py-4 bg-[#1A1F16] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-black transition-all"
                >
                  Verify Compliance
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PremiumStatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 flex flex-col items-center gap-6 group hover:-translate-y-2 transition-all">
      <div className={`w-16 h-16 rounded-[24px] ${color} flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6`}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-4xl font-black text-[#1A1F16] tracking-tight">{value}</p>
      </div>
    </div>
  );
}