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
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
    >
      <div className="p-5 border-b border-gray-50 bg-gray-50/50">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {fund.category}
          </span>
          <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
            {fund.risk_level} Risk
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{fund.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{fund.description}</p>
      </div>

      <div className="p-5 flex-grow">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Recommended SIP</p>
            <p className="font-bold text-gray-900">₹{(fund.monthly_sip || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Allocation</p>
            <p className="font-bold text-gray-900">{fund.allocated_percentage || 0}%</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3 flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">5Y Return</span>
          </div>
          <span className="font-bold text-green-700">{fund.returns["5y"]}% p.a.</span>
        </div>

        {fund.live_nav ? (
          <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-800">Live NAV</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-blue-700">₹{fund.live_nav.toFixed(4)}</span>
              {fund.nav_date && <p className="text-[10px] text-blue-500 mt-0.5">As of {fund.nav_date}</p>}
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <Info className="w-3 h-3 mr-1" /> Exp: {fund.expense_ratio}%
          </span>
          <span>AUM: ₹{(fund.aum_cr || 0).toLocaleString()} Cr</span>
        </div>
      </div>

      {fund.warning && (
        <div className="bg-amber-50 p-3 border-t border-amber-100 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">{fund.warning}</p>
        </div>
      )}

      {/* AI Explanation Feature */}
      <div className="border-t border-gray-100 p-3 bg-slate-50">
        <button 
          onClick={handleExplain}
          className="w-full flex items-center justify-between text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="flex items-center">
            <Sparkles className="w-4 h-4 mr-1 text-yellow-500" /> 
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
              <div className="pt-3 pb-1">
                {isLoading ? (
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                    Gemini AI is analyzing...
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed italic bg-blue-50 p-3 rounded-xl border border-blue-100">
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
