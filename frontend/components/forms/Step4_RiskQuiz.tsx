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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Risk Profile Quiz</h2>
        <p className="text-[#64748B] mt-2">Just 3 quick questions to understand your style.</p>
      </div>

      <div className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <h3 className="font-bold text-[#0F172A] mb-5">{qIndex + 1}. {q.q}</h3>
            <div className="space-y-3">
              {q.options.map((opt, oIndex) => {
                const isSelected = answers[qIndex] === opt.score;
                return (
                  <div
                    key={oIndex}
                    onClick={() => handleSelect(qIndex, opt.score)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-4
                      ${isSelected ? "border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED] font-semibold" : "border-[#E2E8F0] hover:border-[#7C3AED]/40 text-[#64748B] hover:bg-gray-50"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                      ${isSelected ? "border-[#7C3AED]" : "border-[#A1A1AA]"}`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 bg-[#7C3AED] rounded-full shadow-sm" />}
                    </div>
                    <span>{opt.text}</span>
                  </div>
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
          className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-[#64748B]">Analyzed Risk Profile:</p>
            <p className="font-bold text-[#7C3AED] capitalize">{data.risk_appetite} Investor</p>
          </div>
          <div className="text-3xl">
            {data.risk_appetite === "aggressive" ? "🔥" : data.risk_appetite === "moderate" ? "⚖️" : "🛡️"}
          </div>
        </motion.div>
      )}

      <div className="pt-8 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-[#64748B] hover:text-[#0F172A] font-medium px-4 py-2 flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </button>
        <motion.button
          whileHover={isComplete ? { scale: 1.02 } : {}}
          whileTap={isComplete ? { scale: 0.98 } : {}}
          onClick={onNext}
          disabled={!isComplete}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3.5 px-8 rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next Step <ArrowRight className="ml-2 w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
