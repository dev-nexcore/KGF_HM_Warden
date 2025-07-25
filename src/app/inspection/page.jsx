import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import InspectionManagement from "@/components/Inspection/InspectionManagement";

export default function Home(){
    return(
        <div className="min-h-screen flex flex-col md:flex-row">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <InspectionManagement />
              </div>
            </div>  
    );
}