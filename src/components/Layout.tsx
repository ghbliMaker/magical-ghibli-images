
import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter = false }: LayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-grow pb-16 md:pb-0">
        {children}
      </main>
      {isMobile ? <BottomNav /> : !hideFooter && <Footer />}
    </div>
  );
}
