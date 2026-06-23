"use client";

import { useState } from "react";
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

export default function AdvisorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data from sessionStorage if available (for the demo buttons)
  const [formData, setFormData] = useState<UserProfileData>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("demoProfile");
      if (stored) {
        sessionStorage.removeItem("demoProfile");
        return JSON.parse(stored);
      }
    }
    return {
      name: "",
      age: 0,
      monthly_income: 0,
      monthly_savings: 0,
      risk_appetite: "moderate", // default
      goal: "",
      horizon_years: 10, // default
      existing_amount: 0,
      city: "",
    };
  });

  const updateData = (fields: Partial<UserProfileData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the API
      const result = await getInvestmentAdvice(formData);
      
      // Store result in localStorage for the results page
      localStorage.setItem("finwise_result", JSON.stringify(result));
      
      // Redirect to results
      router.push("/results");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 overflow-hidden">
          
          {!isLoading && <StepIndicator currentStep={currentStep} totalSteps={5} />}

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {isLoading ? (
            <LoadingAnimation />
          ) : (
            <div className="mt-8">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
