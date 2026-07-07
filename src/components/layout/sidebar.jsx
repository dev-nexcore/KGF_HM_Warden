// KGF_HM_Warden\src\components\layout\sidebar.jsx

"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);


  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleToggle = () => setSidebarOpen(prev => !prev);
    window.addEventListener("toggleSidebar", handleToggle);
    return () => window.removeEventListener("toggleSidebar", handleToggle);
  }, []);

  const getLinkClass = (href) =>
    `flex items-center gap-2 py-3 px-4 rounded-l-3xl text-sm transition ${pathname.startsWith(href)
      ? "bg-white text-black font-semibold"
      : "text-[#1a312a] hover:text-black"
    }`;

  const logout = () => {
    localStorage.removeItem("wardenToken");
    localStorage.removeItem("wardenId");
    localStorage.removeItem("wardenInfo");
    router.push("/");
  };



  return (
    <div className="bg-[#BEC5AD] h-screen sticky top-0 z-100 ">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Mobile Menu Button handled by Navbar */}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-[100dvh] overflow-y-auto no-scrollbar w-60 bg-[#A4B494] py-8 pl-5 flex flex-col md:justify-between rounded-tr-4xl shadow transform transition-transform duration-300 ease-in-out z-40 md:static md:translate-x-0 md:rounded-tr-4xl md:shadow ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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

        {/* Logo + Navigation */}
        <div>
          <div className="w-full flex justify-center mb-6">
            <img src="/warden/logo.png" className="h-20 w-20 object-contain mx-auto rounded-full" alt="Logo" />
          </div>

          <div className="space-y-2">
            <Link href="/warden-dashboard" className={getLinkClass("/warden-dashboard")}>
              <img src="/warden/sidebar-icons/dashboard.png" alt="Dashboard" className="w-5 h-5" />
              Dashboard
            </Link>
            <Link href="/bedallotment" className={getLinkClass("/bedallotment")}>
              <img src="/warden/sidebar-icons/bed.png" alt="Bed" className="w-5 h-5" />
              Bed Allotment
            </Link>
            <Link href="/student" className={getLinkClass("/student")}>
              <img src="/warden/sidebar-icons/student.png" alt="Student" className="w-5 h-5" />
              Student Management
            </Link>
            <Link href="/staffallotment" className={getLinkClass("/staffallotment")}>
              <img src="/warden/sidebar-icons/staff.png" alt="staffallotment" className="w-5 h-5" />
              Staff Management
            </Link>
            <Link href="/inspection" className={getLinkClass("/inspection")}>
              <img src="/warden/sidebar-icons/inspection.png" alt="Inspection" className="w-5 h-5" />
              Inspection
            </Link>
            <Link href="/inventory" className={getLinkClass("/inventory")}>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a312a]">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              Inventory
            </Link>
            <Link href="/notices" className={getLinkClass("/notices")}>
              <img src="/warden/sidebar-icons/notice.png" alt="Notices" className="w-5 h-5" />
              Notices
            </Link>
            <Link href="/warden-leave" className={getLinkClass("/warden-leave")}>
              <img src="/warden/sidebar-icons/leave.png" alt="Leave" className="w-5 h-5" />
              Leave Request
            </Link>
            <Link href="/attendance-monitoring" className={getLinkClass("/attendance-monitoring")}>
              <div className="w-5 h-5 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#1a312a]">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              Attendance Monitoring
            </Link>
            <Link href="/complaint" className={getLinkClass("/complaint")}>
              <img src="/warden/sidebar-icons/tickets.png" alt="Complaint" className="w-5 h-5" />
              Complaint
            </Link>
            <Link href="/warden-profile" className={getLinkClass("/warden-profile")}>
              <img src="/warden/sidebar-icons/profile.png" alt="Profile" className="w-5 h-5" />
              Warden Profile
            </Link>
            <Link href="/emergency-contact" className={getLinkClass("/emergency-contact")}>
              <img src="/warden/sidebar-icons/contact.png" alt="Contact" className="w-5 h-5" />
              Contacts
            </Link>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8">
          <hr className="border-t border-black my-4 mr-6" />
          <div className="flex justify-center">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 text-[#1a312a] pr-7 font-medium hover:text-black"
            >
              <img src="/warden/sidebar-icons/logout.png" alt="Logout" className="w-5 h-5" />
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

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4" style={{ backdropFilter: 'blur(8px)' }}>
          <div
            className="max-w-md w-full p-6 rounded-2xl border shadow-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.2) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
                pointerEvents: 'none'
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: 'rgba(239, 68, 68, 0.9)',
                    border: '1px solid rgba(239, 68, 68, 1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">Confirm Logout</h3>
              </div>

              <p className="text-gray-800 mb-6 text-sm leading-relaxed font-medium">
                Are you sure you want to logout? You will need to sign in again to access your account.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-5 py-2.5 text-gray-800 font-semibold rounded-lg transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={logout}
                  className="px-5 py-2.5 text-white font-semibold rounded-lg transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 1) 100%)',
                    border: '1px solid rgba(185, 28, 28, 0.8)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px 0 rgba(239, 68, 68, 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(220, 38, 38, 1) 0%, rgba(185, 28, 28, 1) 100%)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 1) 100%)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
