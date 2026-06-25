"use client";

import { motion } from "framer-motion";
import { User, Calendar, MapPin, ArrowRight } from "lucide-react";

interface Step1Props {
  data: { name: string; age: number; city?: string };
  updateData: (fields: Partial<{ name: string; age: number; city?: string }>) => void;
  onNext: () => void;
}

export function Step1_BasicInfo({ data, updateData, onNext }: Step1Props) {
  const isValid = data.name.trim().length > 0 && data.age >= 18 && data.age <= 80;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Tell us about yourself</h2>
        <p className="text-[#64748B] mt-2">Let's start with some basic information.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Full Name *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#64748B]" />
            </div>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="pl-11 block w-full bg-white border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED] py-3.5 text-[#0F172A] placeholder-[#A1A1AA] transition-all outline-none"
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">Age (18-80) *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-[#64748B]" />
            </div>
            <input
              type="number"
              min={18}
              max={80}
              value={data.age || ""}
              onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
              className="pl-11 block w-full bg-white border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED] py-3.5 text-[#0F172A] placeholder-[#A1A1AA] transition-all outline-none"
              placeholder="e.g. 24"
              required
            />
          </div>
          {data.age > 0 && (data.age < 18 || data.age > 80) && (
            <p className="text-[#EF4444] text-xs mt-2 flex items-center"><span className="mr-1">⚠️</span> Age must be between 18 and 80.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">City (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-[#64748B]" />
            </div>
            <input
              type="text"
              value={data.city || ""}
              onChange={(e) => updateData({ city: e.target.value })}
              className="pl-11 block w-full bg-white border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED] py-3.5 text-[#0F172A] placeholder-[#A1A1AA] transition-all outline-none"
              placeholder="e.g. Mumbai"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <motion.button
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
          onClick={onNext}
          disabled={!isValid}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3.5 px-8 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next Step
          <ArrowRight className="ml-2 w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
