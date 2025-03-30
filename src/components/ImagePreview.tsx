
import React from "react";
import { motion } from "framer-motion";
import { ImageIcon, Loader2 } from "lucide-react";
import { GenerationResult } from "@/services/imageGeneration";

interface ImagePreviewProps {
  generatedImage: GenerationResult | null;
  isGenerating: boolean;
}

const ImagePreview = ({ generatedImage, isGenerating }: ImagePreviewProps) => {
  return (
    <motion.div 
      className="bg-muted/30 rounded-lg overflow-hidden aspect-square relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      {generatedImage ? (
        <img 
          src={generatedImage.imageUrl} 
          alt="Generated" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
          <div className="rounded-full bg-muted/50 p-6">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          {isGenerating ? (
            <div className="space-y-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground">Creating your masterpiece...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">No image generated yet</p>
              <p className="text-muted-foreground text-sm">
                Your Ghibli-style creation will appear here
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ImagePreview;
