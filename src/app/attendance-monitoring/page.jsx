import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import Attendance from "@/components/attendance-monitoring/Attendance";

export default function AttendanceMonitoringPage() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Navbar />
        <Attendance />
      </div>
    </div>
  );
}
