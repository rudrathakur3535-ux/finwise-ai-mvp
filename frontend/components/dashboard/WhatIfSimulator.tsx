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
      className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl mt-8"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">What-If Simulator</h3>
          <p className="text-blue-100 text-sm">See how small changes impact your wealth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <label className="block text-sm font-medium mb-3">
            What if I save <span className="font-bold text-yellow-300">₹{extraSip.toLocaleString()}</span> more every month?
          </label>
          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            value={extraSip}
            onChange={(e) => setExtraSip(Number(e.target.value))}
            className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-yellow-400"
          />
          <div className="flex justify-between text-xs text-blue-200 mt-2">
            <span>+₹0</span>
            <span>+₹50k</span>
          </div>
        </div>

        <div className="bg-black/20 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Calculator className="w-20 h-20" />
          </div>
          
          <p className="text-blue-100 text-sm mb-1">New Expected Corpus in {horizonYears} Years</p>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {formatCurrency(newTotalCorpus)}
            </span>
            {extraSip > 0 && (
              <span className="text-sm font-bold text-green-300 mb-1 flex items-center">
                ( <ArrowRight className="w-3 h-3 mx-1" /> +{formatCurrency(extraCorpus)} )
              </span>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
            <span className="text-blue-200">New Total SIP</span>
            <span className="font-bold">₹{(baseSip + extraSip).toLocaleString()} /mo</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
