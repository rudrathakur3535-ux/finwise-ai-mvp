import { ReactNode } from "react";

interface GlowBadgeProps {
  text: string;
  color?: "blue" | "purple" | "green" | "amber" | "indigo" | "gray";
  icon?: ReactNode;
  className?: string;
}

export function GlowBadge({ text, color = "blue", icon, className = "" }: GlowBadgeProps) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-200/50 shadow-[0_0_12px_rgba(37,99,235,0.12)]",
    purple: "bg-purple-50 text-purple-700 border-purple-200/50 shadow-[0_0_12px_rgba(124,58,237,0.12)]",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200/50 shadow-[0_0_12px_rgba(16,185,129,0.12)]",
    amber: "bg-amber-50 text-amber-700 border-amber-200/50 shadow-[0_0_12px_rgba(245,158,11,0.12)]",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/50 shadow-[0_0_12px_rgba(79,70,229,0.12)]",
    gray: "bg-gray-100 text-gray-700 border-gray-200/50 shadow-sm",
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all ${colorStyles[color]} ${className}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {text}
    </div>
  );
}
