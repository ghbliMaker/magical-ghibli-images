
import React from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";

type AnimatedButtonProps = ButtonProps & {
  children: React.ReactNode;
};

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Button ref={ref} className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  )
);

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;
