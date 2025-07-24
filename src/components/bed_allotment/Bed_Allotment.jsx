import { FiMonitor, FiHome, FiBox } from 'react-icons/fi';

// Dummy data (replace with API data as needed)
const statistics = [
  {
    title: 'Occupied Beds',
    count: 70,
    icon: FiHome,
    color: 'bg-[#bfc8ad]',
    highlight: 'text-black',
  },
  {
    title: 'Vacant Beds',
    count: 3,
    icon: FiBox,
    color: 'bg-[#bfc8ad]',
    highlight: 'text-black',
  },
  {
    title: 'Damaged Beds',
    count: 2,
    icon: FiMonitor,
    color: 'bg-[#bfc8ad]',
    highlight: 'text-red-600',
  },
];

const beds = [
  {
    id: 'Bed A101-1',
    block: 'Block A',
    floor: 1,
    room: 101,
    status: 'Occupied',
    statusColor: 'text-green-600',
    cardBg: 'bg-white',
    border: 'border-2 border-green-500',
  },
  {
    id: 'Bed A101-2',
    block: 'Block A',
    floor: 1,
    room: 101,
    status: 'Vacant',
    statusColor: 'text-gray-800',
    cardBg: 'bg-white',
    border: 'border border-gray-300',
  },
  {
    id: 'Bed B203-1',
    block: 'Block B',
    floor: 2,
    room: 203,
    status: 'Damaged',
    statusColor: 'text-red-600',
    cardBg: 'bg-white',
    border: 'border border-red-300',
  },
  {
    id: 'Bed C305-1',
    block: 'Block C',
    floor: 3,
    room: 305,
    status: 'Occupied',
    statusColor: 'text-green-600',
    cardBg: 'bg-white',
    border: 'border border-green-300',
  },
  {
    id: 'Bed C205-2',
    block: 'Block C',
    floor: 2,
    room: 205,
    status: 'Vacant',
    statusColor: 'text-gray-800',
    cardBg: 'bg-white',
    border: 'border border-gray-300',
  },
];

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
        {statistics.map((stat, idx) => (
          <div
            key={stat.title}
            className={`rounded-xl px-6 py-5 flex items-center justify-between shadow ${stat.color}`}
          >
            <div>
              <div className="text-sm font-semibold">{stat.title}</div>
              <div className={`text-3xl font-bold ${stat.highlight}`}>{stat.count}</div>
            </div>
            <div className="bg-white rounded-full p-2 shadow -mt-8 mr-[-8px]">
              <stat.icon className={`${stat.highlight} text-2xl`} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter Beds */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs font-semibold mb-1 block">Block</label>
            <select className="rounded bg-gray-100 px-4 py-2 outline-none">
              <option>All Blocks</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Floor</label>
            <select className="rounded bg-gray-100 px-4 py-2 outline-none">
              <option>All Floors</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Room Number</label>
            <select className="rounded bg-gray-100 px-4 py-2 outline-none">
              <option>All Rooms</option>
            </select>
          </div>
          <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded flex items-center">
            Apply Filters
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Bed Status Overview */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="mb-4 font-semibold">Bed Status Overview</h3>
        <div className="rounded-xl bg-[#bfc8ad] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {beds.map((bed) => (
            <div
              key={bed.id}
              className={`rounded-xl p-4 ${bed.cardBg} ${bed.border} shadow flex flex-col min-w-[210px]`}
            >
              <div className="font-semibold text-[16px] mb-1">{bed.id}</div>
              <div className="text-xs mb-2">{bed.block}, Floor {bed.floor}, Room {bed.room}</div>
              <div className="flex gap-2 items-center mt-auto">
                <span className={`w-3 h-3 rounded-full ${ 
                  bed.status === "Occupied" ? "bg-green-500" 
                  : bed.status === "Vacant" ? "bg-gray-400" 
                  : bed.status === "Damaged" ? "bg-red-500" 
                  : "bg-gray-300"
                } inline-block`}></span>
                <span className="text-xs">
                  Status: <span className={bed.statusColor}>{bed.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
