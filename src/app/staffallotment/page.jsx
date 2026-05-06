import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import StaffAllotment from "@/components/Staff/StaffAllotment";





export default function Home() {
  return (
    <div className="min-h-screen flex">
      
      {/* Sidebar */}
      <div className="md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <Navbar />
      <StaffAllotment />
      </div>

    </div>
  );
}
