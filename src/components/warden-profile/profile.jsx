"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import { Camera } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const WardenProfile = () => {
  const [warden, setWarden] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("wardenToken") : null;
  const decoded = token ? jwtDecode(token) : null;
  const wardenId = decoded?.id;

  useEffect(() => {
    if (wardenId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/profile/${wardenId}`)
        .then((res) => {
          setWarden(res.data);
          setFormData({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            email: res.data.email || "",
            contactNumber: res.data.contactNumber || "",
          });
        })
        .catch((err) => {
          console.error("Failed to fetch profile", err);
          toast.error("Failed to fetch profile details.");
        });
    }
  }, [wardenId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      handlePhotoUpload(file);
    }
  };

  const handlePhotoUpload = async (file) => {
    try {
      const form = new FormData();
      form.append("profilePhoto", file);

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/profile/${wardenId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile photo updated successfully!");
      setWarden(res.data.warden);
    } catch (error) {
      console.error("Photo upload error", error);
      toast.error("Failed to update profile photo.");
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/profile/${wardenId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully!");
      setWarden(res.data.warden);
      setEditMode(false);
    } catch (error) {
      console.error("Update error", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    // <div className="max-h-screen bg-white px-4 sm:px-6 md:px-10 flex flex-col">
    //   <ToastContainer position="top-right" autoClose={3000} />
    //   {/* Section Title */}
    //   <div className="flex items-center ml-1 md:ml-2 mt-8 mb-5">
    //     <div className="h-7 w-1 bg-[#FF0000] rounded mr-3" />
    //     <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold text-[#232323] select-none">
    //       Warden Profile
    //     </span>
    //   </div>

    //   <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 mx-auto w-full max-w-7xl">
    //     {/* Profile Card */}
    //     <div className="bg-[#BEC5AD] rounded-2xl shadow-md flex flex-col items-center w-full max-w-sm sm:max-w-md lg:max-w-xl py-8 px-6">
    //       <div
    //         className="rounded-full bg-white overflow-hidden mb-6 relative cursor-pointer group"
    //         style={{ width: 96, height: 96 }}
    //         onMouseEnter={() => setIsHovering(true)}
    //         onMouseLeave={() => setIsHovering(false)}
    //         onClick={handleProfilePictureClick}
    //       >
    //         {warden.profilePhoto ? (
    //           <img
    //             src={`${process.env.NEXT_PUBLIC_PROD_API_URL}/uploads/wardens/${warden.profilePhoto}`}
    //             alt="Profile"
    //             className="object-cover w-full h-full transition-opacity duration-200 group-hover:opacity-60"
    //           />
    //         ) : (
    //           <div className="w-full h-full bg-gray-200 transition-opacity duration-200 group-hover:opacity-60" />
    //         )}

    //         {/* Hover Overlay */}
    //         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    //           <Camera className="w-8 h-8 text-white mb-1" />
    //           <span className="text-white text-xs font-medium">Change Photo</span>
    //         </div>
    //       </div>

    //       {/* Hidden file input */}
    //       <input
    //         ref={fileInputRef}
    //         type="file"
    //         accept="image/*"
    //         onChange={handlePhotoChange}
    //         className="hidden"
    //       />

    //       <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#232323] leading-snug">
    //         {warden.firstName} {warden.lastName}
    //       </h2>
    //       <p className="text-base sm:text-lg text-gray-700 mt-3 text-center break-words max-w-full px-4">
    //         Warden ID: {warden.wardenId}
    //       </p>
    //       <button
    //         onClick={() => setEditMode(!editMode)}
    //         className="mt-8 px-8 py-3 rounded-md bg-[#A4B494] text-[#232323] font-bold shadow hover:bg-white transition-colors duration-300"
    //       >
    //         {editMode ? "Cancel" : "Edit Profile"}
    //       </button>
    //     </div>

    //     {/* Basic Info Section */}
    //     <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl flex flex-col">
    //       <div className="bg-[#BEC5AD] rounded-t-2xl h-20 flex items-center justify-center px-6">
    //         <h3 className="text-2xl sm:text-3xl font-bold text-[#232323] select-none whitespace-nowrap">
    //           Basic Information
    //         </h3>
    //       </div>

    //       <div className="flex flex-col gap-8 p-6 sm:p-10">
    //         {!editMode ? (
    //           [
    //             { label: "First Name:", value: warden.firstName },
    //             { label: "Last Name:", value: warden.lastName },
    //             { label: "Email Address:", value: warden.email },
    //             { label: "Warden ID:", value: warden.wardenId },
    //             { label: "Phone No:", value: warden.contactNumber },
    //           ].map(({ label, value }) => (
    //             <div
    //               key={label}
    //               className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
    //             >
    //               <span className="font-semibold text-gray-800 sm:w-1/3 text-base sm:text-lg">
    //                 {label}
    //               </span>
    //               <span className="text-gray-900 sm:w-2/3 mt-1 sm:mt-0 text-base sm:text-lg">
    //                 {value}
    //               </span>
    //             </div>
    //           ))
    //         ) : (
    //           <form onSubmit={handleSubmit} className="space-y-6 text-base">
    //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    //               <div>
    //                 <label className="font-semibold">First Name</label>
    //                 <input
    //                   type="text"
    //                   name="firstName"
    //                   value={formData.firstName}
    //                   onChange={handleChange}
    //                   className="w-full border px-3 py-2 rounded mt-1"
    //                 />
    //               </div>
    //               <div>
    //                 <label className="font-semibold">Last Name</label>
    //                 <input
    //                   type="text"
    //                   name="lastName"
    //                   value={formData.lastName}
    //                   onChange={handleChange}
    //                   className="w-full border px-3 py-2 rounded mt-1"
    //                 />
    //               </div>
    //               <div>
    //                 <label className="font-semibold">Email</label>
    //                 <input
    //                   type="email"
    //                   name="email"
    //                   value={formData.email}
    //                   onChange={handleChange}
    //                   className="w-full border px-3 py-2 rounded mt-1"
    //                 />
    //               </div>
    //               <div>
    //                 <label className="font-semibold">Contact Number</label>
    //                 <input
    //                   type="text"
    //                   name="contactNumber"
    //                   value={formData.contactNumber}
    //                   onChange={handleChange}
    //                   className="w-full border px-3 py-2 rounded mt-1"
    //                 />
    //               </div>
    //             </div>
    //             <button
    //               type="submit"
    //               className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
    //             >
    //               Save Changes
    //             </button>
    //           </form>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>



    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-10 flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Section Title */}
      <div className="flex items-center ml-1 md:ml-2 mt-8 mb-6">
        <div className="h-7 w-1 bg-red-500 rounded mr-3" />
        <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 select-none">
          Warden Profile
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-center gap-6 mx-auto w-full max-w-7xl">

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-sm lg:max-w-xs shrink-0">

          {/* Green banner */}
          <div className="h-24 bg-[#A4B494]/40 relative" />

          <div className="flex flex-col items-center px-6 pb-8 -mt-12">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden relative cursor-pointer group bg-gray-200"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleProfilePictureClick}
            >
              {warden.profilePhoto ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_PROD_API_URL}/uploads/wardens/${warden.profilePhoto}`}
                  alt="Profile"
                  className="object-cover w-full h-full group-hover:opacity-60 transition-opacity duration-200"
                />
              ) : (
                <div className="w-full h-full bg-[#A4B494]/30 group-hover:opacity-60 transition-opacity duration-200" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-6 h-6 text-white mb-0.5" />
                <span className="text-white text-[10px] font-medium">Change Photo</span>
              </div>
            </div>

            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />

            <h2 className="mt-4 text-xl font-bold text-gray-800 text-center">
              {warden.firstName} {warden.lastName}
            </h2>

            <span className="mt-1 text-xs font-mono text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {warden.wardenId}
            </span>

            <div className="w-full mt-6 pt-5 border-t border-gray-100 flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#A4B494]/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#1a312a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="truncate">{warden.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#A4B494]/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#1a312a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>{warden.contactNumber}</span>
              </div>
            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className={`mt-6 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${editMode
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-[#1a312a] text-white hover:bg-[#0f211a]"
                }`}
            >
              {editMode ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* ── Basic Info Section ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full ">

          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wide uppercase">Basic Information</h3>
          </div>

          <div className="p-6 sm:p-8">
            {!editMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: "First Name", value: warden.firstName, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0z" },
                  { label: "Last Name", value: warden.lastName, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0z" },
                  { label: "Email Address", value: warden.email, icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                  { label: "Warden ID", value: warden.wardenId, icon: "M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" },
                  { label: "Phone No.", value: warden.contactNumber, icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#A4B494]/25 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-[#1a312a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                      <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: "First Name", name: "firstName", type: "text" },
                    { label: "Last Name", name: "lastName", type: "text" },
                    { label: "Email Address", name: "email", type: "email" },
                    { label: "Contact Number", name: "contactNumber", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#A4B494] focus:border-transparent transition"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1a312a] text-white text-sm font-semibold rounded-xl hover:bg-[#0f211a] transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenProfile;