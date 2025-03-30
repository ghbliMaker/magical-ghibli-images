import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { Database } from "@/lib/supabase";

type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    async function fetchSubscription() {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setSubscription(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();

    // Subscribe to subscription changes
    const subscription = supabase
      .channel("subscription_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "subscriptions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setSubscription(payload.new as Subscription);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const isSubscribed = subscription?.status === "active";
  const isPremium = subscription?.plan === "premium";

  return {
    subscription,
    loading,
    error,
    isSubscribed,
    isPremium,
  };
} 