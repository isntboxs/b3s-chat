"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { AnimatePresence, motion } from "framer-motion";

const GREETINGS = [
  "Welcome back, {name}",
  "How can I help you today, {name}?",
  "Ready to explore new ideas, {name}?",
  "Let's create something amazing, {name}",
  "What's on your mind, {name}?",
];

export function ChatGreeting() {
  const { user } = useAuth();
  const [index, setIndex] = useState(0);

  // Get user name or default to "Guest"
  const defaultName = "Guest";
  const name = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ')[0] // First name only
    : user?.email?.split('@')[0] || defaultName;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 7000); // Change every 7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 relative min-w-[300px] flex justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="absolute text-muted-foreground text-sm"
        >
          {GREETINGS[index].replace("{name}", name)}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
