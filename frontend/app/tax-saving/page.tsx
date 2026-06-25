"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calculator, Sparkles, PiggyBank, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { TaxSavingSection } from "../../components/dashboard/TaxSavingSection";
import { PageHeader } from "../../components/ui/design-system/PageHeader";
import { PremiumInput } from "../../components/ui/design-system/PremiumInput";
import { PremiumButton } from "../../components/ui/design-system/PremiumButton";

export default function TaxSavingPage() {
  const router = useRouter();
  const [annualIncome, setAnnualIncome] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(annualIncome) > 0) {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center text-sm font-medium text-[#64748B] hover:text-[#0F172A] mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </button>
          <PageHeader 
            title="Tax Saving Planner"
            subtitle="Maximize your take-home salary with ELSS mutual funds under Section 80C."
            icon={<Calculator className="w-8 h-8" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm"
            >
              <h3 className="text-xl font-bold text-[#0F172A] mb-4">Your Income</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <PremiumInput
                    label="Annual Income (₹)"
                    type="number"
                    value={annualIncome}
                    onChange={(e) => {
                      setAnnualIncome(e.target.value);
                      setShowResults(false);
                    }}
                    placeholder="e.g. 1500000"
                    required
                  />
                </div>
                <PremiumButton type="submit" variant="primary" className="w-full">
                  Calculate Tax Savings
                </PremiumButton>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-amber-50 p-6 rounded-3xl border border-amber-200"
            >
              <div className="flex items-center space-x-3 mb-3">
                <ShieldAlert className="w-6 h-6 text-amber-600" />
                <h4 className="font-bold text-amber-900">Did you know?</h4>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed font-medium">
                You can save up to ₹46,800 in taxes every year by investing ₹1.5 Lakhs in ELSS Mutual Funds under Section 80C. Plus, it has the shortest lock-in period of just 3 years!
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                >
                  <div className="bg-emerald-50 p-5 rounded-full mb-5 border border-emerald-100">
                    <PiggyBank className="w-12 h-12 text-[#10B981]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Ready to save tax?</h3>
                  <p className="text-[#64748B] max-w-sm">
                    Enter your annual income on the left to see your tax bracket and how much you can save with AI-recommended ELSS funds.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Reuse the existing TaxSavingSection Component! */}
                  <div className="-mt-12">
                    <TaxSavingSection 
                      monthlyIncome={Number(annualIncome) / 12} 
                      userProfile={{ name: "User" }} // Dummy profile just for API call if needed
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
