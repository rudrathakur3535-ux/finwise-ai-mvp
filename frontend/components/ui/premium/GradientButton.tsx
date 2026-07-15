import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface GradientButtonProps {
  variant?: "primary" | "outline" | "ghost";
  gradient?: "theme" | "blue" | "purple" | "green" | "amber" | "indigo" | "teal" | "maroon";
  children: ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function GradientButton({ 
  variant = "primary", 
  gradient = "theme", 
  children, 
  loading = false, 
  onClick, 
  className = "",
  type = "button",
  disabled = false
}: GradientButtonProps) {
  
  const baseStyle = "relative overflow-hidden font-bold rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-10";
  
  const gradientClass = gradient === "theme" ? "grad-theme" : `grad-${gradient}`;
  const textGradientClass = gradient === "theme" ? "grad-text-theme" : `grad-text-${gradient}`;

  if (variant === "outline") {
    return (
      <motion.button
        type={type}
        whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseStyle} glass-card border-[1px] hover:border-[var(--theme-accent)] px-6 py-3 ${className}`}
        style={{
          boxShadow: !disabled && !loading ? 'var(--theme-accent-glow)' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <span className={`${textGradientClass}`}>
          {loading ? (
            <span className="flex items-center text-gray-300">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-gray-400" /> Please wait...
            </span>
          ) : (
            children
          )}
        </span>
      </motion.button>
    );
  }

  if (variant === "ghost") {
    return (
      <motion.button
        type={type}
        whileHover={!disabled && !loading ? { backgroundColor: "rgba(255,255,255,0.05)" } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseStyle} px-6 py-3 text-gray-300 hover:text-white ${className}`}
      >
        {loading ? (
          <span className="flex items-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Please wait...
          </span>
        ) : (
          <span className={`${textGradientClass} hover:brightness-125 transition-all`}>
            {children}
          </span>
        )}
      </motion.button>
    );
  }

  // Primary
  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02, filter: "brightness(1.15)" } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${gradientClass} text-white px-6 py-3 border border-white/10 ${className}`}
      style={{
        boxShadow: !disabled && !loading ? 'var(--theme-accent-glow)' : 'none',
      }}
    >
      {loading ? (
        <span className="flex items-center">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Please wait...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
