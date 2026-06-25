"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, ArrowRight } from "lucide-react";

interface Props {
  baseSip: number;
  baseCorpus: number;
  horizonYears: number;
}

export function WhatIfSimulator({ baseSip, baseCorpus, horizonYears }: Props) {
  const [extraSip, setExtraSip] = useState(0);

  // Simplified projection: assuming average portfolio return of ~12%
  // Formula: A = P * (((1 + r)^n - 1) / r) * (1 + r)
  const calculateExtraCorpus = (monthlyAmount: number, years: number) => {
    const r = 0.12 / 12; // 12% annual return
    const n = years * 12;
    return monthlyAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  };

  const extraCorpus = calculateExtraCorpus(extraSip, horizonYears);
  const newTotalCorpus = baseCorpus + extraCorpus;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(val));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-8 text-[#0F172A] mt-8 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 bg-[#10B981] h-full"></div>
      
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
          <Calculator className="w-6 h-6 text-[#10B981]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">What-If Simulator</h3>
          <p className="text-[#64748B] mt-1">See how small changes impact your wealth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <label className="block text-sm font-semibold mb-4 text-[#0F172A]">
            What if I save <span className="font-bold text-[#10B981] text-base px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100">₹{extraSip.toLocaleString()}</span> more every month?
          </label>
          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={extraSip}
            onChange={(e) => setExtraSip(Number(e.target.value))}
            className="w-full h-2.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#10B981] outline-none focus:ring-2 focus:ring-[#10B981]/50"
          />
          <div className="flex justify-between text-xs text-[#64748B] mt-3 font-medium">
            <span>+₹0</span>
            <span>+₹50k</span>
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E2E8F0] relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Calculator className="w-32 h-32 text-[#10B981]" />
          </div>
          
          <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-2">New Expected Corpus in {horizonYears} Years</p>
          <div className="flex flex-col space-y-1 relative z-10">
            <span className="text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {formatCurrency(newTotalCorpus)}
            </span>
            {extraSip > 0 && (
              <span className="text-sm font-bold text-[#10B981] flex items-center bg-emerald-50 w-max px-2 py-1 rounded-md mt-2 border border-emerald-100">
                <ArrowRight className="w-3.5 h-3.5 mr-1.5" /> +{formatCurrency(extraCorpus)}
              </span>
            )}
          </div>
          
          <div className="mt-5 pt-5 border-t border-[#E2E8F0] flex justify-between items-center text-sm relative z-10">
            <span className="text-[#64748B] font-medium">New Total SIP</span>
            <span className="font-bold text-[#0F172A] bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0] shadow-sm">₹{(baseSip + extraSip).toLocaleString()} /mo</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
