"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { RecommendedFund } from "../../lib/types";

interface Props {
  funds: RecommendedFund[];
  horizonYears: number;
}

export function ProjectionChart({ funds, horizonYears }: Props) {
  // Calculate total final values
  let totalBase = 0;
  let totalOptimistic = 0;
  let totalPessimistic = 0;
  let totalInvested = 0;

  funds.forEach((f) => {
    totalBase += f.projection.base;
    totalOptimistic += f.projection.optimistic;
    totalPessimistic += f.projection.pessimistic;
    totalInvested += f.projection.total_invested;
  });

  // Generate curve data points (0 to horizonYears)
  const data = [];
  for (let year = 0; year <= horizonYears; year += Math.max(1, Math.floor(horizonYears / 5))) {
    const ratio = year / horizonYears;
    // Simple exponential curve approximation for visual
    const curve = Math.pow(ratio, 1.5); 
    
    data.push({
      year: `Year ${year}`,
      Invested: Math.round(totalInvested * ratio),
      Expected: Math.round(totalBase * curve),
      Optimistic: Math.round(totalOptimistic * curve),
      Pessimistic: Math.round(totalPessimistic * curve),
    });
  }

  // Ensure last point is exactly horizonYears
  if (data[data.length - 1].year !== `Year ${horizonYears}`) {
    data.push({
      year: `Year ${horizonYears}`,
      Invested: totalInvested,
      Expected: totalBase,
      Optimistic: totalOptimistic,
      Pessimistic: totalPessimistic,
    });
  }

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Wealth Projection</h3>
          <p className="text-sm text-gray-500">Expected growth over {horizonYears} years</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Expected Corpus</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBase)}</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="Optimistic" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="Expected" stroke="#2563eb" strokeWidth={3} dot={true} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Pessimistic" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="Invested" stroke="#9ca3af" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
