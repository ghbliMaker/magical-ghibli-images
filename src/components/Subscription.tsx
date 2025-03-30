import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Check, Crown, Sparkles } from "lucide-react";
import { useStripe } from "@stripe/react-stripe-js";
import { useToast } from "./ui/use-toast";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "5 images per week",
      "Basic image generation",
      "Community access",
      "Standard support",
    ],
    buttonText: "Current Plan",
    disabled: true,
  },
  {
    name: "Premium",
    price: "$9.99",
    interval: "month",
    features: [
      "Unlimited images",
      "Advanced image generation",
      "Priority support",
      "Exclusive filters",
      "HD downloads",
      "Early access to features",
    ],
    priceId: "price_XXXXX", // Replace with your Stripe price ID
    buttonText: "Upgrade to Premium",
    disabled: false,
  },
];

export function Subscription() {
  const stripe = useStripe();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleSubscribe = async (priceId: string) => {
    if (!stripe) {
      toast({
        title: "Error",
        description: "Stripe is not initialized",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      const { sessionId } = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-display text-ghibli">Choose Your Journey</h1>
          <p className="text-muted-foreground text-lg">
            Select the plan that best fits your needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`ghibli-card p-8 space-y-6 ${
                plan.name === "Premium" ? "border-2 border-ghibli" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display text-ghibli">{plan.name}</h2>
                {plan.name === "Premium" && (
                  <Crown className="w-6 h-6 text-ghibli" />
                )}
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold">{plan.price}</div>
                {plan.interval && (
                  <div className="text-muted-foreground">per {plan.interval}</div>
                )}
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-ghibli" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.name === "Premium" ? "ghibli-button" : ""
                }`}
                disabled={plan.disabled || loading}
                onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  plan.buttonText
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 