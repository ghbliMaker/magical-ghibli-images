
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ImageIcon, User, Grid, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around py-3">
        <Link to="/" className="flex flex-col items-center space-y-1">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Home 
              size={22} 
              className={cn(
                "transition-colors", 
                isActive("/") ? "text-accent" : "text-muted-foreground"
              )} 
            />
          </motion.div>
          <span className={cn(
            "text-xs font-medium",
            isActive("/") ? "text-accent" : "text-muted-foreground"
          )}>
            Home
          </span>
        </Link>
        
        <Link to="/gallery" className="flex flex-col items-center space-y-1">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Grid 
              size={22}
              className={cn(
                "transition-colors", 
                isActive("/gallery") ? "text-accent" : "text-muted-foreground"
              )}
            />
          </motion.div>
          <span className={cn(
            "text-xs font-medium",
            isActive("/gallery") ? "text-accent" : "text-muted-foreground"
          )}>
            Gallery
          </span>
        </Link>
        
        {user && (
          <Link to="/generator" className="flex flex-col items-center -mt-5 relative">
            <motion.div 
              className={cn(
                "rounded-full p-3 shadow-md transition-colors",
                isActive("/generator") 
                  ? "bg-accent text-accent-foreground" 
                  : "bg-primary text-primary-foreground"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 0 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 2,
                repeatDelay: 3
              }}
            >
              <ImageIcon size={24} />
            </motion.div>
            <span className={cn(
              "text-xs font-medium mt-1",
              isActive("/generator") ? "text-accent" : "text-primary"
            )}>
              Create
            </span>
            {!isActive("/generator") && (
              <motion.div 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </Link>
        )}
        
        {user ? (
          <Link to="/profile" className="flex flex-col items-center space-y-1">
            <motion.div whileTap={{ scale: 0.9 }}>
              <User 
                size={22}
                className={cn(
                  "transition-colors", 
                  isActive("/profile") ? "text-accent" : "text-muted-foreground"
                )}
              />
            </motion.div>
            <span className={cn(
              "text-xs font-medium",
              isActive("/profile") ? "text-accent" : "text-muted-foreground"
            )}>
              Profile
            </span>
          </Link>
        ) : (
          <Link to="/login" className="flex flex-col items-center space-y-1">
            <motion.div whileTap={{ scale: 0.9 }}>
              <User 
                size={22}
                className={cn(
                  "transition-colors", 
                  isActive("/login") ? "text-accent" : "text-muted-foreground"
                )}
              />
            </motion.div>
            <span className={cn(
              "text-xs font-medium",
              isActive("/login") ? "text-accent" : "text-muted-foreground"
            )}>
              Login
            </span>
          </Link>
        )}
      </div>
      
      {/* Add a placeholder div to ensure content doesn't get hidden behind the nav */}
      <div className="h-16 opacity-0 safe-area-inset-bottom"></div>
    </motion.div>
  );
}
