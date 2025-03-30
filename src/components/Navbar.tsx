
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageIcon, User, LogOut } from "lucide-react";

export function Navbar() {
  // In a real app, we would use Supabase auth here
  const isLoggedIn = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-6 w-6 text-primary" />
          <Link to="/" className="font-display text-xl font-bold">
            Ghibli Maker
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/gallery" className="text-sm font-medium hover:text-primary">
            Gallery
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                <User size={16} />
                Profile
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <LogOut size={16} />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
