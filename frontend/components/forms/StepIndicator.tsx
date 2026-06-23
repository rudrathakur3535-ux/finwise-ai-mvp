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
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-500 ease-in-out"
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
                  backgroundColor: isActive || isCompleted ? "#2563eb" : "#ffffff",
                  borderColor: isActive || isCompleted ? "#2563eb" : "#d1d5db",
                  color: isActive || isCompleted ? "#ffffff" : "#6b7280",
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-colors duration-300 shadow-sm
                  ${isActive ? 'ring-4 ring-blue-100' : ''}`}
              >
                {isCompleted ? <Check className="w-5 h-5 text-white" /> : stepNumber}
              </motion.div>
              <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors duration-300
                ${isActive ? 'text-blue-700' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
