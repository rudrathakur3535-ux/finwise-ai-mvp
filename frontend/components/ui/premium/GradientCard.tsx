import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GradientCardProps {
  gradient: "blue" | "purple" | "green" | "amber" | "indigo";
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GradientCard({ gradient, children, className = "", delay = 0 }: GradientCardProps) {
  const shadowMap = {
    blue: "hover:shadow-[0_0_24px_rgba(37,99,235,0.15)]",
    purple: "hover:shadow-[0_0_24px_rgba(124,58,237,0.15)]",
    green: "hover:shadow-[0_0_24px_rgba(16,185,129,0.15)]",
    amber: "hover:shadow-[0_0_24px_rgba(245,158,11,0.15)]",
    indigo: "hover:shadow-[0_0_24px_rgba(79,70,229,0.15)]",
  };

  const borderMap = {
    blue: "border-t-blue-500",
    purple: "border-t-purple-500",
    green: "border-t-emerald-500",
    amber: "border-t-amber-500",
    indigo: "border-t-indigo-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 border-t-[3px] transition-all duration-300 ${borderMap[gradient]} ${shadowMap[gradient]} ${className}`}
    >
      {children}
    </motion.div>
  );
}
