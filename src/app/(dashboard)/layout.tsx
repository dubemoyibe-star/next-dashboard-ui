import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex h-screen overflow-hidden">
        {/* left */}
        <div className="overflow-y-auto sidebar-scroll w-[14%] md:w-[10%] lg:w-[18%] xl:w-[16%] py-4">
          <Link href="/" className="flex items-center justify-center lg:justify-start gap-2 mb-4 lg:ml-4">
          <Image src="/logo.png" alt="logo" width={32} height={32} className="w-8 h-8  min-w-[32px]"/>
          <span className="hidden lg:block font-semibold">CRESTWOOD</span>
          </Link>

          <Menu />
        </div>
        {/*right */}
        <div className="w-[86%] md:w-[90%] lg:w-[82%] xl:w-[84%] bg-[#F7F8FA]  overflow-y-auto flex flex-col">
          <Navbar />
          {children}
        </div>
      </div>
  );
}