import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "@/context/AuthContext";

export function useOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;

    async function checkOnboardingStatus() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("has_completed_onboarding")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setHasCompletedOnboarding(data.has_completed_onboarding);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    }

    checkOnboardingStatus();
  }, [user]);

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({ has_completed_onboarding: true })
        .eq("id", user.id);

      if (error) throw error;
      setHasCompletedOnboarding(true);
      navigate("/generator");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  return {
    hasCompletedOnboarding,
    completeOnboarding,
  };
} 