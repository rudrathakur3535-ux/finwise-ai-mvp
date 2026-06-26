"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Pencil, Sparkles } from "lucide-react";
import { UserProfileData } from "../../lib/types";

interface Step5Props {
  data: UserProfileData;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function Step5_Review({ data, onBack, onSubmit, isLoading }: Step5Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight mb-2">Review Your Profile</h2>
        <p className="text-gray-400">Almost there! Check if everything looks correct before we analyze.</p>
      </div>

      <div className="bg-[rgba(255,255,255,0.02)] rounded-3xl p-6 md:p-8 border border-[rgba(255,255,255,0.08)] shadow-inner space-y-6">
        <div className="grid grid-cols-2 gap-y-8 gap-x-6">
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider mb-1 font-semibold">Full Name</p>
            <p className="font-bold text-lg text-white">{data.name}</p>
          </div>
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider mb-1 font-semibold">Age</p>
            <p className="font-bold text-lg text-white">{data.age} years</p>
          </div>
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider mb-1 font-semibold">City</p>
            <p className="font-bold text-lg text-white">{data.city || "Not provided"}</p>
          </div>
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider mb-1 font-semibold">Monthly Income</p>
            <p className="font-bold text-lg text-white">₹{data.monthly_income.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider mb-1 font-semibold">Monthly Savings</p>
            <p className="font-bold text-lg text-white">₹{data.monthly_savings.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider mb-1 font-semibold">Existing Inv.</p>
            <p className="font-bold text-lg text-white">₹{data.existing_amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider mb-1 font-semibold">Primary Goal</p>
            <p className="font-bold text-lg text-white">{data.goal}</p>
          </div>
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider mb-1 font-semibold">Time Horizon</p>
            <p className="font-bold text-lg text-white">{data.horizon_years} years</p>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-[rgba(255,255,255,0.08)]">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Calculated Risk Appetite</p>
          <div className="flex items-center space-x-3 bg-purple-500/10 border border-purple-500/30 p-4 rounded-2xl w-max shadow-inner">
            <CheckCircle2 className="w-6 h-6 text-purple-400" />
            <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 capitalize drop-shadow-sm">{data.risk_appetite}</span>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-between items-center border-t border-[rgba(255,255,255,0.08)] mt-8">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="text-gray-400 hover:text-white font-medium px-4 py-3 mt-4 flex items-center transition-colors rounded-xl hover:bg-white/5 disabled:opacity-50"
        >
          <Pencil className="mr-2 w-4 h-4" /> Edit Details
        </button>
        <motion.button
          whileHover={!isLoading ? { scale: 1.05 } : {}}
          whileTap={!isLoading ? { scale: 0.95 } : {}}
          onClick={onSubmit}
          disabled={isLoading}
          className="relative group bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 mt-4 rounded-full shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all disabled:opacity-80 disabled:cursor-wait flex items-center border border-white/20"
        >
          {!isLoading && <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>}
          <span className="relative z-10 flex items-center text-lg">
            {isLoading ? (
              <>
                <span className="animate-spin mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Generating Magic...
              </>
            ) : (
              <>Generate Plan <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" /></>
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
