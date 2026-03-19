import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import WardenProfile from "@/components/warden-profile/profile";



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
       <WardenProfile/>
      </div>

    </div>
  );
}
