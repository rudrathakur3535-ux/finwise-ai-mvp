"use client";

import { IndianRupee, Wallet, PiggyBank, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Step2Props {
  data: { monthly_income: number; monthly_savings: number; existing_amount: number };
  updateData: (fields: Partial<{ monthly_income: number; monthly_savings: number; existing_amount: number }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2_Financial({ data, updateData, onNext, onBack }: Step2Props) {
  const isValid = data.monthly_income > 0 && data.monthly_savings >= 0 && data.monthly_savings <= data.monthly_income;

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight mb-2">Financial Details</h2>
        <p className="text-gray-400">Help us understand your current finances to calculate potential returns.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">Monthly Income (₹) *</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-400 text-gray-500">
              <IndianRupee className="h-5 w-5" />
            </div>
            <input
              type="number"
              min={0}
              value={data.monthly_income || ""}
              onChange={(e) => updateData({ monthly_income: parseInt(e.target.value) || 0 })}
              className="pl-12 block w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-[rgba(255,255,255,0.05)] py-4 text-white placeholder-gray-600 transition-all outline-none shadow-inner"
              placeholder="e.g. 50000"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">Monthly Savings/Investment Capacity (₹) *</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-400 text-gray-500">
              <Wallet className="h-5 w-5" />
            </div>
            <input
              type="number"
              min={0}
              max={data.monthly_income || 1000000}
              value={data.monthly_savings || ""}
              onChange={(e) => updateData({ monthly_savings: parseInt(e.target.value) || 0 })}
              className="pl-12 block w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-[rgba(255,255,255,0.05)] py-4 text-white placeholder-gray-600 transition-all outline-none shadow-inner"
              placeholder="e.g. 15000"
              required
            />
          </div>
          {data.monthly_savings > data.monthly_income && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-2 ml-1 flex items-center">
              <span className="mr-1">⚠️</span> Savings cannot exceed your income.
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">Existing Investments (₹) (Optional)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-400 text-gray-500">
              <PiggyBank className="h-5 w-5" />
            </div>
            <input
              type="number"
              min={0}
              value={data.existing_amount || ""}
              onChange={(e) => updateData({ existing_amount: parseInt(e.target.value) || 0 })}
              className="pl-12 block w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-[rgba(255,255,255,0.05)] py-4 text-white placeholder-gray-600 transition-all outline-none shadow-inner"
              placeholder="e.g. 100000"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white font-medium px-4 py-2 flex items-center transition-colors rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </button>
        <motion.button
          whileHover={isValid ? { scale: 1.05 } : {}}
          whileTap={isValid ? { scale: 0.95 } : {}}
          onClick={onNext}
          disabled={!isValid}
          className="relative group bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center border border-white/10"
        >
          <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <span className="relative z-10 flex items-center">
            Next Step <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}
