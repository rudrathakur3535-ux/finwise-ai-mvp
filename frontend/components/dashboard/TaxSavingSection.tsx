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
        console.warn("Backend unavailable, using mock data for tax saving.");
        const annualIncome = monthlyIncome * 12;
        let taxBracket = "0%";
        let taxSaved = 0;
        
        if (annualIncome > 1500000) {
          taxBracket = "30%";
          taxSaved = 46800;
        } else if (annualIncome > 1000000) {
          taxBracket = "20%";
          taxSaved = 31200;
        } else if (annualIncome > 500000) {
          taxBracket = "10%";
          taxSaved = 15600;
        } else {
          taxBracket = "0%";
          taxSaved = 0;
        }

        setData({
          tax_data: {
            tax_bracket: taxBracket,
            tax_saved: taxSaved,
          },
          recommended_elss: taxSaved > 0 ? [
            {
              name: "Mirae Asset Tax Saver Fund",
              category: "ELSS",
              rating: 5,
              sip_amount: 12500,
              historical_return_3yr: 22.4,
              ai_reason: "High quality large & midcap stocks focus. Best for tax saving under 80C."
            },
            {
              name: "Axis Long Term Equity Fund",
              category: "ELSS",
              rating: 4,
              sip_amount: 5000,
              historical_return_3yr: 16.8,
              ai_reason: "Stable growth with quality stocks."
            },
            {
              name: "Quant Tax Plan",
              category: "ELSS",
              rating: 5,
              sip_amount: 5000,
              historical_return_3yr: 28.5,
              ai_reason: "Aggressive quantitative model driven returns."
            }
          ] : []
        } as any);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTaxData();
  }, [monthlyIncome]);

  if (isLoading) {
    return (
      <div className="mt-12 bg-card rounded-3xl p-8 shadow-sm border border-border animate-pulse">
        <div className="h-8 bg-border rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-background rounded-xl border border-border"></div>)}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  if (data.tax_data.tax_saved === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2E8F0] text-center"
      >
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-full inline-block mb-4 text-[#10B981]">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#0F172A] mb-3">No Tax Liability! 🎉</h2>
        <p className="text-[#64748B] max-w-2xl mx-auto mb-6 leading-relaxed">
          Based on your income, you currently fall in the <span className="font-bold text-[#10B981]">0% tax bracket</span>. 
          You don't need to invest in ELSS mutual funds just for saving taxes right now. 
          Focus on building wealth through normal equity mutual funds which don't have a strict 3-year lock-in!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12 bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2E8F0]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] flex items-center mb-2">
            <span className="text-3xl mr-3">💰</span> Tax Saving Opportunity
          </h2>
          <p className="text-[#64748B]">
            Based on your income, you are in the <span className="font-bold text-[#10B981]">{data.tax_data.tax_bracket} tax bracket</span>.
          </p>
        </div>
        
        <div className="mt-5 md:mt-0 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex items-center space-x-4">
          <div className="bg-emerald-50 p-3 rounded-full text-[#10B981] shadow-sm border border-emerald-100">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#64748B] uppercase font-bold tracking-wider mb-1">You Can Save up to</p>
            <p className="text-xl font-bold text-[#10B981]">₹{data.tax_data.tax_saved.toLocaleString()} / year</p>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mb-8 text-[#0F172A] flex flex-col md:flex-row items-center justify-between">
        <div className="mb-5 md:mb-0 md:mr-6 flex-grow">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg text-[#10B981]">FinWise AI Advice</h3>
          </div>
          <p className="text-[#0F172A] text-sm leading-relaxed italic">"{data.ai_advice}"</p>
        </div>
        <div className="flex-shrink-0 bg-white border border-emerald-100 px-5 py-4 rounded-xl text-center shadow-sm w-full md:w-auto">
          <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-1.5">Recommended ELSS SIP</p>
          <p className="text-3xl font-bold text-[#10B981]">₹{data.tax_data.recommended_elss_sip.toLocaleString()}<span className="text-sm text-[#10B981]/70">/mo</span></p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start space-x-3 mb-8">
        <ShieldAlert className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-amber-800 text-sm mb-1">Mandatory 3-Year Lock-in</h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            ELSS funds have a strict 3-year lock-in period. You cannot withdraw this money before 3 years from the date of investment. However, this is the shortest lock-in among all 80C tax-saving options like PPF (15 yrs) or FD (5 yrs).
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-6">Top Recommended ELSS Funds</h3>
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
