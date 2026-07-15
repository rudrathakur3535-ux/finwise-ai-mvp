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
      className="glass-card relative overflow-hidden h-full p-6"
    >
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-5">
          <div className="bg-[var(--theme-accent)]/10 p-2.5 rounded-xl border border-[var(--theme-accent)]/20">
            <Bot className="w-6 h-6 text-[var(--theme-accent)]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
              FinWise AI Insight
              <Sparkles className="w-4 h-4 ml-2 text-amber-400" />
            </h3>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <p className="text-[var(--text-primary)] text-lg leading-relaxed font-medium italic">
            "{advice}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
