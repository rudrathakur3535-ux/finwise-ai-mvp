"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calculator, Sparkles, PiggyBank, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { TaxSavingSection } from "../../components/dashboard/TaxSavingSection";
import { PageHeader } from "../../components/ui/design-system/PageHeader";
import { PremiumInput } from "../../components/ui/design-system/PremiumInput";
import { PremiumButton } from "../../components/ui/design-system/PremiumButton";
import ThemeProvider from "@/components/ui/ThemeProvider";

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
    <ThemeProvider theme="teal" className="min-h-screen">
      <div
        className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ background: "var(--theme-bg)" }}
      >
        <div className="max-w-5xl mx-auto space-y-8 mt-12 md:mt-16">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => router.back()}
              className="flex items-center text-sm font-medium hover:text-white mb-3 transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </button>
            <PageHeader
              title="Tax Saving Planner"
              subtitle="Maximize your take-home salary with ELSS mutual funds under Section 80C."
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] pointer-events-none"
                  style={{ background: "var(--theme-accent-light)" }}
                />
                <h3 className="text-xl font-bold text-white mb-6 flex items-center relative z-10">
                  <Calculator
                    className="w-5 h-5 mr-2"
                    style={{ color: "var(--theme-accent)" }}
                  />
                  Your Income
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div>
                    <PremiumInput
                      label="Annual Income (?)"
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
                  <PremiumButton type="submit" variant="primary" gradient="theme" className="w-full">
                    Calculate Tax Savings
                  </PremiumButton>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden"
                style={{ background: "rgba(245,158,11,0.05)" }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-[40px] pointer-events-none" />
                <div className="flex items-center space-x-3 mb-4 relative z-10">
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                  <h4 className="font-bold text-amber-300">Did you know?</h4>
                </div>
                <p
                  className="text-sm leading-relaxed font-medium relative z-10"
                  style={{ color: "var(--text-secondary)" }}
                >
                  You can save up to <strong className="text-white">?46,800</strong> in taxes every year by investing{" "}
                  <strong className="text-white">?1.5 Lakhs</strong> in ELSS Mutual Funds under Section 80C. Plus, it has
                  the shortest lock-in period of just 3 years!
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
                    className="glass-card backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px] relative overflow-hidden"
                  >
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
                      style={{ background: "var(--theme-accent-light)" }}
                    />
                    <div
                      className="p-5 rounded-full mb-6 border shadow-inner relative z-10"
                      style={{
                        background: "rgba(20,184,166,0.15)",
                        borderColor: "var(--theme-accent)",
                      }}
                    >
                      <PiggyBank
                        className="w-12 h-12"
                        style={{ color: "var(--theme-accent)" }}
                      />
                    </div>
                    <h3 className="text-3xl font-extrabold text-white mb-3 relative z-10 drop-shadow-md">
                      Ready to save tax?
                    </h3>
                    <p
                      className="max-w-sm text-lg relative z-10"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Enter your annual income on the left to see your tax bracket and how much you can save with
                      AI-recommended ELSS funds.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                  >
                    {/* Reuse the existing TaxSavingSection Component! */}
                    <div className="-mt-10 h-full">
                      <TaxSavingSection
                        monthlyIncome={Number(annualIncome) / 12}
                        userProfile={{ name: "User" }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
