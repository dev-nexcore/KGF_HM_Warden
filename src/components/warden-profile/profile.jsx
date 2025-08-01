// "use client";


// export default function WardenProfile() {
//   return (
//     <div className="min-h-screen bg-white px-4 sm:px-6 md:px-10 flex flex-col">
//       {/* Section Title with Red Line */}
//       <div className="flex items-center ml-1 md:ml-2 mt-8 mb-5">
//         <div className="h-7 w-1 bg-[#FF0000] rounded mr-3" />
//         <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold text-[#232323] select-none">
//           Warden Profile
//         </span>
//       </div>

//       {/* Flexible container for two cards */}
//       <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 mx-auto w-full max-w-7xl">
//         {/* Profile Card */}
//         <div className="bg-[#BEC5AD] rounded-2xl shadow-md flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl py-8 px-6">
//           <div
//             className="rounded-full bg-white overflow-hidden mb-6"
//             style={{ width: 96, height: 96 }}
//           >
            
//           </div>
//           <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#232323] leading-snug">
//             Nouman Khan
//           </h2>
//           <p className="text-base sm:text-lg text-gray-700 mt-3 text-center break-words max-w-full px-4">
//             Student ID: HFL001
//           </p>
//           <button className="mt-8 px-8 py-3 rounded-md bg-[#A4B494] text-[#232323] font-bold shadow hover:bg-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#A4B494]">
//             Edit Profile
//           </button>
//         </div>

//         {/* Basic Information Card */}
//         <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl flex flex-col">
//           {/* Green header */}
//           <div className="bg-[#BEC5AD] rounded-t-2xl h-20 flex items-center justify-center px-6">
//             <h3 className="text-2xl sm:text-3xl font-bold text-[#232323] select-none whitespace-nowrap">
//               Basic Information
//             </h3>
//           </div>

//           {/* Information list */}
//           <div className="flex flex-col gap-8 p-6 sm:p-10">
//             {[
//               { label: "First Name:", value: "Nouman" },
//               { label: "Last Name:", value: "Khan" },
//               { label: "Email Address:", value: "gawadechinmay01@gmail.com" },
//               { label: "Warden ID:", value: "WDN001" },
//               { label: "Phone No:", value: "9321625533" },
//               { label: "Department:", value: "Student Affairs" },
//             ].map(({ label, value }) => (
//               <div
//                 key={label}
//                 className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
//               >
//                 <span className="font-semibold text-gray-800 sm:w-1/3 break-words text-base sm:text-lg">
//                   {label}
//                 </span>
//                 <span className="text-gray-900 sm:w-2/3 break-words mt-1 sm:mt-0 text-base sm:text-lg">
//                   {value}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("wardenToken") : null;
  const decoded = token ? jwtDecode(token) : null;
  const wardenId = decoded?.id;

  useEffect(() => {
    if (wardenId) {
      axios
        .get(`http://localhost:5000/api/wardenauth/profile/${wardenId}`)
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
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      if (profilePhoto) form.append("profilePhoto", profilePhoto);

      const res = await axios.put(
        `http://localhost:5000/api/wardenauth/profile/${wardenId}`,
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
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-10 flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Section Title */}
      <div className="flex items-center ml-1 md:ml-2 mt-8 mb-5">
        <div className="h-7 w-1 bg-[#FF0000] rounded mr-3" />
        <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold text-[#232323] select-none">
          Warden Profile
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 mx-auto w-full max-w-7xl">
        {/* Profile Card */}
        <div className="bg-[#BEC5AD] rounded-2xl shadow-md flex flex-col items-center w-full max-w-sm sm:max-w-md lg:max-w-xl py-8 px-6">
          <div
            className="rounded-full bg-white overflow-hidden mb-6"
            style={{ width: 96, height: 96 }}
          >
            {warden.profilePhoto ? (
              <img
                src={`http://localhost:5000/uploads/wardens/${warden.profilePhoto}`}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#232323] leading-snug">
            {warden.firstName} {warden.lastName}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mt-3 text-center break-words max-w-full px-4">
            Warden ID: {warden.wardenId}
          </p>
          <button
            onClick={() => setEditMode(!editMode)}
            className="mt-8 px-8 py-3 rounded-md bg-[#A4B494] text-[#232323] font-bold shadow hover:bg-white transition-colors duration-300"
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Basic Info Section */}
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl flex flex-col">
          <div className="bg-[#BEC5AD] rounded-t-2xl h-20 flex items-center justify-center px-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#232323] select-none whitespace-nowrap">
              Basic Information
            </h3>
          </div>

          <div className="flex flex-col gap-8 p-6 sm:p-10">
            {!editMode ? (
              [
                { label: "First Name:", value: warden.firstName },
                { label: "Last Name:", value: warden.lastName },
                { label: "Email Address:", value: warden.email },
                { label: "Warden ID:", value: warden.wardenId },
                { label: "Phone No:", value: warden.contactNumber },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <span className="font-semibold text-gray-800 sm:w-1/3 text-base sm:text-lg">
                    {label}
                  </span>
                  <span className="text-gray-900 sm:w-2/3 mt-1 sm:mt-0 text-base sm:text-lg">
                    {value}
                  </span>
                </div>
              ))
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 text-base">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="font-semibold">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Contact Number</label>
                    <input
                      type="text"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded mt-1"
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="font-semibold">Profile Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full mt-1"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenProfile;
