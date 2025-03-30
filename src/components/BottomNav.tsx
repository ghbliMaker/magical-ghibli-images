
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ImageIcon, User, Grid, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-lg">
      <div className="flex items-center justify-around py-3">
        <Link to="/" className="flex flex-col items-center space-y-1">
          <Home 
            size={22} 
            className={cn(
              "transition-colors", 
              isActive("/") ? "text-primary" : "text-muted-foreground"
            )} 
          />
          <span className={cn(
            "text-xs font-medium",
            isActive("/") ? "text-primary" : "text-muted-foreground"
          )}>
            Home
          </span>
        </Link>
        
        <Link to="/gallery" className="flex flex-col items-center space-y-1">
          <Grid 
            size={22}
            className={cn(
              "transition-colors", 
              isActive("/gallery") ? "text-primary" : "text-muted-foreground"
            )}
          />
          <span className={cn(
            "text-xs font-medium",
            isActive("/gallery") ? "text-primary" : "text-muted-foreground"
          )}>
            Gallery
          </span>
        </Link>
        
        {user && (
          <Link to="/generator" className="flex flex-col items-center -mt-5">
            <div className={cn(
              "rounded-full p-3 shadow-md transition-colors",
              isActive("/generator") 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            )}>
              <ImageIcon size={24} />
            </div>
            <span className={cn(
              "text-xs font-medium mt-1",
              isActive("/generator") ? "text-primary" : "text-muted-foreground"
            )}>
              Create
            </span>
          </Link>
        )}
        
        {user ? (
          <Link to="/profile" className="flex flex-col items-center space-y-1">
            <User 
              size={22}
              className={cn(
                "transition-colors", 
                isActive("/profile") ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span className={cn(
              "text-xs font-medium",
              isActive("/profile") ? "text-primary" : "text-muted-foreground"
            )}>
              Profile
            </span>
          </Link>
        ) : (
          <Link to="/login" className="flex flex-col items-center space-y-1">
            <User 
              size={22}
              className={cn(
                "transition-colors", 
                isActive("/login") ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span className={cn(
              "text-xs font-medium",
              isActive("/login") ? "text-primary" : "text-muted-foreground"
            )}>
              Login
            </span>
          </Link>
        )}
      </div>
      
      {/* Add a placeholder div to ensure content doesn't get hidden behind the nav */}
      <div className="h-16 opacity-0"></div>
    </div>
  );
}
