"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrainCircuit, Search, PieChart, Sparkles } from "lucide-react";

export function LoadingAnimation() {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Analyzing your risk profile...", icon: BrainCircuit },
    { text: "Fetching best mutual funds...", icon: Search },
    { text: "Calculating your allocation...", icon: PieChart },
    { text: "Generating personalized plan...", icon: Sparkles },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000); // changes every 2 seconds

    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = steps[step].icon;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <motion.div
        key={step}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-24 h-24 bg-[var(--theme-accent)]/10 rounded-full flex items-center justify-center mb-8 relative"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-[var(--theme-accent)]/20 border-t-[var(--theme-accent)]"
        ></motion.div>
        <CurrentIcon className="w-10 h-10 text-[var(--theme-accent)]" />
      </motion.div>

      <div className="h-8 relative w-full flex justify-center">
        {steps.map((s, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: index === step ? 1 : 0, y: index === step ? 0 : -10 }}
            className="absolute font-medium text-lg text-[var(--text-primary)]"
          >
            {s.text}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
