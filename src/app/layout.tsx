import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrestWood School Management Dashboard",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider ui={ui}>
        <body className={inter.className}>{children}</body>
      </ClerkProvider>
    </html>
  );
}
