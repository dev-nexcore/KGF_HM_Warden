import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import LeaveRequestsDashboard from "@/components/warden-leave/w-leave";

export default function Leave(){
    return(
        <>
           <div className="min-h-screen flex flex-col md:flex-row">
            <Sidebar/>
            <div className="flex-1 flex flex-col">
                <Navbar/>
                <LeaveRequestsDashboard/>
            </div>
           </div>
        </>
    );
}