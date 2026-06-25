"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfileData } from "../../lib/types";
import { getInvestmentAdvice } from "../../lib/api";
import { StepIndicator } from "../../components/forms/StepIndicator";
import { Step1_BasicInfo } from "../../components/forms/Step1_BasicInfo";
import { Step2_Financial } from "../../components/forms/Step2_Financial";
import { Step3_Goals } from "../../components/forms/Step3_Goals";
import { Step4_RiskQuiz } from "../../components/forms/Step4_RiskQuiz";
import { Step5_Review } from "../../components/forms/Step5_Review";
import { LoadingAnimation } from "../../components/forms/LoadingAnimation";

import { AnimatePresence, motion } from "framer-motion";

export default function AdvisorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with empty defaults to prevent hydration mismatch
  const [formData, setFormData] = useState<UserProfileData>({
    name: "",
    age: 0,
    monthly_income: 0,
    monthly_savings: 0,
    risk_appetite: "moderate",
    goal: "",
    horizon_years: 10,
    existing_amount: 0,
    city: "",
  });

  // Load initial data from sessionStorage after hydration
  useEffect(() => {
    const stored = sessionStorage.getItem("demoProfile");
    if (stored) {
      sessionStorage.removeItem("demoProfile");
      setFormData(JSON.parse(stored));
    }
  }, []);

  const updateData = (fields: Partial<UserProfileData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getInvestmentAdvice(formData);
      localStorage.setItem("finwise_result", JSON.stringify(result));
      router.push("/results");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  const direction = 1;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#E2E8F0] p-6 sm:p-10 overflow-hidden relative">
          
          <div className="relative z-10">
            {!isLoading && <StepIndicator currentStep={currentStep} totalSteps={5} />}

            {error && (
              <div className="mb-6 bg-danger/10 text-danger p-4 rounded-xl border border-danger/20 flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            {isLoading ? (
              <LoadingAnimation />
            ) : (
              <div className="mt-8 relative min-h-[400px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {currentStep === 1 && (
                      <Step1_BasicInfo data={formData} updateData={updateData} onNext={nextStep} />
                    )}
                    {currentStep === 2 && (
                      <Step2_Financial data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />
                    )}
                    {currentStep === 3 && (
                      <Step3_Goals data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />
                    )}
                    {currentStep === 4 && (
                      <Step4_RiskQuiz data={formData} updateData={updateData} onNext={nextStep} onBack={prevStep} />
                    )}
                    {currentStep === 5 && (
                      <Step5_Review data={formData} onBack={prevStep} onSubmit={handleSubmit} isLoading={isLoading} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
