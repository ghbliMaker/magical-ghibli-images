import React, { useEffect, useRef } from "react";
import { Heart, Share2, Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useImageFeed } from "@/hooks/useImageFeed";
import { useInView } from "react-intersection-observer";

export function ImageFeed() {
  const {
    images,
    loading,
    error,
    hasMore,
    loadMore,
    likeImage,
    saveImage,
  } = useImageFeed();

  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading images. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display text-ghibli">Discover Serenity</h1>
        <p className="text-muted-foreground text-lg">
          Explore calming images created by our community
        </p>
      </div>

      <div className="space-y-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="ghibli-card overflow-hidden"
          >
            <div className="relative aspect-square">
              <img
                src={image.image_url}
                alt={image.prompt}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={image.user.avatar_url || "https://i.pravatar.cc/150"}
                    alt={image.user.username}
                    className="w-10 h-10 rounded-full border-2 border-primary/20"
                  />
                  <div>
                    <p className="font-medium">{image.user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(image.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => saveImage(image.id)}
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-lg font-medium">{image.prompt}</p>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  onClick={() => likeImage(image.id)}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  {image.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div ref={ref} className="h-20 flex items-center justify-center">
        {loading && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-ghibli animate-bounce" />
            <div className="w-4 h-4 rounded-full bg-ghibli animate-bounce delay-100" />
            <div className="w-4 h-4 rounded-full bg-ghibli animate-bounce delay-200" />
          </div>
        )}
      </div>
    </div>
  );
} 