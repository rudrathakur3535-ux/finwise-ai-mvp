"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PortfolioAllocation } from "../../lib/types";

interface Props {
  allocation: PortfolioAllocation;
}

export function AllocationChart({ allocation }: Props) {
  // Convert detail dict to array for Recharts
  const data = Object.entries(allocation.detail)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value
    }))
    .sort((a, b) => b.value - a.value);

  // Modern financial color palette
  const COLORS = [
    '#2563eb', // blue-600
    '#3b82f6', // blue-500
    '#60a5fa', // blue-400
    '#10b981', // emerald-500
    '#34d399', // emerald-400
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-blue-600 font-bold">{payload[0].value}% Allocation</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Allocation</h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-around border-t border-gray-100 pt-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Equity</p>
          <p className="font-bold text-lg text-gray-900">{allocation.equity_percent}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Debt/Safe</p>
          <p className="font-bold text-lg text-gray-900">{allocation.safe_percent}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Gold</p>
          <p className="font-bold text-lg text-gray-900">{allocation.gold_percent}%</p>
        </div>
      </div>
    </motion.div>
  );
}
