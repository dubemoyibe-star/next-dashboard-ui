import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrestWood School Management Dashboard",
  description: "Next.js School Management System",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider ui={ui}>
        <ThemeProvider>
          <body className={inter.className}>
            {children} <ToastContainer position="bottom-right" theme="dark"/>
          </body>
        </ThemeProvider>
      </ClerkProvider>
    </html>
  );
}
