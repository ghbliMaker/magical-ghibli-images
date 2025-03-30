
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Wand2, Search, SlidersHorizontal, Heart, Download, Share2, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { imageGenerationService } from "@/services/imageGeneration";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GalleryImage {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: Date;
  magicLevel?: number;
}

const Gallery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userImages, setUserImages] = useState<GalleryImage[]>([]);
  const [communityImages, setCommunityImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch user's gallery images
  useEffect(() => {
    const fetchUserGallery = async () => {
      if (!user) {
        setUserImages([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const images = await imageGenerationService.getUserGallery(user.id);
        setUserImages(images);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserGallery();
  }, [user]);
  
  // For community images, we're using placeholders for now
  useEffect(() => {
    setCommunityImages(Array.from({ length: 12 }, (_, i) => ({
      id: `community-${i}`,
      imageUrl: `https://picsum.photos/600/600?random=${i}`,
      prompt: `Ghibli Magic ${i + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
    })));
  }, []);
  
  const handleDelete = async () => {
    if (!imageToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await imageGenerationService.deleteFromGallery(imageToDelete);
      
      if (success) {
        setUserImages(userImages.filter(img => img.id !== imageToDelete));
        toast({
          title: "Image deleted",
          description: "The image has been removed from your gallery.",
        });
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };
  
  const handleDownload = (imageUrl: string) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ghibli-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your image is being downloaded.",
    });
  };
  
  const handleShare = (imageUrl: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'My Ghibli-style Image',
        text: 'Check out this Ghibli-style image I created!',
        url: imageUrl,
      })
      .then(() => {
        toast({
          title: "Shared successfully",
          description: "Your image has been shared.",
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(imageUrl);
      toast({
        title: "Link copied",
        description: "Image URL copied to clipboard.",
      });
    }
  };

  const filteredUserImages = userImages.filter(img => 
    img.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommunityImages = communityImages.filter(img => 
    img.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Animation variants for the image grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };
  
  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="font-display text-3xl font-bold">Magical Gallery</h1>
            <p className="text-muted-foreground">Discover enchanting Ghibli-inspired creations</p>
          </div>

          <Link to="/generator">
            <Button className="gap-2 bg-accent hover:bg-accent/80 text-accent-foreground">
              <Wand2 className="h-4 w-4" />
              Create New Image
            </Button>
          </Link>
        </motion.div>

        <div className="mb-8">
          <Tabs defaultValue={user ? "my-images" : "community"}>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TabsList>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="my-images">My Images</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search images..." 
                    className="pl-9" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <TabsContent value="community" className="mt-6">
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredCommunityImages.map((image, index) => (
                  <motion.div 
                    key={image.id} 
                    className="group relative"
                    variants={itemVariants}
                  >
                    <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                      <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-white font-medium truncate">{image.prompt}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 text-white/90">
                          <Heart className="h-4 w-4" fill="white" />
                          <span className="text-sm">{Math.floor(Math.random() * 100)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="mt-8 flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            </TabsContent>

            <TabsContent value="my-images" className="mt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : filteredUserImages.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {filteredUserImages.map((image) => (
                    <motion.div 
                      key={image.id} 
                      className="group relative"
                      variants={itemVariants}
                    >
                      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                        <img
                          src={image.imageUrl}
                          alt={image.prompt}
                          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 className="text-white font-medium truncate">{image.prompt}</h3>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-1 text-white/90">
                            <span className="text-sm">{new Date(image.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:text-white hover:bg-white/20">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this image? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => {
                                      setImageToDelete(image.id);
                                      handleDelete();
                                    }}
                                    disabled={isDeleting}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    {isDeleting && imageToDelete === image.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                              onClick={() => handleDownload(image.imageUrl)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                              onClick={() => handleShare(image.imageUrl)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center py-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Wand2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold">No images yet</h3>
                  <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                    Start creating magical Ghibli-style images to see them in your personal gallery
                  </p>
                  <Link to="/generator">
                    <Button className="bg-accent hover:bg-accent/80 text-accent-foreground">Create Your First Image</Button>
                  </Link>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
