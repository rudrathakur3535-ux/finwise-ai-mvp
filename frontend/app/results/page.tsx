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
import { ArrowLeft, Download, AlertTriangle } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );

  const { user_profile, risk_assessment, portfolio, recommended_funds, ai_advice } = data;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <button 
              onClick={() => router.push("/")}
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Start Over
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Your Investment Plan
            </h1>
            <p className="text-gray-500 mt-1">Custom built for your {risk_assessment.category.toLowerCase()} profile.</p>
          </div>
          <button 
            className="flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-2 px-6 rounded-xl shadow-sm transition-colors"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Top Section: Risk Profile & AI Advice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RiskProfileCard risk={risk_assessment} />
          <AIAdviceCard advice={ai_advice} />
        </div>

        {/* Middle Section: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <AllocationChart allocation={portfolio.allocation} />
          </div>
          <div className="lg:col-span-2">
            <ProjectionChart funds={recommended_funds} horizonYears={user_profile.horizon_years} />
          </div>
        </div>

        {/* Bottom Section: Recommended Funds */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Portfolio</h2>
            <div className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-bold">
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

        {/* Dynamic Risk Warning */}
        <div className={`border rounded-2xl p-5 flex items-start space-x-3 mt-10 ${
          risk_assessment.category.toLowerCase() === "aggressive" 
            ? "bg-red-50 border-red-200" 
            : risk_assessment.category.toLowerCase() === "conservative"
            ? "bg-blue-50 border-blue-200"
            : "bg-amber-50 border-amber-200"
        }`}>
          <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
            risk_assessment.category.toLowerCase() === "aggressive" 
              ? "text-red-500" 
              : risk_assessment.category.toLowerCase() === "conservative"
              ? "text-blue-500"
              : "text-amber-500"
          }`} />
          <div className="text-sm leading-relaxed">
            <p className={`font-bold mb-1 ${
              risk_assessment.category.toLowerCase() === "aggressive" 
              ? "text-red-800" 
              : risk_assessment.category.toLowerCase() === "conservative"
              ? "text-blue-800"
              : "text-amber-800"
            }`}>
              {risk_assessment.category.toLowerCase() === "aggressive" 
                ? "High Risk Warning" 
                : risk_assessment.category.toLowerCase() === "conservative"
                ? "Low Risk Notice"
                : "Moderate Risk Advisory"}
            </p>
            <p className={
              risk_assessment.category.toLowerCase() === "aggressive" 
              ? "text-red-700" 
              : risk_assessment.category.toLowerCase() === "conservative"
              ? "text-blue-700"
              : "text-amber-700"
            }>
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
