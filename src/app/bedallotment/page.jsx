import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import BedAllotment from "@/components/bed_allotment/Bed_Allotment"; // Import the BedAllotment component

export default function BedAllotmentPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <BedAllotment />
      </div>
    </div>
  );
}
