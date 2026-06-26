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
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight mb-2">Your Goals</h2>
        <p className="text-gray-400">What are you investing for?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3 ml-1">Select your primary goal *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((g) => {
              const isSelected = data.goal === g.title;
              const Icon = g.icon;
              return (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={g.id}
                  onClick={() => updateData({ goal: g.title })}
                  className={`p-4 border rounded-2xl cursor-pointer transition-all duration-300 flex items-start space-x-4
                    ${isSelected 
                      ? "border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                      : "border-[rgba(255,255,255,0.1)] hover:border-purple-500/50 bg-[rgba(255,255,255,0.03)]"}`}
                >
                  <div className={`p-3 rounded-full transition-colors ${isSelected ? "bg-purple-500 text-white shadow-lg shadow-purple-500/40" : "bg-white/5 text-gray-400"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold transition-colors ${isSelected ? "text-purple-300" : "text-gray-200"}`}>{g.title}</h3>
                    <p className={`text-sm mt-1 transition-colors ${isSelected ? "text-purple-200/70" : "text-gray-500"}`}>{g.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="pt-8 pb-4">
          <div className="flex justify-between items-center mb-6">
            <label className="block text-sm font-semibold text-gray-300 ml-1">Investment Horizon *</label>
            <motion.span 
              key={data.horizon_years}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-white font-bold bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 rounded-full text-sm shadow-[0_0_15px_rgba(139,92,246,0.4)] border border-purple-500/30"
            >
              {data.horizon_years} {data.horizon_years === 1 ? 'Year' : 'Years'}
            </motion.span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={data.horizon_years}
            onChange={(e) => updateData({ horizon_years: parseInt(e.target.value) })}
            className="w-full h-3 bg-[rgba(255,255,255,0.1)] rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all shadow-inner"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-4 font-medium px-1">
            <span>1 Year (Short)</span>
            <span>15 Years (Medium)</span>
            <span>30 Years (Long)</span>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-between items-center border-t border-[rgba(255,255,255,0.08)]">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white font-medium px-4 py-3 mt-4 flex items-center transition-colors rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </button>
        <motion.button
          whileHover={isValid ? { scale: 1.05 } : {}}
          whileTap={isValid ? { scale: 0.95 } : {}}
          onClick={onNext}
          disabled={!isValid}
          className="relative group bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-10 mt-4 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center border border-white/10"
        >
          <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <span className="relative z-10 flex items-center">
            Next Step <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}
