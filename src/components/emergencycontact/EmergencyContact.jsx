// "use client";

// import { useState } from "react";

// export default function EmergencyContact() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const contacts = [
//     {
//       student: "Chinmay Gawade",
//       contact: "Chinmay Gawade",
//       relation: "Mother",
//       phone: "+91 932162553",
//     },
//     {
//       student: "Chinmay Gawade",
//       contact: "Chinmay Gawade",
//       relation: "Mother",
//       phone: "+91 932162553",
//     },
//     {
//       student: "Chinmay Gawade",
//       contact: "Chinmay Gawade",
//       relation: "Mother",
//       phone: "+91 932162553",
//     },
//     {
//       student: "Chinmay Gawade",
//       contact: "Chinmay Gawade",
//       relation: "Mother",
//       phone: "+91 932162553",
//     },
//     {
//       student: "Chinmay Gawade",
//       contact: "Chinmay Gawade",
//       relation: "Mother",
//       phone: "+91 932162553",
//     },
//   ];

//   // Filter contacts based on search term
//   const filteredContacts = contacts.filter(
//     (contact) =>
//       contact.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       contact.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       contact.relation.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen w-full bg-[#f5f5f5] px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-5 flex flex-col">
//   {/* Page Header with 20px left offset */}
//   <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-black border-l-4 border-red-600 pl-3 mb-4 sm:mb-6 ml-5">
//     Emergency Contact
//   </h2>


//       {/* Search and Buttons - Centered container with max width */}
//       <div className="w-full max-w-6xl mx-auto">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
//           {/* Search Input */}
//           <div className="flex-1 max-w-full sm:max-w-md lg:max-w-lg">
//             <input
//               type="text"
//               placeholder="Search contacts..."
//               className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg shadow placeholder:text-gray-600 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-row gap-2 sm:gap-3">
//             <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg shadow transition-colors duration-200 min-w-[70px] sm:min-w-[80px]">
//               Filter
//             </button>
//             <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg shadow transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
//               + Add Contact
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Card View (visible on small screens) */}
//       <div className="block lg:hidden space-y-3 sm:space-y-4 w-full max-w-6xl mx-auto">
//         {filteredContacts.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             No contacts found matching your search.
//           </div>
//         ) : (
//           filteredContacts.map((contact, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-lg shadow-md border-2 border-gray-400 p-4 sm:p-5"
//             >
//               <div className="space-y-3">
//                 <div className="pb-2 border-b-2 border-gray-300">
//                   <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
//                     Student Name
//                   </span>
//                   <p className="text-sm sm:text-base font-semibold text-black mt-1">
//                     {contact.student}
//                   </p>
//                 </div>
                
//                 <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
//                   <div className="pb-2 border-b-2 border-gray-300">
//                     <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
//                       Contact Name
//                     </span>
//                     <p className="text-sm sm:text-base font-semibold text-black mt-1">
//                       {contact.contact}
//                     </p>
//                   </div>
                  
//                   <div className="pb-2 border-b-2 border-gray-300">
//                     <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
//                       Relation
//                     </span>
//                     <p className="text-sm sm:text-base font-semibold text-black mt-1">
//                       {contact.relation}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="pb-2 border-b-2 border-gray-300">
//                   <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
//                     Phone Number
//                   </span>
//                   <p className="text-sm sm:text-base font-semibold text-black mt-1">
//                     {contact.phone}
//                   </p>
//                 </div>
                
//                 <div className="flex items-center justify-end gap-4 pt-2">
//                   <button className="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
//                     <img
//                       src="/icons/phone.svg"
//                       alt="Phone Icon"
//                       className="w-4 h-4 sm:w-5 sm:h-5"
//                     />
//                     <span className="text-xs sm:text-sm font-medium text-green-700">Call</span>
//                   </button>
//                   <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
//                     <img
//                       src="/icons/edit.svg"
//                       alt="Edit Icon"
//                       className="w-4 h-4 sm:w-5 sm:h-5"
//                     />
//                     <span className="text-xs sm:text-sm font-medium text-blue-700">Edit</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Desktop Table View (visible on large screens) */}
//       <div className="hidden lg:block w-full max-w-6xl mx-auto">
//         <div className="overflow-x-auto rounded-xl border-2 border-black bg-white shadow-lg">
//           <table className="min-w-full">
//             <thead>
//               <tr className="bg-[#A4B494] text-black">
//                 <th className="text-left px-6 xl:px-8 py-4 xl:py-5 rounded-tl-xl font-semibold text-sm xl:text-base">
//                   Student Name
//                 </th>
//                 <th className="text-left px-6 xl:px-8 py-4 xl:py-5 font-semibold text-sm xl:text-base">
//                   Contact Name
//                 </th>
//                 <th className="text-left px-6 xl:px-8 py-4 xl:py-5 font-semibold text-sm xl:text-base">
//                   Relation
//                 </th>
//                 <th className="text-left px-6 xl:px-8 py-4 xl:py-5 font-semibold text-sm xl:text-base">
//                   Phone no.
//                 </th>
//                 <th className="text-left px-6 xl:px-8 py-4 xl:py-5 rounded-tr-xl font-semibold text-sm xl:text-base">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredContacts.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="text-center py-8 text-gray-500">
//                     No contacts found matching your search.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredContacts.map((contact, index) => (
//                  <tr
//                    key={index}
//                      className={`hover:bg-gray-50 transition-colors duration-150 relative ${
//                        index !== filteredContacts.length - 1 ? "after:content-[''] after:absolute after:bottom-0 after:left-9 after:right-27 after:h-px after:bg-gray-400" : ""
//                        }`}
//                   >

//                     <td className="px-6 xl:px-8 py-4 xl:py-5 font-semibold text-black text-sm xl:text-base">
//                       {contact.student}
//                     </td>
//                     <td className="px-6 xl:px-8 py-4 xl:py-5 font-semibold text-black text-sm xl:text-base">
//                       {contact.contact}
//                     </td>
//                     <td className="px-6 xl:px-8 py-4 xl:py-5 font-semibold text-black text-sm xl:text-base">
//                       {contact.relation}
//                     </td>
//                     <td className="px-6 xl:px-8 py-4 xl:py-5 font-semibold text-black text-sm xl:text-base">
//                       {contact.phone}
//                     </td>
//                     <td className="px-6 xl:px-8 py-4 xl:py-5">
//                       <div className="flex items-center gap-3 xl:gap-4">
//                         <button className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group">
//                           <img
//                             src="/emergency/phone.png"
//                             alt="Phone Icon"
//                             className="w-5 h-5 xl:w-6 xl:h-6 group-hover:scale-110 transition-transform duration-200"
//                           />
//                         </button>
//                         <div className="w-px h-6 bg-gray-800" />
//                         <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
//                           <img
//                             src="/emergency/edit.png"
//                             alt="Edit Icon"
//                             className="w-5 h-5 xl:w-6 xl:h-6 group-hover:scale-110 transition-transform duration-200"
//                           />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>      
//     </div>
//   );
// }






// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FiPhone, FiSearch, FiPlus, FiFilter } from "react-icons/fi";
// import { FaEdit } from "react-icons/fa";

// const mockContacts = [
//   { id: 1, name: "Police Station", phone: "100" },
//   { id: 2, name: "Fire Department", phone: "101" },
//   { id: 3, name: "Hospital", phone: "102" },
// ];

// export default function EmergencyContact() {
//   const [contacts, setContacts] = useState(mockContacts);
//   const [editingId, setEditingId] = useState(null);
//   const [editValues, setEditValues] = useState({ name: "", phone: "" });

//   const [tableContacts, setTableContacts] = useState([]);
//   const [search, setSearch] = useState("");

//   // Fetch filtered data from backend
//   const fetchContacts = async () => {
//     try {
//       const params = {};
//       if (search) {
//         params.studentName = search;
//         params.studentId = search;
//       }

//       const res = await axios.get("http://localhost:5000/api/wardenauth/emergency-contact", {
//         params,
//       });

//       if (res.data.success) {
//         const formatted = res.data.contacts.map((item) => ({
//           id: item.studentId,
//           student: item.studentName,
//           contact: item.emergencyContactName,
//           relation: item.relation,
//           phone: item.emergencyContactNumber,
//         }));
//         setTableContacts(formatted);
//       }
//     } catch (err) {
//       console.error("Error fetching emergency contacts:", err);
//     }
//   };

//   // Fetch on mount and when search updates (with debounce)
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchContacts();
//     }, 400); // delay for typing

//     return () => clearTimeout(delayDebounce);
//   }, [search]);

//   const handleEdit = (contact) => {
//     setEditingId(contact.id);
//     setEditValues({ name: contact.name, phone: contact.phone });
//   };

//   const handleSave = (id) => {
//     setContacts((prev) =>
//       prev.map((c) => (c.id === id ? { ...c, ...editValues } : c))
//     );
//     setEditingId(null);
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
//       {/* Section 2: Table */}
//       <section>
//         <div className="flex items-center mb-4">
//           <div className="w-1 h-7 bg-red-500 mr-3"></div>
//           <h2 className="text-xl font-bold">Emergency Contact</h2>
//         </div>

//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
//           <div className="relative w-full md:w-1/2">
//             <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by Student ID or Name..."
//               className="w-full pl-10 pr-4 py-2 rounded-lg shadow focus:outline-none text-black bg-white"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <div className="flex gap-3 flex-wrap">
//             {/* <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow">
//               <FiFilter />
//               Filter
//             </button> */}
//             <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow">
//               <FiPlus />
//               Add Contact
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto rounded-xl border border-black">
//           <table className="min-w-full bg-white">
//             <thead className="bg-[#A4B494] text-gray-800">
//               <tr>
//                 <th className="text-left px-4 py-3">Student ID</th>
//                 <th className="text-left px-4 py-3">Student Name</th>
//                 <th className="text-left px-4 py-3">Contact Name</th>
//                 <th className="text-left px-4 py-3">Relation</th>
//                 <th className="text-left px-4 py-3">Phone No.</th>
//                 <th className="text-left px-4 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableContacts.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center text-gray-500 py-8">
//                     No contacts found.
//                   </td>
//                 </tr>
//               ) : (
//                 tableContacts.map((c, idx) => (
//                   <tr
//                     key={idx}
//                     className="border-t border-gray-200 hover:bg-gray-50 transition"
//                   >
//                     <td className="px-4 py-3">{c.id}</td>
//                     <td className="px-4 py-3">{c.student}</td>
//                     <td className="px-4 py-3">{c.contact}</td>
//                     <td className="px-4 py-3">{c.relation}</td>
//                     <td className="px-4 py-3">{c.phone}</td>
//                     <td className="px-4 py-3 flex items-center gap-4">
//                       <FiPhone className="cursor-pointer text-gray-700 hover:text-black" />
//                       <FaEdit className="cursor-pointer text-gray-700 hover:text-black" />
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// }








// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FiPhone, FiSearch, FiPlus, FiFilter } from "react-icons/fi";
// import { FaEdit, FaSave } from "react-icons/fa";

// export default function EmergencyContact() {
//   const [tableContacts, setTableContacts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [editValues, setEditValues] = useState({
//     contact: "",
//     relation: "",
//     phone: "",
//   });

//   // Fetch filtered data from backend
//   const fetchContacts = async () => {
//     try {
//       const params = {};
//       if (search) {
//         params.studentName = search;
//         params.studentId = search;
//       }

//       const res = await axios.get("http://localhost:5000/api/wardenauth/emergency-contact", {
//         params,
//       });

//       if (res.data.success) {
//         const formatted = res.data.contacts.map((item) => ({
//           id: item.studentId,
//           student: item.studentName,
//           contact: item.emergencyContactName,
//           relation: item.relation,
//           phone: item.emergencyContactNumber,
//         }));
//         setTableContacts(formatted);
//       }
//     } catch (err) {
//       console.error("Error fetching emergency contacts:", err);
//     }
//   };

//   // Fetch on mount and when search updates (with debounce)
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchContacts();
//     }, 400);

//     return () => clearTimeout(delayDebounce);
//   }, [search]);

//   const handleEdit = (contact) => {
//     setEditingId(contact.id);
//     setEditValues({
//       contact: contact.contact,
//       relation: contact.relation,
//       phone: contact.phone,
//     });
//   };

//   const handleSave = (id) => {
//     const updated = tableContacts.map((c) =>
//       c.id === id ? { ...c, ...editValues } : c
//     );
//     setTableContacts(updated);
//     setEditingId(null);

//     // Optionally, you can send PUT request to backend here
//     // axios.put(`/api/update-contact/${id}`, editValues);
//   };

//   const handleClearFilter = () => {
//     setSearch("");
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
//       {/* Section 2: Table */}
//       <section>
//         <div className="flex items-center mb-4">
//           <div className="w-1 h-7 bg-red-500 mr-3"></div>
//           <h2 className="text-xl font-bold">Emergency Contact</h2>
//         </div>

//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
//           <div className="relative w-full md:w-1/2">
//             <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by Student ID or Name..."
//               className="w-full pl-10 pr-4 py-2 rounded-lg shadow focus:outline-none text-black bg-white"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <div className="flex gap-3 flex-wrap">
//             <button
//               className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow"
//               onClick={handleClearFilter}
//             >
//               <FiFilter />
//               Clear Filter
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto rounded-xl border border-black">
//           <table className="min-w-full bg-white">
//             <thead className="bg-[#A4B494] text-gray-800">
//               <tr>
//                 <th className="text-left px-4 py-3">Student ID</th>
//                 <th className="text-left px-4 py-3">Student Name</th>
//                 <th className="text-left px-4 py-3">Contact Name</th>
//                 <th className="text-left px-4 py-3">Relation</th>
//                 <th className="text-left px-4 py-3">Phone No.</th>
//                 <th className="text-left px-4 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableContacts.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center text-gray-500 py-8">
//                     No contacts found.
//                   </td>
//                 </tr>
//               ) : (
//                 tableContacts.map((c, idx) => (
//                   <tr
//                     key={idx}
//                     className="border-t border-gray-200 hover:bg-gray-50 transition"
//                   >
//                     <td className="px-4 py-3">{c.id}</td>
//                     <td className="px-4 py-3">{c.student}</td>
//                     <td className="px-4 py-3">
//                       {editingId === c.id ? (
//                         <input
//                           type="text"
//                           className="w-full border px-2 py-1 rounded"
//                           value={editValues.contact}
//                           onChange={(e) =>
//                             setEditValues({ ...editValues, contact: e.target.value })
//                           }
//                         />
//                       ) : (
//                         c.contact
//                       )}
//                     </td>
//                     <td className="px-4 py-3">
//                       {editingId === c.id ? (
//                         <input
//                           type="text"
//                           className="w-full border px-2 py-1 rounded"
//                           value={editValues.relation}
//                           onChange={(e) =>
//                             setEditValues({ ...editValues, relation: e.target.value })
//                           }
//                         />
//                       ) : (
//                         c.relation
//                       )}
//                     </td>
//                     <td className="px-4 py-3">
//                       {editingId === c.id ? (
//                         <input
//                           type="text"
//                           className="w-full border px-2 py-1 rounded"
//                           value={editValues.phone}
//                           onChange={(e) =>
//                             setEditValues({ ...editValues, phone: e.target.value })
//                           }
//                         />
//                       ) : (
//                         c.phone
//                       )}
//                     </td>
//                     <td className="px-4 py-3 flex items-center gap-4">
//                       <FiPhone className="cursor-pointer text-gray-700 hover:text-black" />
//                       {editingId === c.id ? (
//                         <FaSave
//                           className="cursor-pointer text-green-600 hover:text-green-800"
//                           onClick={() => handleSave(c.id)}
//                         />
//                       ) : (
//                         <FaEdit
//                           className="cursor-pointer text-gray-700 hover:text-black"
//                           onClick={() => handleEdit(c)}
//                         />
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// }



// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FiPhone, FiSearch, FiFilter } from "react-icons/fi";
// import { FaEdit, FaSave } from "react-icons/fa";

// export default function EmergencyContact() {
//   const [tableContacts, setTableContacts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [editValues, setEditValues] = useState({
//     contact: "",
//     relation: "",
//     phone: "",
//   });

//   // Fetch filtered data from backend
//   const fetchContacts = async () => {
//     try {
//       const params = {};
//       if (search) {
//         params.studentName = search;
//         params.studentId = search;
//       }

//       const res = await axios.get("http://localhost:5000/api/wardenauth/emergency-contact", {
//         params,
//       });

//       if (res.data.success) {
//         const formatted = res.data.contacts.map((item) => ({
//           id: item.studentId,
//           student: item.studentName,
//           contact: item.emergencyContactName,
//           relation: item.relation,
//           phone: item.emergencyContactNumber,
//         }));
//         setTableContacts(formatted);
//       }
//     } catch (err) {
//       console.error("Error fetching emergency contacts:", err);
//     }
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchContacts();
//     }, 400);

//     return () => clearTimeout(delayDebounce);
//   }, [search]);

//   const handleEdit = (contact) => {
//     setEditingId(contact.id);
//     setEditValues({
//       contact: contact.contact || "",
//       relation: contact.relation || "",
//       phone: contact.phone || "",
//     });
//   };

//   const handleSave = async (id) => {
//     try {
//       const res = await axios.put(
//         `http://localhost:5000/api/wardenauth/emergency-contact/${id}`,
//         {
//           emergencyContactName: editValues.contact,
//           relation: editValues.relation,
//           emergencyContactNumber: editValues.phone,
//         }
//       );

//       if (res.data.success) {
//         alert("Emergency contact updated successfully!");
//         setEditingId(null);
//         fetchContacts(); // Refresh table after update
//       } else {
//         alert("Failed to update contact.");
//       }
//     } catch (err) {
//       console.error("Update failed:", err);
//       alert("Something went wrong while updating.");
//     }
//   };

//   const handleClearFilter = () => {
//     setSearch("");
//   };

//   return (
//     <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
//       <section>
//         <div className="flex items-center mb-4">
//           <div className="w-1 h-7 bg-red-500 mr-3"></div>
//           <h2 className="text-xl font-bold">Emergency Contact</h2>
//         </div>

//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
//           <div className="relative w-full md:w-1/2">
//             <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by Student ID or Name..."
//               className="w-full pl-10 pr-4 py-2 rounded-lg shadow focus:outline-none text-black bg-white"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <div className="flex gap-3 flex-wrap">
//             <button
//               className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow"
//               onClick={handleClearFilter}
//             >
//               <FiFilter />
//               Clear Filter
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto rounded-xl border border-black">
//           <table className="min-w-full bg-white">
//             <thead className="bg-[#A4B494] text-gray-800">
//               <tr>
//                 <th className="text-left px-4 py-3">Student ID</th>
//                 <th className="text-left px-4 py-3">Student Name</th>
//                 <th className="text-left px-4 py-3">Contact Name</th>
//                 <th className="text-left px-4 py-3">Relation</th>
//                 <th className="text-left px-4 py-3">Phone No.</th>
//                 <th className="text-left px-4 py-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableContacts.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center text-gray-500 py-8">
//                     No contacts found.
//                   </td>
//                 </tr>
//               ) : (
//                 tableContacts.map((c, idx) => (
//                   <tr
//                     key={idx}
//                     className="border-t border-gray-200 hover:bg-gray-50 transition"
//                   >
//                     <td className="px-4 py-3">{c.id}</td>
//                     <td className="px-4 py-3">{c.student}</td>
//                     <td className="px-4 py-3">
//                       {editingId === c.id ? (
//                         <input
//                           type="text"
//                           className="w-full border px-2 py-1 rounded"
//                           value={editValues.contact}
//                           onChange={(e) =>
//                             setEditValues({ ...editValues, contact: e.target.value })
//                           }
//                         />
//                       ) : (
//                         c.contact
//                       )}
//                     </td>
//                     <td className="px-4 py-3">
//                       {editingId === c.id ? (
//                         <input
//                           type="text"
//                           className="w-full border px-2 py-1 rounded"
//                           value={editValues.relation}
//                           onChange={(e) =>
//                             setEditValues({ ...editValues, relation: e.target.value })
//                           }
//                         />
//                       ) : (
//                         c.relation
//                       )}
//                     </td>
//                     <td className="px-4 py-3">
//                       {editingId === c.id ? (
//                         <input
//                           type="text"
//                           className="w-full border px-2 py-1 rounded"
//                           value={editValues.phone}
//                           onChange={(e) =>
//                             setEditValues({ ...editValues, phone: e.target.value })
//                           }
//                         />
//                       ) : (
//                         c.phone
//                       )}
//                     </td>
//                     <td className="px-4 py-3 flex items-center gap-4">
//                       <FiPhone className="cursor-pointer text-gray-700 hover:text-black" />
//                       {editingId === c.id ? (
//                         <FaSave
//                           className="cursor-pointer text-green-600 hover:text-green-800"
//                           onClick={() => handleSave(c.id)}
//                         />
//                       ) : (
//                         <FaEdit
//                           className="cursor-pointer text-gray-700 hover:text-black"
//                           onClick={() => handleEdit(c)}
//                         />
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// }





"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiPhone, FiSearch, FiFilter } from "react-icons/fi";
import { FaEdit, FaSave } from "react-icons/fa";
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

  // Fetch filtered data from backend
  const fetchContacts = async () => {
    try {
      const params = {};
      if (search) {
        params.studentName = search;
        params.studentId = search;
      }

      const res = await axios.get("http://localhost:5000/api/wardenauth/emergency-contact", {
        params,
      });

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
      console.error("Error fetching emergency contacts:", err);
      toast.error("Failed to fetch contacts");
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
        `http://localhost:5000/api/wardenauth/emergency-contact/${id}`,
        {
          emergencyContactName: editValues.contact,
          relation: editValues.relation,
          emergencyContactNumber: editValues.phone,
        }
      );

      if (res.data.success) {
        toast.success("Emergency contact updated successfully!");
        setEditingId(null);
        fetchContacts();
      } else {
        toast.error("Failed to update contact.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Something went wrong while updating.");
    }
  };

  const handleClearFilter = () => {
    setSearch("");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <section>
        <div className="flex items-center mb-4">
          <div className="w-1 h-7 bg-red-500 mr-3"></div>
          <h2 className="text-xl font-bold">Emergency Contact</h2>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Student ID or Name..."
              className="w-full pl-10 pr-4 py-2 rounded-lg shadow focus:outline-none text-black bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow"
              onClick={handleClearFilter}
            >
              <FiFilter />
              Clear Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-black">
          <table className="min-w-full bg-white">
            <thead className="bg-[#A4B494] text-gray-800">
              <tr>
                <th className="text-left px-4 py-3">Student ID</th>
                <th className="text-left px-4 py-3">Student Name</th>
                <th className="text-left px-4 py-3">Contact Name</th>
                <th className="text-left px-4 py-3">Relation</th>
                <th className="text-left px-4 py-3">Phone No.</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-8">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                tableContacts.map((c, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{c.id}</td>
                    <td className="px-4 py-3">{c.student}</td>
                    <td className="px-4 py-3">
                      {editingId === c.id ? (
                        <input
                          type="text"
                          className="w-full border px-2 py-1 rounded"
                          value={editValues.contact}
                          onChange={(e) =>
                            setEditValues({ ...editValues, contact: e.target.value })
                          }
                        />
                      ) : (
                        c.contact
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === c.id ? (
                        <input
                          type="text"
                          className="w-full border px-2 py-1 rounded"
                          value={editValues.relation}
                          onChange={(e) =>
                            setEditValues({ ...editValues, relation: e.target.value })
                          }
                        />
                      ) : (
                        c.relation
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === c.id ? (
                        <input
                          type="text"
                          className="w-full border px-2 py-1 rounded"
                          value={editValues.phone}
                          onChange={(e) =>
                            setEditValues({ ...editValues, phone: e.target.value })
                          }
                        />
                      ) : (
                        c.phone
                      )}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-4">
                      <FiPhone className="cursor-pointer text-gray-700 hover:text-black" />
                      {editingId === c.id ? (
                        <FaSave
                          className="cursor-pointer text-green-600 hover:text-green-800"
                          onClick={() => handleSave(c.id)}
                        />
                      ) : (
                        <FaEdit
                          className="cursor-pointer text-gray-700 hover:text-black"
                          onClick={() => handleEdit(c)}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
