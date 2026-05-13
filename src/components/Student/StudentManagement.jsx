"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import api from "@/lib/api";
import Tesseract from "tesseract.js";
import { 
  Users2, 
  UserCheck, 
  UserMinus, 
  PlaneTakeoff, 
  Search, 
  Plus, 
  Filter, 
  X, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  MoreVertical,
  Edit3,
  Eye,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  ShieldCheck,
  Building,
  Activity,
  ArrowUpRight,
  Trash2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";

// ─── OCR Helpers ────────────────────────────────────────────────────────────

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
          firstName = words[0];
          lastName = words.length === 2 ? words[1] : words[words.length - 1];
          break;
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
  for (const line of lines) {
    const m = line.match(/([A-Z]{5}\d{4}[A-Z])/);
    if (m) { panNumber = m[1]; break; }
  }
  for (const line of lines) {
    const m = line.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
    if (m) { dob = m[1].replace(/\//g, "-"); break; }
  }
  return { name, dob, panNumber };
};

const getTodaysDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// ─── Registration Modal ──────────────────────────────────────────────────────

function RegistrationModal({ open, onClose, initialTab = "student", onSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  // Student state
  const [studentForm, setStudentForm] = useState({
    firstName: "", lastName: "", contactNumber: "", email: "",
    roomNumber: "", bedNumber: "", emergencyContactNumber: "",
    admissionDate: getTodaysDate(), emergencyContactName: "", feeStatus: "",
  });
  const [studentDocs, setStudentDocs] = useState({ aadharCard: null, panCard: null });
  const [studentErrors, setStudentErrors] = useState({});
  const [studentLoading, setStudentLoading] = useState(false);

  // Parent state
  const [parentForm, setParentForm] = useState({
    firstName: "", lastName: "", email: "", relation: "", contactNumber: "", studentId: "",
  });
  const [parentDocs, setParentDocs] = useState({ aadharCard: null, panCard: null });
  const [parentErrors, setParentErrors] = useState({});
  const [parentLoading, setParentLoading] = useState(false);

  // Worker state
  const [workerForm, setWorkerForm] = useState({
    firstName: "", lastName: "", email: "", contactNumber: "",
    studentId: "", designation: "",
  });
  const [workerDocs, setWorkerDocs] = useState({ aadharCard: null, panCard: null });
  const [workerErrors, setWorkerErrors] = useState({});
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
      setter((prev) => ({
        ...prev,
        firstName: info.firstName || prev.firstName,
        lastName: info.lastName || prev.lastName,
        contactNumber: info.mobileNumber || prev.contactNumber,
      }));
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
      toast.success(`Registered! Pass: ${res.data.student?.password}`);
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
      toast.success(`Parent registered!`);
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

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#1A1F16]/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#7A8B5E]/10 animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="px-6 md:px-10 py-6 md:py-8 border-b border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/50">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#1A1F16] italic uppercase tracking-tight">Personnel Registration</h2>
            <p className="text-[9px] md:text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">Enroll new members into the system</p>
          </div>
          <button onClick={onClose} className="p-2 md:p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
            <X className="w-[18px] h-[18px] md:w-5 md:h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/5 overflow-x-auto no-scrollbar">
          {["student", "parent", "worker"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[100px] py-6 text-[11px] font-black uppercase tracking-[0.25em] transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab 
                  ? "border-[#7A8B5E] text-[#1A1F16] bg-white/50" 
                  : "border-transparent text-[#1A1F16]/30 hover:text-[#1A1F16]/60"
              }`}
            >
              {tab === "worker" ? "Intern" : tab}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10">
          
          {/* OCR Pulse */}
          {ocrLoading && (
            <div className="mb-10 bg-[#7A8B5E]/5 border border-[#7A8B5E]/20 rounded-3xl p-6 animate-pulse">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">Document Analysis Active</span>
                <span className="text-sm font-black text-[#1A1F16]">{ocrProgress}%</span>
              </div>
              <div className="h-2 bg-[#7A8B5E]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#7A8B5E] transition-all duration-300" style={{ width: `${ocrProgress}%` }}></div>
              </div>
            </div>
          )}

          {activeTab === "student" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PremiumInput label="First Name" value={studentForm.firstName} onChange={(v) => setStudentForm({...studentForm, firstName: v})} icon={<Users2 />} error={studentErrors.firstName} placeholder="John" />
              <PremiumInput label="Last Name" value={studentForm.lastName} onChange={(v) => setStudentForm({...studentForm, lastName: v})} icon={<Users2 />} error={studentErrors.lastName} placeholder="Doe" />
              
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8 bg-[#F8FAF5] rounded-[32px] border border-[#7A8B5E]/10 shadow-inner">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">Aadhar Card (OCR)</label>
                  <label className="flex items-center justify-center gap-3 w-full h-32 bg-white border-2 border-dashed border-[#7A8B5E]/20 rounded-3xl cursor-pointer hover:border-[#7A8B5E] transition-all group">
                    <div className="text-center">
                      <Camera className="mx-auto mb-2 text-[#7A8B5E]/40 group-hover:text-[#7A8B5E]" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1F16]/30 group-hover:text-[#1A1F16]">{studentDocs.aadharCard ? studentDocs.aadharCard.name : "Tap to Scan"}</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleDocUpload(e, "aadharCard", "student")} />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">PAN Card (OCR)</label>
                  <label className="flex items-center justify-center gap-3 w-full h-32 bg-white border-2 border-dashed border-[#7A8B5E]/20 rounded-3xl cursor-pointer hover:border-[#7A8B5E] transition-all group">
                    <div className="text-center">
                      <Camera className="mx-auto mb-2 text-[#7A8B5E]/40 group-hover:text-[#7A8B5E]" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1F16]/30 group-hover:text-[#1A1F16]">{studentDocs.panCard ? studentDocs.panCard.name : "Tap to Scan"}</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleDocUpload(e, "panCard", "student")} />
                  </label>
                </div>
              </div>

              <PremiumInput label="Contact Number" value={studentForm.contactNumber} onChange={(v) => setStudentForm({...studentForm, contactNumber: v})} icon={<Phone />} placeholder="+91 00000 00000" />
              <PremiumInput label="Email Address" value={studentForm.email} onChange={(v) => setStudentForm({...studentForm, email: v})} icon={<Mail />} placeholder="john@example.com" />
              
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">Assigned Room</label>
                <select 
                  value={studentForm.roomNumber}
                  onChange={(e) => setStudentForm({...studentForm, roomNumber: e.target.value, bedNumber: ""})}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-sm font-black text-[#1A1F16] outline-none focus:border-[#7A8B5E] transition-all appearance-none"
                >
                  <option value="">Select Room</option>
                  {availableRoomNumbers.map(r => <option key={r._id} value={r._id}>Room {r._id} (Floor {r.floor})</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">Assigned Bed</label>
                <select 
                  value={studentForm.bedNumber}
                  onChange={(e) => setStudentForm({...studentForm, bedNumber: e.target.value})}
                  disabled={!studentForm.roomNumber}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-sm font-black text-[#1A1F16] outline-none focus:border-[#7A8B5E] transition-all appearance-none disabled:opacity-30"
                >
                  <option value="">{studentForm.roomNumber ? "Select Bed" : "Select Room First"}</option>
                  {getBedsForRoom(studentForm.roomNumber).map(b => <option key={b._id} value={b._id}>{b.itemName}</option>)}
                </select>
              </div>

              <PremiumInput label="Guardian Name" value={studentForm.emergencyContactName} onChange={(v) => setStudentForm({...studentForm, emergencyContactName: v})} icon={<Users2 />} placeholder="Guardian Full Name" />
              <PremiumInput label="Guardian Contact" value={studentForm.emergencyContactNumber} onChange={(v) => setStudentForm({...studentForm, emergencyContactNumber: v})} icon={<Phone />} placeholder="Guardian Phone" />
              
              <div className="md:col-span-2 mt-8">
                <button 
                  onClick={handleStudentSubmit}
                  disabled={studentLoading}
                  className="w-full bg-[#1A1F16] text-white py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/20 hover:bg-[#2A3324] transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  {studentLoading ? <Activity className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                  Complete Registration
                </button>
              </div>
            </div>
          )}

          {activeTab === "parent" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PremiumInput label="First Name" value={parentForm.firstName} onChange={(v) => setParentForm({...parentForm, firstName: v})} icon={<Users2 />} placeholder="First Name" />
              <PremiumInput label="Last Name" value={parentForm.lastName} onChange={(v) => setParentForm({...parentForm, lastName: v})} icon={<Users2 />} placeholder="Last Name" />
              <PremiumInput label="Email" value={parentForm.email} onChange={(v) => setParentForm({...parentForm, email: v})} icon={<Mail />} placeholder="Email Address" />
              <PremiumInput label="Contact" value={parentForm.contactNumber} onChange={(v) => setParentForm({...parentForm, contactNumber: v})} icon={<Phone />} placeholder="Phone Number" />
              <div className="md:col-span-2">
                <PremiumInput label="Relationship" value={parentForm.relation} onChange={(v) => setParentForm({...parentForm, relation: v})} icon={<ShieldCheck />} placeholder="Father / Mother / Guardian" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">Link Student ID</label>
                <select 
                  value={parentForm.studentId}
                  onChange={(e) => setParentForm({...parentForm, studentId: e.target.value})}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-sm font-black text-[#1A1F16] outline-none focus:border-[#7A8B5E] transition-all appearance-none"
                >
                  <option value="">Select Student</option>
                  {studentsWithoutParents.map(s => <option key={s.studentId} value={s.studentId}>{s.studentId} - {s.firstName} {s.lastName}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 mt-8">
                <button 
                  onClick={handleParentSubmit}
                  disabled={parentLoading}
                  className="w-full bg-[#1A1F16] text-white py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/20 hover:bg-[#2A3324] transition-all"
                >
                  Confirm Parent Account
                </button>
              </div>
            </div>
          )}

          {activeTab === "worker" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PremiumInput label="First Name" value={workerForm.firstName} onChange={(v) => setWorkerForm({...workerForm, firstName: v})} icon={<Users2 />} placeholder="First Name" />
              <PremiumInput label="Last Name" value={workerForm.lastName} onChange={(v) => setWorkerForm({...workerForm, lastName: v})} icon={<Users2 />} placeholder="Last Name" />
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8 bg-[#F8FAF5] rounded-[32px] border border-[#7A8B5E]/10 shadow-inner">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">Aadhar Card (OCR)</label>
                  <label className="flex items-center justify-center gap-3 w-full h-32 bg-white border-2 border-dashed border-[#7A8B5E]/20 rounded-3xl cursor-pointer hover:border-[#7A8B5E] transition-all group">
                    <div className="text-center">
                      <Camera className="mx-auto mb-2 text-[#7A8B5E]/40 group-hover:text-[#7A8B5E]" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1F16]/30 group-hover:text-[#1A1F16]">{workerDocs.aadharCard ? workerDocs.aadharCard.name : "Tap to Scan"}</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleDocUpload(e, "aadharCard", "worker")} />
                  </label>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">PAN Card (OCR)</label>
                  <label className="flex items-center justify-center gap-3 w-full h-32 bg-white border-2 border-dashed border-[#7A8B5E]/20 rounded-3xl cursor-pointer hover:border-[#7A8B5E] transition-all group">
                    <div className="text-center">
                      <Camera className="mx-auto mb-2 text-[#7A8B5E]/40 group-hover:text-[#7A8B5E]" size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1F16]/30 group-hover:text-[#1A1F16]">{workerDocs.panCard ? workerDocs.panCard.name : "Tap to Scan"}</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleDocUpload(e, "panCard", "worker")} />
                  </label>
                </div>
              </div>

              <PremiumInput label="Contact Number" value={workerForm.contactNumber} onChange={(v) => setWorkerForm({...workerForm, contactNumber: v})} icon={<Phone />} placeholder="+91 00000 00000" />
              <PremiumInput label="Email Address" value={workerForm.email} onChange={(v) => setWorkerForm({...workerForm, email: v})} icon={<Mail />} placeholder="staff@example.com" />
              
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <PremiumInput label="Student ID" value={workerForm.studentId} onChange={(v) => setWorkerForm({...workerForm, studentId: v})} icon={<Users2 />} placeholder="S-101-XXX" />
                  <PremiumInput label="Internship / Job Role" value={workerForm.designation} onChange={(v) => setWorkerForm({...workerForm, designation: v})} icon={<Search />} placeholder="Library Asst / Admin Intern" />
                </div>
              </div>

              <div className="md:col-span-2 mt-8">
                <button 
                  onClick={handleWorkerSubmit}
                  disabled={workerLoading}
                  className="w-full bg-[#1A1F16] text-white py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/20 hover:bg-[#2A3324] transition-all"
                >
                  Register Student Intern
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Student Details Modal ──────────────────────────────────────────────────

function StudentDetailsModal({ item, open, onClose, type }) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-[#1A1F16]/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-[#7A8B5E]/10 flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/50">
          <div>
            <h2 className="text-2xl font-black text-[#1A1F16] italic uppercase tracking-tight">Record Dossier</h2>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">{type} profile verification</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-10 space-y-8 overflow-y-auto no-scrollbar max-h-[70vh]">
          <div className="flex items-center gap-8 p-8 bg-[#F8FAF5] rounded-[32px] border border-[#7A8B5E]/10 shadow-inner">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-[#7A8B5E] shadow-lg border border-white">
              {item.profileImage || item.profilePhoto ? (
                <img src={`${process.env.NEXT_PUBLIC_PROD_API_URL}${item.profileImage || '/uploads/wardens/'+item.profilePhoto}`} className="w-full h-full object-cover rounded-3xl" alt="" />
              ) : <Users2 size={40} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-[#1A1F16] uppercase italic tracking-tight">{item.studentName || `${item.firstName} ${item.lastName}`}</h3>
              <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] mt-2 opacity-60">ID: {item.studentId || item.staffId || item.parentId || 'UNASSIGNED'}</p>
              <div className="mt-4">
                <StatusBadge status={item.status || (type === "parent" ? "Active" : "On Duty")} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <DetailItem label="Email Communication" value={item.email || 'No Email Logged'} icon={<Mail />} />
            <DetailItem label="Primary Contact" value={item.contactNumber || 'No Contact'} icon={<Phone />} />
            <DetailItem label="Operational Role" value={item.designation || item.relation || (type === "student" ? "Resident" : "Official")} icon={<ShieldCheck />} />
            {type === "student" && <DetailItem label="Assigned Quarter" value={`Room ${item.roomNo || 'Pending'}`} icon={<Building />} />}
          </div>

          {item.aadharCard && (
            <div className="pt-6 border-t border-[#7A8B5E]/5">
              <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] mb-4">Identification Documents</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-[#7A8B5E] shadow-sm"><ShieldCheck size={14} /></div>
                  <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-widest">Aadhar Verified</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-10 bg-[#F8FAF5]/50 border-t border-[#7A8B5E]/5">
          <button onClick={onClose} className="w-full py-5 bg-[#1A1F16] text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all">
            Dismiss Dossier
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="space-y-2">
      <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] ml-1">{label}</p>
      <div className="p-4 bg-white border border-[#7A8B5E]/5 rounded-2xl flex items-center gap-3 shadow-sm hover:border-[#7A8B5E]/20 transition-all">
        <div className="text-[#7A8B5E] opacity-40">{React.cloneElement(icon, { size: 16 })}</div>
        <p className="text-xs font-black text-[#1A1F16]">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function StudentManagementPage() {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, onLeave: 0, checkedOut: 0 });
  const [filters, setFilters] = useState({ studentId: "", roomNo: "", status: "" });
  const [activeTab, setActiveTab] = useState("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCounts();
    fetchParents();
    fetchInterns();
  }, []);

  useEffect(() => { 
    fetchStudents(); 
    setCurrentPage(1);
  }, [filters, activeTab]);

  const fetchCounts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students/count`);
      setCounts({ total: res.data.totalStudents, active: res.data.activeStudents, onLeave: res.data.onLeaveStudents, checkedOut: res.data.checkedOutStudents || 0 });
    } catch (e) { console.error(e); }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students`, { params: filters });
      setStudents(res.data.students || []);
    } catch (e) { console.error(e); }
  };

  const fetchParents = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/parents`);
      setParents(res.data.parents || []);
    } catch (e) { setParents([]); }
  };

  const fetchInterns = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/interns`);
      setWorkers(res.data.workers || []);
    } catch (e) { setWorkers([]); }
  };

  const filteredItems = () => {
    const query = searchQuery.toLowerCase();
    let results = [];
    if (activeTab === "students") {
      results = students.filter(s => s.studentId?.toLowerCase().includes(query) || s.studentName?.toLowerCase().includes(query));
    } else if (activeTab === "parents") {
      results = parents.filter(p => p.firstName?.toLowerCase().includes(query) || p.lastName?.toLowerCase().includes(query) || p.email?.toLowerCase().includes(query));
    } else {
      results = workers.filter(w => w.firstName?.toLowerCase().includes(query) || w.staffId?.toLowerCase().includes(query));
    }
    return results;
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleDelete = async (item) => {
    const id = item._id;
    const type = activeTab === "students" ? "student" : activeTab === "parents" ? "parent" : "worker";
    if (!window.confirm(`Are you sure you want to purge this ${type} record? This action is irreversible.`)) return;

    try {
      let endpoint = `/api/wardenauth/students/${id}`;
      if (activeTab === "parents") endpoint = `/api/wardenauth/parents/${id}`;
      if (activeTab === "workers") endpoint = `/api/wardenauth/workers/${id}`;

      await api.delete(endpoint);
      toast.success(`${type} record purged successfully.`);
      if (activeTab === "students") fetchStudents();
      if (activeTab === "parents") fetchParents();
      if (activeTab === "workers") fetchWorkers();
      fetchCounts();
    } catch (e) {
      toast.error(`Failed to purge record: ${e.response?.data?.message || e.message}`);
    }
  };

  const allFiltered = filteredItems();
  const totalPages = Math.ceil(allFiltered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-4 md:p-10 space-y-10 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Directory Hub</h1>
            <p className="text-[9px] md:text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Management & Records Terminal</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E]" />
            <input 
              type="text" 
              placeholder="Live search records..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowRegisterModal(true)}
            className="px-8 py-4 bg-[#7A8B5E] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#7A8B5E]/20 hover:bg-[#8B9D6E] transition-all flex items-center gap-2"
          >
            <Plus size={16} /> New Entry
          </button>
        </div>
      </div>

      {activeTab === "students" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumStatCard label="Total Residents" value={counts.total} icon={<Users2 />} color="bg-blue-50 text-blue-600" />
          <PremiumStatCard label="Present in Unit" value={counts.active} icon={<UserCheck />} color="bg-emerald-50 text-emerald-600" />
          <PremiumStatCard label="Authorized Leave" value={counts.onLeave} icon={<PlaneTakeoff />} color="bg-amber-50 text-amber-600" />
          <PremiumStatCard label="Departures" value={counts.checkedOut} icon={<UserMinus />} color="bg-red-50 text-red-600" />
        </div>
      )}

      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">
        <div className="flex border-b border-[#7A8B5E]/5 bg-[#F8FAF5]/50 overflow-x-auto no-scrollbar">
          {["students", "parents", "workers"].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(""); }}
              className={`px-8 md:px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab ? "border-[#7A8B5E] text-[#1A1F16]" : "border-transparent text-[#1A1F16]/30 hover:text-[#1A1F16]/60"
              }`}
            >
              {tab === "workers" ? "Interns" : tab}
            </button>
          ))}
        </div>

        {activeTab === "students" && (
          <div className="p-6 md:p-10 border-b border-[#7A8B5E]/5 grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-[#F8FAF5]/30">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest ml-1">Room Filter</label>
              <input 
                type="text" 
                placeholder="Ex: 101"
                value={filters.roomNo}
                onChange={(e) => setFilters({...filters, roomNo: e.target.value})}
                className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl px-6 py-3 text-xs font-black text-[#1A1F16] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest ml-1">Status Filter</label>
              <select 
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl px-6 py-3 text-xs font-black text-[#1A1F16] outline-none appearance-none"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Checked Out">Checked Out</option>
              </select>
            </div>
            <button 
              onClick={() => setFilters({studentId: "", roomNo: "", status: ""})}
              className="px-8 py-3 bg-[#1A1F16] text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/10">
                <th className="px-6 md:px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] whitespace-nowrap">Identity Record</th>
                <th className="px-6 md:px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] whitespace-nowrap">Vital Contact</th>
                <th className="px-6 md:px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] whitespace-nowrap">Primary Role</th>
                <th className="px-6 md:px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] whitespace-nowrap">Operational Status</th>
                <th className="px-6 md:px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em] whitespace-nowrap">Registry Action</th>
              </tr>
            </thead>
            <tbody>
              {allFiltered.slice(indexOfFirstItem, indexOfLastItem).map((item, i) => (
                <tr key={i} className="border-b border-[#7A8B5E]/5 hover:bg-[#F8FAF5] transition-colors group">
                  <td className="px-6 md:px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F8FAF5] rounded-2xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 group-hover:bg-[#7A8B5E] group-hover:text-white transition-all overflow-hidden shadow-sm">
                        {item.profileImage || item.profilePhoto ? (
                          <img src={`${process.env.NEXT_PUBLIC_PROD_API_URL}${item.profileImage || '/uploads/wardens/'+item.profilePhoto}`} className="w-full h-full object-cover" alt="" />
                        ) : <Users2 size={20} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-[#1A1F16] tracking-tight">{item.studentName || `${item.firstName} ${item.lastName}`}</span>
                        <span className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60">ID: {item.studentId || item.staffId || item.parentId || 'UNASSIGNED'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-[#1A1F16] flex items-center gap-2"><Phone size={10} className="text-[#7A8B5E]" /> {item.contactNumber || 'N/A'}</span>
                      <span className="text-[10px] font-medium text-[#7A8B5E] lowercase tracking-tight opacity-70">{item.email || 'no-email-logged'}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-10 py-8">
                    <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-[0.15em] bg-[#F8FAF5] px-3 py-1 rounded-lg border border-[#7A8B5E]/10">{item.designation || item.relation || (activeTab === "students" ? "Resident" : "Official")}</span>
                  </td>
                  <td className="px-6 md:px-10 py-8">
                    <StatusBadge status={item.status || (activeTab === "parents" ? "Active" : "On Duty")} />
                  </td>
                  <td className="px-6 md:px-10 py-8">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleView(item)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDelete(item)} className="p-3 bg-white border border-red-100 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allFiltered.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#7A8B5E]/20">
                <Search size={32} />
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">No Records Found</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-10 border-t border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/30">
            <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, allFiltered.length)} of {allFiltered.length} entries
            </p>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm disabled:opacity-20"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#1A1F16] text-white shadow-lg' : 'bg-white border border-[#7A8B5E]/10 text-[#7A8B5E] hover:bg-[#7A8B5E]/5'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm disabled:opacity-20"
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showRegisterModal && (
        <RegistrationModal 
          open={showRegisterModal} 
          onClose={() => setShowRegisterModal(false)} 
          initialTab={activeTab === "students" ? "student" : activeTab === "parents" ? "parent" : "worker"}
          onSuccess={() => { setShowRegisterModal(false); fetchStudents(); fetchParents(); fetchInterns(); fetchCounts(); }}
        />
      )}

      {showDetailsModal && (
        <StudentDetailsModal 
          item={selectedItem} 
          open={showDetailsModal} 
          onClose={() => setShowDetailsModal(false)} 
          type={activeTab === "students" ? "student" : activeTab === "parents" ? "parent" : "worker"}
        />
      )}
    </div>
  );
}

function PremiumStatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 flex flex-col items-center gap-6 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#7A8B5E]/10 group">
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

function PremiumInput({ label, value, onChange, icon, error, type = "text", placeholder }) {
  return (
    <div className="space-y-2 w-full">
      <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E] transition-colors">
          {React.cloneElement(icon, { size: 18 })}
        </div>
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-[#F8FAF5] border ${error ? 'border-red-400' : 'border-[#7A8B5E]/10'} rounded-2xl pl-14 pr-6 py-4 text-sm font-black text-[#1A1F16] placeholder:text-[#1A1F16]/20 placeholder:italic outline-none focus:border-[#7A8B5E] transition-all`}
        />
      </div>
      {error && <p className="text-[9px] font-bold text-red-500 ml-2 uppercase tracking-widest">{error}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Active": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "On Leave": "bg-amber-50 text-amber-600 border-amber-100",
    "Checked Out": "bg-red-50 text-red-600 border-red-100",
    "On Duty": "bg-blue-50 text-blue-600 border-blue-100"
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status] || 'bg-gray-50 text-gray-400 border-gray-100'}`}>
      {status}
    </span>
  );
}