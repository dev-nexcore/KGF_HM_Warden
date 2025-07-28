"use client";

import React, { useState, useMemo } from "react";

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

function getStatusColor(status) {
  if (status === "Approved") return "bg-green-500";
  if (status === "Pending") return "bg-yellow-400 text-black";
  return "bg-red-600";
}

export default function LeaveRequestsDashboard() {
  const [filters, setFilters] = useState({
    student: "",
    status: "",
    date: "",
  });

  const handleChange = (field) => (e) =>
    setFilters((f) => ({ ...f, [field]: e.target.value }));

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
      { label: "Total Requests", value: total, bgColor: "bg-[#CBD2BB]", textColor: "text-black" },
      { label: "Pending Requests", value: pending, bgColor: "bg-[#CBD2BB]", textColor: "text-[#FF9D00]" },
      { label: "Approved Requests", value: approved, bgColor: "bg-[#CBD2BB]", textColor: "text-[#28C404]" },
      { label: "Rejected Requests", value: rejected, bgColor: "bg-[#CBD2BB]", textColor: "text-[#FF0000]" },
    ];
  }, [filteredRows]);

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      {/* Section Title with Red Line */}
      <div className="flex items-center ml-1 md:ml-2 mt-2 mb-5 max-w-[555px] mx-auto">
        <div className="h-7 w-1 bg-[#FF0000] rounded mr-3" />
        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black select-none">
          Leave Request Management
        </span>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap justify-center gap-6 mb-8 px-2">
        {stats.map(({ label, value, bgColor, textColor }) => (
          <div
            key={label}
            className={`relative w-[232px] h-[155px] rounded-[18px] ${bgColor} shadow-md flex flex-col p-4`}
          >
            <div className={`font-medium text-[25px] leading-none text-black mb-auto font-poppins`}>
              {label}
            </div>
            <div className={`absolute bottom-4 left-4 text-[40px] font-semibold ${textColor} font-poppins`}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="max-w-[860px] mx-auto mb-12 border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Filter Leave Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Student Name / ID */}
          <div className="sm:col-span-5">
            <label htmlFor="studentFilter" className="block text-sm font-medium mb-1">
              Student Name / ID
            </label>
            <input
              type="text"
              id="studentFilter"
              value={filters.student}
              onChange={handleChange("student")}
              placeholder="Search by Name or ID"
              className="w-full rounded-md border border-gray-300 bg-[#f7f7fa] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div className="sm:col-span-3">
            <label htmlFor="statusFilter" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={filters.status}
              onChange={handleChange("status")}
              className="w-full rounded-md border border-gray-300 bg-[#f7f7fa] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Date */}
          <div className="sm:col-span-2">
            <label htmlFor="dateFilter" className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              id="dateFilter"
              value={filters.date}
              onChange={handleChange("date")}
              className="w-full rounded-md border border-gray-300 bg-[#f7f7fa] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Apply Filters Button */}
          <div className="sm:col-span-2">
            <button
              type="button"
              className="w-full bg-[#0099ff] text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition h-10"
              onClick={() => {
                // Filtering is live, no extra action needed here
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="overflow-x-auto px-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 min-w-[320px] max-w-[960px] mx-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 min-w-[90px]">Student ID</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 min-w-[150px]">Student Name</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 min-w-[120px]">Leave Type</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 min-w-[110px]">Start Date</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 min-w-[110px]">End Date</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 min-w-[100px]">Status</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRows.map((row) => (
                <tr key={row.id + row.name} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-900">{row.id}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{row.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{row.type}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{row.start}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{row.end}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    <span
                      className={`inline-block text-white px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    <div className="flex gap-2">
                      <button
                        className="p-1 text-green-600 hover:text-green-800 transition rounded"
                        title="Approve"
                        type="button"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        className="p-1 text-red-600 hover:text-red-800 transition rounded"
                        title="Reject"
                        type="button"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        className="p-1 text-gray-600 hover:text-gray-800 transition rounded"
                        title="Delete"
                        type="button"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
