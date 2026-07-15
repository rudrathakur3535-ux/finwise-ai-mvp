import { ReactNode } from "react";

interface GlowBadgeProps {
  text: string;
  color?: "theme" | "blue" | "purple" | "green" | "amber" | "indigo" | "gray";
  icon?: ReactNode;
  className?: string;
}

export function GlowBadge({ text, color = "theme", icon, className = "" }: GlowBadgeProps) {
  const colorStyles: Record<string, string> = {
    theme: "bg-[var(--theme-accent-muted)] text-[var(--theme-accent-light)] border-[var(--theme-accent)] shadow-[var(--theme-accent-glow)]",
    blue: "bg-blue-900/30 text-blue-300 border-blue-500/50 shadow-[0_0_12px_rgba(37,99,235,0.2)]",
    purple: "bg-purple-900/30 text-purple-300 border-purple-500/50 shadow-[0_0_12px_rgba(124,58,237,0.2)]",
    green: "bg-emerald-900/30 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    amber: "bg-amber-900/30 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
    indigo: "bg-indigo-900/30 text-indigo-300 border-indigo-500/50 shadow-[0_0_12px_rgba(79,70,229,0.2)]",
    gray: "bg-gray-800/50 text-gray-300 border-gray-600/50 shadow-sm",
  };

  const selectedStyle = colorStyles[color] || colorStyles.theme;

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all ${selectedStyle} ${className}`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {text}
    </div>
  );
}
