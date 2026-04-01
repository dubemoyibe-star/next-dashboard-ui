"use client";

import React from "react";
import MenuClient from "@/components/MenuClient";
import Image from "next/image";
import Link from "next/link";
import { X, Menu as MenuIcon } from "lucide-react";

export default function SidebarWrapper({ role }: { role: string }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col overflow-y-auto sidebar-scroll w-[14%] md:w-[10%] lg:w-[18%] xl:w-[16%] py-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2 mb-4 lg:ml-4"
        >
          <Image
            src="/logo.png"
            alt="logo"
            width={32}
            height={32}
            className="w-8 h-8 min-w-[32px]"
          />
          <span className="hidden lg:block font-semibold">CRESTWOOD</span>
        </Link>
        <MenuClient role={role} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-scroll overflow-y-auto fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 lg:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
       <div className="flex justify-between items-center">
         <Link href="/" className="flex items-center justify-start gap-2 p-4">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="font-semibold">CRESTWOOD</span>
        </Link>

        <X className="w-5 h-5 mr-4 cursor-pointer hover:text-red-500" onClick={() => setSidebarOpen(false)}/>
       </div>
        <MenuClient role={role} setSidebarOpen={setSidebarOpen}/>
      </div>

      {/* Mobile overlay background */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2"
        onClick={() => setSidebarOpen(true)}
      >
        <MenuIcon className="w-5 h-5 text-gray-600" />
      </button>
    </>
  );
}
