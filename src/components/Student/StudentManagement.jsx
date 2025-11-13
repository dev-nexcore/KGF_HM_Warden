"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [counts, setCounts] = useState({ total: 0, active: 0, onLeave: 0, checkedOut: 0 });
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students/count`);
      setCounts({
        total: res.data.totalStudents,
        active: res.data.activeStudents,
        onLeave: res.data.onLeaveStudents,
        checkedOut: res.data.checkedOutStudents || 0,
      });
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students`, { params });
      setStudents(res.data.students);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleClearFilters = () => {
    setFilters({ studentId: "", roomNo: "", status: "" });
    toast.info("Filters cleared", { autoClose: 2000 });
  };

  const handleEditClick = async (student) => {
    setEditingStudent(student);
    setNewBarcodeId(student.barcodeId || "");

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students/available-bed`);
      setAvailableBeds(res.data.beds);
    } catch (err) {
      console.error("Error fetching available beds:", err);
      toast.error("Failed to fetch available beds", { autoClose: 3000 });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/students/${editingStudent.studentId}`,
        { barcodeId: newBarcodeId }
      );
      toast.success(res.data.message || "Bed updated successfully!", { autoClose: 3000 });
      setEditingStudent(null);
      fetchCounts();
      fetchStudents();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || "Error updating bed.", { autoClose: 3000 });
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Active") return "text-green-600";
    if (status === "On Leave") return "text-orange-500";
    if (status === "Checked Out") return "text-gray-600";
    return "";
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-1 h-7 bg-red-500 mr-3"></div>
        <h2 className="text-2xl font-bold">Student Management</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Students" count={counts.total} icon="/warden/std-management/students.png" />
        <StatCard title="Active Students" count={counts.active} icon="/warden/std-management/active.png" />
        <StatCard title="On Leave" count={counts.onLeave} icon="/warden/std-management/leave-std.png" red />
        <StatCard title="Checked Out" count={counts.checkedOut} icon="/warden/std-management/leave-std.png" />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h3 className="text-md font-semibold">Filter Students</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <FilterSelect
            label="Student IDs"
            value={filters.studentId}
            onChange={(e) => setFilters({ ...filters, studentId: e.target.value })}
            options={["", ...students.map((s) => s.studentId)]}
          />
          <FilterSelect
            label="Room Nos"
            value={filters.roomNo}
            onChange={(e) => setFilters({ ...filters, roomNo: e.target.value })}
            options={["", ...students.map((s) => s.roomNo).filter(Boolean)]}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={["", "Active", "On Leave", "Checked Out"]}
          />
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-md font-semibold mb-4">Student List</h3>
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 w-32">Student ID</th>
                <th className="p-2 w-40">Name</th>
                <th className="p-2 w-24">Room No</th>
                <th className="p-2 w-24">Bed No</th>
                <th className="p-2 w-32">Status</th>
                <th className="p-2 w-36">Contact</th>
                <th className="p-2 w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50 border-b">
                  <td className="p-2">{s.studentId}</td>
                  <td className="p-2">{s.studentName}</td>
                  <td className="p-2">{s.roomNo || "-"}</td>
                  <td className="p-2">{s.barcodeId || "-"}</td>
                  <td className={`p-2 font-semibold ${getStatusStyle(s.status || "Active")}`}>
                    {s.status || "Active"}
                  </td>
                  <td className="p-2">{s.contactNumber || "-"}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => handleEditClick(s)}>
                      <img src="/warden/images/edit-icon.png" alt="Edit" className="w-5 h-5 inline-block" />
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
              <button onClick={() => handleEditClick(s)} className="mt-2 text-blue-600">
                Edit Bed
              </button>
            </div>
          ))}
          {students.length === 0 && <p className="p-4">No students found.</p>}
        </div>
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Update Bed for {editingStudent.studentName}
            </h2>
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
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  disabled={!newBarcodeId}
                >
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

// --- Helper Components ---

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
          <option key={index} value={opt}>{opt || `All ${label}`}</option>
        ))}
      </select>
    </div>
  );
}
