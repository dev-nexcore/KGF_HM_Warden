
// "use client";

// import { useState, useEffect } from "react";
// import {
//   Edit2,
//   Trash2,
//   Clock,
//   Eye,
//   X,
// } from "lucide-react";
// import axios from "axios";

// const StaffAllotment = () => {

//   const [activeTab, setActiveTab] =
//     useState("warden");

//   const [formData, setFormData] =
//     useState({
//       firstName: "",
//       lastName: "",
//       wardenId: "",
//       contactNumber: "",
//       emailId: "",
//       designation: "",
//       otherDesignation: "",
//       shiftStart: "",
//       shiftEnd: "",
//     });

//   const [wardens, setWardens] =
//     useState([]);

//   const [staffs, setStaffs] =
//     useState([]);

//   const [successMsg, setSuccessMsg] =
//     useState("");

//   const [showDeleteModal, setShowDeleteModal] =
//     useState(false);

//   const [showEditModal, setShowEditModal] =
//     useState(false);

//   const [showViewModal, setShowViewModal] =
//     useState(false);

//   const [selectedId, setSelectedId] =
//     useState(null);

//   const [selectedWarden, setSelectedWarden] =
//     useState(null);

//   // Fetch Data
//   useEffect(() => {

//     fetchWardens();

//     fetchStaffs();

//   }, []);

//   // Fetch Wardens
//   const fetchWardens = async () => {

//     try {

//       const response =
//         await axios.get(
//           "http://localhost:5224/api/wardenauth/all"
//         );

//       const formattedData =
//         response.data.wardens.map(
//           (warden) => ({

//             id: warden.id,

//             firstName:
//               warden.firstName,

//             lastName:
//               warden.lastName,

//             name: `${warden.firstName} ${warden.lastName}`,

//             email:
//               warden.email,

//             contactNumber:
//               warden.contactNumber,

//             wardenId:
//               warden.wardenId,
//           })
//         );

//       setWardens(formattedData);

//     } catch (error) {

//       console.error(error);
//     }
//   };

//   // Fetch Staff
//   const fetchStaffs = async () => {

//     try {

//       const response =
//         await axios.get(
//           "http://localhost:5224/api/staffauth/all"
//         );

//       const formattedData =
//         response.data.staffs.map(
//           (staff) => ({

//             id: staff._id,

//             firstName:
//               staff.firstName,

//             lastName:
//               staff.lastName,

//             name: `${staff.firstName} ${staff.lastName}`,

//             email:
//               staff.email,

//             contactNumber:
//               staff.contactNumber,

//             designation:
//               staff.designation,

//             shiftStart:
//               staff.shiftStart,

//             shiftEnd:
//               staff.shiftEnd,
//           })
//         );

//       setStaffs(formattedData);

//     } catch (error) {

//       console.error(error);
//     }
//   };

//   // Input Change
//   const handleInputChange = (e) => {

//     const { name, value } =
//       e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Register Warden
//   const handleRegisterWarden =
//     async () => {

//       try {

//         const payload = {
//           firstName:
//             formData.firstName,

//           lastName:
//             formData.lastName,

//           email:
//             formData.emailId,

//           contactNumber:
//             formData.contactNumber,

//           wardenId:
//             formData.wardenId,
//         };

//         const response =
//           await axios.post(
//             "http://localhost:5224/api/adminauth/register-warden",
//             payload
//           );

//         setSuccessMsg(
//           response.data.message
//         );

//         fetchWardens();

//         setFormData({
//           firstName: "",
//           lastName: "",
//           wardenId: "",
//           contactNumber: "",
//           emailId: "",
//           designation: "",
//           otherDesignation: "",
//           shiftStart: "",
//           shiftEnd: "",
//         });

//       } catch (error) {

//         console.error(error);

//         setSuccessMsg(
//           "Error registering warden"
//         );
//       }
//     };

//   // Register Staff
//   const handleRegisterStaff =
//     async () => {

//       try {

//         const payload = {

//           firstName:
//             formData.firstName,

//           lastName:
//             formData.lastName,

//           email:
//             formData.emailId,

//           staffId: `S${Date.now()
//             .toString()
//             .slice(-4)}`,

//           contactNumber:
//             formData.contactNumber,

//           designation:
//             formData.designation ===
//             "Other"
//               ? formData.otherDesignation
//               : formData.designation,

//           shiftStart:
//             formData.shiftStart,

//           shiftEnd:
//             formData.shiftEnd,
//         };

//         const response =
//           await axios.post(
//             "http://localhost:5224/api/staffauth/register-staff",
//             payload
//           );

//         setSuccessMsg(
//           response.data.message
//         );

//         fetchStaffs();

//         setFormData({
//           firstName: "",
//           lastName: "",
//           wardenId: "",
//           contactNumber: "",
//           emailId: "",
//           designation: "",
//           otherDesignation: "",
//           shiftStart: "",
//           shiftEnd: "",
//         });

//       } catch (error) {

//         console.error(error);

//         setSuccessMsg(
//           "Error registering staff"
//         );
//       }
//     };

//   // View Warden
//   const handleViewWarden =
//     (warden) => {

//       setSelectedWarden(
//         warden
//       );

//       setShowViewModal(true);
//     };

//   // Edit Warden
//   const handleEditWarden =
//     (warden) => {

//       setSelectedId(
//         warden.id
//       );

//       setFormData({
//         firstName:
//           warden.firstName,

//         lastName:
//           warden.lastName,

//         wardenId:
//           warden.wardenId,

//         contactNumber:
//           warden.contactNumber,

//         emailId:
//           warden.email,
//       });

//       setShowEditModal(true);
//     };

//   // Edit Staff
//   const handleEditStaff =
//     (staff) => {

//       setSelectedId(
//         staff.id
//       );

//       setFormData({
//         firstName:
//           staff.firstName,

//         lastName:
//           staff.lastName,

//         contactNumber:
//           staff.contactNumber,

//         emailId:
//           staff.email,

//         designation:
//           staff.designation,

//         shiftStart:
//           staff.shiftStart,

//         shiftEnd:
//           staff.shiftEnd,
//       });

//       setShowEditModal(true);
//     };

//   // Update Warden
//   const handleUpdateWarden =
//     async () => {

//       try {

//         const payload = {

//           firstName:
//             formData.firstName,

//           lastName:
//             formData.lastName,

//           email:
//             formData.emailId,

//           contactNumber:
//             formData.contactNumber,

//           wardenId:
//             formData.wardenId,
//         };

//         await axios.put(
//           `http://localhost:5224/api/wardenauth/update/${selectedId}`,
//           payload
//         );

//         setSuccessMsg(
//           "Warden updated successfully"
//         );

//         fetchWardens();

//         setShowEditModal(false);

//       } catch (error) {

//         console.error(error);
//       }
//     };

//   // Update Staff
//   const handleUpdateStaff =
//     async () => {

//       try {

//         const payload = {

//           firstName:
//             formData.firstName,

//           lastName:
//             formData.lastName,

//           email:
//             formData.emailId,

//           contactNumber:
//             formData.contactNumber,

//           designation:
//             formData.designation ===
//             "Other"
//               ? formData.otherDesignation
//               : formData.designation,

//           shiftStart:
//             formData.shiftStart,

//           shiftEnd:
//             formData.shiftEnd,
//         };

//         await axios.put(
//           `http://localhost:5224/api/staffauth/update/${selectedId}`,
//           payload
//         );

//         setSuccessMsg(
//           "Staff updated successfully"
//         );

//         fetchStaffs();

//         setShowEditModal(false);

//       } catch (error) {

//         console.error(error);
//       }
//     };

//   // Delete Warden
//   const handleDeleteWarden =
//     (id) => {

//       setSelectedId(id);

//       setShowDeleteModal(true);
//     };

//   const confirmDeleteWarden =
//     async () => {

//       try {

//         await axios.delete(
//           `http://localhost:5224/api/wardenauth/delete/${selectedId}`
//         );

//         fetchWardens();

//         setSuccessMsg(
//           "Warden deleted successfully"
//         );

//       } catch (error) {

//         console.error(error);
//       }

//       setShowDeleteModal(false);
//     };

//   // Delete Staff
//   const handleDeleteStaff =
//     (id) => {

//       setSelectedId(id);

//       setShowDeleteModal(true);
//     };

//   const confirmDeleteStaff =
//     async () => {

//       try {

//         await axios.delete(
//           `http://localhost:5224/api/staffauth/delete/${selectedId}`
//         );

//         fetchStaffs();

//         setSuccessMsg(
//           "Staff deleted successfully"
//         );

//       } catch (error) {

//         console.error(error);
//       }

//       setShowDeleteModal(false);
//     };

//   return (
//     <div className="flex-1 bg-white p-4 sm:p-6 mt-5">

//       {/* Header */}
//       <div className="mb-6">

//         <div className="flex items-center mb-4">

//           <div className="w-[4px] h-6 bg-[#4F8CCF] mr-3" />

//           <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
//             Staff Allotment
//           </h1>

//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex mb-4 gap-2">

//         <button
//           onClick={() =>
//             setActiveTab(
//               "warden"
//             )
//           }
//           className={`px-6 py-3 rounded-t-[20px] font-semibold ${
//             activeTab ===
//             "warden"
//               ? "bg-[#BEC5AD] text-black"
//               : "bg-gray-200"
//           }`}
//         >
//           Register Warden
//         </button>

//         <button
//           onClick={() =>
//             setActiveTab(
//               "staff"
//             )
//           }
//           className={`px-6 py-3 rounded-t-[20px] font-semibold ${
//             activeTab ===
//             "staff"
//               ? "bg-[#BEC5AD] text-black"
//               : "bg-gray-200"
//           }`}
//         >
//           Register Staff
//         </button>

//       </div>

//       {/* Warden Section */}
//       {activeTab ===
//         "warden" && (
//         <>
//           <div className="bg-[#BEC5AD] rounded-xl p-6 mb-6">

//             <h2 className="text-2xl font-semibold mb-6">
//               Register New Warden
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//               <input
//                 type="text"
//                 name="firstName"
//                 value={
//                   formData.firstName
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="First Name"
//                 className="p-3 border rounded-md bg-white"
//               />

//               <input
//                 type="text"
//                 name="lastName"
//                 value={
//                   formData.lastName
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="Last Name"
//                 className="p-3 border rounded-md bg-white"
//               />

//               <input
//                 type="text"
//                 name="contactNumber"
//                 value={
//                   formData.contactNumber
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="Contact Number"
//                 className="p-3 border rounded-md bg-white"
//               />

//               <input
//                 type="text"
//                 name="wardenId"
//                 value={
//                   formData.wardenId
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="Warden ID"
//                 className="p-3 border rounded-md bg-white"
//               />

//               <input
//                 type="email"
//                 name="emailId"
//                 value={
//                   formData.emailId
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="Email"
//                 className="p-3 border rounded-md bg-white"
//               />

//             </div>

//             <div className="mt-6 text-center">

//               <button
//                 onClick={
//                   handleRegisterWarden
//                 }
//                 className="bg-white px-8 py-3 rounded-xl font-bold"
//               >
//                 Register Warden
//               </button>

//             </div>
//           </div>

//           {/* Manage Warden */}
//           <div className="bg-[#BEC5AD] rounded-xl p-6">

//             <h2 className="text-2xl font-bold mb-6">
//               Manage Warden
//             </h2>

//             <div className="space-y-4">

//               {wardens.map(
//                 (warden) => (

//                   <div
//                     key={warden.id}
//                     className="bg-white rounded-lg p-4 flex justify-between items-center"
//                   >

//                     <div>

//                       <h3 className="font-bold text-lg">
//                         {
//                           warden.name
//                         }
//                       </h3>

//                       <p>
//                         {
//                           warden.email
//                         }
//                       </p>

//                       <p>
//                         Warden ID:
//                         {" "}
//                         {
//                           warden.wardenId
//                         }
//                       </p>

//                     </div>

//                     <div className="flex gap-4">

//                       <button
//                         onClick={() =>
//                           handleViewWarden(
//                             warden
//                           )
//                         }
//                       >
//                         <Eye />
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleEditWarden(
//                             warden
//                           )
//                         }
//                       >
//                         <Edit2 />
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleDeleteWarden(
//                             warden.id
//                           )
//                         }
//                       >
//                         <Trash2 />
//                       </button>

//                     </div>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Staff Section */}
//       {activeTab ===
//         "staff" && (
//         <>
//           <div className="bg-[#BEC5AD] rounded-xl p-6 mb-6">

//             <h2 className="text-2xl font-semibold mb-6">
//               Register New Staff
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//               <input
//                 type="text"
//                 name="firstName"
//                 value={
//                   formData.firstName
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="First Name"
//                 className="p-3 border rounded-md bg-white"
//               />

//               <input
//                 type="text"
//                 name="lastName"
//                 value={
//                   formData.lastName
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="Last Name"
//                 className="p-3 border rounded-md bg-white"
//               />

//               <input
//                 type="text"
//                 name="contactNumber"
//                 value={
//                   formData.contactNumber
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="Contact Number"
//                 className="p-3 border rounded-md bg-white"
//               />

//               <input
//                 type="email"
//                 name="emailId"
//                 value={
//                   formData.emailId
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="Email"
//                 className="p-3 border rounded-md bg-white"
//               />

//               <select
//                 name="designation"
//                 value={
//                   formData.designation
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 className="p-3 border rounded-md bg-white"
//               >

//                 <option value="">
//                   Select Designation
//                 </option>

//                 <option value="Watchman">
//                   Watchman
//                 </option>

//                 <option value="Cleaner">
//                   Cleaner
//                 </option>

//                 <option value="Other">
//                   Other
//                 </option>

//               </select>

//               {formData.designation ===
//                 "Other" && (

//                 <input
//                   type="text"
//                   name="otherDesignation"
//                   value={
//                     formData.otherDesignation
//                   }
//                   onChange={
//                     handleInputChange
//                   }
//                   placeholder="Specify Designation"
//                   className="p-3 border rounded-md bg-white"
//                 />
//               )}

//               <div className="flex items-center gap-2">

//                 <input
//                   type="time"
//                   name="shiftStart"
//                   value={
//                     formData.shiftStart
//                   }
//                   onChange={
//                     handleInputChange
//                   }
//                   className="p-3 border rounded-md bg-white"
//                 />

//                 <Clock />

//                 <input
//                   type="time"
//                   name="shiftEnd"
//                   value={
//                     formData.shiftEnd
//                   }
//                   onChange={
//                     handleInputChange
//                   }
//                   className="p-3 border rounded-md bg-white"
//                 />

//               </div>
//             </div>

//             <div className="mt-6 text-center">

//               <button
//                 onClick={
//                   handleRegisterStaff
//                 }
//                 className="bg-white px-8 py-3 rounded-xl font-bold"
//               >
//                 Register Staff
//               </button>

//             </div>
//           </div>

//           {/* Manage Staff */}
//           <div className="bg-[#BEC5AD] rounded-xl p-6">

//             <h2 className="text-2xl font-bold mb-6">
//               Manage Staff
//             </h2>

//             <div className="space-y-4">

//               {staffs.map(
//                 (staff) => (

//                   <div
//                     key={staff.id}
//                     className="bg-white rounded-lg p-4 flex justify-between items-center"
//                   >

//                     <div>

//                       <h3 className="font-bold text-lg">
//                         {
//                           staff.name
//                         }
//                       </h3>

//                       <p>
//                         {
//                           staff.email
//                         }
//                       </p>

//                       <p>
//                         {
//                           staff.designation
//                         }
//                       </p>

//                       <p>
//                         Shift:
//                         {" "}
//                         {
//                           staff.shiftStart
//                         }
//                         {" - "}
//                         {
//                           staff.shiftEnd
//                         }
//                       </p>

//                     </div>

//                     <div className="flex gap-4">

//                       <button
//                         onClick={() =>
//                           handleEditStaff(
//                             staff
//                           )
//                         }
//                       >
//                         <Edit2 />
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleDeleteStaff(
//                             staff.id
//                           )
//                         }
//                       >
//                         <Trash2 />
//                       </button>

//                     </div>
//                   </div>
//                 )
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {/* Success */}
//       {successMsg && (

//         <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-lg z-50">

//           {successMsg}

//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && (

//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//           <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl">

//             <div className="flex justify-between items-center mb-5">

//               <h2 className="text-2xl font-bold">
//                 Edit {
//                   activeTab ===
//                   "warden"
//                     ? "Warden"
//                     : "Staff"
//                 }
//               </h2>

//               <button
//                 onClick={() =>
//                   setShowEditModal(
//                     false
//                   )
//                 }
//               >
//                 <X />
//               </button>

//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//               <input
//                 type="text"
//                 name="firstName"
//                 value={
//                   formData.firstName
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="First Name"
//                 className="p-3 border rounded-md"
//               />

//               <input
//                 type="text"
//                 name="lastName"
//                 value={
//                   formData.lastName
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="Last Name"
//                 className="p-3 border rounded-md"
//               />

//               {activeTab ===
//                 "warden" && (

//                 <input
//                   type="text"
//                   name="wardenId"
//                   value={
//                     formData.wardenId
//                   }
//                   onChange={
//                     handleInputChange
//                   }
//                   placeholder="Warden ID"
//                   className="p-3 border rounded-md"
//                 />
//               )}

//               <input
//                 type="text"
//                 name="contactNumber"
//                 value={
//                   formData.contactNumber
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="Contact Number"
//                 className="p-3 border rounded-md"
//               />

//               <input
//                 type="email"
//                 name="emailId"
//                 value={
//                   formData.emailId
//                 }
//                 onChange={
//                   handleInputChange
//                 }
//                 placeholder="Email"
//                 className="p-3 border rounded-md"
//               />

//               {activeTab ===
//                 "staff" && (
//                 <>
//                   <select
//                     name="designation"
//                     value={
//                       formData.designation
//                     }
//                     onChange={
//                       handleInputChange
//                     }
//                     className="p-3 border rounded-md"
//                   >

//                     <option value="">
//                       Select
//                     </option>

//                     <option value="Watchman">
//                       Watchman
//                     </option>

//                     <option value="Cleaner">
//                       Cleaner
//                     </option>

//                     <option value="Other">
//                       Other
//                     </option>

//                   </select>

//                   {formData.designation ===
//                     "Other" && (

//                     <input
//                       type="text"
//                       name="otherDesignation"
//                       value={
//                         formData.otherDesignation
//                       }
//                       onChange={
//                         handleInputChange
//                       }
//                       placeholder="Specify Designation"
//                       className="p-3 border rounded-md"
//                     />
//                   )}

//                   <div className="flex gap-2">

//                     <input
//                       type="time"
//                       name="shiftStart"
//                       value={
//                         formData.shiftStart
//                       }
//                       onChange={
//                         handleInputChange
//                       }
//                       className="p-3 border rounded-md w-full"
//                     />

//                     <input
//                       type="time"
//                       name="shiftEnd"
//                       value={
//                         formData.shiftEnd
//                       }
//                       onChange={
//                         handleInputChange
//                       }
//                       className="p-3 border rounded-md w-full"
//                     />

//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="flex justify-end mt-6">

//               <button
//                 onClick={
//                   activeTab ===
//                   "warden"
//                     ? handleUpdateWarden
//                     : handleUpdateStaff
//                 }
//                 className="bg-green-600 text-white px-6 py-3 rounded-lg"
//               >
//                 Update
//               </button>

//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && (

//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//           <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">

//             <h2 className="text-xl font-bold text-center mb-5">
//               Delete {
//                 activeTab ===
//                 "warden"
//                   ? "Warden"
//                   : "Staff"
//               }?
//             </h2>

//             <div className="flex justify-center gap-4">

//               <button
//                 onClick={() =>
//                   setShowDeleteModal(
//                     false
//                   )
//                 }
//                 className="px-5 py-2 border rounded-lg"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={
//                   activeTab ===
//                   "warden"
//                     ? confirmDeleteWarden
//                     : confirmDeleteStaff
//                 }
//                 className="px-5 py-2 bg-red-600 text-white rounded-lg"
//               >
//                 Delete
//               </button>

//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Modal */}
//       {showViewModal &&
//         selectedWarden && (

//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//           <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">

//             <div className="flex justify-between items-center mb-5">

//               <h2 className="text-2xl font-bold">
//                 Warden Details
//               </h2>

//               <button
//                 onClick={() =>
//                   setShowViewModal(
//                     false
//                   )
//                 }
//               >
//                 <X />
//               </button>

//             </div>

//             <div className="space-y-3">

//               <p>
//                 <strong>
//                   First Name:
//                 </strong>{" "}
//                 {
//                   selectedWarden.firstName
//                 }
//               </p>

//               <p>
//                 <strong>
//                   Last Name:
//                 </strong>{" "}
//                 {
//                   selectedWarden.lastName
//                 }
//               </p>

//               <p>
//                 <strong>
//                   Email:
//                 </strong>{" "}
//                 {
//                   selectedWarden.email
//                 }
//               </p>

//               <p>
//                 <strong>
//                   Contact:
//                 </strong>{" "}
//                 {
//                   selectedWarden.contactNumber
//                 }
//               </p>

//               <p>
//                 <strong>
//                   Warden ID:
//                 </strong>{" "}
//                 {
//                   selectedWarden.wardenId
//                 }
//               </p>

//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StaffAllotment;


"use client";

<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  Trash2,
  Eye,
  X,
  UserPlus,
  ShieldCheck,
  Search,
  Plus,
  Mail,
  Phone,
  UserCog,
  ChevronRight,
  Loader2,
  Users2,
} from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

// ── Stat Card ────────────────────────────────────────────────────────────────
const PremiumStatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-[32px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 flex flex-col items-center gap-4 group hover:-translate-y-1 transition-all">
    <div className={`w-14 h-14 rounded-[20px] ${color} flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div className="text-center">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-3xl font-black text-[#1A1F16] tracking-tight">{value}</h3>
    </div>
  </div>
);

// ── Form Input ───────────────────────────────────────────────────────────────
const PremiumInput = ({ label, value, onChange, icon, placeholder, type = "text", name }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest ml-4">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7A8B5E]/30 group-focus-within:text-[#7A8B5E] transition-colors">
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-[20px] py-4 pl-14 pr-6 text-sm font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all placeholder:text-[#7A8B5E]/30"
      />
    </div>
  </div>
);
=======
import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Clock,
  X,
} from "lucide-react";
import axios from "axios";
>>>>>>> parent of b475873 (feat: initialize warden dashboard and management modules with student OCR registration support)

// ── Mobile Personnel Card ────────────────────────────────────────────────────
const PersonnelCard = ({ item, activeTab, onView, onDelete }) => (
  <div className="bg-white rounded-2xl border border-[#7A8B5E]/10 shadow-md p-5 space-y-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-[#F8FAF5] rounded-xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10">
          <Users2 size={20} />
        </div>
        <div>
          <p className="text-sm font-black text-[#1A1F16]">{item.name}</p>
          <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60">
            {item.wardenId || item.staffId || "ADMIN-001"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        On Duty
      </div>
    </div>

    {/* Details grid */}
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-[#F8FAF5] rounded-xl p-3">
        <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest mb-1">Contact</p>
        <p className="text-xs font-bold text-[#1A1F16] flex items-center gap-1">
          <Phone size={10} className="text-[#7A8B5E]" />
          {item.contactNumber || "—"}
        </p>
      </div>
      <div className="bg-[#F8FAF5] rounded-xl p-3">
        <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest mb-1">Role</p>
        <p className="text-xs font-bold text-[#1A1F16]">
          {item.designation || (activeTab === "warden" ? "Warden" : "Operational")}
        </p>
      </div>
      <div className="bg-[#F8FAF5] rounded-xl p-3 col-span-2">
        <p className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest mb-1">Email</p>
        <p className="text-xs font-bold text-[#1A1F16] flex items-center gap-1">
          <Mail size={10} className="text-[#7A8B5E]" />
          {item.email || item.emailId || "—"}
        </p>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-2 pt-1">
      <button
        onClick={() => onView(item)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-xl text-xs font-black text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all"
      >
        <Eye size={14} /> View
      </button>
      <button
        onClick={() => onDelete(item)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs font-black text-red-500 hover:bg-red-500 hover:text-white transition-all"
      >
        <Trash2 size={14} /> Remove
      </button>
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const StaffAllotment = () => {

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      contactNumber: "",
      emailId: "",
      designation: "",
      otherDesignation: "",
      shiftStart: "",
      shiftEnd: "",
      salary: "",
    });

  const [staffs, setStaffs] =
    useState([]);

  const [successMsg, setSuccessMsg] =
    useState("");

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

  // Fetch Staff
  useEffect(() => {

    fetchStaffs();

  }, []);

  const fetchStaffs = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5224/api/staffauth/all"
        );

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isWarden = activeTab === "warden";
      const endpoint = isWarden ? "/api/adminauth/register-warden" : "/api/staffauth/register-staff";
      const payload = isWarden
        ? { firstName: formData.firstName, lastName: formData.lastName, email: formData.emailId, contactNumber: formData.contactNumber, wardenId: formData.wardenId }
        : { firstName: formData.firstName, lastName: formData.lastName, email: formData.emailId, contactNumber: formData.contactNumber, designation: formData.designation === "Other" ? formData.otherDesignation : formData.designation, shiftStart: formData.shiftStart, shiftEnd: formData.shiftEnd };
=======
      const formattedData =
        response.data.staffs.map(
          (staff) => ({
>>>>>>> parent of b475873 (feat: initialize warden dashboard and management modules with student OCR registration support)

            id: staff._id,

            firstName:
              staff.firstName,

            lastName:
              staff.lastName,

            name: `${staff.firstName} ${staff.lastName}`,

            email:
              staff.email,

            contactNumber:
              staff.contactNumber,

            designation:
              staff.designation,

            shiftStart:
              staff.shiftStart,

            shiftEnd:
              staff.shiftEnd,
          })
        );

      setStaffs(formattedData);

    } catch (error) {

      console.error(error);
    }
  };

<<<<<<< HEAD
  const handleView = (item) => {
    toast(`${item.name} — ${item.email || item.emailId || "No email"}`, { icon: "👤" });
  };

  const handleDelete = (item) => {
    toast.error(`Remove ${item.name}? (not yet wired)`, { icon: "🗑️" });
  };

  const filteredItems = (activeTab === "warden" ? wardens : staffs).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.wardenId || item.staffId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAF5] p-4 md:p-8 space-y-8">
      <Toaster position="top-right" />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-[#7A8B5E] rounded-full shadow-lg" />
          <div>
            <h1 className="text-2xl font-black text-[#1A1F16] tracking-tight uppercase italic leading-none">
              Personnel Command
            </h1>
            <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.25em] mt-1">
              Staff Unit & Administrative Registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8B5E]/40 group-focus-within:text-[#7A8B5E] transition-colors" />
            <input
              type="text"
              placeholder="Search personnel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#7A8B5E]/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all"
=======
  // Input Change
  const handleInputChange = (e) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Register Staff
  const handleRegisterStaff =
    async () => {

      try {

        const payload = {

          firstName:
            formData.firstName,

          lastName:
            formData.lastName,

          email:
            formData.emailId,

          staffId: `S${Date.now()
            .toString()
            .slice(-4)}`,

          contactNumber:
            formData.contactNumber,

          designation:
            formData.designation ===
            "Other"
              ? formData.otherDesignation
              : formData.designation,

          shiftStart:
            formData.shiftStart,

          shiftEnd:
            formData.shiftEnd,

          salary:
            formData.salary,
        };

        const response =
          await axios.post(
            "http://localhost:5224/api/staffauth/register-staff",
            payload
          );

        setSuccessMsg(
          response.data.message
        );

        fetchStaffs();

        setFormData({
          firstName: "",
          lastName: "",
          contactNumber: "",
          emailId: "",
          designation: "",
          otherDesignation: "",
          shiftStart: "",
          shiftEnd: "",
          salary: "",
        });

        setTimeout(() => {
          setSuccessMsg("");
        }, 3000);

      } catch (error) {

        console.error(error);

        setSuccessMsg(
          "Error registering staff"
        );
      }
    };

  // Edit Staff
  const handleEditStaff =
    (staff) => {

      setSelectedId(
        staff.id
      );

      setFormData({
        firstName:
          staff.firstName,

        lastName:
          staff.lastName,

        contactNumber:
          staff.contactNumber,

        emailId:
          staff.email,

        designation:
          staff.designation,

        shiftStart:
          staff.shiftStart,

        shiftEnd:
          staff.shiftEnd,

        salary:
          staff.salary || "",
      });

      setShowEditModal(true);
    };

  // Update Staff
  const handleUpdateStaff =
    async () => {

      try {

        const payload = {

          firstName:
            formData.firstName,

          lastName:
            formData.lastName,

          email:
            formData.emailId,

          contactNumber:
            formData.contactNumber,

          designation:
            formData.designation ===
            "Other"
              ? formData.otherDesignation
              : formData.designation,

          shiftStart:
            formData.shiftStart,

          shiftEnd:
            formData.shiftEnd,

          salary:
            formData.salary,
        };

        await axios.put(
          `http://localhost:5224/api/staffauth/update/${selectedId}`,
          payload
        );

        setSuccessMsg(
          "Staff updated successfully"
        );

        fetchStaffs();

        setShowEditModal(false);

      } catch (error) {

        console.error(error);
      }
    };

  // Delete Staff
  const handleDeleteStaff =
    (id) => {

      setSelectedId(id);

      setShowDeleteModal(true);
    };

  const confirmDeleteStaff =
    async () => {

      try {

        await axios.delete(
          `http://localhost:5224/api/staffauth/delete/${selectedId}`
        );

        fetchStaffs();

        setSuccessMsg(
          "Staff deleted successfully"
        );

      } catch (error) {

        console.error(error);
      }

      setShowDeleteModal(false);
    };

  return (
    <div className="flex-1 bg-white p-4 sm:p-6 mt-5">

      {/* Header */}
      <div className="mb-6">

        <div className="flex items-center mb-4">

          <div className="w-[4px] h-6 bg-[#4F8CCF] mr-3" />

          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Staff Allotment
          </h1>

        </div>
      </div>

      {/* Register Staff */}
      <div
        className="bg-[#BEC5AD] rounded-xl p-4 sm:p-6 mb-6"
        style={{
          boxShadow:
            "0px 4px 4px 0px #00000040 inset",
        }}
      >

        <h2 className="text-xl sm:text-2xl font-semibold text-black mb-6">
          Register New Staff
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* First Name */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={
                handleInputChange
              }
              placeholder="Enter First Name"
              className="w-full p-3 border rounded-md bg-white"
>>>>>>> parent of b475873 (feat: initialize warden dashboard and management modules with student OCR registration support)
            />

          </div>
<<<<<<< HEAD
          {/* Commission Button */}
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-5 py-3.5 bg-[#1A1F16] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all whitespace-nowrap"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Commission Staff</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <PremiumStatCard label="Total Wardens" value={wardens.length} icon={<ShieldCheck />} color="bg-blue-50 text-blue-600" />
        <PremiumStatCard label="Active Staff" value={staffs.length} icon={<Users2 />} color="bg-emerald-50 text-emerald-600" />
        <PremiumStatCard label="On-Shift" value={Math.floor(staffs.length * 0.7)} icon={<UserCog />} color="bg-amber-50 text-amber-600" />
        <PremiumStatCard label="System Status" value="Secure" icon={<ShieldCheck />} color="bg-purple-50 text-purple-600" />
      </div>

      {/* ── Tab Container ── */}
      <div className="bg-white rounded-[32px] border border-[#7A8B5E]/10 shadow-xl shadow-[#7A8B5E]/5 overflow-hidden">

        {/* Tab Buttons */}
        <div className="flex border-b border-[#7A8B5E]/5 bg-[#F8FAF5]/50">
          {[
            { key: "warden", label: "Wardens" },
            { key: "staff", label: "Staff" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                activeTab === tab.key
                  ? "border-[#7A8B5E] text-[#1A1F16] bg-white/50"
                  : "border-transparent text-[#1A1F16]/30 hover:text-[#1A1F16]/60"
              }`}
            >
              {/* Short label on mobile, full on desktop */}
              <span className="sm:hidden">{tab.label}</span>
              <span className="hidden sm:inline">
                {tab.key === "warden" ? "Administrative Wardens" : "Operational Staff"}
              </span>
            </button>
          ))}
        </div>

        {/* ── MOBILE: Card List ── */}
        <div className="block lg:hidden p-4 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center">
              <Users2 className="mx-auto mb-4 text-[#7A8B5E]/20" size={48} />
              <p className="text-sm font-black text-[#1A1F16]/30 uppercase tracking-widest">No personnel found</p>
            </div>
          ) : (
            filteredItems.map((item, i) => (
              <PersonnelCard
                key={i}
                item={item}
                activeTab={activeTab}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* ── DESKTOP: Table ── */}
        <div className="hidden lg:block">
          <table className="w-full text-left border-collapse table-fixed">
            <colgroup>
              <col style={{ width: "28%" }} />
              <col style={{ width: "26%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
            </colgroup>
            <thead>
              <tr className="bg-[#F8FAF5]/50 border-b border-[#7A8B5E]/10">
                {["Personnel Record", "Contact Node", "Designated Role", "Deployment", "Action"].map(h => (
                  <th key={h} className="px-8 py-5 text-[10px] font-black text-[#7A8B5E] uppercase tracking-[0.2em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <Users2 className="mx-auto mb-4 text-[#7A8B5E]/20" size={48} />
                    <p className="text-sm font-black text-[#1A1F16]/30 uppercase tracking-widest">No personnel found</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, i) => (
                  <tr key={i} className="border-b border-[#7A8B5E]/5 hover:bg-[#F8FAF5] transition-colors group">
                    {/* Name */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-[#F8FAF5] rounded-xl flex items-center justify-center text-[#7A8B5E] border border-[#7A8B5E]/10 group-hover:bg-[#7A8B5E] group-hover:text-white transition-all shadow-sm shrink-0">
                          <Users2 size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#1A1F16] truncate">{item.name}</p>
                          <p className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest opacity-60 truncate">
                            {item.wardenId || item.staffId || "ADMIN-001"}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-8 py-6">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1A1F16] flex items-center gap-1.5 truncate">
                          <Phone size={10} className="text-[#7A8B5E] shrink-0" />
                          {item.contactNumber || "—"}
                        </p>
                        <p className="text-[10px] font-medium text-[#7A8B5E] opacity-70 truncate mt-0.5">
                          {item.email || item.emailId || "—"}
                        </p>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-[#1A1F16] uppercase tracking-[0.1em] bg-[#F8FAF5] px-3 py-1.5 rounded-lg border border-[#7A8B5E]/10 whitespace-nowrap">
                        {item.designation || (activeTab === "warden" ? "Warden" : "Operational")}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                        On Duty
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-2.5 bg-white border border-[#7A8B5E]/10 rounded-xl text-[#7A8B5E] hover:bg-[#7A8B5E] hover:text-white transition-all shadow-sm"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2.5 bg-white border border-red-100 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Registration Modal ── */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#1A1F16]/60 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-[#7A8B5E]/10">

            {/* Modal Header */}
            <div className="px-7 py-6 border-b border-[#7A8B5E]/5 flex justify-between items-start bg-[#F8FAF5]/50 shrink-0">
              <div>
                <h2 className="text-xl font-black text-[#1A1F16] italic uppercase tracking-tight">
                  Personnel Commissioning
                </h2>
                <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-1">
                  Enroll new {activeTab} into service
                </p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2.5 bg-white border border-[#7A8B5E]/10 rounded-xl text-[#1A1F16] hover:bg-red-50 hover:text-red-500 transition-all shadow-sm shrink-0 ml-4"
              >
                <X size={18} />
=======

          {/* Last Name */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={
                handleInputChange
              }
              placeholder="Enter Last Name"
              className="w-full p-3 border rounded-md bg-white"
            />

          </div>

          {/* Contact */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Contact Number
            </label>

            <input
              type="text"
              name="contactNumber"
              value={
                formData.contactNumber
              }
              onChange={
                handleInputChange
              }
              placeholder="Enter Contact Number"
              className="w-full p-3 border rounded-md bg-white"
            />

          </div>

          {/* Email */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Email ID
            </label>

            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={
                handleInputChange
              }
              placeholder="Enter Email Address"
              className="w-full p-3 border rounded-md bg-white"
            />

          </div>

          {/* Designation */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Designation
            </label>

            <select
              name="designation"
              value={
                formData.designation
              }
              onChange={
                handleInputChange
              }
              className="w-full p-3 border rounded-md bg-white"
            >

              <option value="">
                Select Designation
              </option>

              <option value="Watchman">
                Watchman
              </option>

              <option value="Cleaner">
                Cleaner
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* Other Designation */}
          {formData.designation ===
            "Other" && (

            <div>

              <label className="block text-base sm:text-lg text-black font-bold mb-1">
                Specify Designation
              </label>

              <input
                type="text"
                name="otherDesignation"
                value={
                  formData.otherDesignation
                }
                onChange={
                  handleInputChange
                }
                placeholder="Enter Designation"
                className="w-full p-3 border rounded-md bg-white"
              />

            </div>
          )}

          {/* Shift Timing */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Shift Timing
            </label>

            <div className="flex items-center gap-2">

              <input
                type="time"
                name="shiftStart"
                value={
                  formData.shiftStart
                }
                onChange={
                  handleInputChange
                }
                className="w-full p-3 border rounded-md bg-white"
              />

              <Clock />

              <input
                type="time"
                name="shiftEnd"
                value={
                  formData.shiftEnd
                }
                onChange={
                  handleInputChange
                }
                className="w-full p-3 border rounded-md bg-white"
              />

            </div>
          </div>

          {/* Salary */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Salary
            </label>

            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={
                handleInputChange
              }
              placeholder="Enter Salary Amount"
              className="w-full p-3 border rounded-md bg-white"
            />

          </div>
        </div>

        {/* Button */}
        <div className="mt-7 text-center">

          <button
            onClick={
              handleRegisterStaff
            }
            className="bg-white border border-gray-300 py-3 px-8 sm:px-12 rounded-2xl font-bold shadow-2xl"
          >
            Register Staff
          </button>

        </div>
      </div>

      {/* Success */}
      {successMsg && (

        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50">

          {successMsg}

        </div>
      )}

      {/* Manage Staff */}
      <div
        className="bg-[#BEC5AD] rounded-xl p-4 sm:p-6"
        style={{
          boxShadow:
            "inset 0px 4px 20px 0px #00000040",
        }}
      >

        <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">
          Manage Staff
        </h2>

        <div className="space-y-4">

          {staffs.map(
            (staff) => (

              <div
                key={staff.id}
                className="bg-white rounded-lg p-4 flex justify-between items-center"
              >

                <div>

                  <h3 className="font-bold text-lg">
                    {staff.name}
                  </h3>

                  <p>
                    {staff.email}
                  </p>

                  <p>
                    {staff.designation}
                  </p>

                  <p>
                    Shift:
                    {" "}
                    {
                      staff.shiftStart
                    }
                    {" - "}
                    {
                      staff.shiftEnd
                    }
                  </p>

                </div>

                <div className="flex gap-4">

                  <button
                    onClick={() =>
                      handleEditStaff(
                        staff
                      )
                    }
                  >
                    <Edit2 />
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteStaff(
                        staff.id
                      )
                    }
                  >
                    <Trash2 />
                  </button>

                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-2xl font-bold">
                Edit Staff
              </h2>

              <button
                onClick={() =>
                  setShowEditModal(
                    false
                  )
                }
              >
                <X />
>>>>>>> parent of b475873 (feat: initialize warden dashboard and management modules with student OCR registration support)
              </button>

            </div>

<<<<<<< HEAD
            {/* Tab switcher inside modal */}
            <div className="flex border-b border-[#7A8B5E]/5 shrink-0">
              {["warden", "staff"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                    activeTab === tab
                      ? "border-[#7A8B5E] text-[#1A1F16]"
                      : "border-transparent text-[#1A1F16]/30 hover:text-[#1A1F16]/60"
                  }`}
                >
                  {tab === "warden" ? "Warden" : "Staff"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <PremiumInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} icon={<Users2 />} placeholder="John" />
                <PremiumInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} icon={<Users2 />} placeholder="Doe" />
                <PremiumInput label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} icon={<Phone />} placeholder="+91 00000 00000" />
                <PremiumInput label="Email" name="emailId" value={formData.emailId} onChange={handleInputChange} icon={<Mail />} placeholder="john@example.com" />

                {activeTab === "warden" ? (
                  <div className="sm:col-span-2">
                    <PremiumInput label="Administrative ID" name="wardenId" value={formData.wardenId} onChange={handleInputChange} icon={<ShieldCheck />} placeholder="W-786-XX" />
                  </div>
                ) : (
                  <>
                    <div className="sm:col-span-2">
                      <PremiumInput label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} icon={<UserCog />} placeholder="Staff Role" />
                    </div>
                    <PremiumInput label="Shift Start" name="shiftStart" value={formData.shiftStart} onChange={handleInputChange} icon={<ChevronRight />} type="time" />
                    <PremiumInput label="Shift End" name="shiftEnd" value={formData.shiftEnd} onChange={handleInputChange} icon={<ChevronRight />} type="time" />
                  </>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1F16] text-white py-5 rounded-[20px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <><UserPlus size={16} /> Confirm Commissioning</>
                  )}
                </button>
              </div>
            </form>
=======
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <input
                type="text"
                name="firstName"
                value={
                  formData.firstName
                }
                onChange={
                  handleInputChange
                }
                placeholder="First Name"
                className="p-3 border rounded-md"
              />

              <input
                type="text"
                name="lastName"
                value={
                  formData.lastName
                }
                onChange={
                  handleInputChange
                }
                placeholder="Last Name"
                className="p-3 border rounded-md"
              />

              <input
                type="text"
                name="contactNumber"
                value={
                  formData.contactNumber
                }
                onChange={
                  handleInputChange
                }
                placeholder="Contact Number"
                className="p-3 border rounded-md"
              />

              <input
                type="email"
                name="emailId"
                value={
                  formData.emailId
                }
                onChange={
                  handleInputChange
                }
                placeholder="Email"
                className="p-3 border rounded-md"
              />

              <select
                name="designation"
                value={
                  formData.designation
                }
                onChange={
                  handleInputChange
                }
                className="p-3 border rounded-md"
              >

                <option value="">
                  Select
                </option>

                <option value="Watchman">
                  Watchman
                </option>

                <option value="Cleaner">
                  Cleaner
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              {formData.designation ===
                "Other" && (

                <input
                  type="text"
                  name="otherDesignation"
                  value={
                    formData.otherDesignation
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Specify Designation"
                  className="p-3 border rounded-md"
                />
              )}

              <div className="flex gap-2">

                <input
                  type="time"
                  name="shiftStart"
                  value={
                    formData.shiftStart
                  }
                  onChange={
                    handleInputChange
                  }
                  className="p-3 border rounded-md w-full"
                />

                <input
                  type="time"
                  name="shiftEnd"
                  value={
                    formData.shiftEnd
                  }
                  onChange={
                    handleInputChange
                  }
                  className="p-3 border rounded-md w-full"
                />

              </div>

              <input
                type="number"
                name="salary"
                value={
                  formData.salary
                }
                onChange={
                  handleInputChange
                }
                placeholder="Salary"
                className="p-3 border rounded-md"
              />
            </div>

            <div className="flex justify-end mt-6">

              <button
                onClick={
                  handleUpdateStaff
                }
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Update
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">

            <h2 className="text-xl font-bold text-center mb-5">
              Delete Staff?
            </h2>

            <div className="flex justify-center gap-4">

              <button
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={
                  confirmDeleteStaff
                }
                className="px-5 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>

            </div>
>>>>>>> parent of b475873 (feat: initialize warden dashboard and management modules with student OCR registration support)
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAllotment;