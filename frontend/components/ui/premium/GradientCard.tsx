import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientCardProps {
  gradient?: "theme" | "blue" | "purple" | "green" | "amber" | "indigo" | "teal" | "maroon";
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GradientCard({ gradient = "theme", children, className = "", delay = 0 }: GradientCardProps) {
  // In the new dark system, we can rely heavily on the current page's theme,
  // but if a specific gradient is requested, we can apply specific border colors.
  
  const borderMap: Record<string, string> = {
    theme: "border-t-[var(--theme-accent)]",
    blue: "border-t-blue-500",
    purple: "border-t-purple-500",
    green: "border-t-emerald-500",
    amber: "border-t-amber-500",
    teal: "border-t-teal-500",
    maroon: "border-t-red-500",
    indigo: "border-t-indigo-500",
  };

  const selectedBorder = borderMap[gradient] || borderMap.theme;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ 
        y: -4, 
        boxShadow: gradient === "theme" ? "var(--theme-accent-glow)" : "0 0 20px rgba(255,255,255,0.1)"
      }}
      className={`glass-card p-6 border-t-[3px] transition-all duration-300 ${className}`}
      style={{
        borderTopColor: gradient === "theme" ? "var(--theme-accent)" : undefined
      }}
    >
      {children}
    </motion.div>
  );
}
