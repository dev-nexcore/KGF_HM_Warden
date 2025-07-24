"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBox,
  FiUsers,
  FiClipboard,
  FiMail,
  FiUser,
  FiPhone,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname(); // Current path
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change, good for mobile UX
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const getLinkClass = (href) =>
    `flex items-center gap-2 py-3 px-4 rounded-l-3xl text-sm transition
     ${
       pathname.startsWith(href)
         ? "bg-white text-black font-semibold"
         : "text-[#1a312a] hover:text-black"
     }`;

  return (
    <div className="bg-[#BEC5AD]">
      <>
      {/* Hamburger button visible on small screens */}
      <button
        aria-label="Open sidebar"
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#A4B494] text-black shadow-md"
        onClick={() => setSidebarOpen(true)}
      >
        <FiMenu className="text-2xl" />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-[#A4B494] py-8 pl-5 flex flex-col justify-between rounded-tr-4xl shadow
          transform transition-transform duration-300 ease-in-out
          z-40

          md:static md:translate-x-0 md:rounded-tr-4xl md:shadow

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Close button, only on mobile */}
        <button
          aria-label="Close sidebar"
          className="md:hidden absolute top-4 right-4 p-2 rounded-md text-black hover:bg-gray-300"
          onClick={() => setSidebarOpen(false)}
        >
          <FiX className="text-2xl" />
        </button>

        <div>
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" className="h-20 w-20 object-contain" alt="Logo" />
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <Link href="/warden-dashboard" className={getLinkClass("/warden-dashboard")}>
              <FiHome className="text-lg" />
              Dashboard
            </Link>
            <Link href="/bedallotment" className={getLinkClass("/bedallotment")}>
              <FiBox className="text-lg" />
              Bed Allotment
            </Link>
            <Link href="/students" className={getLinkClass("/students")}>
              <FiUsers className="text-lg" />
              Student Management
            </Link>
            <Link href="/inspection" className={getLinkClass("/inspection")}>
              <FiClipboard className="text-lg" />
              Inspection
            </Link>
            <Link href="/leave" className={getLinkClass("/leave")}>
              <FiMail className="text-lg" />
              Leave Request
            </Link>
            <Link href="/profile" className={getLinkClass("/profile")}>
              <FiUser className="text-lg" />
              Warden Profile
            </Link>
            <Link href="/emergency" className={getLinkClass("/emergency")}>
              <FiPhone className="text-lg" />
              Emergency Contact
            </Link>
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-8">
          <hr className="border-t border-black my-4 mr-6" />
          <div className="flex justify-center">
            <a
              href="#"
              className="flex items-center gap-2 text-[#1a312a] pr-7 font-medium hover:text-black"
            >
              <FiLogOut className="text-lg" />
              Logout
            </a>
          </div>
        </div>
      </aside>

      {/* Overlay background when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
    </div>
  );
}