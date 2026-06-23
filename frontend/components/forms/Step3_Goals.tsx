"use client";

import { motion } from "framer-motion";
import { TrendingUp, Home, GraduationCap, Plane } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
        <p className="text-gray-500 mt-2">What are you investing for?</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Select your primary goal *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((g) => {
              const isSelected = data.goal === g.title;
              const Icon = g.icon;
              return (
                <div
                  key={g.id}
                  onClick={() => updateData({ goal: g.title })}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex items-start space-x-4
                    ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"}`}
                >
                  <div className={`p-2 rounded-full ${isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isSelected ? "text-blue-900" : "text-gray-900"}`}>{g.title}</h3>
                    <p className={`text-sm mt-1 ${isSelected ? "text-blue-700" : "text-gray-500"}`}>{g.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Investment Horizon *</label>
            <span className="text-blue-600 font-bold bg-blue-100 px-3 py-1 rounded-full text-sm">
              {data.horizon_years} {data.horizon_years === 1 ? 'Year' : 'Years'}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={data.horizon_years}
            onChange={(e) => updateData({ horizon_years: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
            <span>1 Year (Short)</span>
            <span>15 Years (Medium)</span>
            <span>30 Years (Long)</span>
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
}
