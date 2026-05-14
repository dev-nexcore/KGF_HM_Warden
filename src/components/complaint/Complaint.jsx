"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  ClipboardList, Search, Eye, CheckCircle2, XCircle, 
  Paperclip, ArrowUpRight, X, AlertCircle, Clock 
} from "lucide-react";

export default function Complaint() {
  const [openTickets, setOpenTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState({ show: false, url: '', type: '', filename: '' });

  // Fetch open complaints/tickets
  const fetchOpenTickets = async () => {
    try {
      const response = await api.get(`/api/adminauth/complaints/open`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      const formattedTickets = response.data.complaints.map(complaint => ({
        id: complaint.ticketId,
        _id: complaint._id,
        subject: complaint.subject,
        description: complaint.description,
        complaintType: complaint.displayType || complaint.complaintType,
        raisedBy: complaint.raisedBy ? complaint.raisedBy.name : 'Unknown Student',
        studentId: complaint.raisedBy ? complaint.raisedBy.studentId : '',
        status: "Pending",
        dateRaised: new Date(complaint.filedDate).toLocaleDateString('en-GB'),
        hasAttachments: complaint.hasAttachments,
        attachmentCount: complaint.attachmentCount,
        attachments: complaint.attachments || []
      }));
      setOpenTickets(formattedTickets);
    } catch (error) {
      toast.error("Failed to fetch open tickets.");
    }
  };

  // Fetch resolved complaints/tickets
  const fetchResolvedTickets = async () => {
    try {
      const response = await api.get(`/api/adminauth/complaints/resolved`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      const formattedTickets = response.data.complaints.map(complaint => ({
        id: complaint.ticketId,
        _id: complaint._id,
        subject: complaint.subject,
        description: complaint.description,
        complaintType: complaint.complaintType,
        raisedBy: complaint.raisedBy ? complaint.raisedBy.name : 'Unknown Student',
        studentId: complaint.raisedBy ? complaint.raisedBy.studentId : '',
        status: "Resolved",
        dateRaised: new Date(complaint.filedDate).toLocaleDateString('en-GB'),
        resolvedDate: new Date(complaint.resolvedDate).toLocaleDateString('en-GB'),
        hasAttachments: complaint.hasAttachments,
        attachmentCount: complaint.attachmentCount,
        attachments: complaint.attachments || []
      }));
      setResolvedTickets(formattedTickets);
    } catch (error) {
      toast.error("Failed to fetch resolved tickets.");
    }
  };

  const viewTicketDetails = async (ticket) => {
    try {
      const response = await api.get(`/api/adminauth/complaints/${ticket._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setSelectedTicket({ ...ticket, ...response.data.complaint });
      setShowModal(true);
    } catch (error) {
      toast.error("Failed to fetch details.");
    }
  };

  const viewAttachment = async (complaintId, attachmentId, filename, mimeType) => {
    try {
      const response = await api.get(`/api/adminauth/complaints/${complaintId}/attachment/${attachmentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        responseType: 'blob'
      });
      const url = URL.createObjectURL(response.data);
      const type = mimeType.startsWith('image/') ? 'image' : mimeType.startsWith('video/') ? 'video' : 'document';
      setAttachmentModal({ show: true, url, type, filename });
    } catch (error) {
      toast.error("Failed to load attachment.");
    }
  };

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      await Promise.all([fetchOpenTickets(), fetchResolvedTickets()]);
      setLoading(false);
    };
    loadTickets();
  }, []);

  const handleApprove = async (index) => {
    const ticket = openTickets[index];
    setActionLoading(prev => ({ ...prev, [`approve_${index}`]: true }));
    try {
      await api.put(`/api/adminauth/complaints/${ticket._id}/status`, {
        status: "resolved",
        adminNotes: "Resolved by Warden."
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      setResolvedTickets(prev => [{...ticket, status: "Resolved", resolvedDate: "Just Now"}, ...prev]);
      setOpenTickets(prev => prev.filter((_, i) => i !== index));
      toast.success("Ticket resolved.");
    } catch (error) {
      toast.error("Resolution failed.");
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve_${index}`]: false }));
    }
  };

  const closeAttachmentModal = () => {
    if (attachmentModal.url) URL.revokeObjectURL(attachmentModal.url);
    setAttachmentModal({ show: false, url: '', type: '', filename: '' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAF5]">
        <div className="w-10 h-10 border-4 border-[#A4B494]/20 border-t-[#A4B494] rounded-full animate-spin shadow-lg"></div>
        <p className="mt-6 text-[#A4B494] font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Scanning Tickets...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-[#F8FAF5] min-h-screen p-6 md:p-10 space-y-12 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── Page Title ── */}
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 bg-red-500 rounded-full shadow-lg"></div>
        <div>
          <h1 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Grievance Hub</h1>
          <p className="text-[10px] text-[#A4B494] font-black uppercase tracking-[0.25em] mt-1">Incident Management System</p>
        </div>
      </div>

      {/* ── Open Tickets ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#1A1F16]">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Open Tickets ({openTickets.length})</h2>
          </div>
          <span className="text-[9px] font-black text-[#A4B494] uppercase tracking-widest bg-[#A4B494]/10 px-3 py-1 rounded-full italic">Awaiting Action</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openTickets.length > 0 ? (
            openTickets.map((ticket, index) => (
              <div key={ticket.id} className="group bg-white rounded-[40px] p-8 border border-[#A4B494]/10 shadow-xl shadow-black/5 hover:-translate-y-1 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-[#BEC5AD] rounded-2xl flex items-center justify-center text-[#1A1F16] shadow-sm">
                    <ClipboardList size={22} />
                  </div>
                  <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-100">
                    ID: {ticket.id}
                  </span>
                </div>

                <h3 className="text-lg font-black text-[#1A1F16] tracking-tight mb-2 line-clamp-1 italic">{ticket.subject}</h3>
                <p className="text-xs text-[#1A1F16]/60 leading-relaxed line-clamp-2 mb-6 font-medium">
                  {ticket.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-[#A4B494]/10">
                  <div>
                    <p className="text-[10px] font-black text-[#1A1F16]/40 uppercase tracking-widest">Raised By</p>
                    <p className="text-xs font-black text-[#1A1F16] mt-0.5 italic">{ticket.raisedBy}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[#1A1F16]/40 uppercase tracking-widest">Type</p>
                    <p className="text-xs font-black text-[#A4B494] mt-0.5">{ticket.complaintType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button
                    onClick={() => viewTicketDetails(ticket)}
                    className="flex items-center justify-center gap-2 py-4 bg-[#F8FAF5] border border-[#A4B494]/20 text-[#1A1F16] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#A4B494]/5 transition-all"
                  >
                    <Eye size={14} /> Details
                  </button>
                  <button
                    onClick={() => handleApprove(index)}
                    disabled={actionLoading[`approve_${index}`]}
                    className="flex items-center justify-center gap-2 py-4 bg-[#1A1F16] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                  >
                    {actionLoading[`approve_${index}`] ? "..." : "Resolve"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-white rounded-[40px] border-2 border-dashed border-[#A4B494]/10 flex flex-col items-center justify-center opacity-40">
              <CheckCircle2 size={40} className="text-[#A4B494] mb-4" />
              <p className="text-[10px] font-black text-[#A4B494] uppercase tracking-[0.3em]">No Open Grievances Found</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Resolved Section ── */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#1A1F16]">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Resolution Log ({resolvedTickets.length})</h2>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-[#A4B494]/10 shadow-xl shadow-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#A4B494]/10 border-b border-[#A4B494]/5">
                  {["Ref ID", "Resident", "Subject", "Status", "Action"].map(h => (
                    <th key={h} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#A4B494]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A4B494]/5">
                {resolvedTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-[#F8FAF5] transition-colors group">
                    <td className="px-8 py-5 text-[10px] font-black text-[#1A1F16] uppercase tracking-widest">{ticket.id}</td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-[#1A1F16] tracking-tight">{ticket.raisedBy}</p>
                      <p className="text-[9px] font-black text-[#A4B494] uppercase tracking-widest">{ticket.studentId}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-medium text-[#1A1F16]/60 max-w-[200px] truncate">{ticket.subject}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest">
                        Resolved
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <button onClick={() => viewTicketDetails(ticket)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#A4B494]/20 text-[#A4B494] hover:bg-[#1A1F16] hover:text-white transition-all shadow-sm">
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Detail Modal ── */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-[#A4B494] p-10 text-white relative">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black italic tracking-tight uppercase leading-none mb-2">Ticket Dossier</h2>
                  <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Reference: {selectedTicket.id}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 bg-white/20 rounded-2xl hover:bg-white/40 transition-all"><X size={20} /></button>
              </div>
            </div>
            
            <div className="p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-[#A4B494] uppercase tracking-widest mb-2 block">Resident Details</label>
                    <p className="text-sm font-black text-[#1A1F16] italic">{selectedTicket.raisedBy}</p>
                    <p className="text-[10px] font-black text-[#1A1F16]/40 uppercase tracking-widest mt-0.5">{selectedTicket.studentId}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-[#A4B494] uppercase tracking-widest mb-2 block">Category</label>
                    <span className="px-3 py-1 bg-[#F8FAF5] border border-[#A4B494]/10 rounded-full text-[10px] font-black text-[#A4B494] uppercase tracking-widest">
                      {selectedTicket.complaintType}
                    </span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-[#A4B494] uppercase tracking-widest mb-2 block">Description</label>
                    <p className="text-sm font-medium text-[#1A1F16]/60 leading-relaxed italic">"{selectedTicket.description}"</p>
                  </div>
                </div>
              </div>

              {selectedTicket.attachments?.length > 0 && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[#A4B494] uppercase tracking-widest block">Evidence & Attachments</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {selectedTicket.attachments.map((file, idx) => (
                      <div key={idx} className="group relative bg-[#F8FAF5] rounded-3xl p-4 border border-[#A4B494]/10 hover:border-[#A4B494] transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-[#A4B494] shadow-sm"><Paperclip size={14} /></div>
                          <span className="text-[9px] font-black text-[#1A1F16]/40 uppercase tracking-widest truncate">{file.originalName}</span>
                        </div>
                        <button 
                          onClick={() => viewAttachment(selectedTicket._id, file._id, file.originalName, file.mimeType)}
                          className="w-full py-2 bg-[#1A1F16] text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                          View File
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Attachment Viewer */}
      {attachmentModal.show && (
        <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-8 backdrop-blur-md">
          <div className="relative w-full max-w-5xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 text-white">
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">{attachmentModal.filename}</h3>
              <button onClick={closeAttachmentModal} className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 bg-white/5 rounded-[48px] overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl">
              {attachmentModal.type === 'image' && <img src={attachmentModal.url} className="max-w-full max-h-full object-contain" />}
              {attachmentModal.type === 'video' && <video src={attachmentModal.url} controls className="max-w-full max-h-full" />}
              {attachmentModal.type === 'document' && (
                <div className="text-center text-white space-y-6">
                  <AlertCircle size={64} className="mx-auto text-white/20" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">Binary View Restricted</p>
                  <a href={attachmentModal.url} download={attachmentModal.filename} className="inline-block px-10 py-5 bg-white text-black rounded-[24px] text-[10px] font-black uppercase tracking-widest">Download Archive</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}