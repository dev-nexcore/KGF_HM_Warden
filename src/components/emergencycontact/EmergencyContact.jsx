"use client";
import { useState } from "react";

const mockContacts = [
  { id: 1, name: "Police Station", phone: "100" },
  { id: 2, name: "Fire Department", phone: "101" },
  { id: 3, name: "Hospital", phone: "102" },
];

export default function EmergencyContact() {
  const [contacts, setContacts] = useState(mockContacts);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", phone: "" });

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

  return (
    <div className="w-full p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        Emergency Contacts
      </h1>

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
    </div>
  );
}
