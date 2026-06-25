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
    <div className="w-full mb-12">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#E2E8F0] rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#7C3AED] rounded-full z-0 transition-all duration-500 ease-in-out"
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
                  backgroundColor: isActive || isCompleted ? "#7C3AED" : "#FFFFFF",
                  borderColor: isActive || isCompleted ? "#7C3AED" : "#E2E8F0",
                  color: isActive || isCompleted ? "#FFFFFF" : "#64748B",
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-colors duration-300 shadow-sm
                  ${isActive ? 'ring-4 ring-[#7C3AED]/20' : ''}`}
              >
                {isCompleted ? <Check className="w-5 h-5 text-white font-bold" /> : stepNumber}
              </motion.div>
              <span className={`absolute -bottom-7 text-xs font-bold whitespace-nowrap transition-colors duration-300
                ${isActive ? 'text-[#7C3AED]' : isCompleted ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
