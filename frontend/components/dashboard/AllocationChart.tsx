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

  // Modern premium financial color palette
  const COLORS = [
    'var(--theme-accent)', // primary (accent)
    '#059669', // darker emerald
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#F59E0B', // amber
    '#34D399', // light emerald
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a]/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/10">
          <p className="font-semibold text-[var(--text-primary)]">{payload[0].name}</p>
          <p className="text-[var(--theme-accent)] font-bold">{payload[0].value}% Allocation</p>
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
      className="glass-card p-6 h-full"
    >
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Portfolio Allocation</h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-around border-t border-white/10 pt-5">
        <div className="text-center">
          <p className="text-sm text-[var(--text-muted)] mb-1">Equity</p>
          <p className="font-bold text-lg text-[var(--text-primary)]">{allocation.equity_percent}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-[var(--text-muted)] mb-1">Debt/Safe</p>
          <p className="font-bold text-lg text-[var(--text-primary)]">{allocation.safe_percent}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-[var(--text-muted)] mb-1">Gold</p>
          <p className="font-bold text-lg text-[var(--text-primary)]">{allocation.gold_percent}%</p>
        </div>
      </div>
    </motion.div>
  );
}
