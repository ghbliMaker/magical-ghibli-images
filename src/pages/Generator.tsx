
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Wand2, 
  Upload, 
  DownloadCloud, 
  Share2, 
  Loader2, 
  ImageIcon,
  RefreshCw,
  Info,
  Check,
  AlertTriangle,
  Save
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { imageGenerationService, GenerationResult } from "@/services/imageGeneration";
import { motion } from "framer-motion";

const Generator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [magicLevel, setMagicLevel] = useState(50);
  const [isSaving, setIsSaving] = useState(false);
  const [savedToGallery, setSavedToGallery] = useState(false);
  
  // In a real app, we would track this with Supabase
  const [remainingCredits, setRemainingCredits] = useState(5);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const saveGeneratedImage = async () => {
    if (!user || !generatedImage) return;
    
    setIsSaving(true);
    
    try {
      const success = await imageGenerationService.saveToGallery(
        user.id, 
        generatedImage,
        magicLevel
      );
      
      if (success) {
        toast({
          title: "Saved to gallery",
          description: "Your creation has been saved to your gallery.",
        });
        setSavedToGallery(true);
      } else {
        throw new Error("Failed to save to gallery");
      }
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "Could not save image to your gallery.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const generateImage = async () => {
    if (remainingCredits <= 0) {
      toast({
        title: "Usage limit reached",
        description: "Upgrade to premium for unlimited generations.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setSavedToGallery(false);
    
    try {
      // Call OpenAI via our edge function
      const result = await imageGenerationService.generateFromText({
        prompt,
        magicLevel,
        negativePrompt: negativePrompt || undefined
      });
      
      setGeneratedImage(result);
      setRemainingCredits(prev => prev - 1);
      
      toast({
        title: "Image generated!",
        description: "Your Ghibli-style image is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleImageUploadGenerate = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setSavedToGallery(false);
    
    try {
      // Call OpenAI via edge function for image transformation
      const result = await imageGenerationService.transformImage({
        imageFile: selectedFile,
        prompt,
        magicLevel
      });
      
      setGeneratedImage(result);
      setRemainingCredits(prev => prev - 1);
      
      toast({
        title: "Image transformed!",
        description: "Your uploaded image has been transformed to Ghibli style.",
      });
    } catch (error) {
      toast({
        title: "Transformation failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownload = () => {
    if (generatedImage) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = generatedImage.imageUrl;
      link.download = `ghibli-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: "Your image is being downloaded.",
      });
    }
  };
  
  const handleShare = () => {
    if (generatedImage) {
      if (navigator.share) {
        navigator.share({
          title: 'My Ghibli-style Image',
          text: 'Check out this Ghibli-style image I created!',
          url: generatedImage.imageUrl,
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
        navigator.clipboard.writeText(generatedImage.imageUrl);
        toast({
          title: "Link copied",
          description: "Image URL copied to clipboard.",
        });
      }
    }
  };
  
  return (
    <Layout hideFooter>
      <div className="container py-4 md:py-8 max-w-5xl">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold">Create Ghibli Magic</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">Free tier:</p>
              <Badge variant="outline" className="bg-background">
                {remainingCredits} images left
              </Badge>
              <Button variant="link" size="sm" className="text-primary h-auto p-0">
                Upgrade
              </Button>
            </div>
          </motion.div>
          
          {remainingCredits === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You've used all your free generations. Upgrade to continue creating images.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
          
          <Tabs defaultValue="text" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Text to Image
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Image
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-6 mt-4">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="prompt">Describe your magical scene</Label>
                <Textarea
                  id="prompt"
                  placeholder="A peaceful village with forest spirits, waterfalls, and floating lanterns in Ghibli style..."
                  className="min-h-[100px] md:min-h-[120px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="negative-prompt">Negative prompt (optional)</Label>
                <Textarea
                  id="negative-prompt"
                  placeholder="Elements you want to avoid in the image..."
                  className="min-h-[60px]"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                />
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <Label>Magic level: {magicLevel}%</Label>
                  <span className="text-xs text-muted-foreground">
                    {magicLevel < 33 ? "Subtle" : magicLevel < 66 ? "Medium" : "Strong"}
                  </span>
                </div>
                <Slider 
                  defaultValue={[50]} 
                  max={100} 
                  step={5} 
                  value={[magicLevel]} 
                  onValueChange={(values) => setMagicLevel(values[0])}
                  className="cursor-pointer"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={generateImage} 
                  disabled={isGenerating || !prompt.trim() || remainingCredits <= 0} 
                  className="w-full gap-2 bg-accent hover:bg-accent/80 text-accent-foreground transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate Image"}
                </Button>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-6 mt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-dashed">
                  <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[150px] md:min-h-[200px]">
                    {imagePreview ? (
                      <div className="relative w-full aspect-square max-w-xs mx-auto">
                        <img 
                          src={imagePreview} 
                          alt="Selected" 
                          className="rounded-md object-cover w-full h-full"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setSelectedFile(null);
                            setImagePreview(null);
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full text-center">
                        <Input 
                          id="picture" 
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <Label
                          htmlFor="picture"
                          className="flex flex-col items-center justify-center gap-4 py-8 cursor-pointer"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <div className="text-muted-foreground">
                            <span className="font-medium text-primary">Click to upload</span> or drag and drop
                          </div>
                          <span className="text-xs text-muted-foreground">
                            PNG, JPG or WEBP (max 5MB)
                          </span>
                        </Label>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Label htmlFor="enhance-prompt">Enhance with text (optional)</Label>
                <Textarea
                  id="enhance-prompt"
                  placeholder="Add additional details like 'magical forest' or 'sunset lighting'..."
                  className="min-h-[80px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  onClick={handleImageUploadGenerate} 
                  disabled={isGenerating || !selectedFile || remainingCredits <= 0} 
                  className="w-full gap-2 bg-accent hover:bg-accent/80 text-accent-foreground transition-all duration-300"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  {isGenerating ? "Transforming..." : "Transform to Ghibli Style"}
                </Button>
              </motion.div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <motion.h2 
              className="font-display text-xl font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Your Creation
            </motion.h2>
            
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
            
            {generatedImage && (
              <motion.div 
                className="mt-4 grid grid-cols-4 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Button variant="outline" onClick={() => {
                  setGeneratedImage(null);
                  setSavedToGallery(false);
                }} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  onClick={saveGeneratedImage} 
                  disabled={isSaving || savedToGallery}
                  className="gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : savedToGallery ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {savedToGallery ? "Saved" : isSaving ? "Saving..." : "Gallery"}
                </Button>
                <Button variant="outline" onClick={handleDownload} className="gap-2">
                  <DownloadCloud className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleShare} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </motion.div>
            )}
          </div>
          
          <motion.div 
            className="mt-2 p-4 rounded-md bg-muted/40 flex items-start gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Tips for better results:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                <li>Try mentioning Ghibli elements like forests, spirits, or detailed backgrounds</li>
                <li>Include weather conditions like "misty morning" or "sunny afternoon"</li>
                <li>Add emotional qualities like "peaceful", "mysterious" or "joyful"</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Generator;
