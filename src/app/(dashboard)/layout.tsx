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
      <div className="flex-1 bg-gray-50 overflow-y-auto flex flex-col relative">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
