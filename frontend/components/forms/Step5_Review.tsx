"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { UserProfileData } from "../../lib/types";

interface Step5Props {
  data: UserProfileData;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function Step5_Review({ data, onBack, onSubmit, isLoading }: Step5Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Profile</h2>
        <p className="text-gray-500 mt-2">Almost there! Check if everything looks correct.</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium text-gray-900">{data.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="font-medium text-gray-900">{data.age} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">City</p>
            <p className="font-medium text-gray-900">{data.city || "Not provided"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Income</p>
            <p className="font-medium text-gray-900">₹{data.monthly_income.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Savings</p>
            <p className="font-medium text-gray-900">₹{data.monthly_savings.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Existing Inv.</p>
            <p className="font-medium text-gray-900">₹{data.existing_amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Primary Goal</p>
            <p className="font-medium text-gray-900">{data.goal}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time Horizon</p>
            <p className="font-medium text-gray-900">{data.horizon_years} years</p>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">Calculated Risk Appetite</p>
          <div className="flex items-center space-x-2 mt-1">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-lg text-blue-900 capitalize">{data.risk_appetite}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-between items-center">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 disabled:opacity-50"
        >
          Edit Details
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? "Please wait..." : "Generate My Investment Plan ✨"}
        </button>
      </div>
    </motion.div>
  );
}
