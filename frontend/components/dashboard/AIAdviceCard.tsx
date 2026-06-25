"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot } from "lucide-react";

interface Props {
  advice: string;
}

export function AIAdviceCard({ advice }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden h-full"
    >
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-5">
          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            <Bot className="w-6 h-6 text-[#10B981]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0F172A] flex items-center">
              FinWise AI Insight
              <Sparkles className="w-4 h-4 ml-2 text-amber-400" />
            </h3>
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0]">
          <p className="text-[#0F172A] text-lg leading-relaxed font-medium italic">
            "{advice}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
