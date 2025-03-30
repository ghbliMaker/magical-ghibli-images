
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageIcon, LogOut, Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-6 w-6 text-primary" />
          <Link to="/" className="font-display text-xl font-bold">
            Ghibli Maker
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link to="/gallery" className="text-sm font-medium hover:text-primary">
                Gallery
              </Link>
              {user && (
                <Link to="/generator" className="text-sm font-medium hover:text-primary">
                  Create Image
                </Link>
              )}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/generator">
                    <Button size="sm" className="gap-2">
                      <Sparkles size={16} />
                      Create
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground"
                    onClick={handleLogout}
                  >
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
          </>
        )}
        
        {/* Mobile: Only show a minimal header with menu */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80 pt-12">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-3">
                  {user && (
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Logged in</p>
                      </div>
                    </div>
                  )}
                  
                  <Link to="/" className="px-2 py-1 text-base font-medium hover:text-primary">
                    Home
                  </Link>
                  <Link to="/gallery" className="px-2 py-1 text-base font-medium hover:text-primary">
                    Gallery
                  </Link>
                  {user && (
                    <>
                      <Link to="/generator" className="px-2 py-1 text-base font-medium hover:text-primary">
                        Create Image
                      </Link>
                      <Link to="/profile" className="px-2 py-1 text-base font-medium hover:text-primary">
                        My Profile
                      </Link>
                    </>
                  )}
                </div>
                
                {user ? (
                  <Button 
                    variant="outline" 
                    className="justify-start mt-4"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/login">
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
