import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import MainContent from "@/components/warden_dashboard/Warden_DB";

export default function Home(){
    return(
        <div className="min-h-screen flex flex-col md:flex-row">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <MainContent />
              </div>
            </div>  
    );
}