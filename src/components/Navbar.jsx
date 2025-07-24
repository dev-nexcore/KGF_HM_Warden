export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#BEC5AD]">
      {/* Left Section: Welcome Message */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Welcome Back, Warden</h2>
        <p className="text-sm text-gray-600">- have a great day</p>
      </div>

      {/* Right Section: Circle Avatar */}
      <div className="w-10 h-10 rounded-full bg-white border border-gray-300" />
    </nav>
  );
}