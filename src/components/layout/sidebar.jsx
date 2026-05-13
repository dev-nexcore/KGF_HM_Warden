"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { 
  LayoutDashboard, 
  BedDouble, 
  Users2, 
  UserCog, 
  ScanSearch, 
  BellRing, 
  ClipboardList, 
  MessageSquareWarning, 
  UserCircle, 
  Contact2, 
  LogOut,
  X,
  Menu,
  ShieldCheck
} from "lucide-react";

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

  const getLinkClass = (href) => {
    const isActive = pathname.startsWith(href);
    return `group flex items-center gap-4 py-4 px-6 mx-4 rounded-2xl text-sm font-black transition-all duration-300 uppercase tracking-widest ${
      isActive
        ? "bg-[#7A8B5E] text-white shadow-lg shadow-[#7A8B5E]/20"
        : "text-white/50 hover:text-white hover:bg-white/5"
    }`;
  };

  const logout = () => {
    localStorage.removeItem("wardenToken");
    localStorage.removeItem("wardenId");
    localStorage.removeItem("wardenInfo");
    router.push("/");
  };

  const handleLogoutClick = async () => {
    const token = localStorage.getItem("wardenToken");
    if (!token) {
      toast.error("Session expired.");
      logout();
      return;
    }

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/punch-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { punchedIn, punchedOut, log } = res.data;

      if (!punchedIn || punchedOut) {
        logout();
      } else {
        setPunchInTime(new Date(log?.punchIn));
        setPunchOutTime(null);
        setTotalWorkedHours(null);
        setShowLogoutModal(true);
      }
    } catch (error) {
      toast.error("Security check failed.");
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
      toast.success("Punch-out complete.");
    } catch (error) {
      toast.error("Punch-out failed.");
      logout();
    }
  };

  return (
    <div className="bg-[#1A1F16] h-screen sticky top-0 z-[100] border-r border-white/5">
      <Toaster position="top-right" />

      {/* Hamburger */}
      <button
        aria-label="Open sidebar"
        className="md:hidden fixed top-6 left-6 z-[110] p-3 rounded-2xl bg-[#7A8B5E] text-white shadow-xl"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen overflow-y-auto no-scrollbar w-72 bg-[#1A1F16] py-10 flex flex-col justify-between transform transition-transform duration-500 ease-in-out z-40 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button (Mobile) */}
        <button
          aria-label="Close sidebar"
          className="md:hidden absolute top-8 right-8 p-2 rounded-xl text-white/50 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={24} />
        </button>

        {/* Brand Logo */}
        <div>
          <div className="px-10 mb-12">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg shadow-black/20 group hover:scale-105 transition-transform duration-500">
                <img src="/logo.png" alt="KGF" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tighter italic leading-none">KGF <span className="text-[#7A8B5E]">WARDEN</span></span>
                <span className="text-[8px] font-bold text-[#7A8B5E] uppercase tracking-[0.3em] mt-1">Personnel Command</span>
              </div>
            </div>
            <div className="h-0.5 w-12 bg-[#7A8B5E] rounded-full mt-4"></div>
          </div>

          <nav className="space-y-1">
            <NavItem href="/warden-dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" getLinkClass={getLinkClass} />
            <NavItem href="/bedallotment" icon={<BedDouble size={20} />} label="Bed Registry" getLinkClass={getLinkClass} />
            <NavItem href="/student" icon={<Users2 size={20} />} label="Students" getLinkClass={getLinkClass} />
            <NavItem href="/staffallotment" icon={<UserCog size={20} />} label="Staff Unit" getLinkClass={getLinkClass} />
            <NavItem href="/inspection" icon={<ScanSearch size={20} />} label="Field Inspection" getLinkClass={getLinkClass} />
            <NavItem href="/notices" icon={<BellRing size={20} />} label="Bulletins" getLinkClass={getLinkClass} />
            <NavItem href="/warden-leave" icon={<ClipboardList size={20} />} label="Leaves" getLinkClass={getLinkClass} />
            <NavItem href="/complaint" icon={<MessageSquareWarning size={20} />} label="Reports" getLinkClass={getLinkClass} />
            <NavItem href="/warden-profile" icon={<UserCircle size={20} />} label="Profile" getLinkClass={getLinkClass} />
            <NavItem href="/emergency-contact" icon={<Contact2 size={20} />} label="Contacts" getLinkClass={getLinkClass} />
          </nav>
        </div>

        {/* Logout Section */}
        <div className="px-8 mt-12">
          <div className="bg-white/5 rounded-[32px] p-6 text-center border border-white/5 group hover:border-[#7A8B5E]/20 transition-all">
            <button
              onClick={handleLogoutClick}
              className="w-full flex flex-col items-center gap-3 text-white/40 group-hover:text-white transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#7A8B5E] group-hover:text-white transition-all">
                <LogOut size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">End Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[30] md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout Security Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#1A1F16] border border-[#7A8B5E]/20 rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-[#7A8B5E]/20 rounded-[32px] flex items-center justify-center text-[#7A8B5E] mb-8">
                <LogOut size={40} />
              </div>
              <h2 className="text-2xl font-black text-white mb-4 italic tracking-tight uppercase">Security Clearance</h2>

              {!readyToLogout ? (
                <>
                  <p className="text-white/60 mb-8 leading-relaxed text-sm">You are currently clocked in. Would you like to record your departure before ending the session?</p>
                  {punchInTime && (
                    <div className="w-full bg-white/5 rounded-2xl p-4 mb-8">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7A8B5E] mb-1">Shift Start</p>
                      <p className="text-lg font-bold text-white tracking-widest">{punchInTime.toLocaleTimeString()}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <button onClick={() => setShowLogoutModal(false)} className="px-6 py-4 bg-white/5 text-white/60 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                    <button onClick={handlePunchOutAndLogout} className="px-6 py-4 bg-[#7A8B5E] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#7A8B5E]/20 transition-all">Clock Out</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full space-y-3 mb-10">
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#7A8B5E]">Work Hours</span>
                      <span className="text-white font-bold">{totalWorkedHours} Hrs</span>
                    </div>
                  </div>
                  <button onClick={logout} className="w-full px-8 py-5 bg-white text-[#1A1F16] rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-red-50 hover:text-red-600 transition-all">Terminate Session</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ href, icon, label, getLinkClass }) {
  return (
    <Link href={href} className={getLinkClass(href)}>
      <div className="transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}
