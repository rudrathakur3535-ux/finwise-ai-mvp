"use client";

import { motion } from "framer-motion";
import { ShieldAlert, TrendingUp, Wallet } from "lucide-react";
import { RiskAssessment } from "../../lib/types";

interface Props {
  risk: RiskAssessment;
}

export function RiskProfileCard({ risk }: Props) {
  let accentColor = "bg-blue-50 border-blue-200 text-blue-700";
  let iconColor = "text-blue-500";
  
  if (risk.category.toLowerCase() === "aggressive") {
    accentColor = "bg-rose-50 border-rose-200 text-rose-700";
    iconColor = "text-rose-500";
  } else if (risk.category.toLowerCase() === "conservative") {
    accentColor = "bg-emerald-50 border-emerald-200 text-emerald-700";
    iconColor = "text-emerald-500";
  } else if (risk.category.toLowerCase() === "moderate" || risk.category.toLowerCase() === "moderate-aggressive") {
    accentColor = "bg-amber-50 border-amber-200 text-amber-700";
    iconColor = "text-amber-500";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2E8F0] h-full"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1">
            Your Risk Profile
          </p>
          <div className="flex items-center space-x-3 mt-2">
            <span className="text-4xl">{risk.emoji}</span>
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">{risk.category}</h2>
          </div>
          <p className="text-[#64748B] mt-2 font-medium">{risk.tagline}</p>
        </div>
        <div className={`px-4 py-3 rounded-2xl border ${accentColor}`}>
          <p className="text-xs text-center font-bold uppercase tracking-wider opacity-80">Score</p>
          <p className="text-3xl font-bold text-center mt-1">{risk.score}<span className="text-sm opacity-60">/10</span></p>
        </div>
      </div>

      <div className={`mt-6 rounded-2xl p-4 border ${accentColor} bg-opacity-50`}>
        <p className="text-sm leading-relaxed font-medium">{risk.description}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3 bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
          <TrendingUp className={`w-6 h-6 ${iconColor}`} />
          <div className="text-xs">
            <p className="text-[#64748B] font-medium">Strategy Focus</p>
            <p className="font-bold text-[#0F172A] text-sm mt-0.5">
              {risk.category.toLowerCase().includes("aggressive") ? "High Growth" : risk.category.toLowerCase().includes("moderate") ? "Balanced Return" : "Capital Protection"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
          <ShieldAlert className={`w-6 h-6 ${iconColor}`} />
          <div className="text-xs">
            <p className="text-[#64748B] font-medium">Volatility Tolerance</p>
            <p className="font-bold text-[#0F172A] text-sm mt-0.5">
              {risk.category.toLowerCase().includes("aggressive") ? "High" : risk.category.toLowerCase().includes("moderate") ? "Medium" : "Low"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
