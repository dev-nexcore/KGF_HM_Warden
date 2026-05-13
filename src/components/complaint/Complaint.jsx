"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast, Toaster } from "react-hot-toast";
import { 
  MessageSquareWarning, 
  CheckCircle2, 
  Clock, 
  Paperclip, 
  Eye, 
  X, 
  Trash2, 
  Check, 
  ArrowUpRight,
  FileText,
  User,
  Calendar,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

export default function Complaint() {
  const [openTickets, setOpenTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState({ show: false, url: '', type: '', filename: '' });
  const [activeTab, setActiveTab] = useState("pending");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOpenTickets = async () => {
    try {
      const response = await api.get(`/api/adminauth/complaints/open`);
      const formatted = response.data.complaints.map(c => ({
        id: c.ticketId,
        _id: c._id,
        subject: c.subject,
        description: c.description,
        complaintType: c.displayType || c.complaintType,
        raisedBy: c.raisedBy ? c.raisedBy.name : 'Unknown Student',
        studentId: c.raisedBy ? c.raisedBy.studentId : '',
        status: "Pending",
        dateRaised: new Date(c.filedDate).toLocaleDateString('en-GB'),
        hasAttachments: c.hasAttachments,
        attachmentCount: c.attachmentCount,
        attachments: c.attachments || []
      }));
      setOpenTickets(formatted);
    } catch (error) {
      toast.error("Failed to fetch pending reports.");
    }
  };

  const fetchResolvedTickets = async () => {
    try {
      const response = await api.get(`/api/adminauth/complaints/resolved`);
      const formatted = response.data.complaints.map(c => ({
        id: c.ticketId,
        _id: c._id,
        subject: c.subject,
        description: c.description,
        complaintType: c.complaintType,
        raisedBy: c.raisedBy ? c.raisedBy.name : 'Unknown Student',
        studentId: c.raisedBy ? c.raisedBy.studentId : '',
        status: "Resolved",
        dateRaised: new Date(c.filedDate).toLocaleDateString('en-GB'),
        resolvedDate: new Date(c.resolvedDate).toLocaleDateString('en-GB'),
        hasAttachments: c.hasAttachments,
        attachmentCount: c.attachmentCount,
        attachments: c.attachments || []
      }));
      setResolvedTickets(formatted);
    } catch (error) {
      toast.error("Failed to fetch resolution history.");
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await api.get(`/api/adminauth/complaints/${ticketId}`);
      return response.data.complaint;
    } catch (error) {
      return null;
    }
  };

  const viewTicketDetails = async (ticket) => {
    const details = await fetchTicketDetails(ticket._id);
    if (details) {
      setSelectedTicket({ ...ticket, ...details });
      setShowModal(true);
    }
  };

  const viewAttachment = async (complaintId, attachmentId, filename, mimeType) => {
    try {
      const response = await api.get(
        `/api/adminauth/complaints/${complaintId}/attachment/${attachmentId}`,
        { responseType: 'blob' }
      );
      const url = URL.createObjectURL(response.data);
      const type = mimeType.startsWith('image/') ? 'image' : 
                   mimeType.startsWith('video/') ? 'video' : 'document';
      setAttachmentModal({ show: true, url, type, filename });
    } catch (error) {
      toast.error("Failed to load evidence.");
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
      });
      toast.success("Ticket resolved successfully.");
      fetchOpenTickets();
      fetchResolvedTickets();
    } catch (error) {
      toast.error("Failed to resolve ticket.");
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve_${index}`]: false }));
    }
  };

  const handleReject = async (index) => {
    toast.error("Ticket dismissal currently unavailable.");
  };

  const closeAttachmentModal = () => {
    if (attachmentModal.url) URL.revokeObjectURL(attachmentModal.url);
    setAttachmentModal({ show: false, url: '', type: '', filename: '' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-[#7A8B5E] rounded-full shadow-lg"></div>
          <div>
            <h1 className="text-3xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">Incident Control</h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] mt-1">Management & Records Terminal</p>
          </div>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-[#7A8B5E]/10 shadow-sm">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "pending" ? "bg-[#1A1F16] text-white shadow-lg" : "text-[#1A1F16]/40 hover:text-[#1A1F16]"}`}
          >
            Pending ({openTickets.length})
          </button>
          <button 
            onClick={() => setActiveTab("resolved")}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "resolved" ? "bg-[#1A1F16] text-white shadow-lg" : "text-[#1A1F16]/40 hover:text-[#1A1F16]"}`}
          >
            Resolved ({resolvedTickets.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[40px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden min-h-[600px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[600px] gap-4">
            <div className="w-12 h-12 border-4 border-[#7A8B5E]/20 border-t-[#7A8B5E] rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">Scanning Registry...</p>
          </div>
        ) : (
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/10">
                  <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Incident ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Subject & Evidence</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Raised By</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === "pending" ? openTickets : resolvedTickets)
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((ticket, i) => (
                  <tr key={i} className="border-b border-[#7A8B5E]/5 hover:bg-[#F8FAF5] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F8FAF5] rounded-xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 group-hover:bg-[#7A8B5E] group-hover:text-white transition-all">
                          <ShieldAlert size={18} />
                        </div>
                        <span className="text-sm font-black text-[#1A1F16] tracking-tight">{ticket.id}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="max-w-xs">
                        <p className="text-sm font-black text-[#1A1F16] truncate italic">{ticket.subject}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-widest bg-[#7A8B5E]/5 px-2 py-0.5 rounded-md">{ticket.complaintType}</span>
                          {ticket.hasAttachments && (
                            <button onClick={() => viewTicketDetails(ticket)} className="text-[9px] font-black text-blue-600 uppercase flex items-center gap-1 hover:underline">
                              <Paperclip size={10} /> {ticket.attachmentCount} Files
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-[#1A1F16]">{ticket.raisedBy}</span>
                        <span className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60">{ticket.studentId}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        ticket.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                      }`}>
                        {ticket.status === "Pending" ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                        {ticket.status}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <button onClick={() => viewTicketDetails(ticket)} className="p-3 bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-2xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm">
                          <Eye size={18} />
                        </button>
                        {activeTab === "pending" && (
                          <button 
                            onClick={() => handleApprove(i)} 
                            disabled={actionLoading[`approve_${i}`]}
                            className="p-3 bg-[#1A1F16] border border-black rounded-2xl text-white hover:bg-[#2A3324] transition-all shadow-lg disabled:opacity-20"
                          >
                            <Check size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(activeTab === "pending" ? openTickets : resolvedTickets).length === 0 && (
              <div className="flex flex-col items-center justify-center h-[500px] text-center">
                <div className="w-20 h-20 bg-[#F8FAF5] rounded-full flex items-center justify-center text-[#7A8B5E]/20 mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-lg font-black text-[#1A1F16] uppercase italic tracking-tight">System Integrity Clear</h3>
                <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-2">No pending incidents requiring intervention</p>
              </div>
            )}
          
            {/* Pagination Controls */}
            {Math.ceil((activeTab === "pending" ? openTickets : resolvedTickets).length / itemsPerPage) > 1 && (
              <div className="p-10 border-t border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/30">
                <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, (activeTab === "pending" ? openTickets : resolvedTickets).length)} of {(activeTab === "pending" ? openTickets : resolvedTickets).length} entries
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl disabled:opacity-20"
                  >
                    <X size={14} className="rotate-45" />
                  </button>
                  <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-widest px-4">{currentPage} / {Math.ceil((activeTab === "pending" ? openTickets : resolvedTickets).length / itemsPerPage)}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil((activeTab === "pending" ? openTickets : resolvedTickets).length / itemsPerPage), p + 1))}
                    disabled={currentPage === Math.ceil((activeTab === "pending" ? openTickets : resolvedTickets).length / itemsPerPage)}
                    className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl disabled:opacity-20"
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#1A1F16]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#7A8B5E]/10 animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-[#7A8B5E]/5 flex justify-between items-center bg-[#F8FAF5]/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 shadow-sm">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1A1F16] italic uppercase tracking-tight">Case Dossier: {selectedTicket.id}</h2>
                  <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">Full Incident Disclosure</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InfoBlock label="Reporter" value={selectedTicket.raisedBy} subValue={selectedTicket.studentId} icon={<User />} />
                <InfoBlock label="Incident Type" value={selectedTicket.complaintType} icon={<ShieldAlert />} />
                <InfoBlock label="Date Logged" value={selectedTicket.dateRaised} icon={<Calendar />} />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">Incident Subject</label>
                <div className="bg-[#F8FAF5] p-6 rounded-[32px] border border-[#7A8B5E]/10 text-lg font-bold text-[#1A1F16] italic">
                  "{selectedTicket.subject}"
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">Detailed Narrative</label>
                <div className="bg-[#F8FAF5] p-8 rounded-[32px] border border-[#7A8B5E]/10 text-sm text-[#1A1F16]/70 leading-relaxed">
                  {selectedTicket.description}
                </div>
              </div>

              {selectedTicket.attachments?.length > 0 && (
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase text-[#7A8B5E] tracking-[0.2em] ml-2">Forensic Evidence ({selectedTicket.attachments.length})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selectedTicket.attachments.map((file, i) => (
                      <div key={i} className="bg-white border border-[#7A8B5E]/10 p-4 rounded-3xl flex items-center justify-between group hover:border-[#7A8B5E] transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 bg-[#F8FAF5] rounded-xl flex items-center justify-center text-[#7A8B5E]">
                            <Paperclip size={18} />
                          </div>
                          <p className="text-[10px] font-black text-[#1A1F16] uppercase truncate w-24">{file.originalName || "Attachment"}</p>
                        </div>
                        <button 
                          onClick={() => viewAttachment(selectedTicket._id, file._id, file.originalName, file.mimeType)}
                          className="p-2 text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white rounded-xl transition-all"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-10 bg-[#F8FAF5]/50 border-t border-[#7A8B5E]/5 flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-8 py-4 bg-white border border-[#7A8B5E]/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1A1F16]/40 hover:text-[#1A1F16] transition-all">Close Dossier</button>
              {selectedTicket.status === "Pending" && (
                <button 
                  onClick={() => { handleApprove(openTickets.findIndex(t => t._id === selectedTicket._id)); setShowModal(false); }}
                  className="px-8 py-4 bg-[#7A8B5E] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#7A8B5E]/20 hover:bg-[#8B9D6E] transition-all"
                >
                  Authorize Resolution
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Evidence Viewer */}
      {attachmentModal.show && (
        <div className="fixed inset-0 z-[300] bg-[#1A1F16]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-5xl h-full flex flex-col items-center justify-center gap-8 relative">
            <button onClick={closeAttachmentModal} className="absolute top-0 right-0 p-4 text-white/50 hover:text-white transition-all">
              <X size={32} />
            </button>
            <div className="w-full h-[80%] flex items-center justify-center">
              {attachmentModal.type === 'image' && <img src={attachmentModal.url} className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl" />}
              {attachmentModal.type === 'video' && <video src={attachmentModal.url} controls className="max-w-full max-h-full rounded-3xl shadow-2xl" />}
              {attachmentModal.type === 'document' && (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center text-white mx-auto">
                    <FileText size={48} />
                  </div>
                  <p className="text-white/60 text-sm font-bold tracking-widest uppercase">{attachmentModal.filename}</p>
                  <a href={attachmentModal.url} download={attachmentModal.filename} className="inline-block px-10 py-5 bg-white text-[#1A1F16] rounded-2xl font-black text-[10px] uppercase tracking-[0.3em]">Download Document</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ label, value, subValue, icon }) {
  return (
    <div className="bg-[#F8FAF5] p-6 rounded-[32px] border border-[#7A8B5E]/10 flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#7A8B5E] shadow-sm border border-[#7A8B5E]/5">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase text-[#7A8B5E] tracking-[0.2em]">{label}</p>
        <p className="text-sm font-black text-[#1A1F16] tracking-tight">{value}</p>
        {subValue && <p className="text-[8px] font-black text-[#7A8B5E]/50 uppercase tracking-widest">{subValue}</p>}
      </div>
    </div>
  );
}