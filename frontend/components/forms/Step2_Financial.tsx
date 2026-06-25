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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Financial Details</h2>
        <p className="text-[#64748B] mt-2">Help us understand your current finances.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Monthly Income (₹) *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IndianRupee className="h-5 w-5 text-[#64748B]" />
            </div>
            <input
              type="number"
              min={0}
              value={data.monthly_income || ""}
              onChange={(e) => updateData({ monthly_income: parseInt(e.target.value) || 0 })}
              className="pl-11 block w-full bg-white border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED] py-3.5 text-[#0F172A] placeholder-[#A1A1AA] transition-all outline-none"
              placeholder="e.g. 50000"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Monthly Savings/Investment Capacity (₹) *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Wallet className="h-5 w-5 text-[#64748B]" />
            </div>
            <input
              type="number"
              min={0}
              max={data.monthly_income || 1000000}
              value={data.monthly_savings || ""}
              onChange={(e) => updateData({ monthly_savings: parseInt(e.target.value) || 0 })}
              className="pl-11 block w-full bg-white border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED] py-3.5 text-[#0F172A] placeholder-[#A1A1AA] transition-all outline-none"
              placeholder="e.g. 15000"
              required
            />
          </div>
          {data.monthly_savings > data.monthly_income && (
            <p className="text-[#EF4444] text-xs mt-2 flex items-center"><span className="mr-1">⚠️</span> Savings cannot exceed your income.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Existing Investments (₹) (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <PiggyBank className="h-5 w-5 text-[#64748B]" />
            </div>
            <input
              type="number"
              min={0}
              value={data.existing_amount || ""}
              onChange={(e) => updateData({ existing_amount: parseInt(e.target.value) || 0 })}
              className="pl-11 block w-full bg-white border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED] py-3.5 text-[#0F172A] placeholder-[#A1A1AA] transition-all outline-none"
              placeholder="e.g. 100000"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-[#64748B] hover:text-[#0F172A] font-medium px-4 py-2 flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </button>
        <motion.button
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          onClick={onNext}
          disabled={!isValid}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3.5 px-8 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next Step <ArrowRight className="ml-2 w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
