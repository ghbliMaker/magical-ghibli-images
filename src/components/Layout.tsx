import React from "react";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <main className="pb-16">
        {children}
      </main>
      <Navigation />
    </div>
  );
}
