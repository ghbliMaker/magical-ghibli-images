import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Sparkles, Heart, Leaf, Moon } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";

const steps = [
  {
    icon: Sparkles,
    title: "Create Magical Moments",
    description: "Transform your thoughts into serene, Ghibli-inspired artwork that brings peace to your day.",
  },
  {
    icon: Heart,
    title: "Find Your Calm",
    description: "Immerse yourself in a world of tranquility through our community's calming creations.",
  },
  {
    icon: Leaf,
    title: "Nature's Embrace",
    description: "Experience the healing power of nature through AI-generated landscapes and scenes.",
  },
  {
    icon: Moon,
    title: "Daily Serenity",
    description: "Make mindfulness a part of your daily routine with our calming image generation.",
  },
];

export function Onboarding() {
  const { completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = React.useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-display text-ghibli">Welcome to Ghibli</h1>
          <p className="text-muted-foreground text-lg">
            Your journey to serenity begins here
          </p>
        </motion.div>

        <div className="relative h-64">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: currentStep === index ? 1 : 0,
                x: currentStep === index ? 0 : 100,
              }}
              exit={{ opacity: 0, x: -100 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-ghibli/10 flex items-center justify-center">
                <step.icon className="w-8 h-8 text-ghibli" />
              </div>
              <h2 className="text-2xl font-display text-ghibli">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentStep === index ? "bg-ghibli" : "bg-ghibli/20"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="ghibli-button"
            onClick={nextStep}
          >
            {currentStep === steps.length - 1 ? "Start Creating" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
} 