"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, Toaster } from "react-hot-toast";
import { 
  FiEdit, 
  FiUpload, 
  FiTrash2, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiShield, 
  FiCalendar, 
  FiUsers, 
  FiClock, 
  FiAlertCircle,
  FiActivity,
  FiMapPin
} from "react-icons/fi";
import Image from 'next/image';

const WardenProfile = () => {
  const [warden, setWarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingLeaves: 0,
    activeComplaints: 0
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("wardenToken") : null;
  const decoded = token ? jwtDecode(token) : null;
  const wardenId = decoded?.id;

  useEffect(() => {
    const fetchData = async () => {
      if (!wardenId) return;
      try {
        setLoading(true);
        // 1. Fetch Profile
        const profileRes = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/profile/${wardenId}`);
        const data = profileRes.data;
        setWarden(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          contactNumber: data.contactNumber || "",
        });

        // 2. Fetch Dashboard Stats for the profile view
        const statsRes = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/warden-dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStats({
          totalStudents: statsRes.data.totalStudents || 0,
          pendingLeaves: statsRes.data.pendingLeavesCount || 0,
          activeComplaints: statsRes.data.inProgressComplaintsCount || 0
        });

      } catch (err) {
        console.error("Failed to fetch warden data", err);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [wardenId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.loading("Updating photo...", { id: 'photo' });
      const form = new FormData();
      form.append("profilePhoto", file);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/profile/${wardenId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setWarden(res.data.warden);
      toast.success("Profile photo updated", { id: 'photo' });
    } catch (error) {
      console.error("Photo upload error", error);
      toast.error("Failed to update photo", { id: 'photo' });
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/profile/${wardenId}`,
        formData
      );

      setWarden(res.data.warden);
      setShowModal(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update error", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAF5]">
      <div className="w-12 h-12 border-4 border-[#7A8B5E]/20 border-t-[#7A8B5E] rounded-full animate-spin"></div>
      <p className="mt-6 text-[#7A8B5E] font-black text-[10px] tracking-[0.2em] uppercase animate-pulse">Accessing Credentials</p>
    </div>
  );

  if (!warden) return null;

  return (
    <div className="min-h-screen bg-[#F8FAF5] pb-20 animate-in fade-in duration-700">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* ── Page Header ── */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg shadow-[#7A8B5E]/20"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Administrative Identity</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Official Warden Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── Left Column: Premium Profile Card ── */}
          <div className="lg:col-span-4">
            <div className="bg-[#1A1F16] rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl shadow-black/10 sticky top-10 overflow-hidden group">
              <div className="relative z-10">
                <div className="relative group/photo">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[40px] overflow-hidden border-4 border-[#7A8B5E]/20 shadow-2xl transition-transform duration-500 group-hover/photo:scale-[1.02] bg-[#2A3324]">
                    {warden.profilePhoto ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_PROD_API_URL}/uploads/wardens/${warden.profilePhoto}`}
                        alt="Warden Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-6xl">
                        <FiUser />
                      </div>
                    )}
                  </div>

                  {/* Photo Upload Trigger */}
                  <div className="absolute -bottom-3 -right-3">
                    <label className="w-14 h-14 bg-[#7A8B5E] text-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:bg-[#8B9D6E] transition-all hover:scale-110 active:scale-95 border-4 border-[#1A1F16]">
                      <FiUpload className="text-xl" />
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="mt-10">
                  <h2 className="text-3xl font-black text-white leading-tight italic tracking-tight">
                    {warden.firstName} <br /> {warden.lastName}
                  </h2>
                  <div className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">
                    <FiShield className="text-xs" /> ID: {warden.wardenId}
                  </div>
                </div>

                <div className="mt-10 w-full bg-white/5 border border-white/10 rounded-[32px] p-6 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">Authorization Status</p>
                      <p className="text-lg font-black text-white italic">Clearance Active</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#7A8B5E]/20 flex items-center justify-center text-[#7A8B5E]">
                      <FiActivity className="text-xl animate-pulse" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="mt-8 w-full bg-white text-[#1A1F16] px-8 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#F8FAF5] transition-all active:scale-95 shadow-xl shadow-black/20"
                >
                  <FiEdit size={16} /> Update Records
                </button>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#7A8B5E]/10 rounded-full blur-[100px]"></div>
            </div>
          </div>

          {/* ── Right Column: Stats & Data ── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Impact Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ProfileStat label="Active Residents" value={stats.totalStudents} icon={<FiUsers />} color="text-blue-600" bg="bg-blue-50" />
              <ProfileStat label="Pending Requests" value={stats.pendingLeaves} icon={<FiClock />} color="text-purple-600" bg="bg-purple-50" />
              <ProfileStat label="Open Tickets" value={stats.activeComplaints} icon={<FiAlertCircle />} color="text-amber-600" bg="bg-amber-50" />
            </div>

            {/* Official Credentials Card */}
            <div className="bg-white rounded-[40px] p-10 border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.3em] mb-1">Personnel File</h3>
                  <h4 className="text-2xl font-black text-[#1A1F16] italic uppercase tracking-tight">Verified Details</h4>
                </div>
                <div className="p-4 bg-[#F8FAF5] rounded-3xl text-[#1A1F16] border border-[#7A8B5E]/5">
                  <FiShield size={24} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <InfoRow icon={<FiMail />} label="Communication" value={warden.email} />
                <InfoRow icon={<FiPhone />} label="Verified Line" value={warden.contactNumber} />
                <InfoRow icon={<FiShield />} label="Administrative Rank" value="Senior Hostel Warden" />
                <InfoRow icon={<FiCalendar />} label="Enlistment Date" value={warden.createdAt ? new Date(warden.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'} />
              </div>

              {/* Security Seal Decor */}
              <FiShield className="absolute -bottom-12 -right-12 text-[200px] text-[#7A8B5E]/5 rotate-12 pointer-events-none" />
            </div>

            {/* Role Responsibilities */}
            <div className="bg-gradient-to-br from-[#7A8B5E]/10 to-transparent border border-[#7A8B5E]/10 rounded-[40px] p-10 relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-[#7A8B5E] shrink-0">
                    <FiMapPin size={32} />
                  </div>
                  <div>
                    <h4 className="text-[#1A1F16] font-black uppercase tracking-[0.2em] text-xs mb-3">Duty Protocol</h4>
                    <p className="text-[#1A1F16]/60 text-sm leading-relaxed max-w-xl font-medium">
                      Maintaining institutional integrity through vigilant oversight. Responsible for student safety, residential discipline, and real-time administrative response.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Premium Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A1F16]/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-xl p-10 relative animate-in fade-in zoom-in-95 duration-300 border border-[#7A8B5E]/10 shadow-2xl">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-3xl font-black text-[#1A1F16] italic uppercase tracking-tight">Edit Profile</h2>
                <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">Update administrative records</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-[#F8FAF5] flex items-center justify-center text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-colors">
                <FiTrash2 />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <ModernInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} icon={<FiUser />} />
                <ModernInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} icon={<FiUser />} />
              </div>
              <ModernInput label="Official Email" name="email" value={formData.email} onChange={handleInputChange} type="email" icon={<FiMail />} />
              <ModernInput label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} icon={<FiPhone />} />
            </div>

            <div className="flex gap-4 mt-12">
              <button onClick={() => setShowModal(false)} className="flex-1 px-8 py-5 rounded-[24px] bg-[#F8FAF5] text-[#1A1F16] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all">Dismiss</button>
              <button onClick={handleSubmit} className="flex-1 px-8 py-5 rounded-[24px] bg-[#7A8B5E] text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#8B9D6E] transition-all shadow-xl shadow-[#7A8B5E]/20">Confirm Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function ProfileStat({ label, value, icon, color, bg }) {
  return (
    <div className={`bg-white p-8 rounded-[32px] border border-[#7A8B5E]/10 flex flex-col items-center justify-center text-center shadow-xl shadow-[#7A8B5E]/5 transition-transform hover:scale-[1.02] group`}>
      <div className={`mb-4 w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-black ${color} tracking-tight`}>{value}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-5">
      <div className="mt-1 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F8FAF5] text-[#7A8B5E] border border-[#7A8B5E]/5 shadow-sm">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</p>
        <p className="text-sm font-black text-[#1A1F16] break-all">{value || 'N/A'}</p>
      </div>
    </div>
  );
}

function ModernInput({ label, name, value, onChange, icon, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="block text-[9px] font-black text-[#7A8B5E] uppercase tracking-[0.3em] ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E] transition-colors">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-[20px] pl-14 pr-6 py-5 text-sm font-black text-[#1A1F16] focus:border-[#7A8B5E] focus:ring-4 focus:ring-[#7A8B5E]/5 transition-all outline-none"
        />
      </div>
    </div>
  );
}

export default WardenProfile;

