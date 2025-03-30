
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
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Generator = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // In a real app, we would track this with Supabase
  const [remainingCredits, setRemainingCredits] = useState(10);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setSelectedFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, we would call OpenAI API here
      setGeneratedImage("https://placekitten.com/600/600");
      setRemainingCredits(prev => prev - 1);
      
      toast({
        title: "Image generated!",
        description: "Your Ghibli-style image is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again later.",
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
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, we would call OpenAI API here
      setGeneratedImage("https://placekitten.com/601/601");
      setRemainingCredits(prev => prev - 1);
      
      toast({
        title: "Image transformed!",
        description: "Your uploaded image has been transformed to Ghibli style.",
      });
    } catch (error) {
      toast({
        title: "Transformation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownload = () => {
    if (generatedImage) {
      // In a real app, we would handle actual download
      toast({
        title: "Download started",
        description: "Your image is being downloaded.",
      });
    }
  };
  
  const handleShare = () => {
    if (generatedImage) {
      // In a real app, we would handle actual sharing
      toast({
        title: "Share dialog",
        description: "Share functionality would open here.",
      });
    }
  };
  
  return (
    <Layout>
      <div className="container py-8 md:py-12 max-w-5xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Create Ghibli Magic</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-muted-foreground">Free tier:</p>
            <Badge variant="outline" className="bg-background">
              {remainingCredits} images left this week
            </Badge>
            <Button variant="link" size="sm" className="text-primary h-auto p-0">
              Upgrade
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Input Section */}
          <div>
            <Tabs defaultValue="text" className="mb-6">
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
                <div className="space-y-2">
                  <Label htmlFor="prompt">Describe your magical scene</Label>
                  <Textarea
                    id="prompt"
                    placeholder="A peaceful village with forest spirits, waterfalls, and floating lanterns in Ghibli style..."
                    className="min-h-[120px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Magic level</Label>
                    <span className="text-muted-foreground text-sm">Medium</span>
                  </div>
                  <Slider defaultValue={[50]} max={100} step={10} />
                </div>
                
                <Button 
                  onClick={generateImage} 
                  disabled={isGenerating || !prompt.trim()} 
                  className="w-full gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  {isGenerating ? "Generating..." : "Generate Image"}
                </Button>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-6 mt-4">
                <Card className="border-dashed">
                  <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
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
                          className="flex flex-col items-center justify-center gap-4 py-10 cursor-pointer"
                        >
                          <Upload className="h-10 w-10 text-muted-foreground" />
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
                
                <div className="space-y-2">
                  <Label htmlFor="enhance-prompt">Enhance with text (optional)</Label>
                  <Textarea
                    id="enhance-prompt"
                    placeholder="Add additional details like 'magical forest' or 'sunset lighting'..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <Button 
                  onClick={handleImageUploadGenerate} 
                  disabled={isGenerating || !selectedFile} 
                  className="w-full gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  {isGenerating ? "Transforming..." : "Transform to Ghibli Style"}
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="mt-4 p-4 rounded-md bg-muted/40 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Tips for better results:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                  <li>Try mentioning Ghibli elements like forests, spirits, or detailed backgrounds</li>
                  <li>Include weather conditions like "misty morning" or "sunny afternoon"</li>
                  <li>Add emotional qualities like "peaceful", "mysterious" or "joyful"</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Output Section */}
          <div>
            <h2 className="font-display text-xl font-bold mb-4">Your Creation</h2>
            
            <div className="bg-muted/30 rounded-lg overflow-hidden aspect-square relative">
              {generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
                  <div className="rounded-full bg-muted/50 p-6">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
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
            </div>
            
            {generatedImage && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => setGeneratedImage(null)} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
                <Button variant="outline" onClick={handleDownload} className="gap-2">
                  <DownloadCloud className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleShare} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Generator;
