// components/StudentManagement.jsx
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
        <div className="relative bg-[#dce0d4] w-64 h-32 mx-auto p-4 rounded-3xl shadow transition duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col justify-center text-center">
          <div className="rounded-full w-11 h-11 bg-white absolute top-0 right-0 border">
          <img src="/images/students.png" alt="Icon" className="w-6 h-6 m-2"/>
          </div>
          <p className="text-base font-medium mt-4">Total Students</p>
          <p className="text-3xl font-bold text-gray-800">75</p>
        </div>

        <div className="relative bg-[#dce0d4] w-64 h-32 mx-auto p-4 rounded-3xl shadow transition duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col justify-center text-center">
          <div className="rounded-full w-11 h-11 bg-white absolute top-0 right-0 border">
          <img src="/images/active.png" alt="Icon" className="w-6 h-6 m-2" />
          </div>
          <p className="text-base font-medium mt-4">Active Students</p>
          <p className="text-3xl font-bold text-gray-800">70</p>
        </div>

        <div className="relative bg-[#dce0d4] w-64 h-32 mx-auto p-4 rounded-3xl shadow transition duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col justify-center text-center">
          <div className="rounded-full w-11 h-11 bg-white absolute top-0 right-0 border">
          <img src="/images/leave.png" alt="Icon" className="w-6 h-6 m-2" />
          </div>
          <p className="text-base font-medium mt-4">Students On Leave</p>
          <p className="text-3xl font-bold text-red-600">5</p>
        </div>
      </div>

      {/* Filter Bar */}
<div className="bg-white p-4 rounded-xl drop-shadow-lg space-y-4">
  <h3 className="text-md font-semibold mb-2 text-black">Filter Students</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-black">
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">Student ID</label>
      <select className="bg-gray-100 rounded h-fit p-2 w-full text-sm">
        <option>Select ID</option>
        <option>001</option>
        <option>002</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">Block</label>
      <select className="bg-gray-100 rounded h-fit p-2 w-full text-sm">
        <option>All Blocks</option>
        <option>Block A</option>
        <option>Block B</option>
        <option>Block C</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">Room</label>
      <select className="bg-gray-100 rounded h-fit p-2  w-full text-sm">
        <option>All Rooms</option>
        <option>101/B1</option>
        <option>203/B2</option>
        <option>305/B1</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1">Status</label>
      <select className="bg-gray-100 rounded h-fit p-2 w-full text-sm">
        <option>All Status</option>
        <option>Active</option>
        <option>On Leave</option>
      </select>
    </div>

    {/* Filter button with icon */}
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1 invisible">.</label>
      <button className="flex items-center justify-center gap-2 bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600 w-full lg:w-auto">
        <span>Apply Filters</span>
        <img src="/images/filter-icon.png" alt="Filter" className="w-3 h-3" />
      </button>
    </div>
  </div>
</div>


      {/* Student List */}
      <div className="bg-white p-4 rounded-xl drop-shadow-lg text-black">
        <h3 className="text-md font-semibold mb-4">Student List</h3>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm min-w-[600px] table-fixed">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 w-20">Student ID</th>
                <th className="p-2 w-48">Student Name</th>
                <th className="p-2 w-20">Block</th>
                <th className="p-2 w-28">Room/ Bed</th>
                <th className="p-2 w-28">Status</th>
                <th className="p-2 w-32">Contact</th>
                <th className="p-2 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2">{s.id}</td>
                  <td className="p-2 truncate">{s.name}</td>
                  <td className="p-2">{s.block}</td>
                  <td className="p-2">{s.room}</td>
                  <td className={`p-2 font-semibold ${getStatusStyle(s.status)}`}>{s.status}</td>
                  <td className="p-2">{s.contact}</td>
                  <td className="p-2 text-center space-x-3 text-gray-600">
                    <a href="/edit-student" className="inline-block p-2  rounded ">
                      <img src="/images/edit-icon.png" alt="Edit" className="w-5 h-5" />
                    </a>
                    <a href="/delete-student" className="inline-block p-2">
                      <img src="/images/delete-icon.png" alt="Delete" className="w-5 h-5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4 text-black">
          {students.map((s, i) => (
            <div key={i} className="rounded-lg p-3 shadow-sm bg-gray-50">
              <p><strong>ID:</strong> {s.id}</p>
              <p><strong>Name:</strong> {s.name}</p>
              <p><strong>Block:</strong> {s.block}</p>
              <p><strong>Room:</strong> {s.room}</p>
              <p className={`font-semibold ${getStatusStyle(s.status)}`}><strong>Status:</strong> {s.status}</p>
              <p><strong>Contact:</strong> {s.contact}</p>
              <div className="flex space-x-3 mt-3 text-gray-600">
                <a href="/edit-student" className="p-3">
                  <img src="/images/edit-icon.png" alt="Edit" className="w-5 h-5" />
                </a>
                <a href="/delete-student" className="p-3">
                  <img src="/images/delete-icon.png" alt="Delete" className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
