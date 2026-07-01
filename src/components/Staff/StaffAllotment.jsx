"use client";

import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Clock,
  Eye,
  X,
  Users,
  Shield,
  Sparkles,
  MoreHorizontal,
  Sun,
  Moon,
  Filter,
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  CreditCard,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;

const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      const ampm = h < 12 ? 'AM' : 'PM';
      const h12 = h % 12 || 12;
      const display = `${h12.toString().padStart(2, '0')}:${mm} ${ampm}`;
      options.push({ value: `${hh}:${mm}`, display });
    }
  }
  return options;
};

const StaffAllotment = () => {
  // ── activeTab removed; we only deal with 'staff' ──
  const [activeFilter, setActiveFilter] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    wardenId: "",
    contactNumber: "",
    emailId: "",
    designation: "",
    otherDesignation: "",
    shiftStart: "",
    shiftEnd: "",
    salary: "",
    aadharCard: null,
    panCard: null,
  });

  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    wardenId: "",
    contactNumber: "",
    emailId: "",
    designation: "",
    otherDesignation: "",
    shiftStart: "",
    shiftEnd: "",
    salary: "",
    aadharCard: null,
    panCard: null,
  });

  const [staffs, setStaffs] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    fetchStaffs();
  }, [refresh]);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  const fetchStaffs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/staffauth/all`);
      const formattedData = response.data.staffs.map((staff) => ({
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        name: `${staff.firstName} ${staff.lastName}`,
        email: staff.email,
        contactNumber: staff.contactNumber,
        designation: staff.designation,
        shiftStart: staff.shiftStart,
        shiftEnd: staff.shiftEnd,
        salary: staff.salary || 0,
        status: staff.status || 'Approved',
        isAddedToBiometric: staff.isAddedToBiometric,
        aadharCard: staff.aadharCard,
        panCard: staff.panCard,
      }));
      setStaffs(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleEditFileChange = (e) => {
    const { name, files } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setActiveFilter(null);
    setFormData({
      firstName: "",
      lastName: "",
      wardenId: "",
      contactNumber: "",
      emailId: "",
      designation: "",
      otherDesignation: "",
      shiftStart: "",
      shiftEnd: "",
      salary: "",
      aadharCard: null,
      panCard: null,
    });
  };

  const handleFilterClick = (key) => {
    setActiveFilter((prev) => (prev === key ? null : key));
  };

  const getShiftType = (shiftStart) => {
    if (!shiftStart) return null;
    const h = parseInt(shiftStart.split(":")[0]);
    return h >= 6 && h < 18 ? "morning" : "night";
  };

// ── Staff stats ───────────────────────────────────────────────
const staffStats = [
  {
    key: "all",
    label: "Total Staff",
    value: staffs.length,
    sub: "All registered",
    icon: (
      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
        <Users size={18} className="text-blue-500" />
      </div>
    ),
    badge: "All",
    badgeClass: "bg-blue-50 text-blue-600",
    border: "border-blue-200",
    ring: "ring-blue-200",
  },
  {
    key: "Watchman",
    label: "Watchmen",
    value: staffs.filter((s) => s.designation === "Watchman").length,
    sub: "Security",
    icon: (
      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
        <Shield size={18} className="text-green-500" />
      </div>
    ),
    badge: "Security",
    badgeClass: "bg-green-50 text-green-600",
    border: "border-green-200",
    ring: "ring-green-200",
  },
  {
    key: "Cleaner",
    label: "Cleaners",
    value: staffs.filter((s) => s.designation === "Cleaner").length,
    sub: "Housekeeping",
    icon: (
      <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
        <Sparkles size={18} className="text-yellow-500" />
      </div>
    ),
    badge: "Cleaning",
    badgeClass: "bg-yellow-50 text-yellow-600",
    border: "border-yellow-200",
    ring: "ring-yellow-200",
  },
  {
    key: "Other",
    label: "Others",
    value: staffs.filter((s) => s.designation === "Other").length,
    sub: "Misc. roles",
    icon: (
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
        <MoreHorizontal size={18} className="text-gray-500" />
      </div>
    ),
    badge: "Other",
    badgeClass: "bg-gray-100 text-gray-600",
    border: "border-gray-200",
    ring: "ring-gray-200",
  },
];

  const currentStats = staffStats;

  // ── Filtered lists ────────────────────────────────────────────
  const filteredStaffs =
    activeFilter && activeFilter !== "all" && activeFilter !== "staff_count"
      ? staffs.filter((s) => s.designation === activeFilter)
      : staffs;

  // ── Register handlers ─────────────────────────────────────────
  

  const handleRegisterStaff = async () => {
    try {
      const payload = new FormData();
      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("email", formData.emailId);
      payload.append("contactNumber", formData.contactNumber);
      payload.append("designation", formData.designation === "Other" ? formData.otherDesignation : formData.designation);
      payload.append("shiftStart", formData.shiftStart);
      payload.append("shiftEnd", formData.shiftEnd);
      payload.append("salary", Number(formData.salary));
      
      if (formData.aadharCard) {
        payload.append("aadharCard", formData.aadharCard);
      }
      if (formData.panCard) {
        payload.append("panCard", formData.panCard);
      }

      const response = await axios.post(
        `${BASE_URL}/api/wardenauth/register-staff`,
        payload,
        { 
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("wardenToken")}`
          } 
        }
      );
      setSuccessMsg(response.data.message);
      setRefresh((prev) => prev + 1);
      setFormData({
        firstName: "", lastName: "", wardenId: "", contactNumber: "",
        emailId: "", designation: "", otherDesignation: "", shiftStart: "", shiftEnd: "", salary: "",
        aadharCard: null, panCard: null
      });
    } catch (error) {
      console.error(error);
      setSuccessMsg(error.response?.data?.message || "Error registering staff");
    }
  };

  // ── View / Edit / Delete ──────────────────────────────────────
  

  

  const handleEditStaff = (staff) => {
    setSelectedId(staff.id);
    setEditFormData({
      firstName: staff.firstName, lastName: staff.lastName,
      contactNumber: staff.contactNumber, emailId: staff.email,
      designation: staff.designation, shiftStart: staff.shiftStart, shiftEnd: staff.shiftEnd, salary: staff.salary,
    });
    setShowEditModal(true);
  };

  const handleUpdateWarden = async () => {
    try {
      const payload = new FormData();
      payload.append("firstName", editFormData.firstName);
      payload.append("lastName", editFormData.lastName);
      payload.append("email", editFormData.emailId);
      payload.append("contactNumber", editFormData.contactNumber);
      payload.append("wardenId", editFormData.wardenId);
      payload.append("salary", Number(editFormData.salary));

      if (editFormData.aadharCard) {
        payload.append("aadharCard", editFormData.aadharCard);
      }
      if (editFormData.panCard) {
        payload.append("panCard", editFormData.panCard);
      }

      await axios.put(`${BASE_URL}/api/wardenauth/update/${selectedId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("Warden updated successfully");
      setRefresh((prev) => prev + 1);
      setShowEditModal(false);
    } catch (error) { console.error(error); }
  };

  const handleUpdateStaff = async () => {
    try {
      const payload = new FormData();
      payload.append("firstName", editFormData.firstName);
      payload.append("lastName", editFormData.lastName);
      payload.append("email", editFormData.emailId);
      payload.append("contactNumber", editFormData.contactNumber);
      payload.append("designation", editFormData.designation === "Other" ? editFormData.otherDesignation : editFormData.designation);
      payload.append("shiftStart", editFormData.shiftStart);
      payload.append("shiftEnd", editFormData.shiftEnd);
      payload.append("salary", Number(editFormData.salary));

      if (editFormData.aadharCard) {
        payload.append("aadharCard", editFormData.aadharCard);
      }
      if (editFormData.panCard) {
        payload.append("panCard", editFormData.panCard);
      }

      await axios.put(`${BASE_URL}/api/staffauth/update/${selectedId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("Staff updated successfully");
      setRefresh((prev) => prev + 1);
      setShowEditModal(false);
    } catch (error) { console.error(error); }
  };

  
  const confirmDeleteWarden = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/wardenauth/delete/${selectedId}`);
      setRefresh((prev) => prev + 1);
      setSuccessMsg("Warden deleted successfully");
    } catch (error) { console.error(error); }
    setShowDeleteModal(false);
  };

  const handleDeleteStaff = (id) => { setSelectedId(id); setShowDeleteModal(true); };
  const confirmDeleteStaff = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/staffauth/delete/${selectedId}`);
      setRefresh((prev) => prev + 1);
      setSuccessMsg("Staff deleted successfully");
    } catch (error) { console.error(error); }
    setShowDeleteModal(false);
  };

  // ── Designation badge ─────────────────────────────────────────
  const DesignationBadge = ({ designation }) => {
    const styles = {
      Watchman: "bg-blue-50 text-blue-700 border border-blue-200",
      Cleaner: "bg-green-50 text-green-700 border border-green-200",
      Other: "bg-amber-50 text-amber-700 border border-amber-200",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[designation] || "bg-gray-100 text-gray-600"}`}>
        {designation}
      </span>
    );
  };

  // ── Shift pill ────────────────────────────────────────────────
  const ShiftPill = ({ shiftStart, shiftEnd }) => {
    const type = getShiftType(shiftStart);
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium
        ${type === "morning" ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"}`}>
        {type === "morning" ? <Sun size={11} /> : <Moon size={11} />}
        {shiftStart} – {shiftEnd}
      </span>
    );
  };

  // ── Active filter label ───────────────────────────────────────
  const filterLabel = activeFilter === "all" ? "All"
    : activeFilter === "active" ? "Active wardens"
    : activeFilter === "staff_count" ? "All staff"
    : activeFilter;

  return (
    <div className="flex-1 bg-white p-4 sm:p-6 mt-5">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-[4px] h-6 bg-[#4F8CCF] mr-3" />
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Staff Allotment</h1>
        </div>
      </div>


      {/* ── STATS CARDS ──────────────────────────────────────── */}
      <div className={`grid gap-3 mb-4 grid-cols-2 sm:grid-cols-4`}>
        {currentStats.map((stat) => {
          const isActive = activeFilter === stat.key;
          return (
            <button
              key={stat.key}
              onClick={() => handleFilterClick(stat.key)}
              className={`relative text-left p-4 rounded-xl border transition-all duration-150
                ${isActive
                  ? "border-[#4F8CCF] bg-[#E6F1FB] shadow-sm"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
            >
              {isActive && (
                <span className="absolute top-2 right-2 bg-[#4F8CCF] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
              <div className={`flex items-center gap-1.5 text-xs mb-1.5 font-medium
                ${isActive ? "text-[#185FA5]" : "text-gray-500"}`}>
                {stat.icon}
                {stat.label}
              </div>
              <div className={`text-2xl font-semibold leading-none
                ${isActive ? "text-[#185FA5]" : "text-gray-900"}`}>
                {stat.value}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">{stat.sub}</div>
            </button>
          );
        })}
      </div>

      {/* Active filter bar */}
      {activeFilter && (
        <div className="flex items-center gap-2 bg-[#BEC5AD]/20 border border-[#BEC5AD] rounded-lg px-4 py-2 mb-4 text-sm text-gray-600">
          <Filter size={13} className="text-[#4F8CCF]" />
          Showing: <span className="font-semibold text-gray-800">{filterLabel}</span>
          <button
            onClick={() => setActiveFilter(null)}
            className="ml-auto flex items-center gap-1 text-xs border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-100 transition-colors"
          >
            <X size={11} /> Clear
          </button>
        </div>
      )}

      {/* ── STAFF SECTION ────────────────────────────────────── */}
      <>
          <div className="bg-[#BEC5AD] rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Register New Staff</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                placeholder="First Name" className="w-full h-[45px] px-4 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] placeholder-gray-500" />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                placeholder="Last Name" className="w-full h-[45px] px-4 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] placeholder-gray-500" />
              <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange}
                placeholder="Contact Number" className="w-full h-[45px] px-4 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] placeholder-gray-500" />
              <input type="email" name="emailId" value={formData.emailId} onChange={handleInputChange}
                placeholder="Email" className="w-full h-[45px] px-4 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] placeholder-gray-500" />
              <select name="designation" value={formData.designation} onChange={handleInputChange}
                className="w-full h-[45px] px-4 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] placeholder-gray-500 appearance-none">
                <option value="">Select Designation</option>
                <option value="Watchman">Watchman</option>
                <option value="Cleaner">Cleaner</option>
                <option value="Other">Other</option>
              </select>
              {formData.designation === "Other" && (
                <input type="text" name="otherDesignation" value={formData.otherDesignation}
                  onChange={handleInputChange} placeholder="Specify Designation"
                  className="w-full h-[45px] px-4 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] placeholder-gray-500" />
              )}
              <input type="number" name="salary" value={formData.salary} onChange={handleInputChange}
                placeholder="Salary Amount (₹)" className="w-full h-[45px] px-4 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] placeholder-gray-500" />
              <div className="flex gap-3">
                <div className="relative w-full">
                  <span className="absolute -top-2 left-2 bg-[#BEC5AD] px-1 text-[10px] text-gray-800 font-bold z-10">Start Time</span>
                  <input type="time" name="shiftStart" value={formData.shiftStart} onChange={handleInputChange} onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
                    className="w-full h-[45px] px-2 sm:px-3 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[13px] sm:text-[14px] cursor-pointer relative z-0" />
                </div>
                <div className="relative w-full">
                  <span className="absolute -top-2 left-2 bg-[#BEC5AD] px-1 text-[10px] text-gray-800 font-bold z-10">End Time</span>
                  <input type="time" name="shiftEnd" value={formData.shiftEnd} onChange={handleInputChange} onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
                    className="w-full h-[45px] px-2 sm:px-3 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[13px] sm:text-[14px] cursor-pointer relative z-0" />
                </div>
              </div>
              <div className="relative w-full">
                <span className="absolute -top-2 left-2 bg-[#BEC5AD] px-1 text-[10px] text-gray-800 font-bold z-10">Aadhar Card</span>
                <input type="file" name="aadharCard" onChange={handleFileChange}
                  className="w-full h-[45px] px-4 py-2 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#4F8CCF]/10 file:text-[#4F8CCF] hover:file:bg-[#4F8CCF]/20 cursor-pointer" accept="image/*,.pdf" />
              </div>
              <div className="relative w-full">
                <span className="absolute -top-2 left-2 bg-[#BEC5AD] px-1 text-[10px] text-gray-800 font-bold z-10">PAN Card</span>
                <input type="file" name="panCard" onChange={handleFileChange}
                  className="w-full h-[45px] px-4 py-2 bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border-0 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#4F8CCF]/10 file:text-[#4F8CCF] hover:file:bg-[#4F8CCF]/20 cursor-pointer" accept="image/*,.pdf" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button onClick={handleRegisterStaff} className="bg-white px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-sm hover:shadow-md active:scale-95">
                Register Staff
              </button>
            </div>
          </div>

          {/* Manage Staff */}
          <div className="bg-[#BEC5AD] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Manage Staff
                {activeFilter && activeFilter !== "all" && (
                  <span className="ml-2 text-base font-normal text-gray-700">— {filterLabel}s</span>
                )}
              </h2>
              <span className="text-sm text-gray-700 font-medium">
                {filteredStaffs.length} of {staffs.length}
              </span>
            </div>

            <div className="space-y-4">
              {filteredStaffs.map((staff) => (
                <div key={staff.id} className="bg-white rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1 flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base truncate max-w-full">{staff.name}</h3>
                      <DesignationBadge designation={staff.designation} />
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${staff.status === 'Pending' ? 'bg-orange-100 text-orange-600' : staff.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {staff.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{staff.email} | Salary: ₹{staff.salary} | Biometric: {staff.isAddedToBiometric ? "✅" : "❌"}</p>
                    <ShiftPill shiftStart={staff.shiftStart} shiftEnd={staff.shiftEnd} />
                  </div>
                  <div className="flex gap-4 shrink-0 mt-2 sm:mt-0 self-end sm:self-center">
                    <button onClick={() => { setSelectedStaff(staff); setShowViewModal(true); }} className="text-gray-500 hover:text-gray-800 transition-colors">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleEditStaff(staff)} className="text-gray-500 hover:text-gray-800 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteStaff(staff.id)} className="text-gray-500 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredStaffs.length === 0 && (
                <p className="text-center text-gray-600 py-6">No staff found in this category.</p>
              )}
            </div>
          </div>
        </>

      {/* ── SUCCESS TOAST ─────────────────────────────────────── */}
      {successMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-lg z-50 shadow-lg flex items-center gap-2">
          {successMsg}
        </div>
      )}

      {/* ── EDIT MODAL ────────────────────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                Edit Staff
              </h2>
              <button onClick={() => setShowEditModal(false)}><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" name="firstName" value={editFormData.firstName} onChange={handleEditInputChange}
                placeholder="First Name" className="w-full h-[45px] px-4 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px]" />
              <input type="text" name="lastName" value={editFormData.lastName} onChange={handleEditInputChange}
                placeholder="Last Name" className="w-full h-[45px] px-4 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px]" />
              <input type="text" name="contactNumber" value={editFormData.contactNumber} onChange={handleEditInputChange}
                placeholder="Contact Number" className="w-full h-[45px] px-4 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px]" />
              <input type="email" name="emailId" value={editFormData.emailId} onChange={handleEditInputChange}
                placeholder="Email" className="w-full h-[45px] px-4 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px]" />
              <input type="number" name="salary" value={editFormData.salary} onChange={handleEditInputChange}
                placeholder="Salary Amount (₹)" className="w-full h-[45px] px-4 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px]" />
                <>
                  <select name="designation" value={editFormData.designation} onChange={handleEditInputChange}
                    className="w-full h-[45px] px-4 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] appearance-none">
                    <option value="">Select</option>
                    <option value="Watchman">Watchman</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Other">Other</option>
                  </select>
                  {editFormData.designation === "Other" && (
                    <input type="text" name="otherDesignation" value={editFormData.otherDesignation}
                      onChange={handleEditInputChange} placeholder="Specify Designation"
                      className="w-full h-[45px] px-4 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px]" />
                  )}
                  <div className="flex gap-3">
                    <div className="relative w-full">
                      <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 font-bold z-10">Start Time</span>
                      <input type="time" name="shiftStart" value={editFormData.shiftStart} onChange={handleEditInputChange} onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
                        className="w-full h-[45px] px-2 sm:px-3 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[13px] sm:text-[14px] cursor-pointer relative z-0" />
                    </div>
                    <div className="relative w-full">
                      <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 font-bold z-10">End Time</span>
                      <input type="time" name="shiftEnd" value={editFormData.shiftEnd} onChange={handleEditInputChange} onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }}
                        className="w-full h-[45px] px-2 sm:px-3 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[13px] sm:text-[14px] cursor-pointer relative z-0" />
                    </div>
                  </div>
                </>
              <div className="relative w-full">
                <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 font-bold z-10">Update Aadhar Card</span>
                <input type="file" name="aadharCard" onChange={handleEditFileChange}
                  className="w-full h-[45px] px-4 py-2 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#4F8CCF]/10 file:text-[#4F8CCF] hover:file:bg-[#4F8CCF]/20 cursor-pointer" accept="image/*,.pdf" />
              </div>
              <div className="relative w-full">
                <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-gray-500 font-bold z-10">Update PAN Card</span>
                <input type="file" name="panCard" onChange={handleEditFileChange}
                  className="w-full h-[45px] px-4 py-2 bg-gray-50 rounded-[10px] border border-gray-200 outline-none focus:ring-2 focus:ring-[#4F8CCF]/50 transition-all text-black font-medium text-[14px] file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#4F8CCF]/10 file:text-[#4F8CCF] hover:file:bg-[#4F8CCF]/20 cursor-pointer" accept="image/*,.pdf" />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleUpdateStaff}
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ─────────────────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">
            <h2 className="text-xl font-bold text-center mb-5">
              Delete Staff?
            </h2>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={confirmDeleteStaff}
                className="px-5 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW MODAL ───────────────────────────────────────── */}
      {showViewModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#BEC5AD] to-[#A0A88D] px-6 py-5 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <User size={100} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 relative z-10">
                <ShieldCheck size={24} className="text-white" />
                Staff Details
              </h2>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-600 hover:text-white bg-white/30 hover:bg-black/20 p-1.5 rounded-full transition-all relative z-10"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="px-6 py-6 bg-gray-50 flex-1">
              {/* Profile Overview */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="w-16 h-16 rounded-full bg-[#4F8CCF]/10 flex items-center justify-center text-[#4F8CCF] shadow-inner text-2xl font-bold">
                  {selectedStaff?.firstName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedStaff?.firstName} {selectedStaff?.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-600 rounded-md">
                      {selectedStaff?.designation || 'Staff'}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 ${selectedStaff?.isAddedToBiometric ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {selectedStaff?.isAddedToBiometric ? <><CheckCircle size={12}/> Biometric Linked</> : <><AlertCircle size={12}/> Biometric Pending</>}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><Mail size={14}/> Email Address</div>
                  <div className="text-sm font-semibold text-gray-900 break-all">{selectedStaff?.email || 'N/A'}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><Phone size={14}/> Contact Number</div>
                  <div className="text-sm font-semibold text-gray-900">{selectedStaff?.contactNumber || 'N/A'}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><CreditCard size={14}/> Salary</div>
                  <div className="text-sm font-semibold text-green-600">₹{selectedStaff?.salary ? selectedStaff.salary.toLocaleString('en-IN') : '0'}</div>
                </div>

                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><Clock size={14}/> Shift Timing</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedStaff?.shiftStart && selectedStaff?.shiftEnd 
                        ? `${selectedStaff.shiftStart} - ${selectedStaff.shiftEnd}` 
                        : 'Not Assigned'}
                    </div>
                  </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><Shield size={14}/> Aadhar Card</div>
                  {selectedStaff?.aadharCard ? (
                    <a href={`${BASE_URL}/${selectedStaff.aadharCard}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#4F8CCF] hover:underline">View Document</a>
                  ) : (
                    <div className="text-sm font-semibold text-gray-400 italic">Not Uploaded</div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1.5"><CreditCard size={14}/> PAN Card</div>
                  {selectedStaff?.panCard ? (
                    <a href={`${BASE_URL}/${selectedStaff.panCard}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#4F8CCF] hover:underline">View Document</a>
                  ) : (
                    <div className="text-sm font-semibold text-gray-400 italic">Not Uploaded</div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white px-6 py-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAllotment;