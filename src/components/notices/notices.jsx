"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import { 
  BellRing, 
  Send, 
  X, 
  Calendar, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  User, 
  ShieldAlert,
  Info,
  ChevronRight,
  Megaphone,
  History
} from "lucide-react";

const initialFormState = {
  template: "",
  title: "",
  recipient: "",
  individualRecipient: "",
  message: "",
  date: ""
};

export default function HostelNotices() {
  const [form, setForm] = useState(initialFormState);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "All", recipientType: "", page: 1, limit: 50 });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const dateInputRef = useRef(null);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/adminauth/notices", { params: filters });
      if (data.success) setNotices(data.notices);
    } catch (err) {
      toast.error("Archive sync failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [filters]);

  const handleIssueNotice = async () => {
    const tId = toast.loading("Broadcasting notice...");
    try {
      await api.post("/api/adminauth/issue-notice", {
        template: form.template,
        title: form.title,
        message: form.message,
        issueDate: form.date,
        recipientType: form.recipient === "All (Students & Warden)" ? "All" : form.recipient,
        individualRecipient: form.individualRecipient || "",
      });
      toast.success("Broadcast successful.", { id: tId });
      fetchNotices();
      setForm(initialFormState);
      setFormErrors({});
    } catch (err) {
      toast.error("Broadcast failed.", { id: tId });
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      await api.delete(`/api/adminauth/notices/${id}`);
      setNotices((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notice purged.");
    } catch (err) {
      toast.error("Purge failed.");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.template) errors.template = true;
    if (!form.title) errors.title = true;
    if (!form.recipient) errors.recipient = true;
    if (!form.message) errors.message = true;
    if (!form.date) errors.date = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Bulletin Terminal</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Hostel-Wide Communications & Archive</p>
          </div>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-[#7A8B5E]/10 shadow-sm">
          <button className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#1A1F16] text-white shadow-lg">Compose</button>
          <button onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1A1F16]/40 hover:text-[#1A1F16]">Archive</button>
        </div>
      </div>

      {/* Composition Area */}
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">
        <div className="p-10 border-b border-[#7A8B5E]/5 bg-[#F8FAF5]/30 flex items-center gap-4">
          <Megaphone size={20} className="text-[#7A8B5E]" />
          <h2 className="text-[10px] font-black text-[#1A1F16] uppercase tracking-[0.2em]">New Broadcast Entry</h2>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Broadcast Template</label>
              <select 
                value={form.template}
                onChange={(e) => setForm({...form, template: e.target.value})}
                className={`w-full bg-[#F8FAF5] border rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none appearance-none transition-all ${formErrors.template ? 'border-red-400' : 'border-[#7A8B5E]/10'}`}
              >
                <option value="">Select Protocol</option>
                <option value="maintenance">Maintenance Notice</option>
                <option value="announcement">General Announcement</option>
                <option value="event">Official Event</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Subject Header</label>
              <input 
                type="text" 
                placeholder="Enter Subject..." 
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                className={`w-full bg-[#F8FAF5] border rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none transition-all ${formErrors.title ? 'border-red-400' : 'border-[#7A8B5E]/10'}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Recipient Class</label>
                <select 
                  value={form.recipient}
                  onChange={(e) => setForm({...form, recipient: e.target.value})}
                  className={`w-full bg-[#F8FAF5] border rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none appearance-none transition-all ${formErrors.recipient ? 'border-red-400' : 'border-[#7A8B5E]/10'}`}
                >
                  <option value="">Select Audience</option>
                  <option value="All (Students & Warden)">All Residents</option>
                  <option value="Student">Student Body</option>
                  <option value="Warden">Administrative Team</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Target ID (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Specific ID..." 
                  value={form.individualRecipient}
                  onChange={(e) => setForm({...form, individualRecipient: e.target.value})}
                  className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Schedule Date</label>
              <input 
                type="date" 
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                className={`w-full bg-[#F8FAF5] border rounded-2xl px-6 py-4 text-xs font-black text-[#1A1F16] outline-none transition-all ${formErrors.date ? 'border-red-400' : 'border-[#7A8B5E]/10'}`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex-1 space-y-2 flex flex-col">
              <label className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest ml-2">Message Narrative</label>
              <textarea 
                placeholder="Compose full transmission here..." 
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className={`flex-1 w-full bg-[#F8FAF5] border rounded-[32px] p-8 text-sm font-bold text-[#1A1F16] outline-none resize-none transition-all leading-relaxed ${formErrors.message ? 'border-red-400' : 'border-[#7A8B5E]/10'}`}
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setForm(initialFormState)} className="px-10 py-5 bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1A1F16]/40 hover:text-[#1A1F16] transition-all">Clear Draft</button>
              <button 
                onClick={() => validateForm() && handleIssueNotice()}
                className="flex-1 py-5 bg-[#1A1F16] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-black/20 hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                <Send size={16} /> Broadcast Transmission
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Archive Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <History size={20} className="text-[#7A8B5E]" />
          <h2 className="text-[10px] font-black text-[#1A1F16] uppercase tracking-[0.3em]">Communication Archive</h2>
        </div>

        <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/10">
                  <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Transmission ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Subject & Meta</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Audience</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Deployment</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Directives</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((n, i) => (
                  <tr key={i} className="border-b border-[#7A8B5E]/5 hover:bg-[#F8FAF5] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F8FAF5] rounded-xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 group-hover:bg-[#7A8B5E] group-hover:text-white transition-all">
                          <BellRing size={18} />
                        </div>
                        <span className="text-sm font-black text-[#1A1F16] tracking-tight">{n.id?.slice(-6).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div>
                        <p className="text-sm font-black text-[#1A1F16] truncate italic">"{n.title}"</p>
                        <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest mt-1 opacity-60">{n.template}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-3 py-1 bg-white border border-[#7A8B5E]/10 text-[#1A1F16]/60 rounded-lg text-[9px] font-black uppercase tracking-widest">{n.recipientType}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-[#7A8B5E]" />
                        <span className="text-xs font-black text-[#1A1F16]">{new Date(n.issueDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDeleteNotice(n.id)} className="p-3 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {notices.length === 0 && (
              <div className="py-32 text-center flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#7A8B5E]/10">
                  <Megaphone size={40} />
                </div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">No Historical Transmissions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
