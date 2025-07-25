"use client";
import { useState } from "react";
import { FiPhone, FiSearch, FiPlus, FiFilter } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

// Editable emergency contacts (cards)
const mockContacts = [
  { id: 1, name: "Police Station", phone: "100" },
  { id: 2, name: "Fire Department", phone: "101" },
  { id: 3, name: "Hospital", phone: "102" },
];

// Emergency contacts table (relational)
const initialTableContacts = [
  {
    student: "Chinmay Gawade",
    contact: "Chinmay Gawade",
    relation: "Mother",
    phone: "+91 932162553",
  },
  {
    student: "Kritikka Mishra",
    contact: "Kritikka Mishra",
    relation: "Father",
    phone: "+91 999999999",
  },
  {
    student: "Sulfiya Khan",
    contact: "Sulfiya Khan",
    relation: "Spouse",
    phone: "+91 888888888",
  },
  {
    student: "Alexa Smith",
    contact: "Alexa Smith",
    relation: "Sister",
    phone: "+91 777777777",
  },
];

export default function EmergencyContact() {
  // Editable card state
  const [contacts, setContacts] = useState(mockContacts);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", phone: "" });

  // Table state and search
  const [tableContacts] = useState(initialTableContacts);
  const [search, setSearch] = useState("");

  // Handlers for card edit/save
  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setEditValues({ name: contact.name, phone: contact.phone });
  };

  const handleSave = (id) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...editValues } : c))
    );
    setEditingId(null);
  };

  // Filter table contacts by search
  const filteredTable = tableContacts.filter(
    (c) =>
      c.student.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.relation.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Section 1: Editable Emergency Contact Cards */}
      <section>
        <div className="flex items-center mb-4">
          <div className="w-1 h-7 bg-red-500 mr-3"></div>
          <h2 className="text-lg md:text-xl font-bold">Emergency Contacts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-lg transition hover:shadow-xl"
            >
              {editingId === contact.id ? (
                <>
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues({ ...editValues, name: e.target.value })
                    }
                    className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={editValues.phone}
                    onChange={(e) =>
                      setEditValues({ ...editValues, phone: e.target.value })
                    }
                    className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Phone Number"
                  />
                  <button
                    onClick={() => handleSave(contact.id)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {contact.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{contact.phone}</p>
                  <button
                    onClick={() => handleEdit(contact)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Emergency Contact Table */}
      <section>
        <div className="flex items-center mb-4">
          <div className="w-1 h-7 bg-red-500 mr-3"></div>
          <h2 className="text-lg md:text-xl font-bold">Emergency contact directory</h2>
        </div>
        {/* Search and Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts by Name or Relation..."
              className="w-full pl-10 pr-4 py-2 rounded-lg shadow-[0px_4px_20px_0px_#00000040] focus:outline-none placeholder:text-gray-600 text-black bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
              {filteredTable.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-8">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                filteredTable.map((c, idx) => (
                  <tr
                    key={idx}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
