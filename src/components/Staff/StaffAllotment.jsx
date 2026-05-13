"use client";

import React, { useState, useEffect } from "react";
import { 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  UserPlus, 
  ShieldCheck, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  UserCog,
  ChevronRight,
  Loader2,
  Users2
} from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const PremiumStatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 flex flex-col items-center gap-6 group hover:-translate-y-2 transition-all">
    <div className={`w-16 h-16 rounded-[24px] ${color} flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6`}>
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <div className="text-center">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <h3 className="text-3xl font-black text-[#1A1F16] tracking-tight">{value}</h3>
    </div>
  </div>
);

const PremiumInput = ({ label, value, onChange, icon, placeholder, type = "text", name }) => (
  <div className="space-y-3 group">
    <label className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest ml-4">{label}</label>
    <div className="relative">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7A8B5E]/30 group-focus-within:text-[#7A8B5E] transition-colors">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-[24px] py-5 pl-16 pr-8 text-sm font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all placeholder:text-[#7A8B5E]/30"
      />
    </div>
  </div>
);

const StaffAllotment = () => {
  const [activeTab, setActiveTab] = useState("warden");
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", wardenId: "", contactNumber: "", emailId: "",
    designation: "", otherDesignation: "", shiftStart: "", shiftEnd: "",
  });
  const [wardens, setWardens] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_PROD_API_URL || "http://localhost:5224";

  useEffect(() => {
    fetchWardens();
    fetchStaffs();
  }, []);

  const fetchWardens = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/wardenauth/all`);
      setWardens(res.data.wardens.map(w => ({ ...w, id: w._id || w.id, name: `${w.firstName} ${w.lastName}` })));
    } catch (e) { console.error("Warden Fetch Error", e); }
  };

  const fetchStaffs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/staffauth/all`);
      setStaffs(res.data.staffs.map(s => ({ ...s, id: s._id, name: `${s.firstName} ${s.lastName}` })));
    } catch (e) { console.error("Staff Fetch Error", e); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isWarden = activeTab === "warden";
      const endpoint = isWarden ? "/api/adminauth/register-warden" : "/api/staffauth/register-staff";
      const payload = isWarden 
        ? { firstName: formData.firstName, lastName: formData.lastName, email: formData.emailId, contactNumber: formData.contactNumber, wardenId: formData.wardenId }
        : { firstName: formData.firstName, lastName: formData.lastName, email: formData.emailId, contactNumber: formData.contactNumber, designation: formData.designation === "Other" ? formData.otherDesignation : formData.designation, shiftStart: formData.shiftStart, shiftEnd: formData.shiftEnd };

      await axios.post(`${API_BASE}${endpoint}`, payload);
      toast.success(`${isWarden ? "Warden" : "Staff"} commissioned successfully.`);
      isWarden ? fetchWardens() : fetchStaffs();
      setShowRegisterModal(false);
      setFormData({ firstName: "", lastName: "", wardenId: "", contactNumber: "", emailId: "", designation: "", otherDesignation: "", shiftStart: "", shiftEnd: "" });
    } catch (e) {
      toast.error(e.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = (activeTab === "warden" ? wardens : staffs).filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (item.wardenId || item.staffId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Personnel Command</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Staff Unit & Administrative Registry</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E]" />
            <input 
              type="text" 
              placeholder="Search personnel logs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowRegisterModal(true)}
            className="px-8 py-4 bg-[#1A1F16] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Commission Staff
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumStatCard label="Total Wardens" value={wardens.length} icon={<ShieldCheck />} color="bg-blue-50 text-blue-600" />
        <PremiumStatCard label="Active Staff" value={staffs.length} icon={<Users2 />} color="bg-emerald-50 text-emerald-600" />
        <PremiumStatCard label="On-Shift" value={Math.floor(staffs.length * 0.7)} icon={<UserCog />} color="bg-amber-50 text-amber-600" />
        <PremiumStatCard label="System Status" value="Secure" icon={<ShieldCheck />} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Tabbed View */}
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">
        <div className="flex border-b border-[#7A8B5E]/5 bg-[#F8FAF5]/50 overflow-x-auto no-scrollbar">
          {["warden", "staff"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[150px] py-6 text-[11px] font-black uppercase tracking-[0.25em] transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab ? "border-[#7A8B5E] text-[#1A1F16] bg-white/50" : "border-transparent text-[#1A1F16]/30 hover:text-[#1A1F16]/60"
              }`}
            >
              {tab === "warden" ? "Administrative Wardens" : "Operational Staff"}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/10">
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Personnel Record</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Contact Node</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Designated Role</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Deployment</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, i) => (
                <tr key={i} className="border-b border-[#7A8B5E]/5 hover:bg-[#F8FAF5] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F8FAF5] rounded-2xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 group-hover:bg-[#7A8B5E] group-hover:text-white transition-all shadow-sm">
                        <Users2 size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-[#1A1F16] tracking-tight">{item.name}</span>
                        <span className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60">ID: {item.wardenId || item.staffId || 'ADMIN-001'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-[#1A1F16] flex items-center gap-2"><Phone size={10} className="text-[#7A8B5E]" /> {item.contactNumber}</span>
                      <span className="text-[10px] font-medium text-[#7A8B5E] lowercase tracking-tight opacity-70">{item.email || item.emailId}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-[0.15em] bg-[#F8FAF5] px-3 py-1 rounded-lg border border-[#7A8B5E]/10">
                      {item.designation || (activeTab === "warden" ? "Warden" : "Operational")}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2 text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      On Duty
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <button className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm">
                        <Eye size={18} />
                      </button>
                      <button className="p-3 bg-white border border-red-100 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#1A1F16]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#7A8B5E]/10 animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/50">
              <div>
                <h2 className="text-2xl font-black text-[#1A1F16] italic uppercase tracking-tight">Personnel Commissioning</h2>
                <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">Enroll new {activeTab} into service</p>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PremiumInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} icon={<Users2 />} placeholder="John" />
                <PremiumInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} icon={<Users2 />} placeholder="Doe" />
                <PremiumInput label="Contact Node" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} icon={<Phone />} placeholder="+91 00000 00000" />
                <PremiumInput label="Email Interface" name="emailId" value={formData.emailId} onChange={handleInputChange} icon={<Mail />} placeholder="john@example.com" />
                
                {activeTab === "warden" ? (
                  <div className="md:col-span-2">
                    <PremiumInput label="Administrative ID" name="wardenId" value={formData.wardenId} onChange={handleInputChange} icon={<ShieldCheck />} placeholder="W-786-XX" />
                  </div>
                ) : (
                  <>
                    <PremiumInput label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} icon={<UserCog />} placeholder="Staff Role" />
                    <div className="grid grid-cols-2 gap-4">
                      <PremiumInput label="Shift Start" name="shiftStart" value={formData.shiftStart} onChange={handleInputChange} icon={<ChevronRight />} type="time" />
                      <PremiumInput label="Shift End" name="shiftEnd" value={formData.shiftEnd} onChange={handleInputChange} icon={<ChevronRight />} type="time" />
                    </div>
                  </>
                )}
              </div>

              <div className="pt-6 border-t border-[#7A8B5E]/5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1F16] text-white py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                      <UserPlus size={18} /> Confirm Commissioning
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAllotment;