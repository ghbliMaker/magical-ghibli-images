import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type SavedImage = Database["public"]["Tables"]["images"]["Row"] & {
  user: {
    username: string;
    avatar_url: string | null;
  };
};

export function useSavedImages() {
  const { user } = useAuth();
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setSavedImages([]);
      setLoading(false);
      return;
    }

    async function fetchSavedImages() {
      try {
        const { data, error } = await supabase
          .from("saved_images")
          .select(`
            image:images (
              *,
              user:users (
                username,
                avatar_url
              )
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          setSavedImages(data.map((item) => item.image));
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedImages();

    // Subscribe to changes in saved images
    const subscription = supabase
      .channel("saved_images_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "saved_images",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const { data: image } = await supabase
              .from("images")
              .select(`
                *,
                user:users (
                  username,
                  avatar_url
                )
              `)
              .eq("id", payload.new.image_id)
              .single();

            if (image) {
              setSavedImages((prev) => [image, ...prev]);
            }
          } else if (payload.eventType === "DELETE") {
            setSavedImages((prev) =>
              prev.filter((img) => img.id !== payload.old.image_id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const unsaveImage = async (imageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("saved_images")
        .delete()
        .eq("user_id", user.id)
        .eq("image_id", imageId);

      if (error) throw error;
    } catch (err) {
      console.error("Error unsaving image:", err);
    }
  };

  return {
    savedImages,
    loading,
    error,
    unsaveImage,
  };
} 