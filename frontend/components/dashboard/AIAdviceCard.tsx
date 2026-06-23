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
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/10">
            <Bot className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center">
              Gemini AI Advice
              <Sparkles className="w-4 h-4 ml-2 text-yellow-400" />
            </h3>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
          <p className="text-slate-200 text-lg leading-relaxed font-medium">
            "{advice}"
          </p>
        </div>
      </div>
    </motion.div>
  );
}
