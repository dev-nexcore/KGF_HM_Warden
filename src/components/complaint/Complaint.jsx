"use client";

import { useState, useEffect } from "react";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Paperclip, 
  Image as ImageIcon, 
  Video, 
  File, 
  AlertCircle,
  Ticket,
  Users,
  CheckSquare,
  MessageSquare
} from "lucide-react";
import api from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Complaint() {
  const [openTickets, setOpenTickets] = useState([]);
  const [inProcessTickets, setInProcessTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState({ show: false, url: '', type: '', filename: '' });
  const [activeFilter, setActiveFilter] = useState("total");
  const [rejectionModal, setRejectionModal] = useState({ show: false, ticket: null, reason: '' });

  // Calculate statistics dynamically
  const totalOpen = openTickets.length;
  const totalInProcess = inProcessTickets.length;
  const totalResolved = resolvedTickets.length;
  const highPriority = [...openTickets, ...inProcessTickets].filter(ticket => 
    ticket.complaintType?.toLowerCase().includes('urgent') || 
    ticket.complaintType?.toLowerCase().includes('emergency')
  ).length;

  const stats = {
    total: totalOpen + totalInProcess + totalResolved,
    open: totalOpen,
    inProcess: totalInProcess,
    resolved: totalResolved,
    highPriority: highPriority
  };

  const displayedOpenTickets = openTickets.filter(ticket => {
    if (activeFilter === "priority") {
      return ticket.complaintType?.toLowerCase().includes('urgent') || ticket.complaintType?.toLowerCase().includes('emergency');
    }
    return true;
  });

  const displayedInProcessTickets = inProcessTickets.filter(ticket => {
    if (activeFilter === "priority") {
      return ticket.complaintType?.toLowerCase().includes('urgent') || ticket.complaintType?.toLowerCase().includes('emergency');
    }
    return true;
  });

  const displayedResolvedTickets = resolvedTickets.filter(ticket => {
    if (activeFilter === "priority") {
      return ticket.complaintType?.toLowerCase().includes('urgent') || ticket.complaintType?.toLowerCase().includes('emergency');
    }
    return true;
  });

  // Fetch open complaints/tickets (pending status)
  const fetchOpenTickets = async () => {
    try {
      const response = await api.get(
        `/api/adminauth/complaints/pending`
      );
      
      const formattedTickets = response.data.complaints.map(complaint => ({
        id: complaint.ticketId,
        _id: complaint._id,
        subject: complaint.subject,
        description: complaint.description,
        complaintType: complaint.displayType || complaint.complaintType,
        raisedBy: complaint.raisedBy ? complaint.raisedBy.name : 'Unknown Student',
        studentId: complaint.raisedBy ? complaint.raisedBy.studentId : '',
        studentRoom: complaint.raisedBy ? complaint.raisedBy.roomNumber : '',
        status: "Open Ticket",
        dateRaised: new Date(complaint.filedDate).toLocaleDateString('en-GB'),
        hasAttachments: complaint.hasAttachments,
        attachmentCount: complaint.attachmentCount,
        attachments: complaint.attachments || []
      }));
      
      setOpenTickets(formattedTickets);
    } catch (error) {
      console.error("Failed to fetch open tickets:", error);
      toast.error("Failed to fetch open tickets. Please try again.");
    }
  };

  // Fetch in-process complaints/tickets
  const fetchInProcessTickets = async () => {
    try {
      const response = await api.get(
        `/api/adminauth/complaints/inprogress`
      );
      
      const formattedTickets = response.data.complaints.map(complaint => ({
        id: complaint.ticketId,
        _id: complaint._id,
        subject: complaint.subject,
        description: complaint.description,
        complaintType: complaint.displayType || complaint.complaintType,
        raisedBy: complaint.raisedBy ? complaint.raisedBy.name : 'Unknown Student',
        studentId: complaint.raisedBy ? complaint.raisedBy.studentId : '',
        studentRoom: complaint.raisedBy ? complaint.raisedBy.roomNumber : '',
        status: "Inprocess Ticket",
        dateRaised: new Date(complaint.filedDate).toLocaleDateString('en-GB'),
        hasAttachments: complaint.hasAttachments,
        attachmentCount: complaint.attachmentCount,
        attachments: complaint.attachments || []
      }));
      
      setInProcessTickets(formattedTickets);
    } catch (error) {
      console.error("Failed to fetch in-process tickets:", error);
      toast.error("Failed to fetch in-process tickets. Please try again.");
    }
  };

  // Fetch resolved complaints/tickets
  const fetchResolvedTickets = async () => {
    try {
      const response = await api.get(
        `/api/adminauth/complaints/resolved`
      );
      
      const formattedTickets = response.data.complaints.map(complaint => ({
        id: complaint.ticketId,
        _id: complaint._id,
        subject: complaint.subject,
        description: complaint.description,
        complaintType: complaint.complaintType,
        raisedBy: complaint.raisedBy ? complaint.raisedBy.name : 'Unknown Student',
        studentId: complaint.raisedBy ? complaint.raisedBy.studentId : '',
        studentRoom: complaint.raisedBy ? complaint.raisedBy.roomNumber : '',
        status: complaint.status === 'pending_approval' ? 'Pending Approval' : 'Resolved',
        dateRaised: new Date(complaint.filedDate).toLocaleDateString('en-GB'),
        resolvedDate: new Date(complaint.resolvedDate).toLocaleDateString('en-GB'),
        hasAttachments: complaint.hasAttachments,
        attachmentCount: complaint.attachmentCount,
        attachments: complaint.attachments || []
      }));
      
      setResolvedTickets(formattedTickets);
    } catch (error) {
      console.error("Failed to fetch resolved tickets:", error);
      toast.error("Failed to fetch resolved tickets. Please try again.");
    }
  };

  // Fetch ticket details with attachments
  const fetchTicketDetails = async (ticketId) => {
    try {
      const response = await api.get(
        `/api/adminauth/complaints/${ticketId}`
      );
      return response.data.complaint;
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
      return null;
    }
  };

  // View ticket details
  const viewTicketDetails = async (ticket) => {
    const details = await fetchTicketDetails(ticket._id);
    if (details) {
      setSelectedTicket({ ...ticket, ...details });
      setShowModal(true);
    }
  };

  // View attachment
  const viewAttachment = async (complaintId, attachmentId, filename, mimeType) => {
    try {
      const response = await api.get(
        `/api/adminauth/complaints/${complaintId}/attachment/${attachmentId}`,
        {
          responseType: 'blob'
        }
      );

      const url = URL.createObjectURL(response.data);
      const type = mimeType.startsWith('image/') ? 'image' : 
                   mimeType.startsWith('video/') ? 'video' : 'document';
      
      setAttachmentModal({ show: true, url, type, filename });
    } catch (error) {
      console.error("Failed to fetch attachment:", error);
      toast.error("Failed to load attachment. Please try again.");
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchOpenTickets(), fetchInProcessTickets(), fetchResolvedTickets()]);
      } catch (error) {
        console.error("Failed to load tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // Handle approve from Open Tickets (move to In-Process)
  const handleApprove = async (index) => {
    const ticket = openTickets[index];
    const complaintId = ticket._id;

    setActionLoading(prev => ({ ...prev, [`approve_${index}`]: true }));

    try {
      await api.put(
        `/api/adminauth/complaints/${complaintId}/status`,
        {
          status: "in progress",
          adminNotes: "Complaint has been approved and moved to in-process."
        }
      );

      const inProcessTicket = {
        ...ticket,
        status: "In Progress"
      };

      setInProcessTickets(prev => [inProcessTicket, ...prev]);
      setOpenTickets(prev => prev.filter((_, i) => i !== index));

      toast.success("✅ Ticket has been approved and moved to In-Process!");

    } catch (error) {
      console.error("Failed to approve ticket:", error);
      toast.error("❌ Failed to approve ticket. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve_${index}`]: false }));
    }
  };

  // Handle approve from In-Process Tickets (move to Resolved)
  const handleResolve = async (index) => {
    const ticket = inProcessTickets[index];
    const complaintId = ticket._id;

    setActionLoading(prev => ({ ...prev, [`resolve_${index}`]: true }));

    try {
      await api.put(
        `/api/adminauth/complaints/${complaintId}/status`,
        {
          status: "pending_approval",
          adminNotes: "Warden has requested resolution approval from Admin."
        }
      );

      const resolvedTicket = {
        ...ticket,
        status: "Pending Approval",
        resolvedDate: new Date().toLocaleDateString('en-GB')
      };

      setResolvedTickets(prev => [resolvedTicket, ...prev]);
      setInProcessTickets(prev => prev.filter((_, i) => i !== index));

      toast.success("✅ Resolution request sent for Admin Approval!");

    } catch (error) {
      console.error("Failed to resolve ticket:", error);
      toast.error("❌ Failed to resolve ticket. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, [`resolve_${index}`]: false }));
    }
  };

  // Handle reject click (open modal)
  const handleReject = (index) => {
    const ticket = openTickets[index];
    setRejectionModal({
      show: true,
      ticket: { ...ticket, index },
      reason: ''
    });
  };

  // Confirm rejection after entering reason
  const confirmReject = async () => {
    const { ticket, reason } = rejectionModal;
    
    if (!reason.trim()) {
      toast.warning("Please provide a reason for rejection.");
      return;
    }

    setActionLoading(prev => ({ ...prev, [`reject_${ticket.index}`]: true }));
    setRejectionModal(prev => ({ ...prev, show: false }));

    try {
      await api.put(
        `/api/adminauth/complaints/${ticket._id}/status`,
        {
          status: "rejected",
          adminNotes: reason.trim()
        }
      );

      setOpenTickets(prev => prev.filter((_, i) => i !== ticket.index));
      toast.error("❌ Complaint has been rejected.");
    } catch (error) {
      console.error("Failed to reject complaint:", error);
      toast.error("❌ Failed to reject complaint. Please try again.");
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject_${ticket.index}`]: false }));
    }
  };

  // Close attachment modal
  const closeAttachmentModal = () => {
    if (attachmentModal.url) {
      URL.revokeObjectURL(attachmentModal.url);
    }
    setAttachmentModal({ show: false, url: '', type: '', filename: '' });
  };

  // Card data for stats
  const statCards = [
    {
      id: "total",
      label: "Total Tickets",
      value: stats.total,
      subLabel: "All Tickets",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50",
      textColor: "text-blue-500",
      badgeColor: "bg-blue-50 text-blue-600",
      icon: <Ticket size={18} />,
    },
    {
      id: "open",
      label: "Open Ticket",
      value: stats.open,
      subLabel: "Pending Action",
      borderColor: "border-orange-200",
      bgColor: "bg-orange-50",
      textColor: "text-orange-500",
      badgeColor: "bg-orange-50 text-orange-600",
      icon: <MessageSquare size={18} />,
    },
    {
      id: "inProcess",
      label: "Inprocess Ticket",
      value: stats.inProcess,
      subLabel: "Being Handled",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50",
      textColor: "text-purple-500",
      badgeColor: "bg-purple-50 text-purple-600",
      icon: <Clock size={18} />,
    },
    {
      id: "resolved",
      label: "Resolved Section",
      value: stats.resolved,
      subLabel: "Completed",
      borderColor: "border-green-200",
      bgColor: "bg-green-50",
      textColor: "text-green-500",
      badgeColor: "bg-green-50 text-green-600",
      icon: <CheckCircle size={18} />,
    },
    {
      id: "priority",
      label: "High Priority",
      value: stats.highPriority,
      subLabel: "Urgent",
      borderColor: "border-red-200",
      bgColor: "bg-red-50",
      textColor: "text-red-500",
      badgeColor: "bg-red-50 text-red-600",
      icon: <AlertCircle size={18} />,
    },
  ];


  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-black border-l-4 border-[#4F8CCF] pl-3">
              Tickets & Queries
            </h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black">
            <span className="border-l-4 border-[#4F8CCF] pl-3 inline-block">
              Tickets & Queries
            </span>
          </h2>
          <p className="text-gray-600 mt-2 ml-3">Manage student complaints and support tickets</p>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setActiveFilter(card.id)}
              className={`bg-white rounded-2xl p-5 border ${card.borderColor} ${activeFilter === card.id ? "ring-2 ring-offset-2 ring-" + card.borderColor.split("-")[1] + "-500" : ""} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
            >
              <div className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center mb-4`}>
                <div className={card.textColor}>{card.icon}</div>
              </div>
              <div className="text-4xl font-bold text-black">{card.value}</div>
              <div className="text-gray-700 text-sm font-medium mt-1">{card.label}</div>
              <div className={`inline-block mt-4 px-3 py-1 text-xs font-medium rounded-full ${card.badgeColor}`}>
                {card.subLabel}
              </div>
            </div>
          ))}
        </div>

        {/* Open Tickets */}
        {(activeFilter === "total" || activeFilter === "open" || activeFilter === "priority") && (
          <div className="bg-[#BEC5AD] rounded-2xl p-6 shadow-inner mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
              <MessageSquare size={20} />
              Open Ticket ({displayedOpenTickets.length})
            </h2>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white text-black font-semibold rounded-lg">
                    <th className="p-3 rounded-tl-lg">Ticket ID</th>
                    <th className="p-3">Subject & Files</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Raised By</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOpenTickets.length > 0 ? (
                    displayedOpenTickets.map((ticket, index) => (
                      <tr key={ticket.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-semibold text-sm">{ticket.id}</td>
                        <td className="p-3">
                          <div className="text-sm font-medium truncate max-w-[200px]" title={ticket.subject}>
                            {ticket.subject}
                          </div>
                          {ticket.hasAttachments && (
                            <button
                              onClick={() => viewTicketDetails(ticket)}
                              className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 flex items-center gap-1"
                            >
                              <Paperclip size={12} /> {ticket.attachmentCount} file(s)
                            </button>
                          )}
                        </td>
                        <td className="p-3 text-sm">{ticket.complaintType}</td>
                        <td className="p-3">
                          <div className="text-sm font-medium">{ticket.raisedBy}</div>
                          {ticket.studentId && (
                            <div className="text-xs text-gray-500">ID: {ticket.studentId}</div>
                          )}
                          {ticket.studentRoom && (
                            <div className="text-xs text-gray-500">Room: {ticket.studentRoom}</div>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock size={12} /> {ticket.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{ticket.dateRaised}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => viewTicketDetails(ticket)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleApprove(index)}
                              disabled={actionLoading[`approve_${index}`] || actionLoading[`reject_${index}`]}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(index)}
                              disabled={actionLoading[`approve_${index}`] || actionLoading[`reject_${index}`]}
                              className="p-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-600">No open tickets available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {displayedOpenTickets.map((ticket, index) => (
                <div key={ticket.id} className="bg-white rounded-xl p-4 shadow-md">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-semibold text-gray-500">Ticket ID</span>
                      <p className="font-bold text-sm">{ticket.id}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock size={12} /> {ticket.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-500">Subject</span>
                    <p className="text-sm font-medium">{ticket.subject}</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-500">Raised By</span>
                    <p className="text-sm font-medium">{ticket.raisedBy}</p>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleApprove(index)}
                      disabled={actionLoading[`approve_${index}`]}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(index)}
                      disabled={actionLoading[`reject_${index}`]}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* In-Process Tickets */}
        {(activeFilter === "total" || activeFilter === "inProcess" || activeFilter === "priority") && (
          <div className="bg-[#D4C5E2] rounded-2xl p-6 shadow-inner mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
              <Clock size={20} />
              Inprocess Ticket ({displayedInProcessTickets.length})
            </h2>

            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white text-black font-semibold rounded-lg">
                    <th className="p-3 rounded-tl-lg">Ticket ID</th>
                    <th className="p-3">Subject & Files</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Raised By</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedInProcessTickets.length > 0 ? (
                    displayedInProcessTickets.map((ticket, index) => (
                      <tr key={ticket.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-semibold text-sm">{ticket.id}</td>
                        <td className="p-3">
                          <div className="text-sm font-medium truncate max-w-[200px]" title={ticket.subject}>
                            {ticket.subject}
                          </div>
                          {ticket.hasAttachments && (
                            <button
                              onClick={() => viewTicketDetails(ticket)}
                              className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 flex items-center gap-1"
                            >
                              <Paperclip size={12} /> {ticket.attachmentCount} file(s)
                            </button>
                          )}
                        </td>
                        <td className="p-3 text-sm">{ticket.complaintType}</td>
                        <td className="p-3">
                          <div className="text-sm font-medium">{ticket.raisedBy}</div>
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Clock size={12} /> {ticket.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{ticket.dateRaised}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => viewTicketDetails(ticket)}
                              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleResolve(index)}
                              disabled={actionLoading[`resolve_${index}`]}
                              className="p-1 text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
                              title="Request Admin Approval"
                            >
                              <CheckSquare size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-600">No in-process tickets available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resolved Tickets */}
        {(activeFilter === "total" || activeFilter === "resolved") && (
          <div className="bg-[#A4B494] rounded-2xl p-6 shadow-inner mb-8">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              Resolved Section ({displayedResolvedTickets.length})
            </h2>

            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white text-black font-semibold rounded-lg">
                    <th className="p-3 rounded-tl-lg">Ticket ID</th>
                    <th className="p-3">Subject & Files</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Raised By</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 rounded-tr-lg">Resolved On</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedResolvedTickets.length > 0 ? (
                    displayedResolvedTickets.map((ticket) => (
                      <tr key={ticket.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-semibold text-sm">{ticket.id}</td>
                        <td className="p-3 text-sm">{ticket.subject}</td>
                        <td className="p-3 text-sm">{ticket.complaintType}</td>
                        <td className="p-3 text-sm">{ticket.raisedBy}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'Pending Approval' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {ticket.status === 'Pending Approval' ? <Clock size={12} /> : <CheckCircle size={12} />} {ticket.status}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{ticket.dateRaised}</td>
                        <td className="p-3 text-sm">{ticket.resolvedDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-600">No resolved tickets available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#4F8CCF] to-[#3a6ea5] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Ticket size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ticket Details</h3>
                  <p className="text-blue-100 text-sm">ID: {selectedTicket.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Raised By</p>
                    <p className="text-gray-900 font-semibold">{selectedTicket.raisedBy}</p>
                    <p className="text-sm text-gray-500">ID: {selectedTicket.studentId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Filed</p>
                    <p className="text-gray-900 font-semibold">{selectedTicket.dateRaised}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</p>
                  <p className="text-lg text-gray-900 font-bold leading-tight break-all">{selectedTicket.subject}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</p>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap break-all">
                    {selectedTicket.description}
                  </div>
                </div>

                {/* Attachments Section */}
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attachments ({selectedTicket.attachments.length})</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedTicket.attachments.map((file, idx) => (
                        <div key={idx} className="group flex items-center justify-between p-3 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                             onClick={() => viewAttachment(selectedTicket._id, file._id, file.originalName, file.mimeType)}>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-blue-50 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                              {file.mimeType.startsWith('image/') ? <ImageIcon size={20} /> : 
                               file.mimeType.startsWith('video/') ? <Video size={20} /> : <File size={20} />}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-bold text-gray-900 truncate pr-2">{file.originalName}</p>
                              <p className="text-[10px] text-gray-500 uppercase">{file.mimeType.split('/')[1]}</p>
                            </div>
                          </div>
                          <Eye size={16} className="text-gray-400 group-hover:text-blue-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-8 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                <XCircle size={40} />
              </div>
              <h3 className="text-2xl font-black">Reject Complaint?</h3>
              <p className="text-red-100 mt-2 text-sm">Please provide a reason for rejecting this ticket.</p>
            </div>
            
            <div className="p-8">
              <div className="mb-6">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Complaint Subject</p>
                <p className="text-gray-900 font-bold line-clamp-1">{rejectionModal.ticket?.subject}</p>
              </div>

              <div className="space-y-4">
                <textarea
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-0 transition-all outline-none min-h-[120px] text-sm font-medium"
                  placeholder="Type your reason here..."
                  value={rejectionModal.reason}
                  onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
                  autoFocus
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setRejectionModal({ show: false, ticket: null, reason: '' })}
                    className="flex-1 px-6 py-4 rounded-2xl font-black text-sm text-gray-500 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmReject}
                    className="flex-1 px-6 py-4 bg-red-600 rounded-2xl font-black text-sm text-white hover:bg-red-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-200"
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Viewer Modal */}
      {attachmentModal.show && (
        <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12 transition-all duration-300">
          <div className="relative w-full h-full flex flex-col items-center justify-center max-w-7xl mx-auto">
            <button 
              onClick={closeAttachmentModal}
              className="absolute top-0 right-0 p-4 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300"
            >
              <XCircle size={40} />
            </button>
            
            <div className="w-full h-full flex items-center justify-center p-4">
              {attachmentModal.type === 'image' && (
                <img src={attachmentModal.url} alt="Attachment" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in duration-500" />
              )}
              {attachmentModal.type === 'video' && (
                <video src={attachmentModal.url} controls autoPlay className="max-w-full max-h-full rounded-xl shadow-2xl" />
              )}
              {attachmentModal.type === 'document' && (
                <div className="bg-white/10 backdrop-blur-md p-12 rounded-[3rem] border border-white/20 text-center animate-in slide-in-from-bottom duration-500">
                  <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <File size={48} className="text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">{attachmentModal.filename}</h3>
                  <p className="text-white/50 mb-8 font-medium uppercase tracking-widest text-xs">Preview not available for documents</p>
                  <a href={attachmentModal.url} download={attachmentModal.filename} className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-900/40">
                    Download File
                  </a>
                </div>
              )}
            </div>
            
            <div className="mt-8 text-white/40 text-sm font-bold tracking-widest uppercase">
              {attachmentModal.filename}
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
}