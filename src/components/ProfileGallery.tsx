import React from "react";
import { Heart, Share2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useSavedImages } from "@/hooks/useSavedImages";

export function ProfileGallery() {
  const { savedImages, loading, error, unsaveImage } = useSavedImages();

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading saved images. Please try again.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-ghibli animate-bounce" />
          <div className="w-4 h-4 rounded-full bg-ghibli animate-bounce delay-100" />
          <div className="w-4 h-4 rounded-full bg-ghibli animate-bounce delay-200" />
        </div>
      </div>
    );
  }

  if (savedImages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No saved images yet. Start exploring and save your favorites!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-display text-ghibli">Your Serene Collection</h2>
        <p className="text-muted-foreground">
          Your personal gallery of calming moments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative ghibli-card overflow-hidden"
          >
            <div className="aspect-square relative">
              <img
                src={image.image_url}
                alt={image.prompt}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="space-y-4">
                <p className="text-white font-medium">{image.prompt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-white hover:text-white/80">
                      <Heart className="h-4 w-4 mr-2" />
                      {image.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:text-white/80">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white/80"
                    onClick={() => unsaveImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 