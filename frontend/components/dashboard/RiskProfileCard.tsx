"use client";

import { motion } from "framer-motion";
import { ShieldAlert, TrendingUp, Wallet } from "lucide-react";
import { RiskAssessment } from "../../lib/types";

interface Props {
  risk: RiskAssessment;
}

export function RiskProfileCard({ risk }: Props) {
  let accentColor = "bg-blue-500/10 border-blue-500/20 text-blue-400";
  let iconColor = "text-blue-400";
  
  if (risk.category.toLowerCase() === "aggressive") {
    accentColor = "bg-rose-500/10 border-rose-500/20 text-rose-400";
    iconColor = "text-rose-400";
  } else if (risk.category.toLowerCase() === "conservative") {
    accentColor = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    iconColor = "text-emerald-400";
  } else if (risk.category.toLowerCase() === "moderate" || risk.category.toLowerCase() === "moderate-aggressive") {
    accentColor = "bg-amber-500/10 border-amber-500/20 text-amber-400";
    iconColor = "text-amber-400";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6 border border-white/10 h-full"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider mb-1">
            Your Risk Profile
          </p>
          <div className="flex items-center space-x-3 mt-2">
            <span className="text-4xl">{risk.emoji}</span>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">{risk.category}</h2>
          </div>
          <p className="text-[var(--text-secondary)] mt-2 font-medium">{risk.tagline}</p>
        </div>
        <div className={`px-4 py-3 rounded-2xl border ${accentColor}`}>
          <p className="text-xs text-center font-bold uppercase tracking-wider opacity-80">Score</p>
          <p className="text-3xl font-bold text-center mt-1">{risk.score}<span className="text-sm opacity-60">/10</span></p>
        </div>
      </div>

      <div className={`mt-6 rounded-2xl p-4 border ${accentColor}`}>
        <p className="text-sm leading-relaxed font-medium">{risk.description}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-4 border border-white/10">
          <TrendingUp className={`w-6 h-6 ${iconColor}`} />
          <div className="text-xs">
            <p className="text-[var(--text-secondary)] font-medium">Strategy Focus</p>
            <p className="font-bold text-[var(--text-primary)] text-sm mt-0.5">
              {risk.category.toLowerCase().includes("aggressive") ? "High Growth" : risk.category.toLowerCase().includes("moderate") ? "Balanced Return" : "Capital Protection"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-4 border border-white/10">
          <ShieldAlert className={`w-6 h-6 ${iconColor}`} />
          <div className="text-xs">
            <p className="text-[var(--text-secondary)] font-medium">Volatility Tolerance</p>
            <p className="font-bold text-[var(--text-primary)] text-sm mt-0.5">
              {risk.category.toLowerCase().includes("aggressive") ? "High" : risk.category.toLowerCase().includes("moderate") ? "Medium" : "Low"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
