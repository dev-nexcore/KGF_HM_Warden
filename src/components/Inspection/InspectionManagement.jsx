// components/InspectionManagement.jsx
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function InspectionManagement() {
  const inspections = [
    { date: '05-07-2025', block: 'A', room: '101/B1', inspector: 'Warden Chinu', status: 'Completed' },
    { date: '05-07-2025', block: 'B', room: '203/B2', inspector: 'Warden Chinu', status: 'Pending' },
    { date: '05-07-2025', block: 'C', room: '305/B1', inspector: 'Warden Chinu', status: 'Completed' },
  ];

  const getStatusStyle = (status) => (status === 'Completed' ? 'text-green-600' : 'text-orange-500');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center mb-4">
          <div className="w-1 h-7 bg-red-500 mr-3"></div>
          <h2 className="text-lg md:text-xl font-bold">Inspection Management</h2>
        </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
        <Card label="Total Inspection" value="75" />
        <Card label="Pending Inspection" value="5" color="text-orange-500" />
        <Card label="Completed Inspection" value="70" color="text-green-600" />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h3 className="text-md font-semibold mb-2 text-black">Filter Inspections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select className="bg-gray-100 rounded px-3 py-2 w-full text-sm text-black">
            <option>All Blocks</option>
            <option>Block A</option>
            <option>Block B</option>
            <option>Block C</option>
          </select>

          <select className="bg-gray-100 rounded px-3 py-2 w-full text-sm text-black">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>

          <input type="date" className="bg-gray-100 rounded px-3 py-2 w-full text-sm text-black" />
          <input type="time" className="bg-gray-100 rounded px-3 py-2 w-full text-sm text-black" />

          <button className="bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600 w-full lg:w-auto">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table for Desktop */}
      <div className="bg-white p-4 rounded-xl shadow-lg text-black hidden lg:block">
        <h3 className="text-md font-semibold mb-4 text-black">Recent Inspections</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Block</th>
                <th className="p-2">Room/Bed</th>
                <th className="p-2">Inspector</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 text-black">
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">{item.block}</td>
                  <td className="p-2">{item.room}</td>
                  <td className="p-2">{item.inspector}</td>
                  <td className={`p-2 font-medium ${getStatusStyle(item.status)}`}>{item.status}</td>
                  <td className="p-2 space-x-3 text-black">
                    <button className="p-2 bg-blue-100 rounded hover:bg-blue-200"><FaEdit /></button>
                    <button className="p-2 bg-red-100 rounded hover:bg-red-200"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card View for Mobile */}
      <div className="block lg:hidden space-y-4 text-black">
        {inspections.map((item, index) => (
          <div key={index} className=" rounded-lg p-3 shadow-sm bg-gray-50">
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Block:</strong> {item.block}</p>
            <p><strong>Room:</strong> {item.room}</p>
            <p><strong>Inspector:</strong> {item.inspector}</p>
            <p className={`font-semibold ${getStatusStyle(item.status)}`}><strong>Status:</strong> {item.status}</p>
            <div className="flex space-x-3 mt-3">
              <button className="p-3 bg-blue-100 rounded hover:bg-blue-200"><FaEdit /></button>
              <button className="p-3 bg-red-100 rounded hover:bg-red-200"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ label, value, color = 'text-gray-800' }) {
  return (
    <div className="bg-[#dce0d4] p-4 rounded-lg shadow transition duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer text-center">
      <p className="text-sm font-medium">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
