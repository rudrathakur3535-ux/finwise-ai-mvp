"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Step4Props {
  data: { risk_appetite: "conservative" | "moderate" | "aggressive" | "" };
  updateData: (fields: Partial<{ risk_appetite: "conservative" | "moderate" | "aggressive" }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4_RiskQuiz({ data, updateData, onNext, onBack }: Step4Props) {
  const [answers, setAnswers] = useState<number[]>([-1, -1, -1]);

  const questions = [
    {
      q: "If your investment drops 20% in a month, what would you do?",
      options: [
        { text: "Sell everything immediately", score: 1 },
        { text: "Wait and watch", score: 2 },
        { text: "Buy more (invest on dips)", score: 3 },
      ]
    },
    {
      q: "What is your primary investment focus?",
      options: [
        { text: "Capital preservation (No losses)", score: 1 },
        { text: "Balanced growth and safety", score: 2 },
        { text: "Maximum growth, regardless of volatility", score: 3 },
      ]
    },
    {
      q: "How familiar are you with stock market investing?",
      options: [
        { text: "Beginner, I prefer FDs", score: 1 },
        { text: "Intermediate, I know Mutual Funds", score: 2 },
        { text: "Advanced, I understand market cycles", score: 3 },
      ]
    }
  ];

  // Auto-calculate risk appetite based on answers
  useEffect(() => {
    if (!answers.includes(-1)) {
      const totalScore = answers.reduce((sum, val) => sum + val, 0);
      let appetite: "conservative" | "moderate" | "aggressive" = "moderate";
      
      if (totalScore <= 4) appetite = "conservative";
      else if (totalScore <= 7) appetite = "moderate";
      else appetite = "aggressive";

      updateData({ risk_appetite: appetite });
    }
  }, [answers]);

  const handleSelect = (qIndex: number, score: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = score;
    setAnswers(newAnswers);
  };

  const isComplete = !answers.includes(-1);

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight mb-2">Risk Profile Quiz</h2>
        <p className="text-gray-400">Just 3 quick questions to understand your style.</p>
      </div>

      <div className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-[rgba(255,255,255,0.02)] p-6 rounded-3xl border border-[rgba(255,255,255,0.08)] shadow-inner">
            <h3 className="font-bold text-gray-200 mb-5 text-lg"><span className="text-purple-400">{qIndex + 1}.</span> {q.q}</h3>
            <div className="space-y-3">
              {q.options.map((opt, oIndex) => {
                const isSelected = answers[qIndex] === opt.score;
                return (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    key={oIndex}
                    onClick={() => handleSelect(qIndex, opt.score)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center space-x-4
                      ${isSelected 
                        ? "border-purple-500 bg-purple-500/20 text-purple-300 font-semibold shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                        : "border-[rgba(255,255,255,0.08)] hover:border-purple-500/50 text-gray-400 hover:bg-white/5"}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${isSelected ? "border-purple-500" : "border-gray-600"}`}
                    >
                      {isSelected && <motion.div layoutId={`quiz-dot-${qIndex}`} className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />}
                    </div>
                    <span>{opt.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {isComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-3xl mt-6 text-center shadow-inner"
        >
          <div className="text-gray-400 text-sm mb-2">Calculated Profile</div>
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 capitalize drop-shadow-md">
            {data.risk_appetite} Investor
          </div>
        </motion.div>
      )}

      <div className="pt-8 flex justify-between items-center border-t border-[rgba(255,255,255,0.08)] mt-8">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white font-medium px-4 py-3 mt-4 flex items-center transition-colors rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </button>
        <motion.button
          whileHover={isComplete ? { scale: 1.05 } : {}}
          whileTap={isComplete ? { scale: 0.95 } : {}}
          onClick={onNext}
          disabled={!isComplete}
          className="relative group bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-10 mt-4 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center border border-white/10"
        >
          <span className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <span className="relative z-10 flex items-center">
            Next Step <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </div>
    </div>
  );
}
