import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Database } from "@/lib/supabase";

type Image = Database["public"]["Tables"]["images"]["Row"] & {
  user: {
    username: string;
    avatar_url: string | null;
  };
};

export function useImageFeed() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchImages = async (pageNum: number) => {
    try {
      const from = (pageNum - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("images")
        .select(`
          *,
          user:users (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        setImages((prev) => (pageNum === 1 ? data : [...prev, ...data]));
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(1);
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      fetchImages(page + 1);
    }
  };

  const likeImage = async (imageId: string) => {
    try {
      const { data: image } = await supabase
        .from("images")
        .select("likes")
        .eq("id", imageId)
        .single();

      if (!image) throw new Error("Image not found");

      const { error } = await supabase
        .from("images")
        .update({ likes: image.likes + 1 })
        .eq("id", imageId);

      if (error) throw error;

      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, likes: img.likes + 1 } : img
        )
      );
    } catch (err) {
      console.error("Error liking image:", err);
    }
  };

  const saveImage = async (imageId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("saved_images")
        .insert({
          user_id: user.id,
          image_id: imageId,
        });

      if (error) throw error;
    } catch (err) {
      console.error("Error saving image:", err);
    }
  };

  return {
    images,
    loading,
    error,
    hasMore,
    loadMore,
    likeImage,
    saveImage,
  };
} 