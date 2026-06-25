import React from "react";

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  accentColor?: string;
}

export function PremiumCard({ children, className = "", onClick, accentColor }: PremiumCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={accentColor ? { borderTop: `4px solid ${accentColor}` } : {}}
    >
      {children}
    </div>
  );
}
