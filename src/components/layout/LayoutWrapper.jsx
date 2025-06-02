"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const noLayoutRoutes = ["/signin", "/register"];
  const showLayout = !noLayoutRoutes.includes(pathname);

  return showLayout ? (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  ) : (
    <main>{children}</main>
  );
}
