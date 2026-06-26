import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  accentColor?: string;
  glowOnHover?: boolean;
}

export function PremiumCard({ 
  children, 
  className = "", 
  onClick, 
  accentColor,
  glowOnHover = true,
  ...props 
}: PremiumCardProps) {
  
  return (
    <motion.div 
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02, y: -5 } : glowOnHover ? { y: -5 } : {}}
      className={`bg-[rgba(17,24,39,0.4)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 transition-all relative overflow-hidden group ${onClick ? "cursor-pointer" : ""} ${className}`}
      {...props}
    >
      {/* Decorative top border if accentColor is provided */}
      {accentColor && (
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]" 
          style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} 
        />
      )}
      
      {/* Subtle hover glow */}
      {glowOnHover && (
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
          style={{ background: accentColor ? `radial-gradient(circle at center, ${accentColor}, transparent)` : 'radial-gradient(circle at center, white, transparent)' }}
        />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
