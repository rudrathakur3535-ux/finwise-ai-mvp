import React from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  accentColor?: string;
}

export function PageHeader({ title, subtitle, actions, accentColor }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[rgba(255,255,255,0.08)] pb-6 mb-8 mt-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative pl-5"
      >
        {/* Accent left border decoration */}
        <div 
          className="absolute left-0 top-1 bottom-1 w-1.5 rounded-full" 
          style={{ 
            backgroundColor: accentColor || "#3B82F6", 
            boxShadow: accentColor ? `0 0 10px ${accentColor}` : "0 0 10px #3B82F6" 
          }}
        ></div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 mt-2 text-sm md:text-base font-medium">{subtitle}</p>
        )}
      </motion.div>
      {actions && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-6 md:mt-0 flex items-center space-x-3"
        >
          {actions}
        </motion.div>
      )}
    </div>
  );
}
