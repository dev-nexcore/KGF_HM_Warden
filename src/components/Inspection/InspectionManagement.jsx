"use client";

import { useState, useEffect } from "react";
import { Eye, Download, Trash2, Edit2, Calendar, Clock, MapPin, Users, ClipboardList, Clock3, CheckCircle } from "lucide-react";
import Image from "next/image";
import InspectionModal from "./InspectionModal";
import api from "@/lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PREDEFINED_LOCATIONS = [
  "Room No 101", "Room No 102", "Room No 103", "Room No 104", "Room No 105",
  "Room No 106", "Room No 107", "Room No 108", "Room No 109", "Room No 110",
  "Room No 201", "Room No 202", "Room No 203", "Room No 204", "Room No 205",
  "Room No 206", "Room No 207", "Room No 208", "Room No 209", "Room No 210",
  "Gym", "Prayer Room", "Kitchen Room", "Dining Room", "Study Room",
  "Conference Room", "Store Room", "Washing Machine Room",
  "Corridor- 1st Floor", "Corridor- 2nd Floor", "Corridor- 3rd Floor",
  "Wash Rooms", "Staircase", "Ground Floor", "Terrace"
];

const statusStyles = {
  Scheduled: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function InspectionPage() {
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    area: "",
    date: "",
    time: "",
    instructions: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [upcomingInspections, setUpcomingInspections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    areas: 0
  });
  const [activeFilter, setActiveFilter] = useState("total");
  const [activeTab, setActiveTab] = useState("issue");
  const [templates, setTemplates] = useState([]);
  const [templateForm, setTemplateForm] = useState({ title: "", target: "", area: "", instructions: "" });
  const [templateLoading, setTemplateLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmCompleteId, setConfirmCompleteId] = useState(null);

  const displayedInspections = upcomingInspections.filter(inspection => {
    if (activeFilter === "scheduled" && inspection.status !== "Scheduled") return false;
    if (activeFilter === "completed" && inspection.status !== "Completed") return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = inspection.title?.toLowerCase().includes(query);
      const matchTarget = inspection.target?.toLowerCase().includes(query);
      const matchArea = inspection.area?.toLowerCase().includes(query);
      const matchId = inspection.id?.toLowerCase().includes(query);
      
      if (!matchTitle && !matchTarget && !matchArea && !matchId) return false;
    }
    
    return true;
  });

  // API Functions
  const createInspectionAPI = async (inspectionData) => {
    try {
      const response = await api.post(`/api/wardenauth/inspections`, inspectionData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create inspection' };
    }
  };

  const fetchInspectionsAPI = async () => {
    try {
      const response = await api.get(`/api/wardenauth/inspections`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch inspections' };
    }
  };

  const fetchTemplatesAPI = async () => {
    try {
      const response = await api.get(`/api/wardenauth/inspection-templates`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      return { templates: [] };
    }
  };

  const createTemplateAPI = async (templateData) => {
    try {
      const response = await api.post(`/api/wardenauth/inspection-templates`, templateData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create template' };
    }
  };

  const updateInspectionStatusAPI = async (inspectionId, status) => {
    try {
      const response = await api.patch(`/api/wardenauth/inspections/${inspectionId}/status`, 
        { status }, 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update inspection status' };
    }
  };

  const deleteInspectionAPI = async (inspectionId) => {
    try {
      const response = await api.delete(`/api/wardenauth/inspections/${inspectionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete inspection' };
    }
  };

  // Calculate statistics
  const calculateStats = (inspections) => {
    const total = inspections.length;
    const scheduled = inspections.filter(i => i.status === 'Scheduled').length;
    const completed = inspections.filter(i => i.status === 'Completed').length;
    const cancelled = inspections.filter(i => i.status === 'Cancelled').length;
    const areas = new Set(inspections.map(i => i.area).filter(Boolean)).size;
    
    setStats({ total, scheduled, completed, cancelled, areas });
  };

  // Load inspections on component mount
  useEffect(() => {
    const loadInspections = async () => {
      try {
        setFetchLoading(true);
        const [inspectionsRes, templatesRes] = await Promise.all([
          fetchInspectionsAPI(),
          fetchTemplatesAPI()
        ]);
        const inspections = inspectionsRes.inspections || [];
        setUpcomingInspections(inspections);
        setTemplates(templatesRes.templates || []);
        calculateStats(inspections);
      } catch (error) {
        console.error('Error loading inspections:', error);
        toast.error(error.message || 'Failed to load inspections');
      } finally {
        setFetchLoading(false);
      }
    };

    loadInspections();
  }, []);

  const tableHeaders = [
    { label: "Inspection ID", key: "id" },
    { label: "Title", key: "title" },
    { label: "Target", key: "target" },
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions" },
  ];

  // Card data for stats
 const statCards = [
{
id: "total",
label: "Total Inspections",
value: stats.total,
subLabel: "All inspections",
borderColor: "border-blue-200",
bgColor: "bg-blue-50",
textColor: "text-blue-500",
badgeColor: "bg-blue-50 text-blue-600",
icon: <ClipboardList size={18} />,
},

{
id: "scheduled",
label: "Scheduled",
value: stats.scheduled,
subLabel: "Pending",
borderColor: "border-orange-200",
bgColor: "bg-orange-50",
textColor: "text-orange-500",
badgeColor: "bg-orange-50 text-orange-600",
icon: <Clock3 size={18} />,
},

{
id: "completed",
label: "Completed",
value: stats.completed,
subLabel: "Done",
borderColor: "border-green-200",
bgColor: "bg-green-50",
textColor: "text-green-500",
badgeColor: "bg-green-50 text-green-600",
icon: <CheckCircle size={18} />,
},

{
id: "areas",
label: "Areas Covered",
value: stats.areas,
subLabel: "Locations",
borderColor: "border-purple-200",
bgColor: "bg-purple-50",
textColor: "text-purple-500",
badgeColor: "bg-purple-50 text-purple-600",
icon: <MapPin size={18} />,
},
];


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "title") {
      const selectedTemplate = templates.find(t => t.title === value);
      if (selectedTemplate) {
        setFormData((prev) => ({
          ...prev,
          title: value,
          target: selectedTemplate.target || prev.target,
          area: selectedTemplate.area || prev.area,
          instructions: selectedTemplate.instructions || prev.instructions
        }));
        setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
        return;
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.target) newErrors.target = "Target is required.";
    if (!formData.area) newErrors.area = "Area is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (!formData.time) newErrors.time = "Time is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    setTemplateLoading(true);
    try {
      await createTemplateAPI(templateForm);
      toast.success("Template created successfully");
      const templatesRes = await fetchTemplatesAPI();
      setTemplates(templatesRes.templates || []);
      setActiveTab("issue");
      setTemplateForm({ title: "", target: "", area: "", instructions: "" });
    } catch (error) {
      toast.error(error.message || "Failed to create template");
    } finally {
      setTemplateLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const datetime = new Date(`${formData.date}T${formData.time}`);
      
      const inspectionData = {
        title: formData.title,
        target: formData.target,
        area: formData.area,
        datetime: datetime.toISOString(),
        instructions: formData.instructions || ''
      };

      const response = await createInspectionAPI(inspectionData);
      
      const newInspection = {
        id: response.inspection.id,
        title: response.inspection.title,
        target: response.inspection.target,
        area: response.inspection.area,
        date: new Date(response.inspection.datetime).toLocaleDateString('en-GB'),
        time: new Date(response.inspection.datetime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        datetime: response.inspection.datetime,
        instructions: response.inspection.instructions,
        status: response.inspection.status === 'pending' ? 'Scheduled' : 'Completed',
        createdAt: response.inspection.createdAt
      };
      
      setUpcomingInspections(prev => [newInspection, ...prev]);
      calculateStats([newInspection, ...upcomingInspections]);
      
      setFormData({
        title: "",
        target: "",
        area: "",
        date: "",
        time: "",
        instructions: "",
      });
      
      setSubmitted(true);
      toast.success("Inspection Scheduled Successfully");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error creating inspection:', error);
      toast.error(error.message || 'Error scheduling inspection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (inspection) => {
    const reportData = {
      inspectionId: inspection.id,
      title: inspection.title,
      target: inspection.target,
      date: inspection.date,
      time: inspection.time,
      status: inspection.status,
      area: inspection.area || 'N/A',
      instructions: inspection.instructions || 'No specific instructions'
    };
    
    const reportContent = `
INSPECTION REPORT
================

Inspection ID: ${reportData.inspectionId ? `INSP-${reportData.inspectionId.slice(-4).toUpperCase()}` : "N/A"}
Title: ${reportData.title}
Target: ${reportData.target}
Area: ${reportData.area}
Date: ${reportData.date}
Time: ${reportData.time}
Status: ${reportData.status}

Instructions:
${reportData.instructions}

Generated on: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inspection_report_${inspection.id ? `INSP-${inspection.id.slice(-4).toUpperCase()}` : "unknown"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully");
  };

  const handleViewDetails = (inspection) => {
    setSelectedInspection(inspection);
  };

  const handleStatusUpdate = async (inspectionId, newStatus) => {
    try {
      const backendStatus = newStatus === 'Completed' ? 'completed' : 
                           newStatus === 'Cancelled' ? 'cancelled' : 'pending';
      await updateInspectionStatusAPI(inspectionId, backendStatus);
      
      const updatedInspections = upcomingInspections.map(inspection => 
        inspection.id === inspectionId 
          ? { ...inspection, status: newStatus }
          : inspection
      );
      
      setUpcomingInspections(updatedInspections);
      calculateStats(updatedInspections);
      
      toast.info(`Inspection status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update inspection status');
    }
  };

  const handleDeleteInspection = async (inspectionId) => {
    if (!confirm('Are you sure you want to delete this inspection?')) {
      return;
    }

    try {
      await deleteInspectionAPI(inspectionId);
      
      const updatedInspections = upcomingInspections.filter(
        inspection => inspection.id !== inspectionId
      );
      
      setUpcomingInspections(updatedInspections);
      calculateStats(updatedInspections);
      
      toast.success('Inspection deleted successfully');
    } catch (error) {
      console.error('Error deleting inspection:', error);
      toast.error(error.message || 'Failed to delete inspection');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black">
            <span className="border-l-4 border-[#4F8CCF] pl-3 inline-block">
              Hostel Inspections
            </span>
          </h2>
          <p className="text-gray-600 mt-2 ml-3">Schedule and manage hostel inspections</p>
        </div>

        {/* Stats Cards Section */}
       

        {/* Alternative Minimal Cards Design */}
   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
  {statCards.map((card) => (
    <div
      key={card.id}
      onClick={() => setActiveFilter(card.id)}
      className={`bg-white rounded-2xl p-5 border ${card.borderColor} ${activeFilter === card.id ? "ring-2 ring-offset-2 ring-" + card.borderColor.split("-")[1] + "-500" : ""} shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
    >
      <div
        className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center mb-4`}
      >
        <div className={card.textColor}>
          {card.icon}
        </div>
      </div>

  <div className="text-4xl font-bold text-black">
    {card.value}
  </div>

  <div className="text-gray-700 text-sm font-medium mt-1">
    {card.label}
  </div>

  <div
    className={`inline-block mt-4 px-3 py-1 text-xs font-medium rounded-full ${card.badgeColor}`}
  >
    {card.subLabel}
  </div>

</div>
))}
</div>


      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-black font-[Poppins]">Inspection List</h3>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <input
            type="text"
            placeholder="Search title, area, target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#4F8CCF] w-full sm:w-64 text-black"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap text-sm font-medium cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Inspection Table */}
        <InspectionTable
          upcomingInspections={displayedInspections}
          fetchLoading={fetchLoading}
          handleViewDetails={handleViewDetails}
          handleDownload={handleDownload}
          handleStatusUpdate={handleStatusUpdate}
          statusStyles={statusStyles}
          setConfirmCompleteId={setConfirmCompleteId}
        />
      </div>

      {confirmCompleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm border border-gray-100 p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Inspection</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to mark this inspection as completed? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmCompleteId(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleStatusUpdate(confirmCompleteId, 'Completed');
                  setConfirmCompleteId(null);
                }}
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
              >
                Yes, Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedInspection && (
        <InspectionModal
          isOpen={!!selectedInspection}
          onClose={() => setSelectedInspection(null)}
          section="Inspection Details"
          headers={[
            "Inspection ID",
            "Title",
            "Target",
            "Area",
            "Date",
            "Time",
            "Status",
            "Instructions"
          ]}
          row={[
            <span key="id" title={selectedInspection.id}>
              {selectedInspection.id ? `INSP-${selectedInspection.id.slice(-4).toUpperCase()}` : "N/A"}
            </span>,
            selectedInspection.title,
            selectedInspection.target,
            selectedInspection.area || 'N/A',
            selectedInspection.date,
            selectedInspection.time,
            <span
              key="status"
              className={`inline-block px-3 py-1 text-xs font-medium rounded-lg cursor-pointer ${
                statusStyles[selectedInspection.status] ??
                "bg-gray-300 text-black"
              }`}
              onClick={() => {
                const newStatus = selectedInspection.status === 'Scheduled' ? 'Completed' : 'Scheduled';
                handleStatusUpdate(selectedInspection.id, newStatus);
                setSelectedInspection(prev => ({ ...prev, status: newStatus }));
              }}
              title="Click to toggle status"
            >
              {selectedInspection.status}
            </span>,
            selectedInspection.instructions || 'No specific instructions'
          ]}
          inspection={selectedInspection}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteInspection}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}

// InspectionTable Component with modern design
function InspectionTable({ 
  upcomingInspections, 
  fetchLoading, 
  handleViewDetails, 
  handleDownload, 
  handleStatusUpdate, 
  statusStyles,
  setConfirmCompleteId
}) {
  const tableHeaders = [
    { label: "Inspection ID", key: "id" },
    { label: "Title", key: "title" },
    { label: "Target", key: "target" },
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Status", key: "status" },
    { label: "Actions", key: "actions" },
  ];

  if (fetchLoading) {
    return (
      <div className="bg-[#f4f6f0] rounded-2xl p-8 shadow-xl border border-[#BEC5AD]/30">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f6f0] rounded-2xl shadow-lg overflow-hidden mb-6 border border-[#BEC5AD]/30" style={{ fontFamily: 'Inter' }}>
      <div className="bg-gradient-to-r from-[#BEC5AD] to-[#a8b096] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-black font-[Poppins]">
            Upcoming Inspections
          </h2>
          <p className="text-sm text-gray-700 mt-1 font-medium">Total: {upcomingInspections.length} records</p>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              {tableHeaders.map((header, i) => (
                <th key={i} className="px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap text-center">
                  {header.label}
                </th>
              ))}
             </tr>
          </thead>
          <tbody>
            {upcomingInspections.length === 0 ? (
              <tr>
                <td colSpan={tableHeaders.length} className="text-center py-8 text-gray-600 font-medium">
                  No inspections found. Create your first inspection above.
                </td>
              </tr>
            ) : (
              upcomingInspections.map((row, rowIndex) => (
                <tr key={rowIndex} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {tableHeaders.map((column, cellIndex) => {
                    if (column.key === "actions") {
                      return (
                        <td key={cellIndex} className="text-center px-4 py-3">
                          <div className="flex justify-center items-center gap-3">
                            <button
                              onClick={() => handleViewDetails(row)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 transition-colors bg-white rounded-lg shadow-sm border border-gray-200"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => setConfirmCompleteId(row.id)}
                              className="p-1.5 text-yellow-600 hover:text-yellow-800 transition-colors bg-white rounded-lg shadow-sm border border-gray-200"
                              title="Mark as Completed"
                              disabled={row.status === 'Completed'}
                            >
                              <CheckCircle size={18} className={row.status === 'Completed' ? 'opacity-50' : ''} />
                            </button>
                            <button
                              onClick={() => handleDownload(row)}
                              className="p-1.5 text-green-600 hover:text-green-800 transition-colors bg-white rounded-lg shadow-sm border border-gray-200"
                              title="Download Report"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </td>
                      );
                    }

                    if (column.key === "status") {
                      return (
                        <td key={cellIndex} className="text-center px-4 py-3">
                          <button
                            className={`inline-block px-3 py-1 text-xs font-bold transition-colors ${
                              statusStyles[row.status] ?? "bg-gray-100 text-gray-800 rounded-full"
                            }`}
                            onClick={() => {
                              const newStatus = row.status === 'Scheduled' ? 'Completed' : 
                                               row.status === 'Completed' ? 'Cancelled' : 'Scheduled';
                              handleStatusUpdate(row.id, newStatus);
                            }}
                            title="Click to change status"
                          >
                            {row.status}
                          </button>
                        </td>
                      );
                    }

                    if (column.key === "id") {
                      return (
                        <td key={cellIndex} className="text-center px-4 py-3">
                          <span title={row[column.key]} className="font-mono text-xs font-semibold text-gray-800">
                            {row[column.key] ? `INSP-${row[column.key].slice(-4).toUpperCase()}` : "N/A"}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={cellIndex} className="text-center px-4 py-3 text-sm font-semibold text-gray-800">
                        {row[column.key]}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 lg:hidden p-4">
        {upcomingInspections.length === 0 ? (
          <div className="text-center py-8 text-gray-600 bg-white rounded-xl shadow-md font-medium">
            No inspections found. Create your first inspection above.
          </div>
        ) : (
          upcomingInspections.map((row, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-md border-l-4 border-[#BEC5AD]">
              <div className="mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inspection ID</span>
                <p className="text-sm font-bold font-mono text-gray-900">{row.id ? `INSP-${row.id.slice(-4).toUpperCase()}` : "N/A"}</p>
              </div>
              <div className="mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</span>
                <p className="text-sm font-bold text-gray-900">{row.title}</p>
              </div>
              <div className="mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target</span>
                <p className="text-sm font-bold text-gray-900">{row.target}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</span>
                  <p className="text-sm font-semibold">{row.date}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Time</span>
                  <p className="text-sm font-semibold">{row.time}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(row)}
                    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    title="View Details"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => handleDownload(row)}
                    className="flex-1 bg-green-50 text-green-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                    title="Download Report"
                  >
                    <Download size={16} /> Get
                  </button>
                </div>
                <button
                  className={`inline-block px-3 py-1.5 text-xs font-bold transition-colors ${
                    statusStyles[row.status] ?? "bg-gray-100 text-gray-800 rounded-full"
                  }`}
                  onClick={() => {
                    const newStatus = row.status === 'Scheduled' ? 'Completed' : 
                                     row.status === 'Completed' ? 'Cancelled' : 'Scheduled';
                    handleStatusUpdate(row.id, newStatus);
                  }}
                  title="Click to change status"
                >
                  {row.status}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
