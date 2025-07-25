import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import StudentManagement from "@/components/Student/StudentManagement";

export default function Home(){
    return(
        <div className="min-h-screen flex flex-col md:flex-row">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <StudentManagement />
              </div>
            </div>  
    );
}