import React from "react";

export default function MainContent() {
  return (
    <main className="flex-1 px-4 md:px-6 py-4">
      <section className="mb-8">
        {/* Section Header */}
        <div className="flex items-center mb-4">
          <div className="w-1 h-7 bg-red-500 mr-3"></div>
          <h2 className="text-lg md:text-xl font-bold">Dashboard</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6 justify-items-center sm:justify-items-stretch">

          {/* Total Students */}
          <div className="bg-[#bfc8ad] rounded-2xl p-4 relative shadow w-60 h-24 flex flex-col">
            <img
              src="/dashboard-icons/t-students.png"
              alt="Users Icon"
              className="absolute top-0 right-0 w-7 h-7 object-contain"
            />
            <span className="text-sm md:text-md font-semibold">Total Students</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold">75</span>
          </div>

          {/* Occupied Beds */}
          <div className="bg-[#bfc8ad] rounded-2xl p-4 relative shadow w-60 h-24 flex flex-col">
            <img 
              src="dashboard-icons/beds.png" 
              alt="Checkmark Icon" 
              className="absolute top-0 right-0 w-7 h-7 object-contain"
            />
            <span className="text-sm md:text-md font-semibold">Occupied Beds</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold text-[#e0b300]">70</span>
          </div>

          {/* Vacant Beds */}
          <div className="bg-[#bfc8ad] rounded-2xl p-4 relative shadow w-60 h-24 flex flex-col">
            <img
              src="dashboard-icons/beds.png"
              alt="Layers Icon"
              className="absolute top-0 right-0 w-7 h-7 object-contain"
            />
            <span className="text-sm md:text-md font-semibold">Vacant Beds</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold">3</span>
          </div>

          {/* Damaged Beds */}
          <div className="bg-[#bfc8ad] rounded-2xl p-4 relative shadow w-60 h-24 flex flex-col">
            <img
              src="dashboard-icons/beds.png"
              alt="Cross Icon"
              className="absolute top-0 right-0 w-7 h-7 object-contain"
            />
            <span className="text-sm md:text-md font-semibold">Damaged Beds</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold text-[#c83939]">2</span>
          </div>

          {/* Total Beds */}
          <div className="bg-[#bfc8ad] rounded-2xl p-4 relative shadow w-60 h-24 flex flex-col">
            <img
              src="dashboard-icons/beds.png"
              alt="Layers Icon"
              className="absolute top-0 right-0 w-7 h-7 object-contain"
            />
            <span className="text-sm md:text-md font-semibold">Total Beds</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold">75</span>
          </div>

          {/* Upcoming Inspections */}
          <div className="bg-[#bfc8ad] rounded-2xl p-4 relative shadow w-60 h-24 flex flex-col">
            <span className="text-sm md:text-md font-semibold">Upcoming Inspections</span>
            <span className="text-xl md:text-2xl mt-2 font-semibold">2</span>
          </div>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section>
        <div className="bg-[#d9ddce] rounded-xl shadow">
          <h3 className="text-base md:text-lg font-semibold mb-2 p-4">Recent Activities</h3>
          <ul className="bg-white rounded-b-xl px-4">
            <li className="flex justify-between items-center py-3 text-sm md:text-base">
              <span>Student Ayesha Ali Khan checked in to Bed 101</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">10:30 AM</span>
            </li>
            <li className="flex justify-between items-center py-3 text-sm md:text-base">
              <span>Student Mohammed Shariq Shaikh checked out from Bed 205</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">09:30 AM</span>
            </li>
            <li className="flex justify-between items-center py-3 text-sm md:text-base">
              <span>Student Nida Fatima Konkan checked in to Bed 310</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">08:45 AM</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
