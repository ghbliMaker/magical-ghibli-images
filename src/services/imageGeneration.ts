
import { supabase } from "@/integrations/supabase/client";

// Interface for image generation options
export interface ImageGenerationOptions {
  prompt: string;
  magicLevel?: number; // 1-100 scale for generation parameters
  negativePrompt?: string;
}

// Interface for image transformation options
export interface ImageTransformOptions {
  imageFile: File;
  prompt?: string;
  magicLevel?: number;
}

// Interface for generation results
export interface GenerationResult {
  imageUrl: string;
  prompt: string;
  createdAt: Date;
}

// Interface for gallery items
export interface GalleryItem {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: Date;
  magicLevel?: number;
}

/**
 * Service for handling image generation with OpenAI
 */
export const imageGenerationService = {
  /**
   * Generate an image from text prompt
   */
  generateFromText: async (options: ImageGenerationOptions): Promise<GenerationResult> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: options.prompt,
          magicLevel: options.magicLevel || 50,
          negativePrompt: options.negativePrompt,
          type: 'text'
        }
      });
      
      if (error) throw error;
      
      return {
        imageUrl: data.imageUrl,
        prompt: options.prompt,
        createdAt: new Date(data.createdAt)
      };
    } catch (error) {
      console.error("Error generating image:", error);
      throw new Error("Failed to generate image. Please try again.");
    }
  },
  
  /**
   * Transform an uploaded image with Ghibli style
   */
  transformImage: async (options: ImageTransformOptions): Promise<GenerationResult> => {
    try {
      // Upload image to temporary storage first
      const fileName = `temp-${Date.now()}-${options.imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('temp-uploads')
        .upload(fileName, options.imageFile);
      
      if (uploadError) throw uploadError;
      
      // Get the URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('temp-uploads')
        .getPublicUrl(fileName);
      
      // Call the edge function with the image URL
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: options.prompt || "Transform this in Studio Ghibli style",
          magicLevel: options.magicLevel || 50,
          imageUrl: urlData.publicUrl,
          type: 'image'
        }
      });
      
      if (error) throw error;
      
      return {
        imageUrl: data.imageUrl,
        prompt: options.prompt || "Image transformation",
        createdAt: new Date(data.createdAt)
      };
    } catch (error) {
      console.error("Error transforming image:", error);
      throw new Error("Failed to transform image. Please try again.");
    }
  },
  
  /**
   * Save a generated image to the user's gallery
   */
  saveToGallery: async (userId: string, result: GenerationResult, magicLevel?: number) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .insert({ 
          user_id: userId, 
          prompt: result.prompt, 
          image_url: result.imageUrl,
          magic_level: magicLevel || 50
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error saving to gallery:", error);
      return false;
    }
  },
  
  /**
   * Get all images from the user's gallery
   */
  getUserGallery: async (userId: string): Promise<GalleryItem[]> => {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        imageUrl: item.image_url,
        prompt: item.prompt,
        createdAt: new Date(item.created_at),
        magicLevel: item.magic_level
      }));
    } catch (error) {
      console.error("Error fetching gallery:", error);
      return [];
    }
  },
  
  /**
   * Delete an image from the gallery
   */
  deleteFromGallery: async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('generated_images')
        .delete()
        .eq('id', imageId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting from gallery:", error);
      return false;
    }
  }
};
