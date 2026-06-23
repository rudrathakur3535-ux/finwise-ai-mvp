"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
        { text: "Sell everything immediately", score: 1 }, // conservative
        { text: "Wait and watch", score: 2 }, // moderate
        { text: "Buy more (invest on dips)", score: 3 }, // aggressive
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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Risk Profile Quiz</h2>
        <p className="text-gray-500 mt-2">Just 3 quick questions to understand your style.</p>
      </div>

      <div className="space-y-8">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">{qIndex + 1}. {q.q}</h3>
            <div className="space-y-3">
              {q.options.map((opt, oIndex) => {
                const isSelected = answers[qIndex] === opt.score;
                return (
                  <div
                    key={oIndex}
                    onClick={() => handleSelect(qIndex, opt.score)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center space-x-3
                      ${isSelected ? "border-blue-600 bg-blue-50 text-blue-900 font-medium" : "border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                      ${isSelected ? "border-blue-600" : "border-gray-300"}`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
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
          className="bg-blue-600 text-white p-4 rounded-xl text-center"
        >
          <p className="text-sm opacity-90">Calculated Risk Appetite</p>
          <h4 className="text-xl font-bold capitalize mt-1">
            {data.risk_appetite === "aggressive" ? "⚡ Aggressive" : 
             data.risk_appetite === "moderate" ? "⚖️ Moderate" : "🛡️ Conservative"}
          </h4>
        </motion.div>
      )}

      <div className="pt-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  );
}
