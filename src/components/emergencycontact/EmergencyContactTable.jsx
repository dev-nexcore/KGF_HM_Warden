"use client";
import { FiPhone, FiSearch, FiPlus, FiFilter } from "react-icons/fi";
import { FaEdit } from "react-icons/fa"; // Solid Edit Icon from Font Awesome

export default function EmergencyContactTable() {
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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-black border-l-4 border-red-500 pl-3">
        Emergency Contact
      </h2>

      {/* Search and buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search bar */}
        <div className="relative w-full md:w-1/2">
          <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts by Name or Relation..."
            className="w-full pl-10 pr-4 py-2 rounded-lg shadow-[0px_4px_20px_0px_#00000040] focus:outline-none placeholder:text-gray-600 text-black bg-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow">
            <FiFilter />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow">
            <FiPlus />
            Add Contact
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-black">
        <table className="min-w-full bg-white">
          <thead className="bg-[#A4B494] text-gray-800">
            <tr>
              <th className="text-left px-4 py-3 whitespace-nowrap">Student Name</th>
              <th className="text-left px-4 py-3 whitespace-nowrap">Contact Name</th>
              <th className="text-left px-4 py-3 whitespace-nowrap">Relation</th>
              <th className="text-left px-4 py-3 whitespace-nowrap">Phone no.</th>
              <th className="text-left px-4 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{c.student}</td>
                <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{c.contact}</td>
                <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{c.relation}</td>
                <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{c.phone}</td>
                <td className="px-4 py-3 flex items-center gap-4">
                  <FiPhone className="cursor-pointer text-gray-700 hover:text-black" />
                  <FaEdit className="cursor-pointer text-gray-700 hover:text-black" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
