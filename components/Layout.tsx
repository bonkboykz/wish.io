"use client";

import { Providers } from "@/app/providers";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "./ui/toaster";
import { usePathname } from "next/navigation";
import { IsChangeFetchProvider } from "@/hooks/useIsChange";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <div className="relative">{pathname !== "/api-docs" && <Header />}</div>

        <div className="relative flex-grow min-h-full max-h-[calc(100vh-80px)] overflow-auto">
          <IsChangeFetchProvider>{children}</IsChangeFetchProvider>
        </div>

        <div className="relative bottom-0 w-full">
          {pathname !== "/api-docs" && <Footer />}
        </div>

        <div className="relative">
          <Toaster />
        </div>
      </div>
    </Providers>
  );
};
