"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Phone, 
  Search, 
  Filter, 
  User, 
  Edit3, 
  Save, 
  X, 
  ChevronRight,
  ShieldAlert,
  Users,
  Building
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function EmergencyContact() {
  const [tableContacts, setTableContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    contact: "",
    relation: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const params = {};
      if (search) {
        params.studentName = search;
        params.studentId = search;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/emergency-contact`,
        { params }
      );

      if (res.data.success) {
        const formatted = res.data.contacts.map((item) => ({
          id: item.studentId,
          student: item.studentName,
          contact: item.emergencyContactName,
          relation: item.relation,
          phone: item.emergencyContactNumber,
        }));
        setTableContacts(formatted);
      }
    } catch (err) {
      toast.error("Contact sync failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchContacts();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setEditValues({
      contact: contact.contact || "",
      relation: contact.relation || "",
      phone: contact.phone || "",
    });
  };

  const handleSave = async (id) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/emergency-contact/${id}`,
        {
          emergencyContactName: editValues.contact,
          relation: editValues.relation,
          emergencyContactNumber: editValues.phone,
        }
      );

      if (res.data.success) {
        toast.success("Dossier updated.");
        setEditingId(null);
        fetchContacts();
      }
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    } else {
      toast.error("Line unavailable.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Safe-Line Registry</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Emergency Intervention & Kin Verification</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E]" />
          <input 
            type="text" 
            placeholder="Search Residents or IDs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all"
          />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">
        <div className="px-10 py-6 border-b border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/50">
          <div className="flex items-center gap-3">
            <Users size={18} className="text-[#7A8B5E]" />
            <h3 className="text-[10px] font-black text-[#1A1F16] uppercase tracking-[0.2em]">Contact Network</h3>
          </div>
          <span className="px-4 py-1.5 bg-[#1A1F16] text-white rounded-full text-[9px] font-black uppercase tracking-widest">{tableContacts.length} Profiles</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/10">
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Resident Profile</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Emergency Kin</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Relation</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Comms Channel</th>
                <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableContacts.map((c, i) => (
                <tr key={i} className="border-b border-[#7A8B5E]/5 hover:bg-[#F8FAF5] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F8FAF5] rounded-2xl flex items-center justify-center text-[#7A8B5E] font-black text-xs border border-[#7A8B5E]/10 shadow-inner group-hover:bg-[#7A8B5E] group-hover:text-white transition-all">
                        {c.student?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#1A1F16] tracking-tight">{c.student}</p>
                        <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    {editingId === c.id ? (
                      <input 
                        type="text" 
                        value={editValues.contact}
                        onChange={(e) => setEditValues({...editValues, contact: e.target.value})}
                        className="bg-[#F8FAF5] border border-[#7A8B5E]/20 rounded-xl px-4 py-2 text-xs font-bold text-[#1A1F16] outline-none w-full"
                      />
                    ) : (
                      <p className="text-sm font-black text-[#1A1F16] italic uppercase">{c.contact || "N/A"}</p>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    {editingId === c.id ? (
                      <input 
                        type="text" 
                        value={editValues.relation}
                        onChange={(e) => setEditValues({...editValues, relation: e.target.value})}
                        className="bg-[#F8FAF5] border border-[#7A8B5E]/20 rounded-xl px-4 py-2 text-xs font-bold text-[#1A1F16] outline-none w-full"
                      />
                    ) : (
                      <span className="px-3 py-1 bg-[#F8FAF5] border border-[#7A8B5E]/10 text-[#7A8B5E] rounded-lg text-[10px] font-black uppercase tracking-widest">{c.relation || "Kin"}</span>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    {editingId === c.id ? (
                      <input 
                        type="text" 
                        value={editValues.phone}
                        onChange={(e) => setEditValues({...editValues, phone: e.target.value})}
                        className="bg-[#F8FAF5] border border-[#7A8B5E]/20 rounded-xl px-4 py-2 text-xs font-bold text-[#1A1F16] outline-none w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-[#7A8B5E]" />
                        <span className="text-xs font-black text-[#1A1F16]">{c.phone || "---"}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleCall(c.phone)} className="p-3 bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl text-[#7A8B5E] hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                        <Phone size={18} />
                      </button>
                      {editingId === c.id ? (
                        <>
                          <button onClick={() => handleSave(c.id)} className="p-3 bg-[#1A1F16] text-white rounded-2xl hover:bg-[#2A3324] transition-all shadow-lg">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-3 bg-white border border-red-100 text-red-500 rounded-2xl hover:bg-red-50 transition-all shadow-sm">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleEdit(c)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-[#1A1F16] hover:text-white transition-all shadow-sm">
                          <Edit3 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tableContacts.length === 0 && (
            <div className="py-32 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#7A8B5E]/10">
                <ShieldAlert size={40} />
              </div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">No Intervention Required</p>
            </div>
          )}
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-[#1A1F16] rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-[#7A8B5E] rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-[#7A8B5E]/20">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h4 className="text-xl font-black text-white italic uppercase tracking-tight leading-none">Intervention Protocol</h4>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-2">All emergency calls are logged for compliance monitoring.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-1 w-24 bg-[#7A8B5E]/20 rounded-full hidden lg:block"></div>
          <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest">System Readiness: Active</p>
        </div>
      </div>
    </div>
  );
}
