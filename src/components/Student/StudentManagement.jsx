"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
<<<<<<< HEAD
import { toast, Toaster } from "react-hot-toast";
import api from "@/lib/api";
import Tesseract from "tesseract.js";
import {
  Users2, UserCheck, UserMinus, PlaneTakeoff, Search, Plus, Filter, X,
  Camera, CheckCircle2, AlertCircle, ChevronRight, MoreVertical, Edit3, Eye,
  Calendar, CreditCard, Mail, Phone, ShieldCheck, Building, Activity,
  ArrowUpRight, Trash2, ChevronLeft, LogOut, UserX
} from "lucide-react";

// ─── OCR Helpers ─────────────────────────────────────────────────────────────

const extractAadharInfo = (text) => {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  let firstName = "", lastName = "", dob = "", aadharNumber = "", mobileNumber = "";
  const dobRegex = /DOB[:\s]*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i;
  for (const line of lines) {
    const m = line.match(dobRegex);
    if (m) { dob = m[1].replace(/\//g, "-"); break; }
  }
  const aadharRegex = /(\d{4}\s*\d{4}\s*\d{4})/;
  for (const line of lines) {
    const m = line.match(aadharRegex);
    if (m && m[1].replace(/\s/g, "").length === 12) { aadharNumber = m[1].replace(/\s/g, ""); break; }
  }
  const mobileRegex = /(?:Mobile\s*No\.?[:\s]*)?([6-9]\d{9})(?!\d)/i;
  for (const line of lines) {
    if (/\d{4}\s*\d{4}\s*\d{4}/.test(line)) continue;
    const m = line.match(mobileRegex);
    if (m && m[1].length === 10) { mobileNumber = m[1]; break; }
  }
  let dobIdx = lines.findIndex((l) => /DOB/i.test(l));
  if (dobIdx > 0) {
    for (let i = dobIdx - 1; i >= Math.max(0, dobIdx - 3); i--) {
      const line = lines[i];
      const lc = line.toLowerCase();
      if (lc.includes("government") || lc.includes("india") || /\d{4}\s*\d{4}\s*\d{4}/.test(line) || line.length < 4) continue;
      const words = line.split(/\s+/).filter((w) => w.length > 1);
      if (words.length >= 2 && words.length <= 4) {
        const alphaRatio = (line.match(/[a-zA-Z]/g) || []).length / line.replace(/\s/g, "").length;
        const proper = words.every((w) => /^[A-Z]/.test(w));
        if (alphaRatio > 0.85 && proper && !/[:\-_]/.test(line)) {
          firstName = words[0]; lastName = words.length === 2 ? words[1] : words[words.length - 1]; break;
        }
      }
    }
  }
  return { firstName, lastName, dob, aadharNumber, mobileNumber };
};

const extractPanInfo = (text) => {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  let name = "", panNumber = "", dob = "";
  const ni = lines.findIndex((l) => l.toLowerCase().includes("name"));
  if (ni !== -1 && lines[ni + 1]) name = lines[ni + 1];
  for (const line of lines) { const m = line.match(/([A-Z]{5}\d{4}[A-Z])/); if (m) { panNumber = m[1]; break; } }
  for (const line of lines) { const m = line.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/); if (m) { dob = m[1].replace(/\//g, "-"); break; } }
  return { name, dob, panNumber };
};

const getTodaysDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PremiumInput({ label, value, onChange, icon, error, placeholder, type = "text" }) {
  return (
    <div className="space-y-2 group">
      <div className="flex justify-between items-center px-1">
        <label className="text-[9px] font-bold uppercase text-[#7A8B5E] tracking-wider ml-2">{label}</label>
        {error && <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10}/> {error}</span>}
      </div>
      <div className={`relative flex items-center bg-[#F8FAF5] border rounded-2xl transition-all duration-300 ${error ? 'border-red-200' : 'border-[#7A8B5E]/10 group-focus-within:border-[#7A8B5E]/40 group-focus-within:shadow-lg group-focus-within:shadow-[#7A8B5E]/5'}`}>
        <div className="absolute left-4 text-[#7A8B5E] opacity-40 group-focus-within:opacity-100 transition-opacity">
          {React.cloneElement(icon, { size: 16 })}
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent pl-10 pr-4 py-4 text-sm font-bold text-[#1A1F16] placeholder:text-[#1A1F16]/20 outline-none"
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Active": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "On Duty": "bg-blue-50 text-blue-600 border-blue-100",
    "On Leave": "bg-amber-50 text-amber-600 border-amber-100",
    "Checked Out": "bg-rose-50 text-rose-600 border-rose-100",
    "Pending": "bg-orange-50 text-orange-600 border-orange-100 animate-pulse",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border whitespace-nowrap ${styles[status] || "bg-gray-50 text-gray-600 border-gray-100"}`}>
      {status}
    </span>
  );
}

function PremiumStatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#7A8B5E]/10 shadow-sm hover:shadow-xl hover:shadow-[#7A8B5E]/5 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} transition-colors group-hover:scale-110 duration-300`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-[#F8FAF5] rounded-full border border-[#7A8B5E]/5">
          <Activity size={9} className="text-[#7A8B5E]" />
          <span className="text-[8px] font-bold text-[#7A8B5E] uppercase tracking-widest">Live</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-[#1A1F16] italic tracking-tight">{value}</h3>
      <p className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity">{label}</p>
    </div>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider ml-1">{label}</p>
      <div className="p-3 bg-white border border-[#7A8B5E]/5 rounded-xl flex items-center gap-2 shadow-sm hover:border-[#7A8B5E]/20 transition-all">
        <div className="text-[#7A8B5E] opacity-40">{React.cloneElement(icon, { size: 14 })}</div>
        <p className="text-xs font-bold text-[#1A1F16] truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Person Row Card (replaces wide table row) ───────────────────────────────

function PersonRow({ item, activeTab, onView, onDelete }) {
  const name = item.studentName || `${item.firstName || ''} ${item.lastName || ''}`.trim();
  const id = item.studentId || item.staffId || item.parentId || '—';
  const contact = item.contactNumber || '—';
  const email = item.email || '—';
  const role = item.designation || item.relation || (activeTab === "students" ? "Resident" : "Official");
  const status = item.status || (activeTab === "parents" ? "Active" : "On Duty");
  const profileSrc = item.profileImage || item.profilePhoto
    ? `${process.env.NEXT_PUBLIC_PROD_API_URL}${item.profileImage || '/uploads/wardens/' + item.profilePhoto}`
    : null;

  return (
    <div className="flex items-center gap-4 px-4 py-4 bg-white border border-[#7A8B5E]/8 rounded-2xl hover:border-[#7A8B5E]/25 hover:shadow-md transition-all group">
      {/* Avatar */}
      <div className="w-10 h-10 shrink-0 bg-[#F8FAF5] rounded-xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 group-hover:bg-[#7A8B5E] group-hover:text-white transition-all overflow-hidden shadow-sm">
        {profileSrc ? <img src={profileSrc} className="w-full h-full object-cover" alt="" /> : <Users2 size={16} />}
      </div>

      {/* Name + ID */}
      <div className="min-w-0 flex-[2]">
        <p className="text-sm font-bold text-[#1A1F16] truncate">{name}</p>
        <p className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider opacity-60 truncate">ID: {id}</p>
      </div>

      {/* Contact — hidden on small */}
      <div className="hidden md:flex flex-col flex-[2] min-w-0">
        <span className="text-[11px] font-bold text-[#1A1F16] flex items-center gap-1.5 truncate">
          <Phone size={9} className="text-[#7A8B5E] shrink-0" />{contact}
        </span>
        <span className="text-[10px] text-[#7A8B5E] opacity-70 truncate">{email}</span>
      </div>

      {/* Role */}
      <div className="hidden lg:block flex-[1]">
        <span className="text-[9px] font-bold text-[#1A1F16] uppercase tracking-[0.1em] bg-[#F8FAF5] px-2.5 py-1 rounded-lg border border-[#7A8B5E]/10 whitespace-nowrap">{role}</span>
      </div>

      {/* Status */}
      <div className="flex-[1] flex justify-center">
        <StatusBadge status={status} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onView(item)} className="p-2 bg-white border border-[#7A8B5E]/10 rounded-xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm">
          <Eye size={15} />
        </button>
        <button onClick={() => onDelete(item)} className="p-2 bg-white border border-red-100 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Intern Row Card ──────────────────────────────────────────────────────────

function InternRow({ item, onView }) {
  const name = item.studentName || `${item.firstName || ''} ${item.lastName || ''}`.trim();
  const id = item.studentId || item.staffId || '—';
  const room = item.roomNo ? `Room ${item.roomNo}` : 'N/A';
  const fee = item.monthlyFee || '7,000';
  const contact = item.contactNumber || 'N/A';
  const feeStatus = item.feeStatus || 'Unpaid';
  const dues = item.dues || '0';

  return (
    <div className="flex items-center gap-3 px-4 py-4 bg-white/50 rounded-xl border border-black/5 hover:bg-white/80 transition-all">
      <div className="min-w-0 flex-[2]">
        <p className="text-sm font-bold text-[#1A1F16] truncate">{name}</p>
        <p className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider opacity-60">{id}</p>
      </div>
      <div className="hidden sm:block flex-[1] text-xs text-[#1A1F16] font-medium">{room}</div>
      <div className="hidden md:block flex-[1] text-xs text-[#1A1F16] font-medium">3 Bed</div>
      <div className="flex-[1] text-sm font-bold text-[#4F8CCF]">₹{fee}</div>
      <div className="hidden lg:block flex-[1] text-xs text-[#1A1F16]">{contact}</div>
      <div className="flex-[1]">
        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold text-white whitespace-nowrap ${feeStatus === 'Paid' ? 'bg-emerald-500' : 'bg-[#FF9900]'}`}>
          {feeStatus}
        </span>
      </div>
      <div className="hidden sm:block flex-[1] text-xs font-bold text-[#1A1F16]">₹{dues}/-</div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => onView(item)} className="p-2 bg-white rounded-lg border border-black/10 text-[#1A1F16] hover:bg-[#1A1F16] hover:text-white transition-all">
          <Eye size={14} />
        </button>
        <button onClick={() => onView(item)} className="p-2 bg-white rounded-lg border border-black/10 text-[#1A1F16] hover:bg-[#1A1F16] hover:text-white transition-all">
          <Edit3 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Registration Modal ───────────────────────────────────────────────────────

function RegistrationModal({ open, onClose, initialTab = "student", onSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  const [studentForm, setStudentForm] = useState({
    firstName: "", lastName: "", contactNumber: "", email: "",
    roomNumber: "", bedNumber: "", emergencyContactNumber: "",
    admissionDate: getTodaysDate(), emergencyContactName: "", feeStatus: "",
  });
  const [studentDocs, setStudentDocs] = useState({ aadharCard: null, panCard: null });
  const [studentErrors, setStudentErrors] = useState({});
  const [studentLoading, setStudentLoading] = useState(false);

  const [parentForm, setParentForm] = useState({ firstName: "", lastName: "", email: "", relation: "", contactNumber: "", studentId: "" });
  const [parentDocs, setParentDocs] = useState({ aadharCard: null, panCard: null });
  const [parentLoading, setParentLoading] = useState(false);

  const [workerForm, setWorkerForm] = useState({ firstName: "", lastName: "", email: "", contactNumber: "", studentId: "", designation: "" });
  const [workerDocs, setWorkerDocs] = useState({ aadharCard: null, panCard: null });
  const [workerLoading, setWorkerLoading] = useState(false);

  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableRoomNumbers, setAvailableRoomNumbers] = useState([]);
  const [studentsWithoutParents, setStudentsWithoutParents] = useState([]);

  useEffect(() => { setActiveTab(initialTab); }, [initialTab]);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const [bedsRes, roomsRes, swpRes] = await Promise.all([
          api.get("/api/adminauth/inventory/available-beds"),
          api.get("/api/adminauth/inventory/available-rooms"),
          api.get("/api/adminauth/students-without-parents"),
        ]);
        setAvailableRooms(bedsRes.data.availableBeds || []);
        setAvailableRoomNumbers(roomsRes.data.availableRooms || []);
        setStudentsWithoutParents(swpRes.data.students || []);
      } catch (e) { console.error(e); }
    };
    load();
  }, [open]);

  if (!open) return null;

  const processDoc = async (file, docType, formType) => {
    setOcrLoading(true); setOcrProgress(0);
    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => { if (m.status === "recognizing text") setOcrProgress(Math.round(m.progress * 100)); },
      });
      const info = docType === "aadhar" ? extractAadharInfo(result.data.text) : extractPanInfo(result.data.text);
      const setter = formType === "student" ? setStudentForm : formType === "parent" ? setParentForm : setWorkerForm;
      setter((prev) => ({ ...prev, firstName: info.firstName || prev.firstName, lastName: info.lastName || prev.lastName, contactNumber: info.mobileNumber || prev.contactNumber }));
      if (info.firstName) toast.success(`OCR: Detected ${info.firstName}`);
      else toast.error("OCR failed to detect name.");
    } catch { toast.error("OCR failed."); }
    finally { setOcrLoading(false); setOcrProgress(0); }
  };

  const handleDocUpload = async (e, docKey, formType) => {
    const file = e.target.files[0];
    if (!file) return;
    const setter = formType === "student" ? setStudentDocs : formType === "parent" ? setParentDocs : setWorkerDocs;
    setter((prev) => ({ ...prev, [docKey]: file }));
    await processDoc(file, docKey === "aadharCard" ? "aadhar" : "pan", formType);
  };

  const handleStudentSubmit = async () => {
    const errs = {};
    if (!studentForm.firstName.trim()) errs.firstName = "Required";
    if (!studentForm.lastName.trim()) errs.lastName = "Required";
    if (!studentForm.contactNumber.trim()) errs.contactNumber = "Required";
    if (!studentForm.email.trim()) errs.email = "Required";
    if (Object.keys(errs).length) { setStudentErrors(errs); return; }
    setStudentLoading(true);
    try {
      const fd = new FormData();
      Object.entries(studentForm).forEach(([k, v]) => fd.append(k, v));
      fd.append("roomBedNumber", studentForm.bedNumber || "Not Assigned");
      if (studentDocs.aadharCard) fd.append("aadharCard", studentDocs.aadharCard);
      if (studentDocs.panCard) fd.append("panCard", studentDocs.panCard);
      const res = await api.post("/api/wardenauth/register-student", fd);
      toast.success(`Registration request sent! ID: ${res.data.requisitionId || 'Pending'}.`);
      if (onSuccess) onSuccess();
    } catch (e) { toast.error("Registration failed."); }
    finally { setStudentLoading(false); }
  };

  const handleParentSubmit = async () => {
    setParentLoading(true);
    try {
      const fd = new FormData();
      Object.entries(parentForm).forEach(([k, v]) => fd.append(k, v));
      if (parentDocs.aadharCard) fd.append("aadharCard", parentDocs.aadharCard);
      if (parentDocs.panCard) fd.append("panCard", parentDocs.panCard);
      await api.post("/api/wardenauth/register-parent", fd);
      toast.success("Parent registration request sent to Admin for approval.");
      if (onSuccess) onSuccess();
    } catch (e) { toast.error("Parent registration failed."); }
    finally { setParentLoading(false); }
  };

  const handleWorkerSubmit = async () => {
    setWorkerLoading(true);
    try {
      const fd = new FormData();
      Object.entries(workerForm).forEach(([k, v]) => fd.append(k, v));
      if (workerDocs.aadharCard) fd.append("aadharCard", workerDocs.aadharCard);
      if (workerDocs.panCard) fd.append("panCard", workerDocs.panCard);
      const res = await api.post("/api/wardenauth/register-intern", fd);
      toast.success(`Intern registered! Request ID: ${res.data.requisitionId}`);
      if (onSuccess) onSuccess();
    } catch (e) { toast.error("Intern registration failed."); }
    finally { setWorkerLoading(false); }
  };

  const getBedsForRoom = (roomNumber) => roomNumber ? availableRooms.filter((b) => b.roomNo === roomNumber) : [];

  const DocUpload = ({ docKey, formType, docs }) => (
    <div className="space-y-1.5">
      <label className="text-[9px] font-bold uppercase text-[#7A8B5E] tracking-wider ml-1">
        {docKey === "aadharCard" ? "Aadhar Card (OCR)" : "PAN Card (OCR)"}
      </label>
      <label className="flex flex-col items-center justify-center w-full h-24 bg-white border-2 border-dashed border-[#7A8B5E]/20 rounded-2xl cursor-pointer hover:border-[#7A8B5E] transition-all group">
        <Camera className="mb-1.5 text-[#7A8B5E]/40 group-hover:text-[#7A8B5E]" size={20} />
        <span className="text-[9px] font-bold uppercase tracking-wider text-[#1A1F16]/30 group-hover:text-[#1A1F16] text-center px-2 truncate w-full text-center">
          {docs[docKey] ? docs[docKey].name : "Tap to Scan"}
        </span>
        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleDocUpload(e, docKey, formType)} />
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#1A1F16]/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#7A8B5E]/10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#1A1F16] italic uppercase tracking-tight">Personnel Registration</h2>
            <p className="text-[9px] text-[#7A8B5E] font-bold uppercase tracking-wider mt-0.5">Enroll new members into the system</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-[#7A8B5E]/10 rounded-xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
            <X size={18} />
          </button>
        </div>

        {/* Tab Nav */}
        <div className="flex bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/5 shrink-0">
          {["student", "parent", "worker"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === tab ? "border-[#7A8B5E] text-[#1A1F16] bg-white/50" : "border-transparent text-[#1A1F16]/30 hover:text-[#1A1F16]/60"}`}>
              {tab === "worker" ? "Intern" : tab}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {ocrLoading && (
            <div className="bg-[#7A8B5E]/5 border border-[#7A8B5E]/20 rounded-2xl p-4 animate-pulse">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider">Document Analysis Active</span>
                <span className="text-sm font-bold text-[#1A1F16]">{ocrProgress}%</span>
              </div>
              <div className="h-1.5 bg-[#7A8B5E]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#7A8B5E] transition-all duration-300" style={{ width: `${ocrProgress}%` }}></div>
              </div>
            </div>
          )}

          {activeTab === "student" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <PremiumInput label="First Name" value={studentForm.firstName} onChange={(v) => setStudentForm({...studentForm, firstName: v})} icon={<Users2 />} error={studentErrors.firstName} placeholder="John" />
                <PremiumInput label="Last Name" value={studentForm.lastName} onChange={(v) => setStudentForm({...studentForm, lastName: v})} icon={<Users2 />} error={studentErrors.lastName} placeholder="Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F8FAF5] rounded-2xl border border-[#7A8B5E]/10">
                <DocUpload docKey="aadharCard" formType="student" docs={studentDocs} />
                <DocUpload docKey="panCard" formType="student" docs={studentDocs} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <PremiumInput label="Contact Number" value={studentForm.contactNumber} onChange={(v) => setStudentForm({...studentForm, contactNumber: v})} icon={<Phone />} placeholder="+91 00000 00000" />
                <PremiumInput label="Email Address" value={studentForm.email} onChange={(v) => setStudentForm({...studentForm, email: v})} icon={<Mail />} placeholder="john@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-[#7A8B5E] tracking-wider ml-1">Assigned Room</label>
                  <select value={studentForm.roomNumber} onChange={(e) => setStudentForm({...studentForm, roomNumber: e.target.value, bedNumber: ""})}
                    className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-xl px-4 py-4 text-sm font-bold text-[#1A1F16] outline-none focus:border-[#7A8B5E] transition-all appearance-none">
                    <option value="">Select Room</option>
                    {availableRoomNumbers.map(r => <option key={r._id} value={r._id}>Room {r._id} (Floor {r.floor})</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase text-[#7A8B5E] tracking-wider ml-1">Assigned Bed</label>
                  <select value={studentForm.bedNumber} onChange={(e) => setStudentForm({...studentForm, bedNumber: e.target.value})} disabled={!studentForm.roomNumber}
                    className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-xl px-4 py-4 text-sm font-bold text-[#1A1F16] outline-none focus:border-[#7A8B5E] transition-all appearance-none disabled:opacity-30">
                    <option value="">{studentForm.roomNumber ? "Select Bed" : "Select Room First"}</option>
                    {getBedsForRoom(studentForm.roomNumber).map(b => <option key={b._id} value={b._id}>{b.itemName}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <PremiumInput label="Guardian Name" value={studentForm.emergencyContactName} onChange={(v) => setStudentForm({...studentForm, emergencyContactName: v})} icon={<Users2 />} placeholder="Guardian Full Name" />
                <PremiumInput label="Guardian Contact" value={studentForm.emergencyContactNumber} onChange={(v) => setStudentForm({...studentForm, emergencyContactNumber: v})} icon={<Phone />} placeholder="Guardian Phone" />
              </div>
              <button onClick={handleStudentSubmit} disabled={studentLoading}
                className="w-full bg-[#1A1F16] text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-[#2A3324] transition-all disabled:opacity-20 flex items-center justify-center gap-2">
                {studentLoading ? <Activity className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                Complete Registration
              </button>
            </div>
          )}

          {activeTab === "parent" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <PremiumInput label="First Name" value={parentForm.firstName} onChange={(v) => setParentForm({...parentForm, firstName: v})} icon={<Users2 />} placeholder="First Name" />
                <PremiumInput label="Last Name" value={parentForm.lastName} onChange={(v) => setParentForm({...parentForm, lastName: v})} icon={<Users2 />} placeholder="Last Name" />
                <PremiumInput label="Email" value={parentForm.email} onChange={(v) => setParentForm({...parentForm, email: v})} icon={<Mail />} placeholder="Email Address" />
                <PremiumInput label="Contact" value={parentForm.contactNumber} onChange={(v) => setParentForm({...parentForm, contactNumber: v})} icon={<Phone />} placeholder="Phone Number" />
              </div>
              <PremiumInput label="Relationship" value={parentForm.relation} onChange={(v) => setParentForm({...parentForm, relation: v})} icon={<ShieldCheck />} placeholder="Father / Mother / Guardian" />
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase text-[#7A8B5E] tracking-wider ml-1">Link Student ID</label>
                <select value={parentForm.studentId} onChange={(e) => setParentForm({...parentForm, studentId: e.target.value})}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-xl px-4 py-4 text-sm font-bold text-[#1A1F16] outline-none focus:border-[#7A8B5E] transition-all appearance-none">
                  <option value="">Select Student</option>
                  {studentsWithoutParents.map(s => <option key={s.studentId} value={s.studentId}>{s.studentId} - {s.firstName} {s.lastName}</option>)}
                </select>
              </div>
              <button onClick={handleParentSubmit} disabled={parentLoading}
                className="w-full bg-[#1A1F16] text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-[#2A3324] transition-all">
                Confirm Parent Account
              </button>
            </div>
          )}

          {activeTab === "worker" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <PremiumInput label="First Name" value={workerForm.firstName} onChange={(v) => setWorkerForm({...workerForm, firstName: v})} icon={<Users2 />} placeholder="First Name" />
                <PremiumInput label="Last Name" value={workerForm.lastName} onChange={(v) => setWorkerForm({...workerForm, lastName: v})} icon={<Users2 />} placeholder="Last Name" />
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F8FAF5] rounded-2xl border border-[#7A8B5E]/10">
                <DocUpload docKey="aadharCard" formType="worker" docs={workerDocs} />
                <DocUpload docKey="panCard" formType="worker" docs={workerDocs} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <PremiumInput label="Contact Number" value={workerForm.contactNumber} onChange={(v) => setWorkerForm({...workerForm, contactNumber: v})} icon={<Phone />} placeholder="+91 00000 00000" />
                <PremiumInput label="Email Address" value={workerForm.email} onChange={(v) => setWorkerForm({...workerForm, email: v})} icon={<Mail />} placeholder="staff@example.com" />
                <PremiumInput label="Student ID" value={workerForm.studentId} onChange={(v) => setWorkerForm({...workerForm, studentId: v})} icon={<Users2 />} placeholder="S-101-XXX" />
                <PremiumInput label="Job Role" value={workerForm.designation} onChange={(v) => setWorkerForm({...workerForm, designation: v})} icon={<Search />} placeholder="Library Asst / Admin Intern" />
              </div>
              <button onClick={handleWorkerSubmit} disabled={workerLoading}
                className="w-full bg-[#1A1F16] text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-[#2A3324] transition-all">
                Register Student Intern
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Student Details Modal ────────────────────────────────────────────────────

function StudentDetailsModal({ item, open, onClose, type }) {
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  useEffect(() => {
    if (open && item && type === "student") {
      (async () => {
        setLoadingInvoices(true);
        try {
          const res = await api.get(`/api/wardenauth/invoices/student?studentId=${item.studentId}&limit=10`);
          setInvoices(res.data.invoices || []);
        } catch (e) { console.error(e); }
        finally { setLoadingInvoices(false); }
      })();
    } else { setInvoices([]); }
  }, [open, item, type]);

  if (!open || !item) return null;

  const name = item.studentName || `${item.firstName || ''} ${item.lastName || ''}`.trim();
  const profileSrc = item.profileImage || item.profilePhoto
    ? `${process.env.NEXT_PUBLIC_PROD_API_URL}${item.profileImage || '/uploads/wardens/' + item.profilePhoto}`
    : null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#1A1F16]/80 backdrop-blur-xl">
      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-[#7A8B5E]/10 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/50 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#1A1F16] italic uppercase tracking-tight">Record Dossier</h2>
            <p className="text-[9px] text-[#7A8B5E] font-bold uppercase tracking-wider mt-0.5">{type} profile verification</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-[#7A8B5E]/10 rounded-xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-center gap-4 p-4 bg-[#F8FAF5] rounded-2xl border border-[#7A8B5E]/10">
            <div className="w-16 h-16 shrink-0 bg-white rounded-2xl flex items-center justify-center text-[#7A8B5E] shadow-lg border border-white overflow-hidden">
              {profileSrc ? <img src={profileSrc} className="w-full h-full object-cover rounded-2xl" alt="" /> : <Users2 size={28} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1F16] uppercase italic tracking-tight">{name}</h3>
              <p className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider mt-1 opacity-60">
                ID: {item.studentId || item.staffId || item.parentId || 'UNASSIGNED'}
              </p>
              <div className="mt-2"><StatusBadge status={item.status || (type === "parent" ? "Active" : "On Duty")} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailItem label="Email" value={item.email || 'No Email Logged'} icon={<Mail />} />
            <DetailItem label="Contact" value={item.contactNumber || 'No Contact'} icon={<Phone />} />
            <DetailItem label="Role" value={item.designation || item.relation || (type === "student" ? "Resident" : "Official")} icon={<ShieldCheck />} />
            {type === "student" && <DetailItem label="Room" value={`Room ${item.roomNo || 'Pending'}`} icon={<Building />} />}
          </div>

          {type === "student" && (
            <div className="pt-4 border-t border-[#7A8B5E]/5">
              <p className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider mb-3">Financial Records (Last 10)</p>
              <div className="space-y-2">
                {loadingInvoices ? (
                  <p className="text-[10px] italic text-[#7A8B5E]">Accessing ledger...</p>
                ) : invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <div key={inv._id} className="flex justify-between items-center p-3 bg-[#F8FAF5] rounded-xl border border-[#7A8B5E]/5 hover:border-[#7A8B5E]/20 transition-all">
                      <div>
                        <span className="text-[10px] font-bold text-[#1A1F16] uppercase tracking-wider">{inv.invoiceType}</span>
                        <p className="text-[9px] text-[#7A8B5E]">{new Date(inv.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#1A1F16]">₹{inv.amount.toLocaleString()}</span>
                        <p className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 ${inv.status === 'paid' ? 'text-emerald-600' : 'text-rose-600'}`}>{inv.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-gray-400 italic">No financial records found.</p>
                )}
              </div>
            </div>
          )}

          {item.aadharCard && (
            <div className="pt-4 border-t border-[#7A8B5E]/5">
              <p className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider mb-3">Identification Documents</p>
              <div className="p-3 bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-xl flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-lg text-[#7A8B5E] shadow-sm"><ShieldCheck size={12} /></div>
                <span className="text-[10px] font-bold text-[#1A1F16] uppercase tracking-wider">Aadhar Verified</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 bg-[#F8FAF5]/50 border-t border-[#7A8B5E]/5 shrink-0">
          <button onClick={onClose} className="w-full py-3.5 bg-[#1A1F16] text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all">
            Dismiss Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudentManagementPage() {
=======
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentManagements from "./Management";

export default function StudentManagement() {
>>>>>>> parent of b475873 (feat: initialize warden dashboard and management modules with student OCR registration support)
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, onLeave: 0, checkedOut: 0 });
  const [filters, setFilters] = useState({ studentId: "", roomNo: "", status: "" });
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchCounts(); fetchParents(); fetchInterns(); }, []);
  useEffect(() => { fetchStudents(); setCurrentPage(1); }, [filters, activeTab]);
=======
  
  // New states for modal and tabs
  const [activeTab, setActiveTab] = useState("students"); // "students", "parents", or "workers"
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    fetchCounts();
    // Fetch parents only if the endpoint exists
    fetchParents().catch(() => {
      console.warn("Parents feature not available yet");
    });
    // Fetch workers
    fetchWorkers().catch(() => {
      console.warn("Workers feature not available yet");
    });
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [filters]);
>>>>>>> parent of b475873 (feat: initialize warden dashboard and management modules with student OCR registration support)

  const fetchCounts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students/count`);
      setCounts({
        total: res.data.totalStudents,
        active: res.data.activeStudents,
        onLeave: res.data.onLeaveStudents,
        checkedOut: res.data.checkedOutStudents || 0,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      const params = {};
      if (filters.studentId) params.studentId = filters.studentId;
      if (filters.roomNo) params.roomNo = filters.roomNo;
      if (filters.status) params.status = filters.status;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students`, { params });
      setStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchParents = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/parents`);
      setParents(res.data.parents || []);
    } catch (err) {
      console.error("Error fetching parents:", err);
      // If endpoint doesn't exist yet, set empty array
      if (err.response?.status === 404) {
        console.warn("Parents endpoint not implemented yet");
        setParents([]);
      }
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/workers`);
      setWorkers(res.data.workers || []);
<<<<<<< HEAD
    } catch (e) { setWorkers([]); }
  };

  const filteredItems = () => {
    const query = searchQuery.toLowerCase();
    if (activeTab === "students") return students.filter(s => s.studentId?.toLowerCase().includes(query) || s.studentName?.toLowerCase().includes(query));
    if (activeTab === "parents") return parents.filter(p => p.firstName?.toLowerCase().includes(query) || p.lastName?.toLowerCase().includes(query) || p.email?.toLowerCase().includes(query));
    return workers.filter(w => w.firstName?.toLowerCase().includes(query) || w.staffId?.toLowerCase().includes(query));
  };

  const handleView = (item) => { setSelectedItem(item); setShowDetailsModal(true); };

  const handleDelete = async (item) => {
    const type = activeTab === "students" ? "student" : activeTab === "parents" ? "parent" : "worker";
    if (!window.confirm(`Are you sure you want to purge this ${type} record?`)) return;
    try {
      let endpoint = `/api/wardenauth/students/${item._id}`;
      if (activeTab === "parents") endpoint = `/api/wardenauth/parents/${item._id}`;
      if (activeTab === "workers") endpoint = `/api/wardenauth/workers/${item._id}`;
      await api.delete(endpoint);
      toast.success(`${type} record purged.`);
      if (activeTab === "students") fetchStudents();
      if (activeTab === "parents") fetchParents();
      if (activeTab === "workers") fetchInterns();
      fetchCounts();
    } catch (e) { toast.error(`Failed: ${e.response?.data?.message || e.message}`); }
  };

  const allFiltered = filteredItems();
  const totalPages = Math.ceil(allFiltered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allFiltered.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex-1 bg-[#F8FAF5] min-h-screen overflow-y-auto overflow-x-hidden">
      <Toaster position="top-right" />

      <div className="p-5 md:p-8 space-y-6 w-full max-w-full">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 bg-[#7A8B5E] rounded-full"></div>
            <div>
              <h1 className="text-xl font-bold text-[#1A1F16] tracking-tight">Directory Hub</h1>
              <p className="text-[10px] text-[#7A8B5E] font-medium">Management & Records Terminal</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40" />
              <input
                type="text"
                placeholder="Live search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#7A8B5E]/10 rounded-xl pl-9 pr-4 py-3 text-sm font-medium text-[#1A1F16] focus:border-[#7A8B5E] outline-none transition-all shadow-sm"
              />
            </div>
            <button onClick={() => setShowRegisterModal(true)}
              className="px-5 py-3 bg-[#1A1F16] text-white rounded-xl font-bold text-xs shadow-md hover:bg-black transition-all flex items-center gap-2 whitespace-nowrap shrink-0">
              <Plus size={15} /> New Entry
            </button>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        {activeTab === "students" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <PremiumStatCard label="Total Residents" value={counts.total} icon={<Users2 />} color="bg-blue-50 text-blue-600" />
            <PremiumStatCard label="Active Now" value={counts.active} icon={<ShieldCheck />} color="bg-emerald-50 text-emerald-600" />
            <PremiumStatCard label="On Leave" value={counts.onLeave} icon={<LogOut />} color="bg-amber-50 text-amber-600" />
            <PremiumStatCard label="Vacated" value={counts.checkedOut} icon={<UserX />} color="bg-rose-50 text-rose-600" />
          </div>
        )}

        {/* ── Main Panel ── */}
        <div className="bg-white rounded-2xl border border-[#7A8B5E]/10 shadow-sm overflow-hidden">

          {/* Tab Nav */}
          <div className="flex border-b border-[#7A8B5E]/10">
            {["students", "parents", "interns"].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setSearchQuery(""); setCurrentPage(1); }}
                className={`flex-1 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? "text-[#1A1F16]" : "text-[#1A1F16]/30 hover:text-[#1A1F16]/60"}`}>
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#7A8B5E]" />}
              </button>
            ))}
          </div>

          {/* Filters (students only) */}
          {activeTab === "students" && (
            <div className="p-5 border-b border-[#7A8B5E]/5 flex flex-col sm:flex-row gap-3 items-end bg-[#F8FAF5]/50">
              <div className="flex-1 space-y-1.5">
                <label className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider ml-1">Room Filter</label>
                <input type="text" placeholder="Ex: 101" value={filters.roomNo}
                  onChange={(e) => setFilters({...filters, roomNo: e.target.value})}
                  className="w-full bg-white border border-[#7A8B5E]/10 rounded-xl px-4 py-3 text-xs font-bold text-[#1A1F16] outline-none focus:border-[#7A8B5E] transition-all" />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider ml-1">Status Filter</label>
                <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full bg-white border border-[#7A8B5E]/10 rounded-xl px-4 py-3 text-xs font-bold text-[#1A1F16] outline-none appearance-none focus:border-[#7A8B5E] transition-all">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Checked Out">Checked Out</option>
                </select>
              </div>
              <button onClick={() => setFilters({studentId: "", roomNo: "", status: ""})}
                className="px-6 py-3 bg-[#1A1F16] text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-all whitespace-nowrap">
                Reset
              </button>
            </div>
          )}

          {/* List Content */}
          <div className="p-4 space-y-2">
            {/* Column Headers */}
            {activeTab !== "interns" && (
              <div className="flex items-center gap-4 px-4 py-2 mb-1">
                <div className="w-10 shrink-0" />
                <div className="flex-[2] text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider">Identity</div>
                <div className="hidden md:block flex-[2] text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider">Contact</div>
                <div className="hidden lg:block flex-[1] text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider">Role</div>
                <div className="flex-[1] text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider text-center">Status</div>
                <div className="shrink-0 w-20 text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider text-right">Actions</div>
              </div>
            )}

            {activeTab === "interns" && currentItems.length > 0 && (
              <div className="bg-[#BEC5AD] rounded-2xl p-3 space-y-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="flex-[2] text-[9px] font-bold text-[#1A1F16] uppercase tracking-wider">Name / ID</div>
                  <div className="hidden sm:block flex-[1] text-[9px] font-bold text-[#1A1F16] uppercase tracking-wider">Room</div>
                  <div className="hidden md:block flex-[1] text-[9px] font-bold text-[#1A1F16] uppercase tracking-wider">Type</div>
                  <div className="flex-[1] text-[9px] font-bold text-[#1A1F16] uppercase tracking-wider">Fee</div>
                  <div className="hidden lg:block flex-[1] text-[9px] font-bold text-[#1A1F16] uppercase tracking-wider">Contact</div>
                  <div className="flex-[1] text-[9px] font-bold text-[#1A1F16] uppercase tracking-wider">Status</div>
                  <div className="hidden sm:block flex-[1] text-[9px] font-bold text-[#1A1F16] uppercase tracking-wider">Dues</div>
                  <div className="shrink-0 w-20" />
                </div>
                {currentItems.map((item, i) => <InternRow key={i} item={item} onView={handleView} />)}
              </div>
            )}

            {activeTab !== "interns" && currentItems.map((item, i) => (
              <PersonRow key={i} item={item} activeTab={activeTab} onView={handleView} onDelete={handleDelete} />
            ))}

            {allFiltered.length === 0 && (
              <div className="py-16 text-center flex flex-col items-center gap-3">
                <div className="w-14 h-14 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#7A8B5E]/20">
                  <Search size={28} />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">No Records Found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-[#7A8B5E]/5 flex flex-col sm:flex-row justify-between items-center gap-3 bg-[#F8FAF5]/30">
              <p className="text-[9px] font-bold text-[#7A8B5E] uppercase tracking-wider">
                {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, allFiltered.length)} of {allFiltered.length}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-2 bg-white border border-[#7A8B5E]/10 rounded-xl text-[#1A1F16] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm disabled:opacity-20">
                  <ChevronLeft size={14} />
                </button>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button key={i} onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-xl text-[10px] font-bold transition-all border ${currentPage === page ? 'bg-[#1A1F16] text-white border-transparent' : 'bg-white text-[#1A1F16] border-[#7A8B5E]/10 hover:border-[#7A8B5E]'}`}>
                      {page}
                    </button>
                  );
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-[#7A8B5E]/10 rounded-xl text-[#1A1F16] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm disabled:opacity-20">
                  <ChevronRight size={14} />
                </button>
=======
    } catch (err) {
      console.error("Error fetching workers:", err);
      // If endpoint doesn't exist yet, set empty array
      if (err.response?.status === 404) {
        console.warn("Workers endpoint not implemented yet");
        setWorkers([]);
      }
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleViewParent = (parent) => {
    setSelectedParent(parent);
    setShowViewModal(true);
  };

  const handleEditParent = (parent) => {
    setSelectedParent(parent);
    setShowEditModal(true);
  };

  const handleViewWorker = (worker) => {
    setSelectedWorker(worker);
    setShowViewModal(true);
  };

  const handleEditWorker = (worker) => {
    setSelectedWorker(worker);
    setShowEditModal(true);
  };

  const handleClearFilters = () => {
    setFilters({ studentId: "", roomNo: "", status: "" });
    toast.info("Filters cleared", { autoClose: 2000 });
  };

  const getStatusStyle = (status) => {
    if (status === "Active") return "text-green-600";
    if (status === "On Leave") return "text-orange-500";
    if (status === "Checked Out") return "text-gray-600";
    return "";
  };

  // Filter students/parents based on search query
  const filteredStudents = students.filter(s => 
    s.studentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactNumber?.includes(searchQuery)
  );

  const filteredParents = parents.filter(p =>
    p.parentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contactNumber?.includes(searchQuery)
  );

  const filteredWorkers = workers.filter(w =>
    w.staffId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.contactNumber?.includes(searchQuery) ||
    w.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-[#F8FAF5] min-h-screen p-4 sm:p-10 space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── Page Title & Search ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-red-500 rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Student Management</h1>
            <p className="text-[10px] text-[#A4B494] font-black uppercase tracking-[0.25em] mt-1">Registry Control Center</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A4B494]/40 group-focus-within:text-[#A4B494] transition-colors" />
            <input
              type="text"
              placeholder="Search registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#A4B494]/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-[#1A1F16] focus:border-[#A4B494] shadow-sm outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Tabs & Registration ── */}
      <div className="bg-[#A4B494] p-8 rounded-[32px] shadow-2xl relative overflow-hidden border border-white/20">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex bg-white/20 backdrop-blur-md p-1.5 rounded-[20px] border border-white/20">
            {["students", "parents", "workers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-[16px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-[#1A1F16] shadow-lg"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-[#1A1F16] text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-black/20 group"
          >
            <UserPlus size={16} className="group-hover:rotate-12 transition-transform" />
            Register {activeTab.slice(0, -1)}
          </button>
        </div>
        
        {/* Background blobs */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none"></div>
      </div>

      {/* ── Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Registry" count={counts.total} icon="/warden/dashboard-icons/t-students.png" />
        <StatCard title="Active Profile" count={counts.active} icon="/warden/dashboard-icons/t-students.png" />
        <StatCard title="On Leave" count={counts.onLeave} icon="/warden/dashboard-icons/t-students.png" red />
        <StatCard title="Checked Out" count={counts.checkedOut} icon="/warden/dashboard-icons/t-students.png" />
      </div>

      {/* Filters - Only show for students tab */}
      {activeTab === "students" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Filter Students</h3>
          </div>

          {/* Filters */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</label>
              <div className="relative">
                <select
                  value={filters.studentId}
                  onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
                >
                  {["", ...students.map((s) => s.studentId)].map((opt, i) => (
                    <option key={i} value={opt}>{opt || "All IDs"}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
>>>>>>> parent of b475873 (feat: initialize warden dashboard and management modules with student OCR registration support)
              </div>
            </div>

            {/* Room No */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Room No</label>
              <div className="relative">
                <select
                  value={filters.roomNo}
                  onChange={(e) => setFilters({ ...filters, roomNo: e.target.value })}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
                >
                  {["", ...students.map((s) => s.roomNo).filter(Boolean)].map((opt, i) => (
                    <option key={i} value={opt}>{opt || "All Rooms"}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
                >
                  {["", "Active", "On Leave", "Checked Out"].map((opt, i) => (
                    <option key={i} value={opt}>{opt || "All Statuses"}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Clear Button */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-transparent uppercase tracking-wider select-none">Action</label>
              <button
                onClick={handleClearFilters}
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
      )}

      {/* Students Table */}
      {activeTab === "students" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m6-5a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Student List</h3>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {filteredStudents.length} students
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Student ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Room</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Bed</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">Contact</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Fees Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Dues</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-10 text-center text-gray-400 italic text-sm">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, i) => (
                    <tr key={i} className="hover:bg-[#A4B494]/10 transition-colors duration-150 group">
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-600 font-medium">{s.studentId}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-xs font-bold text-[#1a312a] shrink-0">
                            {s.studentName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{s.studentName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 font-medium">
                        {s.roomNo || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 font-medium">
                        {s.barcodeId || <span className="text-gray-300">Not Assigned</span>}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{s.contactNumber || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          s.feeStatus === 'Paid' ? 'bg-green-500 text-white' :
                          s.feeStatus === 'Unpaid' ? 'bg-orange-500 text-white' :
                          s.feeStatus === 'Partial' ? 'bg-yellow-500 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {s.feeStatus || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 font-medium">{s.dues || '₹ 0/-'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(s.status || "Active")}`}>
                          {s.status || "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-4 relative">
                          <button
                            onClick={() => handleViewStudent(s)}
                            className="text-black hover:text-gray-700 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                            title="View Student Details"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <div
                            style={{
                              width: "1px",
                              height: "20px",
                              backgroundColor: "#000000",
                              margin: "0 8px",
                            }}
                          />
                          <button
                            onClick={() => handleEditStudent(s)}
                            className="text-gray-800 hover:text-black flex items-center justify-center transition-colors cursor-pointer hover:scale-110 transition-transform"
                            title="Edit Student"
                          >
                            <svg
                              width="27"
                              height="26"
                              viewBox="0 0 27 26"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <mask
                                id={`mask0_221_285_${i}`}
                                style={{ maskType: "alpha" }}
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="27"
                                height="26"
                              >
                                <rect
                                  x="0.678223"
                                  y="0.0253906"
                                  width="25.7356"
                                  height="25.7356"
                                  fill="#D9D9D9"
                                />
                              </mask>
                              <g mask={`url(#mask0_221_285_${i})`}>
                                <path
                                  d="M2.82373 25.7609V21.4717H24.2701V25.7609H2.82373ZM7.113 17.1824H8.61425L16.9783 8.8451L15.4503 7.31705L7.113 15.6811V17.1824ZM4.96837 19.327V14.7697L16.9783 2.78651C17.1749 2.58991 17.4028 2.438 17.6619 2.33077C17.9211 2.22354 18.1936 2.16992 18.4796 2.16992C18.7655 2.16992 19.0425 2.22354 19.3106 2.33077C19.5787 2.438 19.82 2.59885 20.0344 2.81331L21.5089 4.31456C21.7233 4.51115 21.8797 4.74349 21.978 5.01157C22.0763 5.27965 22.1255 5.55666 22.1255 5.84261C22.1255 6.11069 22.0763 6.3743 21.978 6.63345C21.8797 6.89259 21.7233 7.1294 21.5089 7.34386L9.52572 19.327H4.96837Z"
                                  fill="#1C1B1F"
                                />
                              </g>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {filteredStudents.length === 0 ? (
              <p className="px-5 py-10 text-center text-gray-400 italic text-sm">No students found.</p>
            ) : (
              filteredStudents.map((s, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-sm font-bold text-[#1a312a] shrink-0">
                        {s.studentName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{s.studentName}</p>
                        <p className="text-xs font-mono text-gray-400">{s.studentId}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(s.status || "Active")}`}>
                      {s.status || "Active"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">Room</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">
                        {s.roomNo || "—"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">Bed</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.barcodeId || "—"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">Contact</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.contactNumber || "—"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">Fee Status</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 ${
                        s.feeStatus === 'Paid' ? 'bg-green-500 text-white' :
                        s.feeStatus === 'Unpaid' ? 'bg-orange-500 text-white' :
                        s.feeStatus === 'Partial' ? 'bg-yellow-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {s.feeStatus || 'N/A'}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-medium">Dues</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.dues || '₹ 0/-'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewStudent(s)}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors flex-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => handleEditStudent(s)}
                      className="flex items-center justify-center gap-1.5 text-xs font-semibold text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors flex-1"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 27 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.82373 25.7609V21.4717H24.2701V25.7609H2.82373ZM7.113 17.1824H8.61425L16.9783 8.8451L15.4503 7.31705L7.113 15.6811V17.1824ZM4.96837 19.327V14.7697L16.9783 2.78651C17.1749 2.58991 17.4028 2.438 17.6619 2.33077C17.9211 2.22354 18.1936 2.16992 18.4796 2.16992C18.7655 2.16992 19.0425 2.22354 19.3106 2.33077C19.5787 2.438 19.82 2.59885 20.0344 2.81331L21.5089 4.31456C21.7233 4.51115 21.8797 4.74349 21.978 5.01157C22.0763 5.27965 22.1255 5.55666 22.1255 5.84261C22.1255 6.11069 22.0763 6.3743 21.978 6.63345C21.8797 6.89259 21.7233 7.1294 21.5089 7.34386L9.52572 19.327H4.96837Z"
                          fill="#1C1B1F"
                        />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Parents Table */}
      {activeTab === "parents" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m6-5a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Parent List</h3>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {filteredParents.length} parents
            </span>
          </div>

          {/* Check if parents endpoint is available */}
          {parents.length === 0 && filteredParents.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m6-5a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-500 font-medium mb-2">No parents registered yet</p>
              <p className="text-gray-400 text-sm">Click "Register Parent" to add a new parent account</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Relation</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredParents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center text-gray-400 italic text-sm">
                      No parents found.
                    </td>
                  </tr>
                ) : (
                  filteredParents.map((p, i) => (
                    <tr key={i} className="hover:bg-[#A4B494]/10 transition-colors duration-150">
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-600 font-medium">{p.parentId}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-xs font-bold text-[#1a312a] shrink-0">
                            {p.firstName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{p.firstName} {p.lastName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{p.email || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{p.contactNumber || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3.5 text-gray-600">{p.relation || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-600">{p.studentId || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewParent(p)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-150"
                            title="View Details"
                          >
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEditParent(p)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#A4B494]/30 transition-colors duration-150"
                            title="Edit Parent"
                          >
                            <img src="/warden/images/edit-icon.png" alt="Edit" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block lg:hidden divide-y divide-gray-100">
            {filteredParents.length === 0 ? (
              <p className="px-5 py-10 text-center text-gray-400 italic text-sm">No parents found.</p>
            ) : (
              filteredParents.map((p, i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-sm font-bold text-[#1a312a] shrink-0">
                        {p.firstName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{p.firstName} {p.lastName}</p>
                        <p className="text-xs font-mono text-gray-400">{p.parentId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { label: "Email", value: p.email },
                      { label: "Contact", value: p.contactNumber },
                      { label: "Relation", value: p.relation },
                      { label: "Student ID", value: p.studentId },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-400 font-medium">{label}</p>
                        <p className="text-xs font-semibold text-gray-700 mt-0.5">{value || "—"}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewParent(p)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => handleEditParent(p)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#1a312a] bg-[#A4B494]/20 hover:bg-[#A4B494]/40 px-3 py-1.5 rounded-lg transition-colors flex-1"
                    >
                      <img src="/warden/images/edit-icon.png" alt="Edit" className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
            </>
          )}
        </div>
<<<<<<< HEAD
      </div>

      <RegistrationModal open={showRegisterModal} onClose={() => setShowRegisterModal(false)}
        onSuccess={() => { setShowRegisterModal(false); fetchStudents(); fetchCounts(); fetchInterns(); fetchParents(); }} />
      <StudentDetailsModal open={showDetailsModal} onClose={() => setShowDetailsModal(false)} item={selectedItem}
        type={activeTab === "students" ? "student" : activeTab === "parents" ? "parent" : "worker"} />
    </div>
  );
}
=======
      )}

      {/* Workers Table */}
      {activeTab === "workers" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Worker List</h3>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {filteredWorkers.length} workers
            </span>
          </div>

          {/* Check if workers endpoint is available */}
          {workers.length === 0 && filteredWorkers.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-medium mb-2">No workers registered yet</p>
              <p className="text-gray-400 text-sm">Click "Register Worker" to add your first worker</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff ID</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shift</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredWorkers.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-4 py-10 text-center text-gray-400 italic text-sm">
                          No workers found.
                        </td>
                      </tr>
                    ) : (
                      filteredWorkers.map((w, i) => (
                        <tr key={i} className="hover:bg-[#A4B494]/10 transition-colors duration-150">
                          <td className="px-4 py-3.5 font-mono text-xs text-gray-600 font-medium">{w.staffId}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-xs font-bold text-[#1a312a] shrink-0">
                                {w.firstName?.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-800">{w.firstName} {w.lastName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-600">{w.designation || <span className="text-gray-300">—</span>}</td>
                          <td className="px-4 py-3.5 text-gray-600">{w.email || <span className="text-gray-300">—</span>}</td>
                          <td className="px-4 py-3.5 text-gray-600 font-mono text-xs">{w.contactNumber || <span className="text-gray-300">—</span>}</td>
                          <td className="px-4 py-3.5 text-gray-600 text-xs">{w.shiftStart && w.shiftEnd ? `${w.shiftStart} - ${w.shiftEnd}` : <span className="text-gray-300">—</span>}</td>
                          <td className="px-4 py-3.5 text-gray-600 font-medium">₹ {w.salary || 0}/-</td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewWorker(w)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-150"
                                title="View Details"
                              >
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleEditWorker(w)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-[#A4B494]/30 transition-colors duration-150"
                                title="Edit Worker"
                              >
                                <img src="/warden/images/edit-icon.png" alt="Edit" className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="block lg:hidden divide-y divide-gray-100">
                {filteredWorkers.length === 0 ? (
                  <p className="px-5 py-10 text-center text-gray-400 italic text-sm">No workers found.</p>
                ) : (
                  filteredWorkers.map((w, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#A4B494]/30 flex items-center justify-center text-sm font-bold text-[#1a312a] shrink-0">
                            {w.firstName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{w.firstName} {w.lastName}</p>
                            <p className="text-xs font-mono text-gray-400">{w.staffId}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {[
                          { label: "Designation", value: w.designation },
                          { label: "Email", value: w.email },
                          { label: "Contact", value: w.contactNumber },
                          { label: "Shift", value: w.shiftStart && w.shiftEnd ? `${w.shiftStart} - ${w.shiftEnd}` : "—" },
                          { label: "Salary", value: `₹ ${w.salary || 0}/-` },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
                            <p className="text-xs text-gray-400 font-medium">{label}</p>
                            <p className="text-xs font-semibold text-gray-700 mt-0.5">{value || "—"}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewWorker(w)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => handleEditWorker(w)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#1a312a] bg-[#A4B494]/20 hover:bg-[#A4B494]/40 px-3 py-1.5 rounded-lg transition-colors flex-1"
                        >
                          <img src="/warden/images/edit-icon.png" alt="Edit" className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Register {activeTab === "students" ? "Student" : activeTab === "parents" ? "Parent" : "Worker"}
              </h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <StudentManagements 
                initialTab={activeTab === "students" ? "student" : activeTab === "parents" ? "parent" : "worker"}
                onSuccess={() => {
                  setShowRegisterModal(false);
                  fetchStudents();
                  fetchParents();
                  fetchCounts();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedStudent(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Student ID</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.studentId}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Student Name</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.studentName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Contact Number</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.contactNumber || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Email</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.email || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Room Number</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.roomNo || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Bed Number (Full ID)</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.barcodeId || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Status</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.status || "Active"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Fee Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedStudent.feeStatus === 'Paid' ? 'bg-green-500 text-white' :
                    selectedStudent.feeStatus === 'Unpaid' ? 'bg-orange-500 text-white' :
                    selectedStudent.feeStatus === 'Partial' ? 'bg-yellow-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {selectedStudent.feeStatus || 'N/A'}
                  </span>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Dues</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.dues || '₹ 0/-'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Emergency Contact Name</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.emergencyContactName || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Emergency Contact Number</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.emergencyContactNumber || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Admission Date</label>
                  <p className="text-base text-gray-800 font-medium">{selectedStudent.admissionDate ? new Date(selectedStudent.admissionDate).toLocaleDateString() : "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Parent Modal */}
      {showViewModal && selectedParent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">Parent Details</h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedParent(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Parent ID</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.parentId}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">First Name</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.firstName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Last Name</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.lastName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Email</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.email || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Contact Number</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.contactNumber || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Relation</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.relation || "—"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-500">Student ID</label>
                  <p className="text-base text-gray-800 font-medium">{selectedParent.studentId || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#BEC5AD] rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedStudent(null);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-lg transition-colors z-50"
            >
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Management Component with its original styling */}
            <div className="p-6">
              <StudentManagements 
                initialTab="student"
                editMode={true}
                studentData={selectedStudent}
                onSuccess={() => {
                  setShowEditModal(false);
                  setSelectedStudent(null);
                  fetchStudents();
                  fetchCounts();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Parent Modal */}
      {showEditModal && selectedParent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#BEC5AD] rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedParent(null);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-lg transition-colors z-50"
            >
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Management Component with its original styling */}
            <div className="p-6">
              <StudentManagements 
                initialTab="parent"
                editMode={true}
                parentData={selectedParent}
                onSuccess={() => {
                  setShowEditModal(false);
                  setSelectedParent(null);
                  fetchParents();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Register {activeTab === "students" ? "Student" : "Parent"}
              </h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <StudentManagements 
                initialTab={activeTab === "students" ? "student" : "parent"}
                onSuccess={() => {
                  setShowRegisterModal(false);
                  fetchStudents();
                  fetchParents();
                  fetchCounts();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

// --- Helper Components ---

function StatCard({ title, count, icon, red }) {
  return (
    <div className="relative bg-white rounded-2xl px-5 py-5 shadow-sm border border-gray-100 overflow-hidden flex justify-between items-center group hover:shadow-md transition-shadow duration-200">

      {/* Accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${red ? "bg-red-400" : "bg-[#A4B494]"}`} />

      {/* Background blob */}
      <div className={`absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-10 blur-2xl ${red ? "bg-red-400" : "bg-[#A4B494]"}`} />

      {/* Content */}
      <div className="pl-3 z-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{title}</p>
        <p className={`text-4xl font-extrabold leading-none ${red ? "text-red-500" : "text-[#1a312a]"}`}>
          {count}
        </p>
      </div>

      {/* Icon */}
      {icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 z-10 ${red ? "bg-red-50" : "bg-[#A4B494]/20"}`}>
          <img src={icon} alt={title} className="w-6 h-6 object-contain" />
        </div>
      )}
    </div>
  );
}
>>>>>>> parent of b475873 (feat: initialize warden dashboard and management modules with student OCR registration support)
