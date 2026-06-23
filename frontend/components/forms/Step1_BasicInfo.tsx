"use client";

import { motion } from "framer-motion";
import { User, Calendar, MapPin } from "lucide-react";

interface Step1Props {
  data: { name: string; age: number; city: string };
  updateData: (fields: Partial<{ name: string; age: number; city: string }>) => void;
  onNext: () => void;
}

export function Step1_BasicInfo({ data, updateData, onNext }: Step1Props) {
  const isValid = data.name.trim().length > 0 && data.age >= 18 && data.age <= 80;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
        <p className="text-gray-500 mt-2">Let's start with some basic information.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-3 text-black"
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age (18-80) *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min={18}
              max={80}
              value={data.age || ""}
              onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
              className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-3 text-black"
              placeholder="e.g. 24"
              required
            />
          </div>
          {data.age > 0 && (data.age < 18 || data.age > 80) && (
            <p className="text-red-500 text-xs mt-1">Age must be between 18 and 80.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-3 text-black"
              placeholder="e.g. Mumbai"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
}
