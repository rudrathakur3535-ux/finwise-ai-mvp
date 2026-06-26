import React from "react";
import { Loader2 } from "lucide-react";
import { motion, HTMLMotionProps } from "framer-motion";

interface PremiumButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
  isLoading?: boolean;
  accentColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PremiumButton({ 
  children, 
  variant = "primary", 
  isLoading = false, 
  accentColor,
  className = "",
  disabled,
  ...props 
}: PremiumButtonProps) {
  
  const baseClasses = "relative inline-flex items-center justify-center font-bold rounded-xl px-6 py-3 transition-colors duration-200 overflow-hidden disabled:opacity-60 disabled:pointer-events-none group";
  
  let variantClasses = "";
  let customStyle: React.CSSProperties = {};

  if (variant === "primary") {
    variantClasses = "text-white shadow-lg border border-white/10";
    if (accentColor) {
      customStyle = { backgroundColor: accentColor };
    } else {
      variantClasses += " bg-gradient-to-r from-blue-600 to-cyan-500";
    }
  } else if (variant === "glass") {
    variantClasses = "bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10 shadow-lg";
  } else if (variant === "secondary") {
    variantClasses = "bg-transparent text-white border border-white/20 hover:bg-white/5";
  } else if (variant === "ghost") {
    variantClasses = "bg-transparent text-gray-300 hover:text-white hover:bg-white/5";
  } else if (variant === "danger") {
    variantClasses = "bg-red-500/80 text-white backdrop-blur-md hover:bg-red-500 border border-red-500/50";
  }

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={customStyle}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Glossy Overlay for primary variant */}
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      )}
      <div className="relative z-10 flex items-center justify-center w-full">
        {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
        {children}
      </div>
    </motion.button>
  );
}
