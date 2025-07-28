export default function BedAllotment() {
  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="font-bold text-xl mb-4 flex items-center">
        <span className="border-l-4 border-red-600 mr-2 h-6 inline-block"></span>
        Bed Allotment
      </h2>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* Occupied Beds */}
        <div className="bg-[#bfc8ad] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
          <div>
            <div className="text-sm font-semibold">Occupied Beds</div>
            <div className="text-3xl font-bold text-black">70</div>
          </div>
          <div className="absolute top-0 right-0  rounded-full  shadow w-12 h-12 flex items-center justify-center">
            <img 
              src="/bed-allotment/bed.png" 
              alt="Occupied Beds" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Vacant Beds */}
        <div className="bg-[#bfc8ad] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
          <div>
            <div className="text-sm font-semibold">Vacant Beds</div>
            <div className="text-3xl font-bold text-black">3</div>
          </div>
          <div className="absolute top-0 right-0  rounded-full shadow w-12 h-12 flex items-center justify-center">
            <img 
              src="/bed-allotment/bed.png" 
              alt="Vacant Beds" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Damaged Beds */}
        <div className="bg-[#bfc8ad] rounded-3xl px-6 py-5 flex items-center justify-between shadow relative">
          <div>
            <div className="text-sm font-semibold">Damaged Beds</div>
            <div className="text-3xl font-bold text-red-600">2</div>
          </div>
          <div className="absolute top-0 right-0 bg-white rounded-full border-1 shadow w-12 h-12 flex items-center justify-center">
            <img 
              src="/bed-allotment/d-bed.png" 
              alt="Damaged Beds" 
              className="w-9 h-9 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Filter Beds */}
      <div className="bg-white rounded-3xl shadow p-6 mb-6">
        {/* Filter Beds Heading */}
        <h3 className="font-bold text-lg mb-4 flex items-center">
          Filter Beds
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-1 block">Block</label>
            <select className="rounded bg-gray-100 px-4 py-2 outline-none w-full">
              <option>All Blocks</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-1 block">Floor</label>
            <select className="rounded bg-gray-100 px-4 py-2 outline-none w-full">
              <option>All Floors</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-1 block">Room Number</label>
            <select className="rounded bg-gray-100 px-4 py-2 outline-none w-full">
              <option>All Rooms</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded flex items-center justify-center w-full">
              Apply Filters
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bed Status Overview */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="mb-4 font-semibold">Bed Status Overview</h3>
        <div className="rounded-xl bg-[#bfc8ad] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Bed cards with dot moved to top-right, text stays at bottom */}
          <div className="rounded-3xl p-4 bg-white border-2 border-green-500 shadow flex flex-col min-w-[210px] relative">
            <span className="absolute top-0 right-0 w-9 h-9 border-2 rounded-full bg-green-500 inline-block"></span>
            <div className="font-semibold text-[16px] mb-1">Bed A101-1</div>
            <div className="text-xs mb-2">Block A, Floor 1, Room 101</div>
            <div className="mt-auto">
              <span className="text-xs">
                Status: <span className="text-green-600">Occupied</span>
              </span>
            </div>
          </div>

          <div className="rounded-3xl p-4 bg-white border border-gray-300 shadow flex flex-col min-w-[210px] relative">
            <span className="absolute top-0 border-2 right-0 w-9 h-9 rounded-full bg-gray-400 inline-block"></span>
            <div className="font-semibold text-[16px] mb-1">Bed A101-2</div>
            <div className="text-xs mb-2">Block A, Floor 1, Room 101</div>
            <div className="mt-auto">
              <span className="text-xs">
                Status: <span className="text-gray-800">Vacant</span>
              </span>
            </div>
          </div>

          <div className="rounded-3xl p-4 bg-white border border-red-300 shadow flex flex-col min-w-[210px] relative">
            <span className="absolute top-0 border-2 right-0 w-9 h-9 rounded-full bg-red-500 inline-block"></span>
            <div className="font-semibold text-[16px] mb-1">Bed B203-1</div>
            <div className="text-xs mb-2">Block B, Floor 2, Room 203</div>
            <div className="mt-auto">
              <span className="text-xs">
                Status: <span className="text-red-600">Damaged</span>
              </span>
            </div>
          </div>

          <div className="rounded-3xl p-4 bg-white border border-green-300 shadow flex flex-col min-w-[210px] relative">
            <span className="absolute top-0 right-0 border-2 w-9 h-9 rounded-full bg-green-500 inline-block"></span>
            <div className="font-semibold text-[16px] mb-1">Bed C305-1</div>
            <div className="text-xs mb-2">Block C, Floor 3, Room 305</div>
            <div className="mt-auto">
              <span className="text-xs">
                Status: <span className="text-green-600">Occupied</span>
              </span>
            </div>
          </div>

          <div className="rounded-3xl p-4 bg-white border border-gray-300 shadow flex flex-col min-w-[210px] relative">
            <span className="absolute top-0 right-0 border-2 w-9 h-9 rounded-full bg-gray-400 inline-block"></span>
            <div className="font-semibold text-[16px] mb-1">Bed C205-2</div>
            <div className="text-xs mb-2">Block C, Floor 2, Room 205</div>
            <div className="mt-auto">
              <span className="text-xs">
                Status: <span className="text-gray-800">Vacant</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
