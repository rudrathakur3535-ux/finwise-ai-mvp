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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Review Your Profile</h2>
        <p className="text-[#64748B] mt-2">Almost there! Check if everything looks correct.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div>
            <p className="text-sm text-[#64748B] mb-1">Full Name</p>
            <p className="font-medium text-[#0F172A]">{data.name}</p>
          </div>
          <div>
            <p className="text-sm text-[#64748B] mb-1">Age</p>
            <p className="font-medium text-[#0F172A]">{data.age} years</p>
          </div>
          <div>
            <p className="text-sm text-[#64748B] mb-1">City</p>
            <p className="font-medium text-[#0F172A]">{data.city || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-[#64748B] mb-1">Monthly Income</p>
            <p className="font-medium text-[#0F172A]">₹{data.monthly_income.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-[#64748B] mb-1">Monthly Savings</p>
            <p className="font-medium text-[#0F172A]">₹{data.monthly_savings.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-[#64748B] mb-1">Existing Inv.</p>
            <p className="font-medium text-[#0F172A]">₹{data.existing_amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-[#64748B] mb-1">Primary Goal</p>
            <p className="font-medium text-[#0F172A]">{data.goal}</p>
          </div>
          <div>
            <p className="text-sm text-[#64748B] mb-1">Time Horizon</p>
            <p className="font-medium text-[#0F172A]">{data.horizon_years} years</p>
          </div>
        </div>

        <div className="pt-5 mt-5 border-t border-[#E2E8F0]">
          <p className="text-sm text-[#64748B] mb-2">Calculated Risk Appetite</p>
          <div className="flex items-center space-x-2 bg-[#7C3AED]/10 border border-[#7C3AED]/20 p-3 rounded-xl w-max">
            <CheckCircle2 className="w-5 h-5 text-[#7C3AED]" />
            <span className="font-bold text-lg text-[#7C3AED] capitalize">{data.risk_appetite}</span>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="text-[#64748B] hover:text-[#0F172A] font-medium px-4 py-2 disabled:opacity-50 flex items-center transition-colors"
        >
          <Pencil className="mr-2 w-4 h-4" /> Edit Details
        </button>
        <motion.button
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all disabled:opacity-80 disabled:cursor-wait flex items-center"
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              Analyzing Profile...
            </span>
          ) : (
            <>Generate Investment Plan <Sparkles className="ml-2 w-5 h-5" /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}
