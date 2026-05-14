"use client";

import React, { useState, useEffect } from "react";
import {
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
  Users2,
} from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

// ── Stat Card ────────────────────────────────────────────────────────────────
const PremiumStatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[32px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 flex flex-col items-center gap-4 group hover:-translate-y-1 transition-all">
    <div className={`w-14 h-14 rounded-[20px] ${color} flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="text-center">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-3xl font-black text-[#1A1F16] tracking-tight">{value}</h3>
    </div>
  </div>
);

// ── Form Input ───────────────────────────────────────────────────────────────
const PremiumInput = ({ label, value, onChange, icon, placeholder, type = "text", name }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest ml-4">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7A8B5E]/30 group-focus-within:text-[#7A8B5E] transition-colors">
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-[20px] py-4 pl-14 pr-6 text-sm font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all placeholder:text-[#7A8B5E]/30"
      />
    </div>
  </div>
);

// ── Mobile Personnel Card ────────────────────────────────────────────────────
const PersonnelCard = ({ item, activeTab, onView, onDelete }) => (
  <div className="bg-white rounded-2xl border border-[#7A8B5E]/10 shadow-md p-5 space-y-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-[#F8FAF5] rounded-xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10">
          <Users2 size={20} />
        </div>
        <div>
          <p className="text-sm font-black text-[#1A1F16]">{item.name}</p>
          <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60">
            {item.wardenId || item.staffId || "ADMIN-001"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        On Duty
      </div>
    </div>

    {/* Details grid */}
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-[#F8FAF5] rounded-xl p-3">
        <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest mb-1">Contact</p>
        <p className="text-xs font-bold text-[#1A1F16] flex items-center gap-1">
          <Phone size={10} className="text-[#7A8B5E]" />
          {item.contactNumber || "—"}
        </p>
      </div>
      <div className="bg-[#F8FAF5] rounded-xl p-3">
        <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest mb-1">Role</p>
        <p className="text-xs font-bold text-[#1A1F16]">
          {item.designation || (activeTab === "warden" ? "Warden" : "Operational")}
        </p>
      </div>
      <div className="bg-[#F8FAF5] rounded-xl p-3 col-span-2">
        <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest mb-1">Email</p>
        <p className="text-xs font-bold text-[#1A1F16] flex items-center gap-1">
          <Mail size={10} className="text-[#7A8B5E]" />
          {item.email || item.emailId || "—"}
        </p>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-2 pt-1">
      <button
        onClick={() => onView(item)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-xl text-xs font-black text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all"
      >
        <Eye size={14} /> View
      </button>
      <button
        onClick={() => onDelete(item)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs font-black text-red-500 hover:bg-red-500 hover:text-white transition-all"
      >
        <Trash2 size={14} /> Remove
      </button>
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
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

  const handleView = (item) => {
    toast(`${item.name} — ${item.email || item.emailId || "No email"}`, { icon: "👤" });
  };

  const handleDelete = (item) => {
    toast.error(`Remove ${item.name}? (not yet wired)`, { icon: "🗑️" });
  };

  const filteredItems = (activeTab === "warden" ? wardens : staffs).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.wardenId || item.staffId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-4 md:p-8 space-y-8">
      <Toaster position="top-right" />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-[#7A8B5E] rounded-full shadow-lg" />
          <div>
            <h1 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">
              Personnel Command
            </h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.25em] mt-1">
              Staff Unit & Administrative Registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E] transition-colors" />
            <input
              type="text"
              placeholder="Search personnel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all"
            />
          </div>
          {/* Commission Button */}
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-5 py-3.5 bg-[#1A1F16] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all whitespace-nowrap"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Commission Staff</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PremiumStatCard label="Total Wardens" value={wardens.length} icon={<ShieldCheck />} color="bg-blue-50 text-blue-600" />
        <PremiumStatCard label="Active Staff" value={staffs.length} icon={<Users2 />} color="bg-emerald-50 text-emerald-600" />
        <PremiumStatCard label="On-Shift" value={Math.floor(staffs.length * 0.7)} icon={<UserCog />} color="bg-amber-50 text-amber-600" />
        <PremiumStatCard label="System Status" value="Secure" icon={<ShieldCheck />} color="bg-purple-50 text-purple-600" />
      </div>

      {/* ── Tab Container ── */}
      <div className="bg-white rounded-[32px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">

        {/* Tab Buttons */}
        <div className="flex border-b border-[#7A8B5E]/5 bg-[#F8FAF5]/50">
          {[
            { key: "warden", label: "Wardens" },
            { key: "staff", label: "Staff" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                activeTab === tab.key
                  ? "border-[#7A8B5E] text-[#1A1F16] bg-white/50"
                  : "border-transparent text-[#1A1F16]/30 hover:text-[#1A1F16]/60"
              }`}
            >
              {/* Short label on mobile, full on desktop */}
              <span className="sm:hidden">{tab.label}</span>
              <span className="hidden sm:inline">
                {tab.key === "warden" ? "Administrative Wardens" : "Operational Staff"}
              </span>
            </button>
          ))}
        </div>

        {/* ── MOBILE: Card List ── */}
        <div className="block lg:hidden p-4 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center">
              <Users2 className="mx-auto mb-4 text-[#7A8B5E]/20" size={48} />
              <p className="text-sm font-black text-[#1A1F16]/30 uppercase tracking-widest">No personnel found</p>
            </div>
          ) : (
            filteredItems.map((item, i) => (
              <PersonnelCard
                key={i}
                item={item}
                activeTab={activeTab}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* ── DESKTOP: Table ── */}
        <div className="hidden lg:block">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col style={{ width: "28%" }} />
              <col style={{ width: "26%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <thead>
              <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/10">
                {["Personnel Record", "Contact Node", "Designated Role", "Deployment", "Action"].map(h => (
                  <th key={h} className="px-8 py-5 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <Users2 className="mx-auto mb-4 text-[#7A8B5E]/20" size={48} />
                    <p className="text-sm font-black text-[#1A1F16]/30 uppercase tracking-widest">No personnel found</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, i) => (
                  <tr key={i} className="border-b border-[#7A8B5E]/5 hover:bg-[#F8FAF5] transition-colors group">
                    {/* Name */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-[#F8FAF5] rounded-xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 group-hover:bg-[#7A8B5E] group-hover:text-white transition-all shadow-sm shrink-0">
                          <Users2 size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#1A1F16] truncate">{item.name}</p>
                          <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60 truncate">
                            {item.wardenId || item.staffId || "ADMIN-001"}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-8 py-6">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1A1F16] flex items-center gap-1.5 truncate">
                          <Phone size={10} className="text-[#7A8B5E] shrink-0" />
                          {item.contactNumber || "—"}
                        </p>
                        <p className="text-[10px] font-medium text-[#7A8B5E] opacity-70 truncate mt-0.5">
                          {item.email || item.emailId || "—"}
                        </p>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-[0.1em] bg-[#F8FAF5] px-3 py-1.5 rounded-lg border border-[#7A8B5E]/10 whitespace-nowrap">
                        {item.designation || (activeTab === "warden" ? "Warden" : "Operational")}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        On Duty
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2.5 bg-white border border-[#7A8B5E]/10 rounded-xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2.5 bg-white border border-red-100 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Registration Modal ── */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#1A1F16]/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-[#7A8B5E]/10">

            {/* Modal Header */}
            <div className="px-7 py-6 border-b border-[#7A8B5E]/5 flex justify-between items-start bg-[#F8FAF5]/50 shrink-0">
              <div>
                <h2 className="text-xl font-black text-[#1A1F16] italic uppercase tracking-tight">
                  Personnel Commissioning
                </h2>
                <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">
                  Enroll new {activeTab} into service
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2.5 bg-white border border-[#7A8B5E]/10 rounded-xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm shrink-0 ml-4"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab switcher inside modal */}
            <div className="flex border-b border-[#7A8B5E]/5 shrink-0">
              {["warden", "staff"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                    activeTab === tab
                      ? "border-[#7A8B5E] text-[#1A1F16]"
                      : "border-transparent text-[#1A1F16]/30 hover:text-[#1A1F16]/60"
                  }`}
                >
                  {tab === "warden" ? "Warden" : "Staff"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <PremiumInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} icon={<Users2 />} placeholder="John" />
                <PremiumInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} icon={<Users2 />} placeholder="Doe" />
                <PremiumInput label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} icon={<Phone />} placeholder="+91 00000 00000" />
                <PremiumInput label="Email" name="emailId" value={formData.emailId} onChange={handleInputChange} icon={<Mail />} placeholder="john@example.com" />

                {activeTab === "warden" ? (
                  <div className="sm:col-span-2">
                    <PremiumInput label="Administrative ID" name="wardenId" value={formData.wardenId} onChange={handleInputChange} icon={<ShieldCheck />} placeholder="W-786-XX" />
                  </div>
                ) : (
                  <>
                    <div className="sm:col-span-2">
                      <PremiumInput label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} icon={<UserCog />} placeholder="Staff Role" />
                    </div>
                    <PremiumInput label="Shift Start" name="shiftStart" value={formData.shiftStart} onChange={handleInputChange} icon={<ChevronRight />} type="time" />
                    <PremiumInput label="Shift End" name="shiftEnd" value={formData.shiftEnd} onChange={handleInputChange} icon={<ChevronRight />} type="time" />
                  </>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1F16] text-white py-5 rounded-[20px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <><UserPlus size={16} /> Confirm Commissioning</>
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