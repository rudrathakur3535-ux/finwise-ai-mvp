"use client";

import { motion } from "framer-motion";
import { ShieldAlert, TrendingUp, Wallet } from "lucide-react";
import { RiskAssessment } from "../../lib/types";

interface Props {
  risk: RiskAssessment;
}

export function RiskProfileCard({ risk }: Props) {
  // Determine gradient based on risk category
  let gradient = "from-blue-500 to-indigo-600";
  if (risk.category.toLowerCase() === "aggressive") gradient = "from-red-500 to-orange-600";
  if (risk.category.toLowerCase() === "conservative") gradient = "from-emerald-500 to-teal-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 text-white shadow-xl`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">
            Your Risk Profile
          </p>
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{risk.emoji}</span>
            <h2 className="text-3xl font-bold">{risk.category}</h2>
          </div>
          <p className="text-white/90 mt-2 font-medium">{risk.tagline}</p>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
          <p className="text-sm text-white/80 text-center">Score</p>
          <p className="text-2xl font-bold text-center">{risk.score}<span className="text-sm">/10</span></p>
        </div>
      </div>

      <div className="mt-6 bg-black/10 rounded-2xl p-4 backdrop-blur-sm">
        <p className="text-sm leading-relaxed">{risk.description}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-3">
          <TrendingUp className="w-5 h-5 text-white/70" />
          <div className="text-xs">
            <p className="text-white/60">Strategy Focus</p>
            <p className="font-semibold">
              {risk.category === "Aggressive" ? "High Growth" : risk.category === "Moderate" ? "Balanced Return" : "Capital Protection"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-3">
          <ShieldAlert className="w-5 h-5 text-white/70" />
          <div className="text-xs">
            <p className="text-white/60">Volatility Tolerance</p>
            <p className="font-semibold">
              {risk.category === "Aggressive" ? "High" : risk.category === "Moderate" ? "Medium" : "Low"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
