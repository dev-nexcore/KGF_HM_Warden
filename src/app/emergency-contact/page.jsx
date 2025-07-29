import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import EmergencyContact from "@/components/emergencycontact/EmergencyContact";

export default function BedAllotmentPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <EmergencyContact />
      </div>
    </div>
  );
}
