import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import EmergencyContact from "@/components/EmergencyContactTable";

export default function EmergencyContactPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-[#f5f5f5]">
          <EmergencyContact />
        </main>
      </div>
    </div>
  );
}
