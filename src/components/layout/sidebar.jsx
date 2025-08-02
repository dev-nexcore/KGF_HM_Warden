// "use client";
// import React, { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import Link from "next/link";

// // Remove all react-icons imports and use your own image files

// export default function Sidebar() {
//   const pathname = usePathname(); // Current path
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [pathname]);

//   const getLinkClass = (href) =>
//     `flex items-center gap-2 py-3 px-4 rounded-l-3xl text-sm transition
//      ${pathname.startsWith(href)
//        ? "bg-white text-black font-semibold"
//        : "text-[#1a312a] hover:text-black"
//      }`;

//   return (
//     <div className="bg-[#BEC5AD]">
//       <>
//         {/* Hamburger button visible on small screens */}
//         <button
//   aria-label="Open sidebar"
//   className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#A4B494] text-black shadow-md"
//   onClick={() => setSidebarOpen(true)}
// >
//   <div className="space-y-1.5">
//     <span className="block w-6 h-0.5 bg-black"></span>
//     <span className="block w-6 h-0.5 bg-black"></span>
//     <span className="block w-6 h-0.5 bg-black"></span>
//   </div>
// </button>


//         {/* Sidebar */}
//         <aside
//           className={`
//             fixed top-0 left-0 h-full w-60 bg-[#A4B494] py-8 pl-5 flex flex-col justify-between rounded-tr-4xl shadow
//             transform transition-transform duration-300 ease-in-out
//             z-40
//             md:static md:translate-x-0 md:rounded-tr-4xl md:shadow
//             ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           `}
//         >
//           {/* Close button, only on mobile */}
//           <button
//             aria-label="Close sidebar"
//             className="md:hidden absolute top-4 right-4 p-2 rounded-md text-black hover:bg-gray-300"
//             onClick={() => setSidebarOpen(false)}
//           >
//             <div className="relative w-6 h-6">
//   <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-black transform rotate-45 origin-center"></span>
//   <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-black transform -rotate-45 origin-center"></span>
// </div>

//           </button>

//           <div>
//             {/* Logo */}
//             <div className="w-full flex justify-center mb-6">
//               <img src="/logo.png" className="h-20 w-20 object-contain mx-auto" alt="Logo" />
//             </div>

//             {/* Navigation Links */}
//             <div className="space-y-2">
//               <Link href="/warden-dashboard" className={getLinkClass("/warden-dashboard")}>
//                 <img src="/sidebar-icons/dashboard.png" alt="Dashboard" className="w-5 h-5" />
//                 Dashboard
//               </Link>
//               <Link href="/bedallotment" className={getLinkClass("/bedallotment")}>
//                 <img src="/sidebar-icons/bed.png" alt="Bed" className="w-5 h-5" />
//                 Bed Allotment
//               </Link>
//               <Link href="/student" className={getLinkClass("/student")}>
//                 <img src="/sidebar-icons/student.png" alt="Student Management" className="w-5 h-5" />
//                 Student Management
//               </Link>
//               <Link href="/inspection" className={getLinkClass("/inspection")}>
//                 <img src="/sidebar-icons/inspection.png" alt="Inspection" className="w-5 h-5" />
//                 Inspection
//               </Link>
//               <Link href="/warden-leave" className={getLinkClass("/warden-leave")}>
//                 <img src="/sidebar-icons/leave.png" alt="Leave Request" className="w-5 h-5" />
//                 Leave Request
//               </Link>
//               <Link href="/warden-profile" className={getLinkClass("/warden-profile")}>
//                 <img src="/sidebar-icons/profile.png" alt="Warden Profile" className="w-5 h-5" />
//                 Warden Profile
//               </Link>
//               <Link href="/emergency-contact" className={getLinkClass("/emergency-contact")}>
//                 <img src="/sidebar-icons/contact.png" alt="Emergency contact" className="w-5 h-5" />
//                 Emergency Contact
//               </Link>
//             </div>
//           </div>

//           {/* Logout Section */}
//           <div className="mt-8">
//             <hr className="border-t border-black my-4 mr-6" />
//             <div className="flex justify-center">
//               <a
//                 href="#"
//                 className="flex items-center gap-2 text-[#1a312a] pr-7 font-medium hover:text-black"
//               >
//                 <img src="/sidebar-icons/logout.png" alt="Logout" className="w-5 h-5" />
//                 Logout
//               </a>
//             </div>
//           </div>
//         </aside>

//         {/* Overlay background when sidebar is open on mobile */}
//         {sidebarOpen && (
//           <div
//             className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
//             onClick={() => setSidebarOpen(false)}
//             aria-hidden="true"
//           />
//         )}
//       </>
//     </div>
//   );
// }







"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const getLinkClass = (href) =>
    `flex items-center gap-2 py-3 px-4 rounded-l-3xl text-sm transition
     ${pathname.startsWith(href)
       ? "bg-white text-black font-semibold"
       : "text-[#1a312a] hover:text-black"
     }`;

  const logout = () => {
    localStorage.removeItem("wardenToken");
    localStorage.removeItem("wardenId");
    localStorage.removeItem("wardenInfo");
    router.push("/");
  };

  const handlePunchOutAndLogout = async () => {
    try {
      const token = localStorage.getItem("wardenToken");

      if (!token) {
        alert("Session expired. Please login again.");
        logout();
        return;
      }

      await axios.post(
        "http://localhost:5000/api/wardenauth/attendance/punch-out",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      logout();
    } catch (error) {
      console.error("Punch out failed:", error);

      if (
        error.response?.status === 400 &&
        error.response?.data?.message === "Already punched out for today"
      ) {
        logout();
      } else if (error.response?.status === 401) {
        alert("Unauthorized. Please login again.");
        logout();
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to punch out. Please try again or contact admin.");
      }
    }
  };

  return (
    <div className="bg-[#BEC5AD]">
      <>
        {/* Hamburger */}
        <button
          aria-label="Open sidebar"
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#A4B494] text-black shadow-md"
          onClick={() => setSidebarOpen(true)}
        >
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </div>
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-60 bg-[#A4B494] py-8 pl-5 flex flex-col justify-between rounded-tr-4xl shadow transform transition-transform duration-300 ease-in-out z-40 md:static md:translate-x-0 md:rounded-tr-4xl md:shadow ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close on mobile */}
          <button
            aria-label="Close sidebar"
            className="md:hidden absolute top-4 right-4 p-2 rounded-md text-black hover:bg-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="relative w-6 h-6">
              <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-black rotate-45"></span>
              <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-black -rotate-45"></span>
            </div>
          </button>

          <div>
            {/* Logo */}
            <div className="w-full flex justify-center mb-6 ">
              <img src="/logo.png" className="h-20 w-20 object-contain mx-auto rounded-full" alt="Logo" />
            </div>

            {/* Navigation */}
            <div className="space-y-2">
              <Link href="/warden-dashboard" className={getLinkClass("/warden-dashboard")}>
                <img src="/sidebar-icons/dashboard.png" alt="Dashboard" className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="/bedallotment" className={getLinkClass("/bedallotment")}>
                <img src="/sidebar-icons/bed.png" alt="Bed" className="w-5 h-5" />
                Bed Allotment
              </Link>
              <Link href="/student" className={getLinkClass("/student")}>
                <img src="/sidebar-icons/student.png" alt="Student" className="w-5 h-5" />
                Student Management
              </Link>
              <Link href="/inspection" className={getLinkClass("/inspection")}>
                <img src="/sidebar-icons/inspection.png" alt="Inspection" className="w-5 h-5" />
                Inspection
              </Link>
              <Link href="/warden-leave" className={getLinkClass("/warden-leave")}>
                <img src="/sidebar-icons/leave.png" alt="Leave" className="w-5 h-5" />
                Leave Request
              </Link>
              <Link href="/warden-profile" className={getLinkClass("/warden-profile")}>
                <img src="/sidebar-icons/profile.png" alt="Profile" className="w-5 h-5" />
                Warden Profile
              </Link>
              <Link href="/emergency-contact" className={getLinkClass("/emergency-contact")}>
                <img src="/sidebar-icons/contact.png" alt="Contact" className="w-5 h-5" />
                Emergency Contact
              </Link>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-8">
            <hr className="border-t border-black my-4 mr-6" />
            <div className="flex justify-center">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 text-[#1a312a] pr-7 font-medium hover:text-black"
              >
                <img src="/sidebar-icons/logout.png" alt="Logout" className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Glassmorphic Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10 border border-white/20">
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 w-[90%] max-w-md shadow-lg text-center border border-white/30">
              <h2 className="text-lg font-bold mb-4 text-black">Punch Out & Logout</h2>
              <p className="mb-6 text-gray-800">Do you want to punch out before logging out?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePunchOutAndLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes, Punch Out
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}
