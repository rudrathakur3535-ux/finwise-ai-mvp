"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { label: "Basic Info" },
    { label: "Financials" },
    { label: "Goals" },
    { label: "Risk Quiz" },
    { label: "Review" },
  ];

  return (
    <div className="w-full mb-16">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-white/10 rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-[var(--theme-accent)] rounded-full z-0 transition-all duration-700 ease-out shadow-[0_0_15px_var(--theme-accent)]"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive || isCompleted ? "var(--theme-accent)" : "rgba(255, 255, 255, 0.05)",
                  borderColor: isActive || isCompleted ? "var(--theme-accent)" : "rgba(255, 255, 255, 0.1)",
                  color: isActive || isCompleted ? "#FFFFFF" : "var(--text-muted)",
                  scale: isActive ? 1.1 : 1,
                  boxShadow: isActive ? "0 0 20px var(--theme-accent)" : "none"
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-colors duration-300 backdrop-blur-sm`}
              >
                {isCompleted ? <Check className="w-6 h-6 text-white font-bold" /> : stepNumber}
              </motion.div>
              <span className={`absolute -bottom-8 text-xs font-bold whitespace-nowrap transition-colors duration-300
                ${isActive ? 'text-[var(--theme-accent)] drop-shadow-[0_0_8px_var(--theme-accent)]' : isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
