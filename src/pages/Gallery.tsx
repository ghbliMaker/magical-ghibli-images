
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Wand2, Search, SlidersHorizontal, Heart, Download, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const Gallery = () => {
  // In a real app, we would fetch images from Supabase
  const placeholderImages = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    src: `https://picsum.photos/600/600?random=${i}`,
    title: `Ghibli Magic ${i + 1}`,
    likes: Math.floor(Math.random() * 100),
  }));

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Magical Gallery</h1>
            <p className="text-muted-foreground">Discover enchanting Ghibli-inspired creations</p>
          </div>

          <Link to="/generator">
            <Button className="gap-2">
              <Wand2 className="h-4 w-4" />
              Create New Image
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <Tabs defaultValue="community">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="my-images">My Images</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search images..." className="pl-9" />
                </div>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="community" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {placeholderImages.map((image) => (
                  <div key={image.id} className="group relative">
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="h-full w-full object-cover transition-all group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-white font-medium truncate">{image.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 text-white/90">
                          <Heart className="h-4 w-4" fill="white" />
                          <span className="text-sm">{image.likes}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            </TabsContent>

            <TabsContent value="my-images" className="mt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Wand2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold">No images yet</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                  Start creating magical Ghibli-style images to see them in your personal gallery
                </p>
                <Link to="/generator">
                  <Button>Create Your First Image</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
