// "use client";
// import Image from 'next/image';

// export default function LeaveRequestManagement() {
//   const stats = [
//     { label: 'Total Requests', value: 120, color: '#CBD2BB', textColor: '#000000' },
//     { label: 'Pending Requests', value: 15, color: '#CBD2BB', textColor: '#FF9D00' },
//     { label: 'Approved Requests', value: 90, color: '#CBD2BB', textColor: '#28C404' },
//     { label: 'Rejected Requests', value: 15, color: '#CBD2BB', textColor: '#FF0000' },
//   ];

//   const leaveRequests = [
//     {
//       id: '001',
//       studentName: 'Chinmay Gawade',
//       leaveType: 'Medical',
//       startDate: '05-07-2025',
//       endDate: '05-07-2025',
//       status: 'Pending',
//     },
//     {
//       id: '002',
//       studentName: 'Krutika Mishra',
//       leaveType: 'Family Event',
//       startDate: '05-07-2025',
//       endDate: '05-07-2025',
//       status: 'Approved',
//     },
//     {
//       id: '003',
//       studentName: 'Sufyan Khan',
//       leaveType: 'Personal',
//       startDate: '05-07-2025',
//       endDate: '05-07-2025',
//       status: 'Rejected',
//     },
//   ];

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'text-orange-600 bg-orange-100 border border-orange-200',
//       approved: 'text-green-600 bg-green-100 border border-green-200',
//       rejected: 'text-red-600 bg-red-100 border border-red-200',
//     };
//     return colors[status.toLowerCase()] || 'text-gray-600 bg-gray-100 border border-gray-200';
//   };

//   return (
//     <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 space-y-3 bg-white min-h-screen max-w-full overflow-x-hidden">
      
//       {/* Page Header */}
//       <div className="flex items-center mb-4">
//         <div className="w-1 h-6 sm:h-8 bg-red-500 mr-2 rounded-full flex-shrink-0"></div>
//         <h1 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-gray-900">
//           Leave Request Management
//         </h1>
//       </div>

//       {/* Statistics */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
//         {stats.map((stat, i) => (
//           <div key={i} className="p-3 sm:p-5 rounded-lg shadow-sm" style={{ backgroundColor: stat.color }}>
//             <div className="text-xs sm:text-sm md:text-base font-medium text-gray-600 mb-2">
//               {stat.label}
//             </div>
//             <div className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: stat.textColor }}>
//               {stat.value}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Filter Section */}
//       <div className="bg-white p-3 sm:p-5 rounded-lg drop-shadow-lg">
//         <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Leave Requests</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Student Name / ID</label>
//             <input type="text" placeholder="Search By Name or ID"
//               className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
//               style={{ backgroundColor: '#D9D9D9', color: '#000' }}
//             />
//           </div>
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
//               style={{ backgroundColor: '#D9D9D9', color: '#000' }}
//               defaultValue="All Status"
//             >
//               <option>All Status</option>
//               <option>Pending</option>
//               <option>Approved</option>
//               <option>Rejected</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date Range</label>
//             <div className="relative flex items-center">
//               <input type="text" placeholder="dd-mm-yyyy"
//                 className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md pr-10"
//                 style={{ backgroundColor: '#D9D9D9', color: '#000' }}
//               />
//               <div className="absolute right-3">
//                 <Image src="/leave/calender.png" alt="Calendar" width={20} height={20} className="rounded" />
//               </div>
//             </div>
//           </div>
//           <div className="flex items-end">
//             <button className="w-full bg-blue-500 text-white px-3 py-2 rounded-md flex items-center justify-center gap-2 font-medium hover:bg-blue-600 transition">
//               <span className="hidden sm:inline">Apply Filters</span>
//               <span className="sm:hidden">Filter</span>
//               <img src="/leave/filter.png" alt="Filter" width={16} height={16} className="rounded" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Recent Leave Requests */}
//       <div className="bg-white p-3 sm:p-5 rounded-lg drop-shadow-lg">
//         <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Leave Requests</h2>

//         {/* Mobile Card List */}
//         <div className="space-y-3 block lg:hidden">
//           {leaveRequests.map((req, i) => (
//             <div key={req.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
//               <div className="flex justify-between items-start mb-1">
//                 <div>
//                   <div className="font-semibold text-base truncate">{req.studentName}</div>
//                   <div className="text-xs text-gray-600">ID: {req.id}</div>
//                 </div>
//                 <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
//                   {req.status}
//                 </span>
//               </div>
//               <div className="flex flex-wrap gap-3 text-xs mb-2">
//                 <div><span className="font-medium">Type:</span> {req.leaveType}</div>
//                 <div><span className="font-medium">Start:</span> {req.startDate}</div>
//                 <div><span className="font-medium">End:</span> {req.endDate}</div>
//               </div>
//               <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-200">
//                 {req.studentName === 'Chinmay Gawade' ? (
//                   <>
//                     <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></button>
//                     <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
//                   </>
//                 ) : (
//                   <>
//                     {req.status === 'Pending' && <button className="p-2"><Image src="/approved.jpg" alt="Approve" width={18} height={18} className="rounded" /></button>}
//                     <button className="p-2"><Image src="/leave/edit.png" alt="Border Color" width={18} height={18} className="rounded" /></button>
//                     <button className="p-2"><Image src="/leave/del.png" alt="Delete" width={18} height={18} className="rounded" /></button>
//                     {req.status === 'Pending' && <button className="p-2"><Image src="/leave/rejected.jpg" alt="Reject" width={18} height={18} className="rounded" /></button>}
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Desktop Table */}
//         <div className="hidden lg:block overflow-x-auto">
//           <table className="w-full min-w-[800px]">
//             <thead style={{ backgroundColor: '#D9D9D9' }}>
//               <tr>
//                 <th className="px-2 py-3 text-left font-semibold">Student ID</th>
//                 <th className="px-2 py-3 text-left font-semibold">Student Name</th>
//                 <th className="px-2 py-3 text-left font-semibold">Leave Type</th>
//                 <th className="px-2 py-3 text-left font-semibold">Start Date</th>
//                 <th className="px-2 py-3 text-left font-semibold">End Date</th>
//                 <th className="px-2 py-3 text-left font-semibold">Status</th>
//                 <th className="px-2 py-3 text-left font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {leaveRequests.map((req, i) => (
//                 <tr key={req.id} className="border-b border-gray-200 hover:bg-gray-50">
//                   <td className="px-2 py-3">{req.id}</td>
//                   <td className="px-2 py-3">{req.studentName}</td>
//                   <td className="px-2 py-3">{req.leaveType}</td>
//                   <td className="px-2 py-3">{req.startDate}</td>
//                   <td className="px-2 py-3">{req.endDate}</td>
//                   <td className="px-2 py-3">
//                     <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
//                       {req.status}
//                     </span>
//                   </td>
//                   <td className="px-2 py-3">
//                     <div className="flex items-center space-x-2">
//                       {req.studentName === 'Chinmay Gawade' ? (
//                         <>
//                           <button className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></button>
//                           <button className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
//                         </>
//                       ) : (
//                         <>
//                           {req.status === 'Pending' && <button className="p-1"><Image src="/approved.jpg" alt="Approve" width={18} height={18} className="rounded" /></button>}
//                           <button className="p-1"><Image src="/leave/edit.png" alt="Border Color" width={18} height={18} className="rounded" /></button>
//                           <button className="p-1"><Image src="/leave/del.png" alt="Delete" width={18} height={18} className="rounded" /></button>
//                           {req.status === 'Pending' && <button className="p-1"><Image src="/rejected.jpg" alt="Reject" width={18} height={18} className="rounded" /></button>}
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {/* End Table */}
//         {leaveRequests.length === 0 && (
//           <div className="text-center py-10 text-gray-500">
//             <p className="font-medium">No leave requests found</p>
//             <p className="text-sm">Try adjusting your filters or check back later.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






// "use client";

// import { MdCheck, MdClose, MdDelete } from "react-icons/md";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const API_BASE = "http://localhost:5000/api/wardenauth";

// function getStatusColor(status) {
//   const colors = {
//     pending: "text-orange-600 bg-orange-100 border border-orange-200",
//     approved: "text-green-600 bg-green-100 border border-green-200",
//     rejected: "text-red-600 bg-red-100 border border-red-200",
//   };
//   return colors[status.toLowerCase()] || "text-gray-600 bg-gray-100 border border-gray-200";
// }

// export default function LeaveRequestsDashboard() {
//   const [filters, setFilters] = useState({ student: "", status: "", date: "" });
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [stats, setStats] = useState([]);

//   const fetchFilteredLeaves = async () => {
//     try {
//       const query = {};
//       const studentInput = filters.student.trim();
//       if (studentInput) {
//         if (!isNaN(studentInput)) query.studentId = studentInput;
//         else query.studentName = studentInput;
//       }
//       if (filters.status) query.status = filters.status.toLowerCase();
//       if (filters.date) {
//         query.startDate = filters.date;
//         query.endDate = filters.date;
//       }

//       const res = await axios.get(`${API_BASE}/leave-filter`, {
//         params: query,
//         headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
//       });

//       setLeaveRequests(res.data);
//     } catch (err) {
//       toast.error("Failed to fetch leave requests.");
//       console.error("Error fetching filtered leaves", err);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/leave-stats`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
//       });

//       setStats([
//         { label: "Total Requests", value: res.data.totalRequests, color: "#CBD2BB", textColor: "#000000" },
//         { label: "Pending Requests", value: res.data.pendingRequests, color: "#CBD2BB", textColor: "#FF9D00" },
//         { label: "Approved Requests", value: res.data.approvedRequests, color: "#CBD2BB", textColor: "#28C404" },
//         { label: "Rejected Requests", value: res.data.rejectedRequests, color: "#CBD2BB", textColor: "#FF0000" },
//       ]);
//     } catch (err) {
//       toast.error("Failed to fetch stats.");
//       console.error("Error fetching stats", err);
//     }
//   };

//   const clearFilters = () => {
//     setFilters({ student: "", status: "", date: "" });
//   };

//   const handleChange = (field) => (e) => {
//     setFilters((prev) => ({ ...prev, [field]: e.target.value }));
//   };

//   const updateLeaveStatus = async (leaveId, status) => {
//     const confirmMsg = `Are you sure you want to ${status.toUpperCase()} this leave request?`;
//     if (!window.confirm(confirmMsg)) return;

//     try {
//       await axios.put(
//         `${API_BASE}/${leaveId}/status`,
//         { status },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
//       );
//       toast.success(`Leave request ${status} successfully.`);
//       fetchFilteredLeaves();
//       fetchStats();
//     } catch (err) {
//       toast.error(`Failed to update status to ${status}.`);
//       console.error("Error updating leave status", err);
//     }
//   };

//   const deleteLeave = async (leaveId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this leave request?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${API_BASE}/leave/${leaveId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
//       });
//       toast.success("Leave request deleted.");
//       fetchFilteredLeaves();
//       fetchStats();
//     } catch (err) {
//       toast.error("Failed to delete leave request.");
//       console.error("Error deleting leave request", err);
//     }
//   };

//   useEffect(() => {
//     fetchFilteredLeaves();
//     fetchStats();
//   }, [filters]);

//   return (
//     <div className="p-5 bg-white min-h-screen space-y-6">
//       <div className="flex items-center">
//         <div className="w-1 h-6 bg-red-500 rounded-full mr-2"></div>
//         <h1 className="text-2xl font-bold text-gray-900">Leave Request Management</h1>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//         {stats.map((stat) => (
//           <div key={stat.label} className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: stat.color }}>
//             <p className="text-sm font-medium text-gray-700">{stat.label}</p>
//             <p className="text-2xl font-bold" style={{ color: stat.textColor }}>{stat.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Leave Requests</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <input
//             type="text"
//             value={filters.student}
//             onChange={handleChange("student")}
//             placeholder="Search by Name or ID"
//             className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
//           />
//           <select
//             value={filters.status}
//             onChange={handleChange("status")}
//             className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
//           <input
//             type="date"
//             value={filters.date}
//             onChange={handleChange("date")}
//             className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
//           />
//           <button
//             className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded shadow"
//             onClick={clearFilters}
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
//         <table className="w-full min-w-[800px] text-sm">
//           <thead className="bg-[#D9D9D9]">
//             <tr>
//               <th className="px-3 py-2 text-left font-semibold">Student ID</th>
//               <th className="px-3 py-2 text-left font-semibold">Student Name</th>
//               <th className="px-3 py-2 text-left font-semibold">Leave Type</th>
//               <th className="px-3 py-2 text-left font-semibold">Start Date</th>
//               <th className="px-3 py-2 text-left font-semibold">End Date</th>
//               <th className="px-3 py-2 text-left font-semibold">Status</th>
//               <th className="px-3 py-2 text-left font-semibold">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaveRequests.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-8 text-gray-500">No leave requests found.</td>
//               </tr>
//             ) : (
//               leaveRequests.map((req) => (
//                 <tr key={req._id} className="border-b hover:bg-gray-50">
//                   <td className="px-3 py-2">{req.studentId?.studentId || "-"}</td>
//                   <td className="px-3 py-2">
//                     {req.studentId?.firstName && req.studentId?.lastName
//                       ? `${req.studentId.firstName} ${req.studentId.lastName}`
//                       : "-"}
//                   </td>
//                   <td className="px-3 py-2">{req.leaveType}</td>
//                   <td className="px-3 py-2">{new Date(req.startDate).toLocaleDateString()}</td>
//                   <td className="px-3 py-2">{new Date(req.endDate).toLocaleDateString()}</td>
//                   <td className="px-3 py-2">
//                     <span className={`inline-block px-3 py-1 rounded-full ${getStatusColor(req.status)}`}>
//                       {req.status}
//                     </span>
//                   </td>
//                   <td className="px-3 py-2">
//                     <div className="flex space-x-2">
//                       {req.status === "pending" ? (
//                         <>
//                           <button
//                             onClick={() => updateLeaveStatus(req._id, "approved")}
//                             title="Approve"
//                             className="text-green-600 hover:text-green-800"
//                           >
//                             <MdCheck size={20} />
//                           </button>
//                           <button
//                             onClick={() => updateLeaveStatus(req._id, "rejected")}
//                             title="Reject"
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <MdClose size={20} />
//                           </button>
//                           <button disabled className="opacity-50 cursor-not-allowed" title="Delete">
//                             <MdDelete size={20} />
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           onClick={() => deleteLeave(req._id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <MdDelete size={20} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { MdCheck, MdClose, MdDelete } from "react-icons/md";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const API_BASE = "http://localhost:5000/api/wardenauth";

// function getStatusColor(status) {
//   const colors = {
//     pending: "text-orange-600 bg-orange-100 border border-orange-200",
//     approved: "text-green-600 bg-green-100 border border-green-200",
//     rejected: "text-red-600 bg-red-100 border border-red-200",
//   };
//   return colors[status.toLowerCase()] || "text-gray-600 bg-gray-100 border border-gray-200";
// }

// export default function LeaveRequestsDashboard() {
//   const [filters, setFilters] = useState({ student: "", status: "", date: "" });
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [stats, setStats] = useState([]);

//   const fetchFilteredLeaves = async () => {
//     try {
//       const query = {};
//       const studentInput = filters.student.trim();
//       if (studentInput) {
//         query.studentName = studentInput;
//         query.studentId = studentInput;
//       }
//       if (filters.status) query.status = filters.status.toLowerCase();
//       if (filters.date) {
//         query.startDate = filters.date;
//         query.endDate = filters.date;
//       }

//       const res = await axios.get(`${API_BASE}/leave-filter`, {
//         params: query,
//         headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
//       });

//       setLeaveRequests(res.data);
//     } catch (err) {
//       toast.error("Failed to fetch leave requests.");
//       console.error("Error fetching filtered leaves", err);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/leave-stats`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
//       });

//       setStats([
//         { label: "Total Requests", value: res.data.totalRequests, color: "#CBD2BB", textColor: "#000000" },
//         { label: "Pending Requests", value: res.data.pendingRequests, color: "#CBD2BB", textColor: "#FF9D00" },
//         { label: "Approved Requests", value: res.data.approvedRequests, color: "#CBD2BB", textColor: "#28C404" },
//         { label: "Rejected Requests", value: res.data.rejectedRequests, color: "#CBD2BB", textColor: "#FF0000" },
//       ]);
//     } catch (err) {
//       toast.error("Failed to fetch stats.");
//       console.error("Error fetching stats", err);
//     }
//   };

//   const clearFilters = () => {
//     setFilters({ student: "", status: "", date: "" });
//     toast.info("Filters cleared");
//   };

//   const handleChange = (field) => (e) => {
//     setFilters((prev) => ({ ...prev, [field]: e.target.value }));
//   };

//   const updateLeaveStatus = async (leaveId, status) => {
//     const confirmMsg = `Are you sure you want to ${status.toUpperCase()} this leave request?`;
//     if (!window.confirm(confirmMsg)) return;

//     try {
//       await axios.put(
//         `${API_BASE}/${leaveId}/status`,
//         { status },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
//       );
//       toast.success(`Leave request ${status} successfully.`);
//       fetchFilteredLeaves();
//       fetchStats();
//     } catch (err) {
//       toast.error(`Failed to update leave status to ${status}.`);
//       console.error("Error updating leave status", err);
//     }
//   };

//   const deleteLeave = async (leaveId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this leave request?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${API_BASE}/leave/${leaveId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
//       });
//       toast.success("Leave request deleted.");
//       fetchFilteredLeaves();
//       fetchStats();
//     } catch (err) {
//       toast.error("Failed to delete leave request.");
//       console.error("Error deleting leave request", err);
//     }
//   };

//   useEffect(() => {
//     fetchFilteredLeaves();
//     fetchStats();
//   }, [filters]);

//   return (
//     <div className="p-5 bg-white min-h-screen space-y-6">
//       <div className="flex items-center">
//         <div className="w-1 h-6 bg-red-500 rounded-full mr-2"></div>
//         <h1 className="text-2xl font-bold text-gray-900">Leave Request Management</h1>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//         {stats.map((stat) => (
//           <div key={stat.label} className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: stat.color }}>
//             <p className="text-sm font-medium text-gray-700">{stat.label}</p>
//             <p className="text-2xl font-bold" style={{ color: stat.textColor }}>{stat.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Leave Requests</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <input
//             type="text"
//             value={filters.student}
//             onChange={handleChange("student")}
//             placeholder="Search by Name or ID"
//             className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
//           />
//           <select
//             value={filters.status}
//             onChange={handleChange("status")}
//             className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
//           <input
//             type="date"
//             value={filters.date}
//             onChange={handleChange("date")}
//             className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
//           />
//           <button
//             className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded shadow"
//             onClick={clearFilters}
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
//         <table className="w-full min-w-[800px] text-sm">
//           <thead className="bg-[#D9D9D9]">
//             <tr>
//               <th className="px-3 py-2 text-left font-semibold">Student ID</th>
//               <th className="px-3 py-2 text-left font-semibold">Student Name</th>
//               <th className="px-3 py-2 text-left font-semibold">Leave Type</th>
//               <th className="px-3 py-2 text-left font-semibold">Start Date</th>
//               <th className="px-3 py-2 text-left font-semibold">End Date</th>
//               <th className="px-3 py-2 text-left font-semibold">Status</th>
//               <th className="px-3 py-2 text-left font-semibold">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaveRequests.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-8 text-gray-500">No leave requests found.</td>
//               </tr>
//             ) : (
//               leaveRequests.map((req) => (
//                 <tr key={req._id} className="border-b hover:bg-gray-50">
//                   <td className="px-3 py-2">{req.studentId?.studentId || "-"}</td>
//                   <td className="px-3 py-2">
//                     {req.studentId?.firstName && req.studentId?.lastName
//                       ? `${req.studentId.firstName} ${req.studentId.lastName}`
//                       : "-"}
//                   </td>
//                   <td className="px-3 py-2">{req.leaveType}</td>
//                   <td className="px-3 py-2">{new Date(req.startDate).toLocaleDateString()}</td>
//                   <td className="px-3 py-2">{new Date(req.endDate).toLocaleDateString()}</td>
//                   <td className="px-3 py-2">
//                     <span className={`inline-block px-3 py-1 rounded-full ${getStatusColor(req.status)}`}>
//                       {req.status}
//                     </span>
//                   </td>
//                   <td className="px-3 py-2">
//                     <div className="flex space-x-2">
//                       {req.status === "pending" ? (
//                         <>
//                           <button
//                             onClick={() => updateLeaveStatus(req._id, "approved")}
//                             title="Approve"
//                             className="text-green-600 hover:text-green-800"
//                           >
//                             <MdCheck size={20} />
//                           </button>
//                           <button
//                             onClick={() => updateLeaveStatus(req._id, "rejected")}
//                             title="Reject"
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <MdClose size={20} />
//                           </button>
//                           <button disabled className="opacity-50 cursor-not-allowed" title="Delete">
//                             <MdDelete size={20} />
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           onClick={() => deleteLeave(req._id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <MdDelete size={20} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { MdCheck, MdClose, MdDelete, MdVisibility } from "react-icons/md";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const API_BASE = "http://localhost:5000/api/wardenauth";

// function getStatusColor(status) {
//   const colors = {
//     pending: "text-orange-600 bg-orange-100 border border-orange-200",
//     approved: "text-green-600 bg-green-100 border border-green-200",
//     rejected: "text-red-600 bg-red-100 border border-red-200",
//   };
//   return colors[status.toLowerCase()] || "text-gray-600 bg-gray-100 border border-gray-200";
// }

// export default function LeaveRequestsDashboard() {
//   const [filters, setFilters] = useState({ student: "", status: "", date: "" });
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [stats, setStats] = useState([]);
//   const [selectedLeave, setSelectedLeave] = useState(null); // for modal

//   const fetchFilteredLeaves = async () => {
//     try {
//       const query = {};
//       const studentInput = filters.student.trim();
//       if (studentInput) {
//         query.studentName = studentInput;
//         query.studentId = studentInput;
//       }
//       if (filters.status) query.status = filters.status.toLowerCase();
//       if (filters.date) {
//         query.startDate = filters.date;
//         query.endDate = filters.date;
//       }

//       const res = await axios.get(`${API_BASE}/leave-filter`, {
//         params: query,
//         headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
//       });

//       setLeaveRequests(res.data);
//     } catch (err) {
//       toast.error("Failed to fetch leave requests.");
//       console.error("Error fetching filtered leaves", err);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/leave-stats`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
//       });

//       setStats([
//         { label: "Total Requests", value: res.data.totalRequests, color: "#CBD2BB", textColor: "#000000" },
//         { label: "Pending Requests", value: res.data.pendingRequests, color: "#CBD2BB", textColor: "#FF9D00" },
//         { label: "Approved Requests", value: res.data.approvedRequests, color: "#CBD2BB", textColor: "#28C404" },
//         { label: "Rejected Requests", value: res.data.rejectedRequests, color: "#CBD2BB", textColor: "#FF0000" },
//       ]);
//     } catch (err) {
//       toast.error("Failed to fetch stats.");
//       console.error("Error fetching stats", err);
//     }
//   };

//   const clearFilters = () => {
//     setFilters({ student: "", status: "", date: "" });
//     toast.info("Filters cleared");
//   };

//   const handleChange = (field) => (e) => {
//     setFilters((prev) => ({ ...prev, [field]: e.target.value }));
//   };

//   const updateLeaveStatus = async (leaveId, status) => {
//     const confirmMsg = `Are you sure you want to ${status.toUpperCase()} this leave request?`;
//     if (!window.confirm(confirmMsg)) return;

//     try {
//       await axios.put(
//         `${API_BASE}/${leaveId}/status`,
//         { status },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
//       );
//       toast.success(`Leave request ${status} successfully.`);
//       fetchFilteredLeaves();
//       fetchStats();
//     } catch (err) {
//       toast.error(`Failed to update leave status to ${status}.`);
//       console.error("Error updating leave status", err);
//     }
//   };

//   const deleteLeave = async (leaveId) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this leave request?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${API_BASE}/leave/${leaveId}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
//       });
//       toast.success("Leave request deleted.");
//       fetchFilteredLeaves();
//       fetchStats();
//     } catch (err) {
//       toast.error("Failed to delete leave request.");
//       console.error("Error deleting leave request", err);
//     }
//   };

//   useEffect(() => {
//     fetchFilteredLeaves();
//     fetchStats();
//   }, [filters]);

//   return (
//     <div className="p-5 bg-white min-h-screen space-y-6">
//       <div className="flex items-center">
//         <div className="w-1 h-6 bg-red-500 rounded-full mr-2"></div>
//         <h1 className="text-2xl font-bold text-gray-900">Leave Request Management</h1>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//         {stats.map((stat) => (
//           <div key={stat.label} className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: stat.color }}>
//             <p className="text-sm font-medium text-gray-700">{stat.label}</p>
//             <p className="text-2xl font-bold" style={{ color: stat.textColor }}>{stat.value}</p>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow">
//         <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Leave Requests</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <input
//             type="text"
//             value={filters.student}
//             onChange={handleChange("student")}
//             placeholder="Search by Name or ID"
//             className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
//           />
//           <select
//             value={filters.status}
//             onChange={handleChange("status")}
//             className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
//           <input
//             type="date"
//             value={filters.date}
//             onChange={handleChange("date")}
//             className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
//           />
//           <button
//             className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded shadow"
//             onClick={clearFilters}
//           >
//             Clear Filters
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
//         <table className="w-full min-w-[800px] text-sm">
//           <thead className="bg-[#D9D9D9]">
//             <tr>
//               <th className="px-3 py-2 text-left font-semibold">Student ID</th>
//               <th className="px-3 py-2 text-left font-semibold">Student Name</th>
//               <th className="px-3 py-2 text-left font-semibold">Leave Type</th>
//               <th className="px-3 py-2 text-left font-semibold">Start Date</th>
//               <th className="px-3 py-2 text-left font-semibold">End Date</th>
//               <th className="px-3 py-2 text-left font-semibold">Status</th>
//               <th className="px-3 py-2 text-left font-semibold">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaveRequests.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-8 text-gray-500">No leave requests found.</td>
//               </tr>
//             ) : (
//               leaveRequests.map((req) => (
//                 <tr key={req._id} className="border-b hover:bg-gray-50">
//                   <td className="px-3 py-2">{req.studentId?.studentId || "-"}</td>
//                   <td className="px-3 py-2">
//                     {req.studentId?.firstName && req.studentId?.lastName
//                       ? `${req.studentId.firstName} ${req.studentId.lastName}`
//                       : "-"}
//                   </td>
//                   <td className="px-3 py-2">{req.leaveType}</td>
//                   <td className="px-3 py-2">{new Date(req.startDate).toLocaleDateString()}</td>
//                   <td className="px-3 py-2">{new Date(req.endDate).toLocaleDateString()}</td>
//                   <td className="px-3 py-2">
//                     <span className={`inline-block px-3 py-1 rounded-full ${getStatusColor(req.status)}`}>
//                       {req.status}
//                     </span>
//                   </td>
//                   <td className="px-3 py-2">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => setSelectedLeave(req)}
//                         title="View"
//                         className="text-blue-600 hover:text-blue-800"
//                       >
//                         <MdVisibility size={20} />
//                       </button>
//                       {req.status === "pending" ? (
//                         <>
//                           <button
//                             onClick={() => updateLeaveStatus(req._id, "approved")}
//                             title="Approve"
//                             className="text-green-600 hover:text-green-800"
//                           >
//                             <MdCheck size={20} />
//                           </button>
//                           <button
//                             onClick={() => updateLeaveStatus(req._id, "rejected")}
//                             title="Reject"
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <MdClose size={20} />
//                           </button>
//                           <button disabled className="opacity-50 cursor-not-allowed" title="Delete">
//                             <MdDelete size={20} />
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           onClick={() => deleteLeave(req._id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           <MdDelete size={20} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Detail Modal */}
//       {selectedLeave && (
//         <div
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
//           onClick={() => setSelectedLeave(null)}
//         >
//           <div
//             className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
//               onClick={() => setSelectedLeave(null)}
//             >
//               &times;
//             </button>
//             <h2 className="text-xl font-semibold mb-4">Leave Details</h2>
//             <p><strong>Student:</strong> {selectedLeave.studentId?.firstName} {selectedLeave.studentId?.lastName}</p>
//             <p><strong>ID:</strong> {selectedLeave.studentId?.studentId}</p>
//             <p><strong>Type:</strong> {selectedLeave.leaveType}</p>
//             <p><strong>Status:</strong> {selectedLeave.status}</p>
//             <p><strong>Start Date:</strong> {new Date(selectedLeave.startDate).toLocaleDateString()}</p>
//             <p><strong>End Date:</strong> {new Date(selectedLeave.endDate).toLocaleDateString()}</p>
//             <p><strong>Reason:</strong> {selectedLeave.reason || "N/A"}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import { MdCheck, MdClose, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://localhost:5000/api/wardenauth";

function getStatusColor(status) {
  const colors = {
    pending: "text-orange-600 bg-orange-100 border border-orange-200",
    approved: "text-green-600 bg-green-100 border border-green-200",
    rejected: "text-red-600 bg-red-100 border border-red-200",
  };
  return colors[status.toLowerCase()] || "text-gray-600 bg-gray-100 border border-gray-200";
}

export default function LeaveRequestsDashboard() {
  const [filters, setFilters] = useState({ student: "", status: "", date: "" });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const fetchFilteredLeaves = async () => {
    try {
      const query = {};
      const studentInput = filters.student.trim();
      if (studentInput) {
        query.studentName = studentInput;
        query.studentId = studentInput;
      }
      if (filters.status) query.status = filters.status.toLowerCase();
      if (filters.date) {
        query.startDate = filters.date;
        query.endDate = filters.date;
      }

      const res = await axios.get(`${API_BASE}/leave-filter`, {
        params: query,
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });

      setLeaveRequests(res.data);
    } catch (err) {
      toast.error("Failed to fetch leave requests.");
      console.error("Error fetching filtered leaves", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/leave-stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });

      setStats([
        { label: "Total Requests", value: res.data.totalRequests, color: "#CBD2BB", textColor: "#000000" },
        { label: "Pending Requests", value: res.data.pendingRequests, color: "#CBD2BB", textColor: "#FF9D00" },
        { label: "Approved Requests", value: res.data.approvedRequests, color: "#CBD2BB", textColor: "#28C404" },
        { label: "Rejected Requests", value: res.data.rejectedRequests, color: "#CBD2BB", textColor: "#FF0000" },
      ]);
    } catch (err) {
      toast.error("Failed to fetch stats.");
      console.error("Error fetching stats", err);
    }
  };

  const clearFilters = () => {
    setFilters({ student: "", status: "", date: "" });
    toast.info("Filters cleared");
  };

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const updateLeaveStatus = async (leaveId, status) => {
    const confirmMsg = `Are you sure you want to ${status.toUpperCase()} this leave request?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.put(
        `${API_BASE}/${leaveId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
      );
      toast.success(`Leave request ${status} successfully.`);
      fetchFilteredLeaves();
      fetchStats();
    } catch (err) {
      toast.error(`Failed to update leave status to ${status}.`);
      console.error("Error updating leave status", err);
    }
  };

  const deleteLeave = async (leaveId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this leave request?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/leave/${leaveId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` },
      });
      toast.success("Leave request deleted.");
      fetchFilteredLeaves();
      fetchStats();
    } catch (err) {
      toast.error("Failed to delete leave request.");
      console.error("Error deleting leave request", err);
    }
  };

  useEffect(() => {
    fetchFilteredLeaves();
    fetchStats();
  }, [filters]);

  return (
    <div className="p-5 bg-white min-h-screen space-y-6">
      <div className="flex items-center">
        <div className="w-1 h-6 bg-red-500 rounded-full mr-2"></div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Request Management</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: stat.color }}>
            <p className="text-sm font-medium text-gray-700">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.textColor }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Leave Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            value={filters.student}
            onChange={handleChange("student")}
            placeholder="Search by Name or ID"
            className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
          />
          <select
            value={filters.status}
            onChange={handleChange("status")}
            className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            type="date"
            value={filters.date}
            onChange={handleChange("date")}
            className="px-3 py-2 rounded border border-gray-300 bg-[#D9D9D9] text-black text-sm"
          />
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded shadow"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-[#D9D9D9]">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Student ID</th>
              <th className="px-3 py-2 text-left font-semibold">Student Name</th>
              <th className="px-3 py-2 text-left font-semibold">Leave Type</th>
              <th className="px-3 py-2 text-left font-semibold">Start Date</th>
              <th className="px-3 py-2 text-left font-semibold">End Date</th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No leave requests found.</td>
              </tr>
            ) : (
              leaveRequests.map((req) => (
                <tr key={req._id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{req.studentId?.studentId || "-"}</td>
                  <td className="px-3 py-2">
                    {req.studentId?.firstName && req.studentId?.lastName
                      ? `${req.studentId.firstName} ${req.studentId.lastName}`
                      : "-"}
                  </td>
                  <td className="px-3 py-2">{req.leaveType}</td>
                  <td className="px-3 py-2">{new Date(req.startDate).toLocaleDateString()}</td>
                  <td className="px-3 py-2">{new Date(req.endDate).toLocaleDateString()}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block px-3 py-1 rounded-full ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex space-x-2">
                      <button onClick={() => setSelectedLeave(req)} className="text-blue-600 hover:text-blue-800" title="View">
                        <MdRemoveRedEye size={20} />
                      </button>
                      {req.status === "pending" ? (
                        <>
                          <button onClick={() => updateLeaveStatus(req._id, "approved")} title="Approve" className="text-green-600 hover:text-green-800">
                            <MdCheck size={20} />
                          </button>
                          <button onClick={() => updateLeaveStatus(req._id, "rejected")} title="Reject" className="text-red-600 hover:text-red-800">
                            <MdClose size={20} />
                          </button>
                          <button disabled className="opacity-50 cursor-not-allowed" title="Delete">
                            <MdDelete size={20} />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => deleteLeave(req._id)} className="text-red-600 hover:text-red-800" title="Delete">
                          <MdDelete size={20} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Leave Request Details</h2>
            <p><strong>Name:</strong> {selectedLeave.studentId?.firstName} {selectedLeave.studentId?.lastName}</p>
            <p><strong>Student ID:</strong> {selectedLeave.studentId?.studentId}</p>
            <p><strong>Leave Type:</strong> {selectedLeave.leaveType}</p>
            <p><strong>Start Date:</strong> {new Date(selectedLeave.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(selectedLeave.endDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedLeave.status}</p>
            <p><strong>Reason:</strong> {selectedLeave.reason || "N/A"}</p>
            <div className="mt-4 text-right">
              <button onClick={() => setSelectedLeave(null)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
