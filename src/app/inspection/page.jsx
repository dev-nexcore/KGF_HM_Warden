"use client";

import Sidebar from '@/components/layout/sidebar';
import Navbar from '@/components/layout/navbar';
import InspectionManagement from '@/components/Inspection/InspectionManagement';
import { useState } from 'react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f4f5f2]">
      {/* Sidebar (collapsible on mobile) */}
      <div
        className={`fixed z-30 inset-y-0 left-0 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:w-64`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar with menu toggle for mobile */}
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <InspectionManagement />
        </main>
      </div>
    </div>
  );
}
