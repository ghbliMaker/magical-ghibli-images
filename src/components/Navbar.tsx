
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ImageIcon, User, LogOut, Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-6 w-6 text-primary" />
          <Link to="/" className="font-display text-xl font-bold">
            Ghibli Maker
          </Link>
        </div>

        {/* Mobile Menu */}
        {isMobile ? (
          <Collapsible 
            open={isMenuOpen} 
            onOpenChange={setIsMenuOpen}
            className="md:hidden"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {isMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="absolute top-16 left-0 right-0 bg-background border-b z-50 p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-base font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/gallery" 
                  className="text-base font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gallery
                </Link>
                {user && (
                  <>
                    <Link 
                      to="/generator" 
                      className="text-base font-medium hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Image
                    </Link>
                    <Link 
                      to="/profile" 
                      className="text-base font-medium hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="justify-start p-0 h-auto hover:bg-transparent text-base font-medium text-red-500 hover:text-red-600"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                )}
                {!user && (
                  <>
                    <Link 
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link 
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <>
            {/* Desktop Navigation */}
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
      </div>
    </header>
  );
}
