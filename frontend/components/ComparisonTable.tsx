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
      
      <div className="max-w-4xl mx-auto mt-12 glass-card rounded-3xl border border-white/10 shadow-xl overflow-hidden">
        <div className="grid grid-cols-3 border-b border-white/10 p-6 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="text-left font-bold uppercase tracking-wider text-sm" style={{ color: 'var(--text-secondary)' }}>Feature</div>
          <div className="font-bold uppercase tracking-wider text-sm" style={{ color: 'var(--text-secondary)' }}>Traditional</div>
          <div className="font-extrabold uppercase tracking-wider text-sm" style={{ color: 'var(--theme-accent)' }}>FinWise AI</div>
        </div>
        
        {comparisonData.map((row, index) => (
          <div key={index} className="grid grid-cols-3 p-6 border-b border-white/10 items-center text-center hover:bg-white/5 transition-colors">
            <div className="text-left font-bold text-white">{row.feature}</div>
            <div className="font-medium flex flex-col items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              {(row.traditional === "No" || row.traditional.includes("Commission-driven") || row.traditional.includes("10,000")) ? (
                <XCircle className="w-5 h-5 text-red-400 mb-1" />
              ) : null}
              {row.traditional}
            </div>
            <div className="font-bold flex flex-col items-center justify-center gap-1 bg-blue-500/10 p-2 rounded-lg text-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1" />
              {row.finwise}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
