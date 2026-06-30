import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { SectionHeader } from "./ui/premium/SectionHeader";

export function ComparisonTable() {
  const comparisonData = [
    { feature: "Cost", traditional: "₹10,000-50,000", finwise: "Free" },
    { feature: "Time", traditional: "3-5 days", finwise: "2 minutes" },
    { feature: "Bias", traditional: "Commission-driven", finwise: "None (No transactions)" },
    { feature: "ML-Powered", traditional: "No", finwise: "Yes (3 models)" },
    { feature: "Available", traditional: "Office hours", finwise: "24/7" },
    { feature: "Language", traditional: "English only", finwise: "Hindi + English" }
  ];

  return (
    <section>
      <SectionHeader 
        badge="Comparison" 
        accent="blue" 
        title="FinWise AI vs Traditional Advisor" 
        subtitle="See why thousands are switching to AI-powered financial planning." 
      />
      
      <div className="max-w-4xl mx-auto mt-12 bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 p-6 text-center">
          <div className="text-left font-bold text-gray-500 uppercase tracking-wider text-sm">Feature</div>
          <div className="font-bold text-gray-500 uppercase tracking-wider text-sm">Traditional</div>
          <div className="font-extrabold text-blue-600 uppercase tracking-wider text-sm">FinWise AI</div>
        </div>
        
        {comparisonData.map((row, index) => (
          <div key={index} className="grid grid-cols-3 p-6 border-b border-gray-50 items-center text-center hover:bg-blue-50/30 transition-colors">
            <div className="text-left font-bold text-gray-900">{row.feature}</div>
            <div className="text-gray-500 font-medium flex flex-col items-center justify-center gap-1">
              {(row.traditional === "No" || row.traditional.includes("Commission-driven") || row.traditional.includes("10,000")) ? (
                <XCircle className="w-5 h-5 text-red-400 mb-1" />
              ) : null}
              {row.traditional}
            </div>
            <div className="text-blue-900 font-bold flex flex-col items-center justify-center gap-1 bg-blue-50/50 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
              {row.finwise}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
