"use client";

import { motion } from "framer-motion";
import { IndianRupee, Wallet, PiggyBank } from "lucide-react";

interface Step2Props {
  data: { monthly_income: number; monthly_savings: number; existing_amount: number };
  updateData: (fields: Partial<{ monthly_income: number; monthly_savings: number; existing_amount: number }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2_Financial({ data, updateData, onNext, onBack }: Step2Props) {
  const isValid = data.monthly_income > 0 && data.monthly_savings >= 0 && data.monthly_savings <= data.monthly_income;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Financial Details</h2>
        <p className="text-gray-500 mt-2">Help us understand your current finances.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹) *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IndianRupee className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min={0}
              value={data.monthly_income || ""}
              onChange={(e) => updateData({ monthly_income: parseInt(e.target.value) || 0 })}
              className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-3 text-black"
              placeholder="e.g. 50000"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Savings/Investment Capacity (₹) *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Wallet className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min={0}
              max={data.monthly_income || 1000000}
              value={data.monthly_savings || ""}
              onChange={(e) => updateData({ monthly_savings: parseInt(e.target.value) || 0 })}
              className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-3 text-black"
              placeholder="e.g. 15000"
              required
            />
          </div>
          {data.monthly_savings > data.monthly_income && (
            <p className="text-red-500 text-xs mt-1">Savings cannot exceed your income.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Existing Investments (₹) (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PiggyBank className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min={0}
              value={data.existing_amount || ""}
              onChange={(e) => updateData({ existing_amount: parseInt(e.target.value) || 0 })}
              className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-3 text-black"
              placeholder="e.g. 100000"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
}
