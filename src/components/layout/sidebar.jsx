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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);
  const [totalWorkedHours, setTotalWorkedHours] = useState(null);
  const [readyToLogout, setReadyToLogout] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const getLinkClass = (href) =>
    `flex items-center gap-2 py-3 px-4 rounded-l-3xl text-sm transition ${
      pathname.startsWith(href)
        ? "bg-white text-black font-semibold"
        : "text-[#1a312a] hover:text-black"
    }`;

  const logout = () => {
    localStorage.removeItem("wardenToken");
    localStorage.removeItem("wardenId");
    localStorage.removeItem("wardenInfo");
    router.push("/");
  };

  const handleLogoutClick = async () => {
    const token = localStorage.getItem("wardenToken");

    if (!token) {
      toast.error("Session expired. Please login again.");
      logout();
      return;
    }

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/punch-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { punchedIn, punchedOut, log } = res.data;

      if (!punchedIn || punchedOut) {
        if (log?.punchIn) {
          toast.info(`You punched in at ${new Date(log.punchIn).toLocaleTimeString()}`);
        }
        if (log?.punchOut) {
          toast.info(`You punched out at ${new Date(log.punchOut).toLocaleTimeString()}`);
        }
        setTimeout(() => logout(), 2500);
      } else {
        setPunchInTime(new Date(log?.punchIn));
        setPunchOutTime(null);
        setTotalWorkedHours(null);
        setShowLogoutModal(true);
      }
    } catch (error) {
      console.error("Punch status check failed:", error);
      toast.error("Failed to verify punch status.");
      logout();
    }
  };

  const handlePunchOutAndLogout = async () => {
    const token = localStorage.getItem("wardenToken");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/attendance/punch-out`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { punchIn, punchOut, totalHours } = res.data;

      setPunchInTime(new Date(punchIn));
      setPunchOutTime(new Date(punchOut));
      setTotalWorkedHours(totalHours);
      setReadyToLogout(true);

      toast.success(`Punched out! Worked ${totalHours} hrs`);
    } catch (error) {
      console.error("Punch out failed:", error);
      toast.error(error.response?.data?.message || "Punch out failed.");
      logout();
    }
  };

  return (
    <div className="bg-[#BEC5AD]">
      <ToastContainer position="top-right" autoClose={3000} />

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
            <Link href="/inspection" className={getLinkClass("/inspection")}>
              <img src="/warden/sidebar-icons/inspection.png" alt="Inspection" className="w-5 h-5" />
              Inspection
            </Link>
            <Link href="/warden-leave" className={getLinkClass("/warden-leave")}>
              <img src="/warden/sidebar-icons/leave.png" alt="Leave" className="w-5 h-5" />
              Leave Request
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
              onClick={handleLogoutClick}
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

      {/* Punch Out Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10 border border-white/20">
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 w-[90%] max-w-md shadow-lg text-center border border-white/30">
            <h2 className="text-lg font-bold mb-2 text-black">Punch Out & Logout</h2>

            {!readyToLogout ? (
              <>
                <p className="mb-2 text-gray-800">Do you want to punch out before logging out?</p>
                {punchInTime && (
                  <p className="text-sm text-gray-700">
                    <strong>Punched In:</strong> {punchInTime.toLocaleTimeString()}
                  </p>
                )}
                <div className="flex justify-center gap-4 mt-6">
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
              </>
            ) : (
              <>
                <p className="mb-2 text-green-700 font-medium">You have punched out successfully!</p>
                {punchInTime && (
                  <p className="text-sm text-gray-700">
                    <strong>Punched In:</strong> {punchInTime.toLocaleTimeString()}
                  </p>
                )}
                {punchOutTime && (
                  <p className="text-sm text-gray-700">
                    <strong>Punched Out:</strong> {punchOutTime.toLocaleTimeString()}
                  </p>
                )}
                {totalWorkedHours && (
                  <p className="text-sm text-gray-700">
                    <strong>Total Time:</strong> {totalWorkedHours} hrs
                  </p>
                )}
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={logout}
                    className="px-6 py-2 bg-[#1a312a] text-white rounded hover:bg-[#0f211a]"
                  >
                    Confirm Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
