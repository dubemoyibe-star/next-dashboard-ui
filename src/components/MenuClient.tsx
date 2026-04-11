"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaBook,
  FaSchool,
  FaClipboardList,
  FaFileAlt,
  FaTasks,
  FaChartBar,
  FaUserCheck,
  FaCalendarAlt,
  FaEnvelope,
  FaBullhorn,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: FaHome,
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaChalkboardTeacher,
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: FaUserGraduate,
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: FaUsers,
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: FaBook,
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: FaSchool,
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: FaClipboardList,
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: FaFileAlt,
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaTasks,
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaChartBar,
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaCalendarAlt,
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: FaBullhorn,
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const MenuClient = ({ role, setSidebarOpen }: { role: string; setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const pathname = usePathname()
  return (
    <div className="mb-4 text-sm pb-8">
      {menuItems.map(i => (
        <div className="px-2 flex flex-col gap-2 " key={i.title}>
          <span className=" text-gray-400 dark:text-gray-500 font-light my-4">{i.title}</span>
          {i.items.map((item) => {
            if(item.visible.includes(role)) {
              return (
                  <Link onClick={() => setSidebarOpen && setSidebarOpen(prev => !prev)} href={item.href} key={item.label} className={` min-w-[20px] flex items-center justify-start gap-4 text-gray-500 dark:text-gray-400 py-2  rounded-md hover:bg-lamaSkyLight dark:hover:bg-gray-800 transition-colors duration-200 px-2 ${pathname === item.href ? 'bg-[#A3D9F5] dark:bg-gray-700' : ''}`}>
                    <item.icon className="w-5 h-5 ml-2"/>
                    <span >{item.label}</span>
                  </Link>
              )
            }
          })}
        </div>
      ))}
    </div>
  )
}

export default MenuClient
