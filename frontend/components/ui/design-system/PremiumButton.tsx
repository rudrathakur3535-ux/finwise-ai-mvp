import React from "react";
import { Loader2 } from "lucide-react";

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  isLoading?: boolean;
  accentColor?: string;
  className?: string;
}

export function PremiumButton({ 
  children, 
  variant = "primary", 
  isLoading = false, 
  accentColor = "#2563EB", // Default Blue
  className = "",
  disabled,
  ...props 
}: PremiumButtonProps) {
  
  const baseClasses = "relative inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3 transition-all duration-150 ease-in-out hover:brightness-95 hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:pointer-events-none";
  
  let variantClasses = "";
  let customStyle = {};

  if (variant === "primary") {
    variantClasses = "text-white shadow-sm";
    customStyle = { backgroundColor: accentColor };
  } else if (variant === "secondary") {
    variantClasses = "bg-white text-gray-900 shadow-sm border border-[#E2E8F0] hover:border-gray-300";
    customStyle = { color: accentColor, borderColor: accentColor };
  } else if (variant === "ghost") {
    variantClasses = "bg-transparent hover:bg-gray-100/50";
    customStyle = { color: accentColor };
  } else if (variant === "danger") {
    variantClasses = "bg-[#EF4444] text-white shadow-sm hover:bg-[#DC2626]";
  }

  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={variant !== "danger" ? customStyle : {}}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
