"use client";
import Image from 'next/image';

export default function LeaveRequestManagement() {
  const stats = [
    { label: 'Total Requests', value: 120, color: '#CBD2BB', textColor: '#000000' },
    { label: 'Pending Requests', value: 15, color: '#CBD2BB', textColor: '#FF9D00' },
    { label: 'Approved Requests', value: 90, color: '#CBD2BB', textColor: '#28C404' },
    { label: 'Rejected Requests', value: 15, color: '#CBD2BB', textColor: '#FF0000' },
  ];

  const leaveRequests = [
    {
      id: '001',
      studentName: 'Chinmay Gawade',
      leaveType: 'Medical',
      startDate: '05-07-2025',
      endDate: '05-07-2025',
      status: 'Pending',
    },
    {
      id: '002',
      studentName: 'Krutika Mishra',
      leaveType: 'Family Event',
      startDate: '05-07-2025',
      endDate: '05-07-2025',
      status: 'Approved',
    },
    {
      id: '003',
      studentName: 'Sufyan Khan',
      leaveType: 'Personal',
      startDate: '05-07-2025',
      endDate: '05-07-2025',
      status: 'Rejected',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-orange-600 bg-orange-100 border border-orange-200',
      approved: 'text-green-600 bg-green-100 border border-green-200',
      rejected: 'text-red-600 bg-red-100 border border-red-200',
    };
    return colors[status.toLowerCase()] || 'text-gray-600 bg-gray-100 border border-gray-200';
  };

  return (
    <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10 space-y-3 bg-white min-h-screen max-w-full overflow-x-hidden">
      
      {/* Page Header */}
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 sm:h-8 bg-red-500 mr-2 rounded-full flex-shrink-0"></div>
        <h1 className="text-lg sm:text-xl md:text-2xl xl:text-3xl font-bold text-gray-900">
          Leave Request Management
        </h1>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {stats.map((stat, i) => (
          <div key={i} className="p-3 sm:p-5 rounded-lg shadow-sm" style={{ backgroundColor: stat.color }}>
            <div className="text-xs sm:text-sm md:text-base font-medium text-gray-600 mb-2">
              {stat.label}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: stat.textColor }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white p-3 sm:p-5 rounded-lg drop-shadow-lg">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Filter Leave Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Student Name / ID</label>
            <input type="text" placeholder="Search By Name or ID"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
              style={{ backgroundColor: '#D9D9D9', color: '#000' }}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md"
              style={{ backgroundColor: '#D9D9D9', color: '#000' }}
              defaultValue="All Status"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="relative flex items-center">
              <input type="text" placeholder="dd-mm-yyyy"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md pr-10"
                style={{ backgroundColor: '#D9D9D9', color: '#000' }}
              />
              <div className="absolute right-3">
                <Image src="/leave/calender.png" alt="Calendar" width={20} height={20} className="rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-500 text-white px-3 py-2 rounded-md flex items-center justify-center gap-2 font-medium hover:bg-blue-600 transition">
              <span className="hidden sm:inline">Apply Filters</span>
              <span className="sm:hidden">Filter</span>
              <img src="/leave/filter.png" alt="Filter" width={16} height={16} className="rounded" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Leave Requests */}
      <div className="bg-white p-3 sm:p-5 rounded-lg drop-shadow-lg">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Leave Requests</h2>

        {/* Mobile Card List */}
        <div className="space-y-3 block lg:hidden">
          {leaveRequests.map((req, i) => (
            <div key={req.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <div className="font-semibold text-base truncate">{req.studentName}</div>
                  <div className="text-xs text-gray-600">ID: {req.id}</div>
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                  {req.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs mb-2">
                <div><span className="font-medium">Type:</span> {req.leaveType}</div>
                <div><span className="font-medium">Start:</span> {req.startDate}</div>
                <div><span className="font-medium">End:</span> {req.endDate}</div>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-200">
                {req.studentName === 'Chinmay Gawade' ? (
                  <>
                    <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></button>
                    <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </>
                ) : (
                  <>
                    {req.status === 'Pending' && <button className="p-2"><Image src="/approved.jpg" alt="Approve" width={18} height={18} className="rounded" /></button>}
                    <button className="p-2"><Image src="/leave/edit.png" alt="Border Color" width={18} height={18} className="rounded" /></button>
                    <button className="p-2"><Image src="/leave/del.png" alt="Delete" width={18} height={18} className="rounded" /></button>
                    {req.status === 'Pending' && <button className="p-2"><Image src="/leave/rejected.jpg" alt="Reject" width={18} height={18} className="rounded" /></button>}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead style={{ backgroundColor: '#D9D9D9' }}>
              <tr>
                <th className="px-2 py-3 text-left font-semibold">Student ID</th>
                <th className="px-2 py-3 text-left font-semibold">Student Name</th>
                <th className="px-2 py-3 text-left font-semibold">Leave Type</th>
                <th className="px-2 py-3 text-left font-semibold">Start Date</th>
                <th className="px-2 py-3 text-left font-semibold">End Date</th>
                <th className="px-2 py-3 text-left font-semibold">Status</th>
                <th className="px-2 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req, i) => (
                <tr key={req.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-2 py-3">{req.id}</td>
                  <td className="px-2 py-3">{req.studentName}</td>
                  <td className="px-2 py-3">{req.leaveType}</td>
                  <td className="px-2 py-3">{req.startDate}</td>
                  <td className="px-2 py-3">{req.endDate}</td>
                  <td className="px-2 py-3">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center space-x-2">
                      {req.studentName === 'Chinmay Gawade' ? (
                        <>
                          <button className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></button>
                          <button className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </>
                      ) : (
                        <>
                          {req.status === 'Pending' && <button className="p-1"><Image src="/approved.jpg" alt="Approve" width={18} height={18} className="rounded" /></button>}
                          <button className="p-1"><Image src="/leave/edit.png" alt="Border Color" width={18} height={18} className="rounded" /></button>
                          <button className="p-1"><Image src="/leave/del.png" alt="Delete" width={18} height={18} className="rounded" /></button>
                          {req.status === 'Pending' && <button className="p-1"><Image src="/rejected.jpg" alt="Reject" width={18} height={18} className="rounded" /></button>}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* End Table */}
        {leaveRequests.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p className="font-medium">No leave requests found</p>
            <p className="text-sm">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
