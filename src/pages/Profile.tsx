import React from "react";
import { ProfileGallery } from "../components/ProfileGallery";
import { motion } from "framer-motion";
import { User, Settings, Bell } from "lucide-react";
import { Button } from "../components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/components/ui/use-toast";

export function Profile() {
  const { profile, loading, error, updateProfile } = useProfile();
  const { toast } = useToast();

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading profile. Please try again.</p>
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

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        username: "New Username", // This would come from a form in a real app
      });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-ghibli/20">
              <img
                src={profile.avatar_url || "https://i.pravatar.cc/150"}
                alt={profile.username || "Profile"}
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-0 right-0 bg-background rounded-full border-2 border-ghibli/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-display text-ghibli">{profile.username}</h1>
            <p className="text-muted-foreground">Creator of Serene Moments</p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button variant="ghost" className="text-muted-foreground hover:text-ghibli">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-ghibli"
              onClick={handleUpdateProfile}
            >
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="text-center p-4 ghibli-card">
            <div className="text-2xl font-display text-ghibli">{profile.stats.totalImages}</div>
            <div className="text-sm text-muted-foreground">Created</div>
          </div>
          <div className="text-center p-4 ghibli-card">
            <div className="text-2xl font-display text-ghibli">{profile.stats.totalLikes}</div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </div>
          <div className="text-center p-4 ghibli-card">
            <div className="text-2xl font-display text-ghibli">{profile.stats.following}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </div>
        </div>

        {/* Gallery */}
        <ProfileGallery />
      </div>
    </div>
  );
}
