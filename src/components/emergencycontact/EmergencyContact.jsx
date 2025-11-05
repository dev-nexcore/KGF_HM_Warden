"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiPhone, FiSearch, FiFilter } from "react-icons/fi";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
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

  const fetchContacts = async () => {
    try {
      const params = {};
      if (search) {
        params.studentName = search;
        params.studentId = search;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/emergency-contact`,
        { params }
      );

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
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/emergency-contact/${id}`,
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

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleClearFilter = () => {
    setSearch("");
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    } else {
      toast.error("Phone number not available");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <section>
        <div className="flex items-center mb-4">
          <div className="w-1 h-7 bg-red-500 mr-3"></div>
          <h2 className="text-xl font-bold">Contacts</h2>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
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

        {/* Card View - Mobile */}
        <div className="md:hidden space-y-4">
          {tableContacts.length === 0 ? (
            <p className="text-center text-gray-500">No contacts found.</p>
          ) : (
            tableContacts.map((c, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-xl shadow p-4 space-y-2"
              >
                <div>
                  <strong>Student ID:</strong> {c.id}
                </div>
                <div>
                  <strong>Name:</strong> {c.student}
                </div>
                <div>
                  <strong>Contact:</strong>{" "}
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
                </div>
                <div>
                  <strong>Relation:</strong>{" "}
                  {editingId === c.id ? (
                    <input
                      type="text"
                      className="w-full border px-2 py-1 rounded"
                      value={editValues.relation}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          relation: e.target.value,
                        })
                      }
                    />
                  ) : (
                    c.relation
                  )}
                </div>
                <div>
                  <strong>Phone:</strong>{" "}
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
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <FiPhone
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() => handleCall(c.phone)}
                  />
                  {editingId === c.id ? (
                    <>
                      <FaSave
                        className="cursor-pointer text-green-600 hover:text-green-800"
                        onClick={() => handleSave(c.id)}
                      />
                      <FaTimes
                        className="cursor-pointer text-red-600 hover:text-red-800"
                        onClick={handleCancelEdit}
                      />
                    </>
                  ) : (
                    <FaEdit
                      className="cursor-pointer text-gray-700 hover:text-black"
                      onClick={() => handleEdit(c)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table View - Desktop */}
        <div className="hidden md:block overflow-x-auto rounded-xl border border-black">
          <table className="min-w-full bg-white">
            <thead className="bg-[#A4B494] text-gray-800">
              <tr>
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Contact Name</th>
                <th className="text-left px-4 py-3">Relation</th>
                <th className="text-left px-4 py-3">Phone No.</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableContacts.map((c, idx) => (
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
                          setEditValues({
                            ...editValues,
                            relation: e.target.value,
                          })
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
                    <FiPhone
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => handleCall(c.phone)}
                    />
                    {editingId === c.id ? (
                      <>
                        <FaSave
                          className="cursor-pointer text-green-600 hover:text-green-800"
                          onClick={() => handleSave(c.id)}
                        />
                        <FaTimes
                          className="cursor-pointer text-red-600 hover:text-red-800"
                          onClick={handleCancelEdit}
                        />
                      </>
                    ) : (
                      <FaEdit
                        className="cursor-pointer text-gray-700 hover:text-black"
                        onClick={() => handleEdit(c)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
