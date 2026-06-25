"use client";

import { TrendingUp, Home, GraduationCap, Plane, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Step3Props {
  data: { goal: string; horizon_years: number };
  updateData: (fields: Partial<{ goal: string; horizon_years: number }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3_Goals({ data, updateData, onNext, onBack }: Step3Props) {
  const goals = [
    { id: "wealth", title: "Wealth Creation", icon: TrendingUp, desc: "Grow money over time" },
    { id: "home", title: "Home Purchase", icon: Home, desc: "Save for down payment" },
    { id: "education", title: "Child Education", icon: GraduationCap, desc: "Fund higher studies" },
    { id: "retirement", title: "Retirement", icon: Plane, desc: "Financial independence" },
  ];

  const isValid = data.goal !== "" && data.horizon_years >= 1 && data.horizon_years <= 30;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Your Goals</h2>
        <p className="text-[#64748B] mt-2">What are you investing for?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-3">Select your primary goal *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((g) => {
              const isSelected = data.goal === g.title;
              const Icon = g.icon;
              return (
                <div
                  key={g.id}
                  onClick={() => updateData({ goal: g.title })}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex items-start space-x-4
                    ${isSelected ? "border-[#7C3AED] bg-[#7C3AED]/10" : "border-[#E2E8F0] hover:border-[#7C3AED]/40 bg-white"}`}
                >
                  <div className={`p-2 rounded-full ${isSelected ? "bg-[#7C3AED]/20 text-[#7C3AED]" : "bg-gray-100 text-[#64748B]"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${isSelected ? "text-[#7C3AED]" : "text-[#0F172A]"}`}>{g.title}</h3>
                    <p className={`text-sm mt-1 ${isSelected ? "text-[#7C3AED]/80" : "text-[#64748B]"}`}>{g.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-semibold text-[#0F172A]">Investment Horizon *</label>
            <span className="text-white font-bold bg-[#7C3AED] px-4 py-1.5 rounded-full text-sm shadow-sm">
              {data.horizon_years} {data.horizon_years === 1 ? 'Year' : 'Years'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={data.horizon_years}
            onChange={(e) => updateData({ horizon_years: parseInt(e.target.value) })}
            className="w-full h-2.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
          />
          <div className="flex justify-between text-xs text-[#64748B] mt-3 font-medium">
            <span>1 Year (Short)</span>
            <span>15 Years (Medium)</span>
            <span>30 Years (Long)</span>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-[#64748B] hover:text-[#0F172A] font-medium px-4 py-2 flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </button>
        <motion.button
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          onClick={onNext}
          disabled={!isValid}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3.5 px-8 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next Step <ArrowRight className="ml-2 w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
