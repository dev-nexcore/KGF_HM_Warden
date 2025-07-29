"use client";

import { useState } from "react";

export default function EmergencyContact() {
  const [searchTerm, setSearchTerm] = useState("");

  const contacts = [
    {
      student: "Chinmay Gawade",
      contact: "Chinmay Gawade",
      relation: "Mother",
      phone: "+91 932162553",
    },
    {
      student: "Chinmay Gawade",
      contact: "Chinmay Gawade",
      relation: "Mother",
      phone: "+91 932162553",
    },
    {
      student: "Chinmay Gawade",
      contact: "Chinmay Gawade",
      relation: "Mother",
      phone: "+91 932162553",
    },
    {
      student: "Chinmay Gawade",
      contact: "Chinmay Gawade",
      relation: "Mother",
      phone: "+91 932162553",
    },
    {
      student: "Chinmay Gawade",
      contact: "Chinmay Gawade",
      relation: "Mother",
      phone: "+91 932162553",
    },
  ];

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.relation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] px-4 py-4 sm:px-6 md:px-8 lg:px-12 xl:px-5 flex flex-col">
  {/* Page Header with 20px left offset */}
  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-black border-l-4 border-red-600 pl-3 mb-4 sm:mb-6 ml-5">
    Emergency Contact
  </h2>


      {/* Search and Buttons - Centered container with max width */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Search Input */}
          <div className="flex-1 max-w-full sm:max-w-md lg:max-w-lg">
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg shadow placeholder:text-gray-600 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-2 sm:gap-3">
            <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg shadow transition-colors duration-200 min-w-[70px] sm:min-w-[80px]">
              Filter
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg shadow transition-colors duration-200 min-w-[100px] sm:min-w-[120px]">
              + Add Contact
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View (visible on small screens) */}
      <div className="block lg:hidden space-y-3 sm:space-y-4 w-full max-w-6xl mx-auto">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No contacts found matching your search.
          </div>
        ) : (
          filteredContacts.map((contact, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md border-2 border-gray-400 p-4 sm:p-5"
            >
              <div className="space-y-3">
                <div className="pb-2 border-b-2 border-gray-300">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Student Name
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-black mt-1">
                    {contact.student}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                  <div className="pb-2 border-b-2 border-gray-300">
                    <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Contact Name
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-black mt-1">
                      {contact.contact}
                    </p>
                  </div>
                  
                  <div className="pb-2 border-b-2 border-gray-300">
                    <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Relation
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-black mt-1">
                      {contact.relation}
                    </p>
                  </div>
                </div>
                
                <div className="pb-2 border-b-2 border-gray-300">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Phone Number
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-black mt-1">
                    {contact.phone}
                  </p>
                </div>
                
                <div className="flex items-center justify-end gap-4 pt-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                    <img
                      src="/icons/phone.svg"
                      alt="Phone Icon"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span className="text-xs sm:text-sm font-medium text-green-700">Call</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200">
                    <img
                      src="/icons/edit.svg"
                      alt="Edit Icon"
                      className="w-4 h-4 sm:w-5 sm:h-5"
                    />
                    <span className="text-xs sm:text-sm font-medium text-blue-700">Edit</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (visible on large screens) */}
      <div className="hidden lg:block w-full max-w-6xl mx-auto">
        <div className="overflow-x-auto rounded-xl border-2 border-black bg-white shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#A4B494] text-black">
                <th className="text-left px-6 xl:px-8 py-4 xl:py-5 rounded-tl-xl font-semibold text-sm xl:text-base">
                  Student Name
                </th>
                <th className="text-left px-6 xl:px-8 py-4 xl:py-5 font-semibold text-sm xl:text-base">
                  Contact Name
                </th>
                <th className="text-left px-6 xl:px-8 py-4 xl:py-5 font-semibold text-sm xl:text-base">
                  Relation
                </th>
                <th className="text-left px-6 xl:px-8 py-4 xl:py-5 font-semibold text-sm xl:text-base">
                  Phone no.
                </th>
                <th className="text-left px-6 xl:px-8 py-4 xl:py-5 rounded-tr-xl font-semibold text-sm xl:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No contacts found matching your search.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact, index) => (
                 <tr
                   key={index}
                     className={`hover:bg-gray-50 transition-colors duration-150 relative ${
                       index !== filteredContacts.length - 1 ? "after:content-[''] after:absolute after:bottom-0 after:left-9 after:right-27 after:h-px after:bg-gray-400" : ""
                       }`}
                  >

                    <td className="px-6 xl:px-8 py-4 xl:py-5 font-semibold text-black text-sm xl:text-base">
                      {contact.student}
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-5 font-semibold text-black text-sm xl:text-base">
                      {contact.contact}
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-5 font-semibold text-black text-sm xl:text-base">
                      {contact.relation}
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-5 font-semibold text-black text-sm xl:text-base">
                      {contact.phone}
                    </td>
                    <td className="px-6 xl:px-8 py-4 xl:py-5">
                      <div className="flex items-center gap-3 xl:gap-4">
                        <button className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group">
                          <img
                            src="/emergency/phone.png"
                            alt="Phone Icon"
                            className="w-5 h-5 xl:w-6 xl:h-6 group-hover:scale-110 transition-transform duration-200"
                          />
                        </button>
                        <div className="w-px h-6 bg-gray-800" />
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 group">
                          <img
                            src="/emergency/edit.png"
                            alt="Edit Icon"
                            className="w-5 h-5 xl:w-6 xl:h-6 group-hover:scale-110 transition-transform duration-200"
                          />
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
    </div>
  );
}