import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PremiumCard } from "./PremiumCard";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number; // percentage
  trendLabel?: string;
  accentColor: string;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, trend, trendLabel, accentColor, icon }: StatCardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;
  const isNeutral = trend === 0;

  return (
    <PremiumCard accentColor={accentColor} className="flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[13px] font-medium text-[#64748B]">{title}</span>
        {icon && <div className="text-[#64748B]">{icon}</div>}
      </div>
      <div className="mt-2">
        <h3 className="text-3xl font-bold text-[#0F172A]">{value}</h3>
        
        {trend !== undefined && (
          <div className="flex items-center mt-2 text-sm font-medium">
            {isPositive && (
              <span className="flex items-center text-[#10B981]">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{trend}%
              </span>
            )}
            {isNegative && (
              <span className="flex items-center text-[#EF4444]">
                <TrendingDown className="w-4 h-4 mr-1" />
                {trend}%
              </span>
            )}
            {isNeutral && (
              <span className="flex items-center text-[#64748B]">
                <Minus className="w-4 h-4 mr-1" />
                0%
              </span>
            )}
            {trendLabel && <span className="ml-1 text-[#64748B] font-normal">{trendLabel}</span>}
          </div>
        )}
      </div>
    </PremiumCard>
  );
}
