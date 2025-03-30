
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © 2023 Ghibli Style Image Maker. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Made with</span>
          <Heart className="h-4 w-4 text-destructive" fill="currentColor" />
          <span className="text-sm text-muted-foreground">and AI magic</span>
        </div>
        
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link to="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
