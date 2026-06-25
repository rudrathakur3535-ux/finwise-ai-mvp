"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AdvisorResponse } from "../../lib/types";
import { RiskProfileCard } from "../../components/dashboard/RiskProfileCard";
import { AllocationChart } from "../../components/dashboard/AllocationChart";
import { FundCard } from "../../components/dashboard/FundCard";
import { ProjectionChart } from "../../components/dashboard/ProjectionChart";
import { AIAdviceCard } from "../../components/dashboard/AIAdviceCard";
import { WhatIfSimulator } from "../../components/dashboard/WhatIfSimulator";
import { TaxSavingSection } from "../../components/dashboard/TaxSavingSection";
import { SIPReminderCard } from "../../components/dashboard/SIPReminderCard";
import { ArrowLeft, Download, AlertTriangle, TrendingUp } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<AdvisorResponse | null>(null);

  useEffect(() => {
    // Load result from localStorage
    const stored = localStorage.getItem("finwise_result");
    if (!stored) {
      router.push("/"); // Redirect to home if no data
      return;
    }
    setData(JSON.parse(stored));
  }, [router]);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full shadow-[0_0_15px_rgba(0,208,156,0.5)]"></div>
    </div>
  );

  const { user_profile, risk_assessment, portfolio, recommended_funds, ai_advice } = data;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <button 
              onClick={() => router.push("/")}
              className="flex items-center text-sm font-medium text-[#64748B] hover:text-[#0F172A] mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Start Over
            </button>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Your Investment Plan
            </h1>
            <p className="text-[#64748B] mt-2 text-lg">Custom built for your <span className="font-semibold text-[#10B981]">{risk_assessment.category.toLowerCase()}</span> profile.</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="flex items-center justify-center space-x-2 bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-gray-50 hover:border-[#10B981]/50 font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button 
              className="flex items-center justify-center space-x-2 bg-[#10B981] hover:bg-[#059669] text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-all"
              onClick={() => {
                localStorage.setItem("finwise_draft_portfolio", JSON.stringify({
                  funds: recommended_funds,
                  risk_score: risk_assessment.score
                }));
                router.push("/portfolio");
              }}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Track Portfolio</span>
            </button>
          </div>
        </div>

        {/* Top Section: Risk Profile & AI Advice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RiskProfileCard risk={risk_assessment} />
          <AIAdviceCard advice={ai_advice} />
        </div>

        {/* Middle Section: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-1">
            <AllocationChart allocation={portfolio.allocation} />
          </div>
          <div className="lg:col-span-2">
            <ProjectionChart funds={recommended_funds} horizonYears={user_profile.horizon_years} />
          </div>
        </div>

        {/* Bottom Section: Recommended Funds */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4 sm:mb-0">Recommended Portfolio</h2>
            <div className="bg-emerald-50 text-[#10B981] border border-emerald-100 px-5 py-2 rounded-xl text-sm font-bold shadow-sm w-max">
              Total SIP: ₹{portfolio.total_sip.toLocaleString()}/mo
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended_funds.map((fund, index) => (
              <FundCard key={fund.scheme_code} fund={fund} index={index} userProfile={user_profile} />
            ))}
          </div>
        </div>

        {/* What If Simulator */}
        <div className="mb-6">
          <WhatIfSimulator 
            baseSip={portfolio.total_sip} 
            baseCorpus={portfolio.total_corpus} 
            horizonYears={user_profile.horizon_years} 
          />
        </div>

        {/* SIP Reminder System */}
        <SIPReminderCard 
          userName={(user_profile as any).name || "User"} 
          totalSip={portfolio.total_sip} 
          funds={recommended_funds.map(f => ({ fund_name: f.name, monthly_sip: f.monthly_sip }))}
        />

        {/* Tax Saving Section */}
        {user_profile.monthly_income * 12 > 500000 && (
          <TaxSavingSection 
            monthlyIncome={user_profile.monthly_income} 
            userProfile={user_profile} 
          />
        )}

        {/* Dynamic Risk Warning */}
        <div className={`border rounded-2xl p-6 flex items-start space-x-4 mt-12 ${
          risk_assessment.category.toLowerCase() === "aggressive" 
            ? "bg-rose-50 border-rose-200" 
            : risk_assessment.category.toLowerCase() === "conservative"
            ? "bg-blue-50 border-blue-200"
            : "bg-amber-50 border-amber-200"
        }`}>
          <AlertTriangle className={`w-7 h-7 flex-shrink-0 mt-0.5 ${
            risk_assessment.category.toLowerCase() === "aggressive" 
              ? "text-rose-500" 
              : risk_assessment.category.toLowerCase() === "conservative"
              ? "text-blue-500"
              : "text-amber-500"
          }`} />
          <div className="text-sm leading-relaxed text-[#64748B]">
            <p className={`font-bold mb-1.5 text-base ${
              risk_assessment.category.toLowerCase() === "aggressive" 
              ? "text-rose-700" 
              : risk_assessment.category.toLowerCase() === "conservative"
              ? "text-blue-700"
              : "text-amber-700"
            }`}>
              {risk_assessment.category.toLowerCase() === "aggressive" 
                ? "High Risk Warning" 
                : risk_assessment.category.toLowerCase() === "conservative"
                ? "Low Risk Notice"
                : "Moderate Risk Advisory"}
            </p>
            <p className="text-[#0F172A]">
              <strong>Mutual Fund investments are subject to market risks.</strong> 
              {" "}Please read all scheme related documents carefully before investing. 
              The projections shown above are based on historical performance and do not guarantee future returns.
              FinWise AI provides educational advice, not registered financial planning.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
