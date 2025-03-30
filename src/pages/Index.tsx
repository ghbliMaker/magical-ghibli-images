
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ImageIcon, TextIcon, Cloud, Leaf, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-24 right-10 w-20 h-20 bg-accent/30 rounded-full blur-2xl animate-float" />
        <div className="absolute top-40 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float" style={{ animationDelay: "-2s" }} />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/30 rounded-full blur-xl animate-float" style={{ animationDelay: "-4s" }} />
        
        {/* Hero Section */}
        <section className="container pt-16 pb-20 md:pt-24 md:pb-32">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
              <h1 className="relative font-display text-4xl md:text-6xl font-bold tracking-tight text-foreground bg-clip-text">
                Create Magical Ghibli-Inspired Images
              </h1>
            </div>
            
            <p className="max-w-[42rem] text-muted-foreground text-lg md:text-xl">
              Transform your ideas into enchanting artwork with the power of AI.
              Generate stunning images in the style of Studio Ghibli films.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Start Creating
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="outline" size="lg">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="ghibli-card p-6 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full ghibli-gradient flex items-center justify-center mb-4">
                  <TextIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Describe Your Vision</h3>
                <p className="text-muted-foreground">
                  Enter a description of the scene you want to create in Ghibli style.
                </p>
              </div>
              
              <div className="ghibli-card p-6 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full ghibli-gradient flex items-center justify-center mb-4">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">AI Magic Happens</h3>
                <p className="text-muted-foreground">
                  Our AI uses your description to generate a beautiful Ghibli-inspired artwork.
                </p>
              </div>
              
              <div className="ghibli-card p-6 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full ghibli-gradient flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Download & Share</h3>
                <p className="text-muted-foreground">
                  Save your creation, share it with friends, or create more magical images.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Example Gallery */}
        <section className="container py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-6">
            Magical Creations
          </h2>
          <p className="text-center text-muted-foreground max-w-[42rem] mx-auto mb-12">
            Get inspired by these enchanting Ghibli-style images created by our users
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square relative overflow-hidden rounded-lg bg-muted group">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-secondary/50"></div>
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-10 w-10" />
                </div>
                {/* In a real app, we'd load actual images here */}
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/gallery">
              <Button variant="outline" className="gap-2">
                <Leaf className="h-4 w-4" />
                Explore Gallery
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted/50 py-16">
          <div className="container max-w-3xl">
            <div className="ghibli-card p-8 md:p-12 text-center">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Begin Your Magical Journey Today
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Start with 10 free images per week. Upgrade anytime to create unlimited magical worlds.
              </p>
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
