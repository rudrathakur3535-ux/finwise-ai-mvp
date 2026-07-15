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
      className="glass-card border border-white/10 rounded-3xl p-6 md:p-8 text-[var(--text-primary)] mt-8 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 bg-[var(--theme-accent)] h-full"></div>
      
      <div className="flex items-center space-x-4 mb-8">
        <div className="bg-[var(--theme-accent)]/10 p-3.5 rounded-2xl border border-[var(--theme-accent)]/20">
          <Calculator className="w-6 h-6 text-[var(--theme-accent)]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">What-If Simulator</h3>
          <p className="text-[var(--text-secondary)] mt-1">See how small changes impact your wealth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <label className="block text-sm font-semibold mb-4 text-[var(--text-primary)]">
            What if I save <span className="font-bold text-[var(--theme-accent)] text-base px-2 py-0.5 bg-[var(--theme-accent)]/10 rounded-md border border-[var(--theme-accent)]/20">₹{extraSip.toLocaleString()}</span> more every month?
          </label>
          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={extraSip}
            onChange={(e) => setExtraSip(Number(e.target.value))}
            className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--theme-accent)] outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/50"
          />
          <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-3 font-medium">
            <span>+₹0</span>
            <span>+₹50k</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Calculator className="w-32 h-32 text-[var(--theme-accent)]" />
          </div>
          
          <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider mb-2">New Expected Corpus in {horizonYears} Years</p>
          <div className="flex flex-col space-y-1 relative z-10">
            <span className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {formatCurrency(newTotalCorpus)}
            </span>
            {extraSip > 0 && (
              <span className="text-sm font-bold text-[var(--theme-accent)] flex items-center bg-[var(--theme-accent)]/10 w-max px-2 py-1 rounded-md mt-2 border border-[var(--theme-accent)]/20">
                <ArrowRight className="w-3.5 h-3.5 mr-1.5" /> +{formatCurrency(extraCorpus)}
              </span>
            )}
          </div>
          
          <div className="mt-5 pt-5 border-t border-white/10 flex justify-between items-center text-sm relative z-10">
            <span className="text-[var(--text-secondary)] font-medium">New Total SIP</span>
            <span className="font-bold text-[var(--text-primary)] bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">₹{(baseSip + extraSip).toLocaleString()} /mo</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
