import React from "react";
import SidebarServer from "@/components/SidebarServer";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen ">
      <SidebarServer />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto flex flex-col relative">
        <Navbar />
        <div className="flex-1 pt-5">
          {children}
        </div>
      </div>
    </div>
  );
}
