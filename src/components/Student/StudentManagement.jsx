// components/StudentManagement.jsx
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function StudentManagement() {
  const students = [
    { id: '001', name: 'Chinmay Gawade', block: 'A', room: '101/B1', status: 'Active', contact: '+91 9321625553' },
    { id: '002', name: 'Krutika Mishra', block: 'B', room: '203/B2', status: 'On Leave', contact: '+91 9321625553' },
    { id: '003', name: 'Sufiyan Khan', block: 'C', room: '305/B1', status: 'Active', contact: '+91 9321625553' },
  ];

  const getStatusStyle = (status) => (status === 'Active' ? 'text-green-600' : 'text-red-500');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center mb-4">
          <div className="w-1 h-7 bg-red-500 mr-3"></div>
          <h2 className="text-lg md:text-xl font-bold">Student Management</h2>
        </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
        <Card label="Total Students" value="75" />
        <Card label="Active Students" value="70" />
        <Card label="Students On Leave" value="5" color="text-red-600" />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h3 className="text-md font-semibold mb-2 text-black">Filter Students</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-black">
          <select className="bg-gray-100 rounded px-3 py-2 w-full text-sm">
            <option>Select ID</option>
            <option>001</option>
            <option>002</option>
          </select>
          <select className="bg-gray-100 rounded px-3 py-2 w-full text-sm">
            <option>All Blocks</option>
            <option>Block A</option>
            <option>Block B</option>
            <option>Block C</option>
          </select>
          <select className="bg-gray-100 rounded px-3 py-2 w-full text-sm">
            <option>All Rooms</option>
            <option>101/B1</option>
            <option>203/B2</option>
            <option>305/B1</option>
          </select>
          <select className="bg-gray-100 rounded px-3 py-2 w-full text-sm">
            <option>All Status</option>
            <option>Active</option>
            <option>On Leave</option>
          </select>
          <button className="bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600 w-full lg:w-auto">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white p-4 rounded-xl shadow text-black">
        <h3 className="text-md font-semibold mb-4">Student List</h3>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">Student ID</th>
                <th className="p-2">Student Name</th>
                <th className="p-2">Block</th>
                <th className="p-2">Room/ Bed</th>
                <th className="p-2">Status</th>
                <th className="p-2">Contact</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{s.id}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.block}</td>
                  <td className="p-2">{s.room}</td>
                  <td className={`p-2 font-semibold ${getStatusStyle(s.status)}`}>{s.status}</td>
                  <td className="p-2">{s.contact}</td>
                  <td className="p-2 space-x-3 text-gray-600">
                    <button className="p-2 bg-blue-100 rounded hover:bg-blue-200"><FaEdit /></button>
                    <button className="p-2 bg-red-100 rounded hover:bg-red-200"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4 text-black">
          {students.map((s, i) => (
            <div key={i} className=" rounded-lg p-3 shadow-sm bg-gray-50">
              <p><strong>ID:</strong> {s.id}</p>
              <p><strong>Name:</strong> {s.name}</p>
              <p><strong>Block:</strong> {s.block}</p>
              <p><strong>Room:</strong> {s.room}</p>
              <p className={`font-semibold ${getStatusStyle(s.status)}`}><strong>Status:</strong> {s.status}</p>
              <p><strong>Contact:</strong> {s.contact}</p>
              <div className="flex space-x-3 mt-3 text-gray-600">
                <button className="p-3 bg-blue-100 rounded hover:bg-blue-200"><FaEdit /></button>
                <button className="p-3 bg-red-100 rounded hover:bg-red-200"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, color = 'text-gray-800' }) {
  return (
    <div className="bg-[#dce0d4] p-4 rounded-lg shadow transition duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer text-center">
      <p className="text-sm font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}
