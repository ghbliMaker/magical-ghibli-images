import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Image, Heart, User, Plus } from "lucide-react";
import { motion } from "framer-motion";

const navigationItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Image, label: "Gallery", path: "/gallery" },
  { icon: Plus, label: "Generate", path: "/generator" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-ghibli/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-full h-full"
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    color: isActive ? "hsl(var(--ghibli))" : "hsl(var(--muted-foreground))",
                  }}
                  className="flex flex-col items-center"
                >
                  <item.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-ghibli"
                    initial={false}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 