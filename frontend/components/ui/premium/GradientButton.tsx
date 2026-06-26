import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface GradientButtonProps {
  variant?: "primary" | "outline" | "ghost";
  gradient?: "blue" | "purple" | "green" | "amber" | "indigo";
  children: ReactNode;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function GradientButton({ 
  variant = "primary", 
  gradient = "blue", 
  children, 
  loading = false, 
  onClick, 
  className = "",
  type = "button",
  disabled = false
}: GradientButtonProps) {
  
  const baseStyle = "relative overflow-hidden font-bold rounded-[12px] transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const gradientMap = {
    blue: "from-blue-600 to-cyan-500",
    purple: "from-purple-600 to-pink-500",
    green: "from-emerald-500 to-cyan-500",
    amber: "from-amber-500 to-red-500",
    indigo: "from-indigo-600 to-purple-600",
  };

  const textGradientMap = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-emerald-600",
    amber: "text-amber-600",
    indigo: "text-indigo-600",
  };

  const selectedGradient = gradientMap[gradient];

  if (variant === "outline") {
    return (
      <motion.button
        type={type}
        whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseStyle} border-2 border-transparent bg-white shadow-sm hover:shadow-md px-6 py-3 ${className}`}
        style={{
          backgroundClip: "padding-box, border-box",
          backgroundImage: `linear-gradient(white, white), linear-gradient(135deg, var(--${gradient}), ${gradient === 'blue' ? 'var(--profile)' : 'var(--reminder)'})` // Approximate gradient borders
        }}
      >
        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${selectedGradient}`}>
          {loading ? (
            <span className="flex items-center text-gray-700">
              <Loader2 className="w-5 h-5 mr-2 animate-spin text-gray-500" /> Please wait...
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
        whileHover={!disabled && !loading ? { backgroundColor: "rgba(0,0,0,0.02)" } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseStyle} px-6 py-3 text-gray-700 hover:text-gray-900 ${className}`}
      >
        {loading ? (
          <span className="flex items-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Please wait...
          </span>
        ) : (
          <span className={`bg-clip-text text-transparent bg-gradient-to-r ${selectedGradient} hover:brightness-110`}>
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
      whileHover={!disabled && !loading ? { scale: 1.02, filter: "brightness(1.05)" } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} bg-gradient-to-r ${selectedGradient} text-white shadow-md hover:shadow-lg px-6 py-3 ${className}`}
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
