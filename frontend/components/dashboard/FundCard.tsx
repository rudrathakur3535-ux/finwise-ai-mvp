"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, TrendingUp, AlertTriangle, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";
import { RecommendedFund, UserProfileData } from "../../lib/types";
import { explainFund } from "../../lib/api";

interface Props {
  fund: RecommendedFund;
  index: number;
  userProfile: any;
}

export function FundCard({ fund, index, userProfile }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!isExpanded && !explanation) {
      setIsLoading(true);
      setIsExpanded(true);
      try {
        const result = await explainFund(fund.name, userProfile);
        setExplanation(result);
      } catch (err) {
        setExplanation("Gemini AI is currently busy. Please try again.");
      }
      setIsLoading(false);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card transition-all overflow-hidden flex flex-col h-full"
    >
      <div className="p-5 border-b border-white/10">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] bg-white/10 px-3 py-1 rounded-full border border-white/5">
            {fund.category}
          </span>
          <span className="text-xs font-medium text-[var(--text-secondary)] bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {fund.risk_level} Risk
          </span>
        </div>
        <h3 className="font-bold text-[var(--text-primary)] text-lg leading-tight mb-2">{fund.name}</h3>
        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{fund.description}</p>
      </div>

      <div className="p-5 flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">Recommended SIP</p>
            <p className="font-bold text-[var(--text-primary)] text-lg">₹{(fund.monthly_sip || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">Allocation</p>
            <p className="font-bold text-[var(--text-primary)] text-lg">{fund.allocated_percentage || 0}%</p>
          </div>
        </div>

        <div className="bg-[var(--theme-accent)]/10 rounded-xl p-3 flex items-center justify-between mb-3 border border-[var(--theme-accent)]/20">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[var(--theme-accent)]" />
            <span className="text-sm font-bold text-[var(--theme-accent)]">5Y Return</span>
          </div>
          <span className="font-bold text-[var(--theme-accent)]">{fund.returns?.["5y"] || fund.returns?.["3y"] || 0}% p.a.</span>
        </div>

        {fund.live_nav ? (
          <div className="bg-blue-500/10 rounded-xl p-3 flex items-center justify-between border border-blue-500/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span className="text-sm font-bold text-blue-400">Live NAV</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-blue-400">₹{fund.live_nav.toFixed(4)}</span>
              {fund.nav_date && <p className="text-[10px] text-blue-400/80 mt-0.5">As of {fund.nav_date}</p>}
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex justify-between text-xs text-[var(--text-secondary)] font-medium">
          <span className="flex items-center">
            <Info className="w-3.5 h-3.5 mr-1 text-[var(--text-muted)]" /> Exp: {fund.expense_ratio}%
          </span>
          <span>AUM: ₹{(fund.aum_cr || 0).toLocaleString()} Cr</span>
        </div>
      </div>

      {fund.warning && (
        <div className="bg-amber-500/10 p-4 border-t border-amber-500/20 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-400/90 leading-relaxed font-medium">{fund.warning}</p>
        </div>
      )}

      {/* AI Explanation Feature */}
      <div className="border-t border-white/10 p-3 bg-white/5">
        <button 
          onClick={handleExplain}
          className="w-full flex items-center justify-between text-sm font-bold text-[var(--text-primary)] hover:text-blue-400 transition-colors py-1"
        >
          <span className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-amber-400" /> 
            Why this fund?
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2">
                {isLoading ? (
                  <div className="flex items-center justify-center text-sm text-[var(--text-secondary)] py-2">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full mr-2"></div>
                    FinWise AI is analyzing...
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed italic bg-white/5 p-4 rounded-xl border border-white/10">
                    "{explanation}"
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
