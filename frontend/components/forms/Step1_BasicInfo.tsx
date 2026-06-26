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
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight mb-2">Tell us about yourself</h2>
        <p className="text-gray-400">Let's start with some basic information to personalize your AI profile.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">Full Name *</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-400 text-gray-500">
              <User className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="pl-12 block w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-[rgba(255,255,255,0.05)] py-4 text-white placeholder-gray-600 transition-all outline-none shadow-inner"
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">Age (18-80) *</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-400 text-gray-500">
              <Calendar className="h-5 w-5" />
            </div>
            <input
              type="number"
              min={18}
              max={80}
              value={data.age || ""}
              onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
              className="pl-12 block w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-[rgba(255,255,255,0.05)] py-4 text-white placeholder-gray-600 transition-all outline-none shadow-inner"
              placeholder="e.g. 24"
              required
            />
          </div>
          {data.age > 0 && (data.age < 18 || data.age > 80) && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-2 ml-1 flex items-center">
              <span className="mr-1">⚠️</span> Age must be between 18 and 80.
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">City (Optional)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-400 text-gray-500">
              <MapPin className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={data.city || ""}
              onChange={(e) => updateData({ city: e.target.value })}
              className="pl-12 block w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 focus:bg-[rgba(255,255,255,0.05)] py-4 text-white placeholder-gray-600 transition-all outline-none shadow-inner"
              placeholder="e.g. Mumbai"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <motion.button
          whileHover={isValid ? { scale: 1.05 } : {}}
          whileTap={isValid ? { scale: 0.95 } : {}}
          onClick={onNext}
          disabled={!isValid}
          className="relative group bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center border border-white/10"
        >
          <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <span className="relative z-10 flex items-center">
            Next Step
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}
