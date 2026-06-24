"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, PiggyBank, Sparkles, AlertTriangle } from "lucide-react";
import { FundCard } from "./FundCard";
import { getTaxSavingAdvice } from "../../lib/api";
import { TaxSavingResponse } from "../../lib/types";

interface Props {
  monthlyIncome: number;
  userProfile: any;
}

export function TaxSavingSection({ monthlyIncome, userProfile }: Props) {
  const [data, setData] = useState<TaxSavingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const result = await getTaxSavingAdvice(monthlyIncome);
        setData(result);
      } catch (err) {
        setError("Could not load tax saving advice. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTaxData();
  }, [monthlyIncome]);

  if (isLoading) {
    return (
      <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  if (error || !data || data.tax_data.tax_saved === 0) {
    // Return null if no tax saved or error
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12 bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-6 md:p-8 shadow-sm border border-indigo-100"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
            <span className="text-3xl mr-2">💰</span> Tax Saving Opportunity
          </h2>
          <p className="text-gray-600">
            Based on your income, you are in the <span className="font-bold text-indigo-700">{data.tax_data.tax_bracket} tax bracket</span>.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 bg-white p-4 rounded-xl shadow-sm border border-indigo-50 flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">You Can Save up to</p>
            <p className="text-xl font-bold text-green-600">₹{data.tax_data.tax_saved.toLocaleString()} / year</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-xl p-5 mb-8 text-white flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-6 flex-grow">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-lg">FinWise AI Advice</h3>
          </div>
          <p className="text-indigo-100 text-sm leading-relaxed italic">"{data.ai_advice}"</p>
        </div>
        <div className="flex-shrink-0 bg-white/20 px-4 py-3 rounded-lg text-center backdrop-blur-sm w-full md:w-auto">
          <p className="text-indigo-100 text-xs mb-1">Recommended ELSS SIP</p>
          <p className="text-2xl font-bold">₹{data.tax_data.recommended_elss_sip.toLocaleString()}/mo</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3 mb-6">
        <ShieldAlert className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-yellow-800 text-sm">Mandatory 3-Year Lock-in</h4>
          <p className="text-xs text-yellow-700 mt-1">
            ELSS funds have a strict 3-year lock-in period. You cannot withdraw this money before 3 years from the date of investment. However, this is the shortest lock-in among all 80C tax-saving options like PPF (15 yrs) or FD (5 yrs).
          </p>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4">Top Recommended ELSS Funds</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.recommended_funds.map((fund, index) => (
          <FundCard 
            key={fund.scheme_code} 
            fund={fund} 
            index={index} 
            userProfile={userProfile} 
          />
        ))}
      </div>
    </motion.div>
  );
}
