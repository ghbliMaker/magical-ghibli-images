import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type Profile = Database["public"]["Tables"]["users"]["Row"] & {
  stats: {
    totalImages: number;
    totalLikes: number;
    following: number;
  };
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (userError) throw userError;

        // Fetch user stats
        const { count: totalImages } = await supabase
          .from("images")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        const { data: images } = await supabase
          .from("images")
          .select("likes")
          .eq("user_id", user.id);

        const totalLikes = images?.reduce((sum, img) => sum + img.likes, 0) || 0;

        const { count: following } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", user.id);

        setProfile({
          ...userData,
          stats: {
            totalImages: totalImages || 0,
            totalLikes,
            following: following || 0,
          },
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();

    // Subscribe to profile changes
    const subscription = supabase
      .channel("profile_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setProfile((prev) => prev ? { ...prev, ...payload.new } : null);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      setProfile((prev) => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
} 