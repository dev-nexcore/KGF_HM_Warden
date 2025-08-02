// // components/StudentManagement.jsx
// export default function StudentManagement() {
//   const students = [
//     { id: '001', name: 'Chinmay Gawade', block: 'A', room: '101/B1', status: 'Active', contact: '+91 9321625553' },
//     { id: '002', name: 'Krutika Mishra', block: 'B', room: '203/B2', status: 'On Leave', contact: '+91 9321625553' },
//     { id: '003', name: 'Sufiyan Khan', block: 'C', room: '305/B1', status: 'Active', contact: '+91 9321625553' },
//   ];

//   const getStatusStyle = (status) => (status === 'Active' ? 'text-green-600' : 'text-red-500');

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center mb-4">
//         <div className="w-1 h-7 bg-red-500 mr-3"></div>
//         <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold">Student Management</h2>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
//         {/* Total students */}
//         <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
//           <div>
//             <div className="text-sm font-semibold">Total Students</div>
//             <div className="text-3xl font-bold text-black">75</div>
//           </div>
//           <div className="absolute top-0 right-0 rounded-full bg-white border shadow w-12 h-12 flex items-center justify-center">
//             <img 
//               src="/std-management/students.png" 
//               alt="Total Students" 
//               className="object-contain"
//             />
//           </div>
//         </div>

//         {/* Active students */}
//         <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
//           <div>
//             <div className="text-sm font-semibold">Active Students</div>
//             <div className="text-3xl font-bold text-black">70</div>
//           </div>
//           <div className="absolute top-0 right-0 rounded-full bg-white border shadow w-12 h-12 flex items-center justify-center">
//             <img 
//               src="/std-management/active.png" 
//               alt="Active Students" 
//               className="object-contain"
//             />
//           </div>
//         </div>

//         <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
//           <div>
//             <div className="text-sm font-semibold">Students On Leave</div>
//             <div className="text-3xl font-bold text-red-600">5</div>
//           </div>
//           <div className="absolute top-0 right-0 rounded-full bg-white border shadow w-12 h-12 flex items-center justify-center">
//             <img 
//               src="/std-management/leave-std.png" 
//               alt="Students On Leave" 
//               className="object-contain"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Filter Bar */}
// <div className="bg-white p-4 rounded-xl drop-shadow-lg space-y-4">
//   <h3 className="text-md font-semibold mb-2 text-black">Filter Students</h3>
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-black">
//     <div>
//       <label className="block text-sm font-semibold text-gray-800 mb-1">Student ID</label>
//       <select className="bg-gray-100 rounded h-fit p-2 w-full text-sm">
//         <option>Select ID</option>
//         <option>001</option>
//         <option>002</option>
//       </select>
//     </div>

//     <div>
//       <label className="block text-sm font-semibold text-gray-800 mb-1">Block</label>
//       <select className="bg-gray-100 rounded h-fit p-2 w-full text-sm">
//         <option>All Blocks</option>
//         <option>Block A</option>
//         <option>Block B</option>
//         <option>Block C</option>
//       </select>
//     </div>

//     <div>
//       <label className="block text-sm font-semibold text-gray-800 mb-1">Room</label>
//       <select className="bg-gray-100 rounded h-fit p-2  w-full text-sm">
//         <option>All Rooms</option>
//         <option>101/B1</option>
//         <option>203/B2</option>
//         <option>305/B1</option>
//       </select>
//     </div>

//     <div>
//       <label className="block text-sm font-semibold text-gray-800 mb-1">Status</label>
//       <select className="bg-gray-100 rounded h-fit p-2 w-full text-sm">
//         <option>All Status</option>
//         <option>Active</option>
//         <option>On Leave</option>
//       </select>
//     </div>

//     {/* Filter button with icon */}
//     <div>
//       <label className="block text-sm font-semibold text-gray-800 mb-1 invisible">.</label>
//       <button className="flex items-center justify-center gap-2 bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600 w-full lg:w-auto">
//         <span>Apply Filters</span>
//         <img src="/images/filter-icon.png" alt="Filter" className="w-3 h-3" />
//       </button>
//     </div>
//   </div>
// </div>


//       {/* Student List */}
//       <div className="bg-white p-4 rounded-xl drop-shadow-lg text-black">
//         <h3 className="text-md font-semibold mb-4">Student List</h3>

//         {/* Desktop Table */}
//         <div className="hidden lg:block overflow-x-auto">
//           <table className="w-full text-sm min-w-[600px] table-fixed">
//             <thead className="bg-gray-100 text-left">
//               <tr>
//                 <th className="p-2 w-20">Student ID</th>
//                 <th className="p-2 w-48">Student Name</th>
//                 <th className="p-2 w-20">Block</th>
//                 <th className="p-2 w-28">Room/ Bed</th>
//                 <th className="p-2 w-28">Status</th>
//                 <th className="p-2 w-32">Contact</th>
//                 <th className="p-2 w-24 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s, i) => (
//                 <tr key={i} className="hover:bg-gray-50">
//                   <td className="p-2">{s.id}</td>
//                   <td className="p-2 truncate">{s.name}</td>
//                   <td className="p-2">{s.block}</td>
//                   <td className="p-2">{s.room}</td>
//                   <td className={`p-2 font-semibold ${getStatusStyle(s.status)}`}>{s.status}</td>
//                   <td className="p-2">{s.contact}</td>
//                   <td className="p-2 text-center space-x-3 text-gray-600">
//                     <a href="/edit-student" className="inline-block p-2  rounded ">
//                       <img src="/images/edit-icon.png" alt="Edit" className="w-5 h-5" />
//                     </a>
//                     <a href="/delete-student" className="inline-block p-2">
//                       <img src="/images/delete-icon.png" alt="Delete" className="w-5 h-5" />
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile Card View */}
//         <div className="block lg:hidden space-y-4 text-black">
//           {students.map((s, i) => (
//             <div key={i} className="rounded-lg p-3 shadow-sm bg-gray-50">
//               <p><strong>ID:</strong> {s.id}</p>
//               <p><strong>Name:</strong> {s.name}</p>
//               <p><strong>Block:</strong> {s.block}</p>
//               <p><strong>Room:</strong> {s.room}</p>
//               <p className={`font-semibold ${getStatusStyle(s.status)}`}><strong>Status:</strong> {s.status}</p>
//               <p><strong>Contact:</strong> {s.contact}</p>
//               <div className="flex space-x-3 mt-3 text-gray-600">
//                 <a href="/edit-student" className="p-3">
//                   <img src="/images/edit-icon.png" alt="Edit" className="w-5 h-5" />
//                 </a>
//                 <a href="/delete-student" className="p-3">
//                   <img src="/images/delete-icon.png" alt="Delete" className="w-5 h-5" />
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }









// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";

// export default function StudentManagement() {
//   const [students, setStudents] = useState([]);
//   const [counts, setCounts] = useState({ total: 0, active: 0, onLeave: 0 });
//   const [filters, setFilters] = useState({ studentId: "", roomNo: "", status: "" });
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [newBarcodeId, setNewBarcodeId] = useState("");

//   useEffect(() => {
//     fetchCounts();
//   }, []);

//   useEffect(() => {
//     fetchStudents();
//   }, [filters]);

//   const fetchCounts = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/wardenauth/students/count");
//       setCounts({ total: res.data.totalStudents, active: res.data.totalStudents, onLeave: 0 });
//     } catch (err) {
//       console.error("Error fetching counts:", err);
//     }
//   };

//   const fetchStudents = async () => {
//     try {
//       const params = {};
//       if (filters.studentId) params.studentId = filters.studentId;
//       if (filters.roomNo) params.roomNo = filters.roomNo;
//       if (filters.status) params.status = filters.status;
//       const res = await axios.get("http://localhost:5000/api/wardenauth/students", { params });
//       setStudents(res.data.students);
//     } catch (err) {
//       console.error("Error fetching students:", err);
//     }
//   };

//   const handleClearFilters = () => {
//     setFilters({ studentId: "", roomNo: "", status: "" });
//   };

//   const handleEditClick = (student) => {
//     setEditingStudent(student);
//     setNewBarcodeId(student.barcodeId || "");
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.put(`http://localhost:5000/api/wardenauth/students/${editingStudent.studentId}`, {
//         barcodeId: newBarcodeId,
//       });
//       alert(res.data.message);
//       setEditingStudent(null);
//       fetchStudents();
//     } catch (err) {
//       console.error("Update failed:", err);
//       alert(err.response?.data?.message || "Error updating bed.");
//     }
//   };

//   const getStatusStyle = (status) =>
//     status === "Active" ? "text-green-600" : "text-red-500";

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center mb-4">
//         <div className="w-1 h-7 bg-red-500 mr-3"></div>
//         <h2 className="text-2xl font-bold">Student Management</h2>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
//         <StatCard title="Total Students" count={counts.total} icon="/std-management/students.png" />
//         <StatCard title="Active Students" count={counts.active} icon="/std-management/active.png" />
//         <StatCard title="On Leave" count={counts.onLeave} icon="/std-management/leave-std.png" red />
//       </div>

//       <div className="bg-white p-4 rounded-xl shadow space-y-4">
//         <h3 className="text-md font-semibold">Filter Students</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
//           <FilterSelect
//             label="Student ID"
//             value={filters.studentId}
//             onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
//             options={["", ...students.map(s => s.studentId)]}
//           />
//           <FilterSelect
//             label="Room No"
//             value={filters.roomNo}
//             onChange={(e) => setFilters({ ...filters, roomNo: e.target.value })}
//             options={["", ...students.map(s => s.roomNo).filter(Boolean)]}
//           />
//           <FilterSelect
//             label="Status"
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//             options={["", "Active", "On Leave"]}
//           />
//           <div className="flex flex-col justify-end">
//             <button
//               onClick={handleClearFilters}
//               className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2"
//             >
//               Clear Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white p-4 rounded-xl shadow">
//         <h3 className="text-md font-semibold mb-4">Student List</h3>

//         <div className="hidden lg:block overflow-x-auto">
//           <table className="w-full table-fixed text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2">Student ID</th>
//                 <th className="p-2">Student Name</th>
//                 <th className="p-2">Room No</th>
//                 <th className="p-2">Bed No</th>
//                 <th className="p-2">Status</th>
//                 <th className="p-2">Contact</th>
//                 <th className="p-2 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s, i) => (
//                 <tr key={i} className="hover:bg-gray-50">
//                   <td className="p-2">{s.studentId}</td>
//                   <td className="p-2">{s.studentName}</td>
//                   <td className="p-2">{s.roomNo || "-"}</td>
//                   <td className="p-2">{s.barcodeId || "-"}</td>
//                   <td className={`p-2 font-semibold ${getStatusStyle(s.status || "Active")}`}>
//                     {s.status || "Active"}
//                   </td>
//                   <td className="p-2">{s.contactNumber || "-"}</td>
//                   <td className="p-2 text-center space-x-3">
//                     <button onClick={() => handleEditClick(s)}>
//                       <img src="/images/edit-icon.png" alt="Edit" className="w-5 h-5 inline-block" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="block lg:hidden space-y-4">
//           {students.map((s, i) => (
//             <div key={i} className="rounded-lg p-3 shadow bg-gray-50">
//               <p><strong>ID:</strong> {s.studentId}</p>
//               <p><strong>Name:</strong> {s.studentName}</p>
//               <p><strong>Room:</strong> {s.roomNo || "-"}</p>
//               <p><strong>Bed:</strong> {s.barcodeId || "-"}</p>
//               <p className={`font-semibold ${getStatusStyle(s.status || "Active")}`}>
//                 <strong>Status:</strong> {s.status || "Active"}
//               </p>
//               <p><strong>Contact:</strong> {s.contactNumber || "-"}</p>
//               <button onClick={() => handleEditClick(s)} className="mt-2 text-blue-600">
//                 Edit Bed
//               </button>
//             </div>
//           ))}
//           {students.length === 0 && <p>No students found.</p>}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editingStudent && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg w-[90%] max-w-md text-center">
//             <h2 className="text-xl font-bold mb-4">Update Bed for {editingStudent.studentName}</h2>
//             <form onSubmit={handleUpdate} className="space-y-4">
//               <label className="block text-left">
//                 New BED:
//                 <input
//                   type="text"
//                   value={newBarcodeId}
//                   onChange={(e) => setNewBarcodeId(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border rounded"
//                 />
//               </label>
//               <div className="flex justify-between">
//                 <button
//                   type="button"
//                   onClick={() => setEditingStudent(null)}
//                   className="px-4 py-2 bg-gray-300 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
//                   Update
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // StatCard
// function StatCard({ title, count, icon, red }) {
//   return (
//     <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex justify-between items-center shadow relative">
//       <div>
//         <div className="text-sm font-semibold">{title}</div>
//         <div className={`text-3xl font-bold ${red ? "text-red-600" : "text-black"}`}>{count}</div>
//       </div>
//       <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-full border flex items-center justify-center">
//         <img src={icon} alt={title} className="object-contain w-full h-full" />
//       </div>
//     </div>
//   );
// }

// // FilterSelect
// function FilterSelect({ label, value, onChange, options }) {
//   return (
//     <div>
//       <label className="text-sm font-semibold text-gray-800 mb-1 block">{label}</label>
//       <select value={value} onChange={onChange} className="bg-gray-100 rounded p-2 w-full text-sm">
//         {options.map((opt, index) => (
//           <option key={index} value={opt}>{opt || `All ${label}s`}</option>
//         ))}
//       </select>
//     </div>
//   );
// }




"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, onLeave: 0 });
  const [filters, setFilters] = useState({ studentId: "", roomNo: "", status: "" });
  const [editingStudent, setEditingStudent] = useState(null);
  const [newBarcodeId, setNewBarcodeId] = useState("");
  const [availableBeds, setAvailableBeds] = useState([]);

  useEffect(() => {
    fetchCounts();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchCounts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/wardenauth/students/count");
      setCounts({ total: res.data.totalStudents, active: res.data.totalStudents, onLeave: 0 });
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
      const res = await axios.get("http://localhost:5000/api/wardenauth/students", { params });
      setStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleClearFilters = () => {
    setFilters({ studentId: "", roomNo: "", status: "" });
  };

  const handleEditClick = async (student) => {
    setEditingStudent(student);
    setNewBarcodeId(student.barcodeId || "");

    try {
      const res = await axios.get("http://localhost:5000/api/wardenauth/students/available-bed");
      setAvailableBeds(res.data.beds);
    } catch (err) {
      console.error("Error fetching available beds:", err);
      alert("Failed to fetch available beds");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/wardenauth/students/${editingStudent.studentId}`,
        { barcodeId: newBarcodeId }
      );
      alert(res.data.message);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      console.error("Update failed:", err);
      alert(err.response?.data?.message || "Error updating bed.");
    }
  };

  const getStatusStyle = (status) => (status === "Active" ? "text-green-600" : "text-red-500");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-1 h-7 bg-red-500 mr-3"></div>
        <h2 className="text-2xl font-bold">Student Management</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Students" count={counts.total} icon="/std-management/students.png" />
        <StatCard title="Active Students" count={counts.active} icon="/std-management/active.png" />
        <StatCard title="On Leave" count={counts.onLeave} icon="/std-management/leave-std.png" red />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h3 className="text-md font-semibold">Filter Students</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <FilterSelect label="Student ID" value={filters.studentId}
            onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
            options={["", ...students.map(s => s.studentId)]} />
          <FilterSelect label="Room No" value={filters.roomNo}
            onChange={(e) => setFilters({ ...filters, roomNo: e.target.value })}
            options={["", ...students.map(s => s.roomNo).filter(Boolean)]} />
          <FilterSelect label="Status" value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={["", "Active", "On Leave"]} />
          <div className="flex items-end">
            <button onClick={handleClearFilters} className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-md font-semibold mb-4">Student List</h3>
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Student ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Room No</th>
                <th className="p-2">Bed No</th>
                <th className="p-2">Status</th>
                <th className="p-2">Contact</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{s.studentId}</td>
                  <td className="p-2">{s.studentName}</td>
                  <td className="p-2">{s.roomNo || "-"}</td>
                  <td className="p-2">{s.barcodeId || "-"}</td>
                  <td className={`p-2 font-semibold ${getStatusStyle(s.status || "Active")}`}>{s.status || "Active"}</td>
                  <td className="p-2">{s.contactNumber || "-"}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => handleEditClick(s)}>
                      <img src="/images/edit-icon.png" alt="Edit" className="w-5 h-5 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view */}
        <div className="block lg:hidden space-y-4">
          {students.map((s, i) => (
            <div key={i} className="rounded-lg p-3 shadow bg-gray-50">
              <p><strong>ID:</strong> {s.studentId}</p>
              <p><strong>Name:</strong> {s.studentName}</p>
              <p><strong>Room:</strong> {s.roomNo || "-"}</p>
              <p><strong>Bed:</strong> {s.barcodeId || "-"}</p>
              <p className={`font-semibold ${getStatusStyle(s.status || "Active")}`}>
                <strong>Status:</strong> {s.status || "Active"}
              </p>
              <p><strong>Contact:</strong> {s.contactNumber || "-"}</p>
              <button onClick={() => handleEditClick(s)} className="mt-2 text-blue-600">Edit Bed</button>
            </div>
          ))}
          {students.length === 0 && <p className="p-4">No students found.</p>}
        </div>
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Bed for {editingStudent.studentName}</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <label className="block text-left">
                Select New Bed:
                <select
                  value={newBarcodeId}
                  onChange={(e) => setNewBarcodeId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">-- Choose available bed --</option>
                  {availableBeds.map((bed) => (
                    <option key={bed._id} value={bed.barcodeId}>
                      Room {bed.roomNo} — {bed.barcodeId}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex justify-between">
                <button type="button" onClick={() => setEditingStudent(null)} className="px-4 py-2 bg-gray-300 rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded" disabled={!newBarcodeId}>
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components —

function StatCard({ title, count, icon, red }) {
  return (
    <div className="bg-[#dce0d4] rounded-3xl px-6 py-5 flex justify-between items-center shadow relative">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className={`text-3xl font-bold ${red ? "text-red-600" : "text-black"}`}>{count}</div>
      </div>
      {icon && (
        <div className="absolute top-0 right-0 w-12 h-12 bg-white rounded-full border flex items-center justify-center">
          <img src={icon} alt={title} className="object-contain w-full h-full" />
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-800 mb-1 block">{label}</label>
      <select value={value} onChange={onChange} className="bg-gray-100 rounded p-2 w-full text-sm">
        {options.map((opt, index) => (
          <option key={index} value={opt}>{opt || `All ${label}s`}</option>
        ))}
      </select>
    </div>
  );
}
