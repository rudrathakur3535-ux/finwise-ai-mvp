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
      className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full"
    >
      <div className="p-5 border-b border-[#E2E8F0] bg-white">
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A] bg-gray-100 px-3 py-1 rounded-full border border-[#E2E8F0]">
            {fund.category}
          </span>
          <span className="text-xs font-medium text-[#64748B] bg-gray-50 px-3 py-1 rounded-full border border-[#E2E8F0]">
            {fund.risk_level} Risk
          </span>
        </div>
        <h3 className="font-bold text-[#0F172A] text-lg leading-tight mb-2">{fund.name}</h3>
        <p className="text-sm text-[#64748B] line-clamp-2 leading-relaxed">{fund.description}</p>
      </div>

      <div className="p-5 flex-grow bg-white">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs text-[#64748B] mb-1 font-medium">Recommended SIP</p>
            <p className="font-bold text-[#0F172A] text-lg">₹{(fund.monthly_sip || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-[#64748B] mb-1 font-medium">Allocation</p>
            <p className="font-bold text-[#0F172A] text-lg">{fund.allocated_percentage || 0}%</p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-3 flex items-center justify-between mb-3 border border-emerald-100">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span className="text-sm font-bold text-[#10B981]">5Y Return</span>
          </div>
          <span className="font-bold text-[#10B981]">{fund.returns["5y"]}% p.a.</span>
        </div>

        {fund.live_nav ? (
          <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between border border-blue-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm font-bold text-blue-700">Live NAV</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-blue-700">₹{fund.live_nav.toFixed(4)}</span>
              {fund.nav_date && <p className="text-[10px] text-blue-600 mt-0.5">As of {fund.nav_date}</p>}
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex justify-between text-xs text-[#64748B] font-medium">
          <span className="flex items-center">
            <Info className="w-3.5 h-3.5 mr-1 text-[#A1A1AA]" /> Exp: {fund.expense_ratio}%
          </span>
          <span>AUM: ₹{(fund.aum_cr || 0).toLocaleString()} Cr</span>
        </div>
      </div>

      {fund.warning && (
        <div className="bg-amber-50 p-4 border-t border-amber-200 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed font-medium">{fund.warning}</p>
        </div>
      )}

      {/* AI Explanation Feature */}
      <div className="border-t border-[#E2E8F0] p-3 bg-gray-50">
        <button 
          onClick={handleExplain}
          className="w-full flex items-center justify-between text-sm font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors py-1"
        >
          <span className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-amber-500" /> 
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
                  <div className="flex items-center justify-center text-sm text-[#64748B] py-2">
                    <div className="animate-spin w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full mr-2"></div>
                    FinWise AI is analyzing...
                  </div>
                ) : (
                  <p className="text-sm text-[#0F172A] leading-relaxed italic bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
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
