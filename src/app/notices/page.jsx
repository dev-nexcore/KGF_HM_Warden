// src/app/notices/page.jsx
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import HostelNotices from "@/components/notices/notices";

export default function page() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="md:block">
        <Sidebar />
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Navbar />
        <HostelNotices />
      </div>
    </div>
  );
}