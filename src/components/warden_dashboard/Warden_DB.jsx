"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Bed, 
  ClipboardCheck, 
  Clock, 
  AlertCircle, 
  Calendar,
  ChevronRight,
  Plus,
  Search,
  Bell,
  ArrowUpRight,
  Layout,
  Home,
  FileText,
  Activity,
  ShieldCheck,
  TrendingUp,
  MapPin
} from "lucide-react";

export default function WardenDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBeds: 0,
    inUseBeds: 0,
    availableBeds: 0,
    damagedBeds: 0,
    upcomingInspections: [],
    pendingLeavesCount: 0,
    inProgressComplaintsCount: 0,
    pendingRequisitionsCount: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/warden-dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAF5]">
        <div className="w-12 h-12 border-4 border-[#7A8B5E]/20 border-t-[#7A8B5E] rounded-full animate-spin"></div>
        <p className="mt-6 text-[#7A8B5E] font-black text-[10px] tracking-[0.2em] uppercase animate-pulse">Synchronizing Data</p>
      </div>
    );
  }

  const occupancyRate = Math.round((stats.inUseBeds / stats.totalBeds) * 100) || 0;

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 bg-[#F8FAF5] min-h-screen font-sans animate-in fade-in duration-700">
      
      {/* ── Top Navigation Bar ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg shadow-[#7A8B5E]/20"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Command Center</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Hostel Administration Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E] transition-colors" />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-[#1A1F16] focus:outline-none focus:border-[#7A8B5E] focus:ring-4 focus:ring-[#7A8B5E]/5 transition-all placeholder:text-gray-300"
            />
          </div>
          <button className="p-4 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-[#F8FAF5] hover:border-[#7A8B5E] transition-all relative group shadow-sm">
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Left Column: Main Overview ── */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Welcome Premium Hero */}
          <section className="bg-[#1A1F16] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-black/10 group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-5 h-5 text-[#7A8B5E]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A8B5E]">Secure Session Active</span>
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tight italic">Welcome back, Warden.</h2>
              <p className="text-white/60 max-w-md leading-relaxed font-medium">
                The hostel ecosystem is performing optimally. You have <span className="text-white font-black underline decoration-[#7A8B5E] decoration-2 underline-offset-4">{stats.pendingLeavesCount} leave requests</span> and <span className="text-white font-black underline decoration-[#7A8B5E] decoration-2 underline-offset-4">{stats.inProgressComplaintsCount} complaints</span> requiring authorization.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-10">
                <button 
                  onClick={() => router.push('/warden-leave')}
                  className="px-8 py-4 bg-[#7A8B5E] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#8B9D6E] transition-all shadow-xl shadow-[#7A8B5E]/20 active:scale-95 flex items-center gap-2"
                >
                  <Activity size={14} /> Review Leaves
                </button>
                <button 
                  onClick={() => router.push('/complaint')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <AlertCircle size={14} /> Manage Desk
                </button>
              </div>
            </div>
            
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#7A8B5E]/10 rounded-full -mr-48 -mt-48 blur-[100px] group-hover:bg-[#7A8B5E]/20 transition-colors duration-1000"></div>
            <Layout className="absolute -bottom-20 -right-20 w-80 h-80 text-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-1000" />
          </section>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricCard label="Total Residents" value={stats.totalStudents} icon={<Users />} color="bg-blue-50 text-blue-600" />
            <MetricCard label="Active Leaves" value={stats.pendingLeavesCount} icon={<Clock />} color="bg-purple-50 text-purple-600" />
            <MetricCard label="Support Desk" value={stats.inProgressComplaintsCount} icon={<AlertCircle />} color="bg-amber-50 text-amber-600" />
            <MetricCard label="Free Units" value={stats.availableBeds} icon={<Bed />} color="bg-emerald-50 text-emerald-600" />
          </div>

          {/* Inventory & Capacity Analysis */}
          <div className="bg-white p-10 rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-black text-[#1A1F16] uppercase tracking-[0.2em] text-xs mb-1">Asset Management</h3>
                  <h4 className="text-xl font-black text-[#1A1F16] italic tracking-tight uppercase">Bed Inventory</h4>
                </div>
                <button 
                  onClick={() => router.push('/inventory')}
                  className="p-3 bg-[#F8FAF5] rounded-xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all group"
                >
                  <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-10">
                <InventoryItem label="Occupied" value={stats.inUseBeds} dot="bg-[#1A1F16]" />
                <InventoryItem label="Available" value={stats.availableBeds} dot="bg-[#7A8B5E]" />
                <InventoryItem label="Maintenance" value={stats.damagedBeds} dot="bg-red-400" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Occupancy Efficiency</span>
                  <span className="text-lg font-black text-[#1A1F16]">{occupancyRate}%</span>
                </div>
                <div className="h-4 w-full bg-[#F8FAF5] rounded-full overflow-hidden p-1 border border-[#7A8B5E]/5">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1A1F16] to-[#7A8B5E] rounded-full transition-all duration-1000 ease-out shadow-sm" 
                    style={{ width: `${occupancyRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-64 bg-[#F8FAF5]/50 rounded-[32px] p-8 flex flex-col justify-between border border-[#7A8B5E]/5">
               <div className="space-y-6">
                  <QuickLink icon={<FileText />} label="Bed Allotment" onClick={() => router.push('/bedallotment')} />
                  <QuickLink icon={<Users />} label="Staff Roster" onClick={() => router.push('/staffallotment')} />
               </div>
               <div className="mt-8 pt-8 border-t border-[#7A8B5E]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7A8B5E]/20 flex items-center justify-center text-[#7A8B5E]">
                      <TrendingUp size={18} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1F16]">Real-time Analytics</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Task Management ── */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          
          <div className="bg-white border border-[#7A8B5E]/10 rounded-[40px] p-10 shadow-xl shadow-[#7A8B5E]/5 flex-1 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h4 className="font-black text-[#7A8B5E] uppercase tracking-[0.2em] text-[10px] mb-1">Schedule</h4>
                  <h3 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic">Operations Log</h3>
                </div>
                <div className="p-3 bg-[#F8FAF5] rounded-2xl text-[#1A1F16]">
                  <Calendar size={20} />
                </div>
              </div>
              
              <div className="space-y-8">
                {stats.upcomingInspections.length > 0 ? (
                  stats.upcomingInspections.slice(0, 4).map((inspection, idx) => (
                    <div key={idx} className="flex gap-5 group cursor-pointer" onClick={() => router.push('/inspection')}>
                      <div className="shrink-0 w-12 h-12 bg-[#F8FAF5] rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#7A8B5E] group-hover:text-white transition-all shadow-sm">
                        <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 border-b border-[#F8FAF5] pb-4 group-last:border-0">
                        <div className="flex justify-between items-start">
                          <h5 className="text-sm font-black text-[#1A1F16] group-hover:text-[#7A8B5E] transition-colors uppercase tracking-tight">{inspection.title}</h5>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#7A8B5E] group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-2 tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B5E]"></span>
                          {new Date(inspection.datetime).toLocaleDateString([], { day: 'numeric', month: 'short' })} • {inspection.area}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#7A8B5E]/20">
                      <ClipboardCheck size={32} />
                    </div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">No Pending Tasks</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => router.push('/inspection')}
                className="w-full mt-12 py-5 bg-[#1A1F16] text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#2A3324] transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/20 group"
              >
                Launch Field App <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </button>
            </div>
            
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#7A8B5E]/5 rounded-full blur-3xl"></div>
          </div>

          {/* Quick Stats Summary Footer */}
          <div className="bg-[#7A8B5E] rounded-[32px] p-8 text-white flex items-center justify-between shadow-xl shadow-[#7A8B5E]/10 overflow-hidden relative">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Global Health</p>
              <h4 className="text-xl font-black italic">Operational</h4>
            </div>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-[#7A8B5E]/5 shadow-xl shadow-[#7A8B5E]/5 flex flex-col items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#7A8B5E]/10 group">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center transition-transform group-hover:rotate-6 shadow-sm`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">{label}</p>
        <p className="text-2xl font-black text-[#1A1F16] mt-1">{value}</p>
      </div>
    </div>
  );
}

function InventoryItem({ label, value, dot }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${dot}`}></div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-2xl font-black text-[#1A1F16]">{value}</p>
    </div>
  );
}

function QuickLink({ icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-[#7A8B5E]/5 hover:border-[#7A8B5E] hover:shadow-lg transition-all group shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="text-[#7A8B5E] group-hover:scale-110 transition-transform">
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <span className="text-xs font-black text-[#1A1F16] uppercase tracking-tight">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#7A8B5E] transition-colors" />
    </button>
  );
}

