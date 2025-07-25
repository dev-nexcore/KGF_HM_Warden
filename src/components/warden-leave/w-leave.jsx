"use client";

import { MdCheck, MdClose, MdDelete } from "react-icons/md";
import { useState, useMemo } from "react";

const allRows = [
  {
    id: "001",
    name: "Chinmay Gawade",
    type: "Medical",
    start: "2025-07-05",
    end: "2025-07-06",
    status: "Pending",
  },
  {
    id: "002",
    name: "Kritikka Mishra",
    type: "Family Event",
    start: "2025-07-05",
    end: "2025-07-06",
    status: "Approved",
  },
  {
    id: "003",
    name: "Sulfiya Khan",
    type: "Personal",
    start: "2025-07-05",
    end: "2025-07-06",
    status: "Rejected",
  },
];

function getChipColor(status) {
  if (status === "Approved") return "bg-green-600";
  if (status === "Pending") return "bg-orange-500";
  return "bg-red-600";
}

export default function LeaveRequestsDashboard() {
  const [filters, setFilters] = useState({
    student: "",
    status: "",
    date: "",
  });

  const handleChange = (field) => (e) => {
    setFilters((f) => ({ ...f, [field]: e.target.value }));
  };

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      const studentFilter = filters.student.toLowerCase();
      if (
        studentFilter &&
        !(
          row.name.toLowerCase().includes(studentFilter) ||
          row.id.toLowerCase().includes(studentFilter)
        )
      )
        return false;

      if (filters.status && row.status !== filters.status) return false;

      if (filters.date) {
        const filterDate = new Date(filters.date);
        const startDate = new Date(row.start);
        const endDate = new Date(row.end);
        if (filterDate < startDate || filterDate > endDate) return false;
      }

      return true;
    });
  }, [filters]);

  const stats = useMemo(() => {
    const total = filteredRows.length;
    const pending = filteredRows.filter((r) => r.status === "Pending").length;
    const approved = filteredRows.filter((r) => r.status === "Approved").length;
    const rejected = filteredRows.filter((r) => r.status === "Rejected").length;
    return [
      { label: "Total Requests", value: total, valueColor: "text-black" },
      { label: "Pending Requests", value: pending, valueColor: "text-orange-500" },
      { label: "Approved Requests", value: approved, valueColor: "text-green-600" },
      { label: "Rejected Requests", value: rejected, valueColor: "text-red-600" },
    ];
  }, [filteredRows]);

  return (
    <div className="w-full p-5">
      {/* Filter Section */}
      <section className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-1 h-7 bg-red-500 mr-3"></div>
          <h2 className="text-lg md:text-xl font-bold">Filter Leave Requests</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {/* Student Name / ID */}
          <div className="flex-grow min-w-[200px]">
            <label className="block mb-1 font-medium" htmlFor="studentFilter">
              Student Name / ID
            </label>
            <input
              id="studentFilter"
              type="text"
              value={filters.student}
              onChange={handleChange("student")}
              placeholder="Search by Name or ID"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Status */}
          <div className="flex-grow min-w-[150px]">
            <label className="block mb-1 font-medium" htmlFor="statusFilter">
              Status
            </label>
            <select
              id="statusFilter"
              value={filters.status}
              onChange={handleChange("status")}
              className="w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          {/* Date */}
          <div className="flex-grow min-w-[150px]">
            <label className="block mb-1 font-medium" htmlFor="dateFilter">
              Date
            </label>
            <input
              id="dateFilter"
              type="date"
              value={filters.date}
              onChange={handleChange("date")}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Apply Button (optional) */}
          <div className="flex items-end min-w-[120px]">
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => {
                // Filtering is real-time, optional no-op
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="mb-8 flex flex-wrap gap-6 justify-center">
        {stats.map(({ label, value, valueColor }) => (
          <div
            key={label}
            className="w-48 h-28 bg-gray-100 rounded-xl flex flex-col justify-between p-5 shadow-sm"
          >
            <p className="font-medium text-lg text-gray-700">{label}</p>
            <p className={`text-4xl font-extrabold ${valueColor}`}>{value}</p>
          </div>
        ))}
      </section>

      {/* Leave Requests Table */}
      <section>
        <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
          <table className="w-full min-w-[700px] border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border-b border-gray-300 px-4 py-3 text-left">Student ID</th>
                <th className="border-b border-gray-300 px-4 py-3 text-left">Student Name</th>
                <th className="border-b border-gray-300 px-4 py-3 text-left">Leave Type</th>
                <th className="border-b border-gray-300 px-4 py-3 text-left">Start Date</th>
                <th className="border-b border-gray-300 px-4 py-3 text-left">End Date</th>
                <th className="border-b border-gray-300 px-4 py-3 text-left">Status</th>
                <th className="border-b border-gray-300 px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-8 text-gray-500 italic"
                  >
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id + row.name}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border-b border-gray-200 px-4 py-3">{row.id}</td>
                    <td className="border-b border-gray-200 px-4 py-3">{row.name}</td>
                    <td className="border-b border-gray-200 px-4 py-3">{row.type}</td>
                    <td className="border-b border-gray-200 px-4 py-3">{row.start}</td>
                    <td className="border-b border-gray-200 px-4 py-3">{row.end}</td>
                    <td className="border-b border-gray-200 px-4 py-3">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold ${
                          getChipColor(row.status)
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="border-b border-gray-200 px-4 py-3 flex gap-3">
                      <button
                        aria-label="Approve"
                        className="hover:text-green-600"
                      >
                        <MdCheck size={22} />
                      </button>
                      <button
                        aria-label="Reject"
                        className="hover:text-red-600"
                      >
                        <MdClose size={22} />
                      </button>
                      <button aria-label="Delete" className="hover:text-gray-600">
                        <MdDelete size={22} />
                      </button>
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
