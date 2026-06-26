import React, { forwardRef } from "react";

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  accentColor?: string;
}

export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ label, error, helperText, iconLeft, iconRight, accentColor = "#3B82F6", className = "", ...props }, ref) => {
    return (
      <div className={`flex flex-col space-y-1.5 ${className}`}>
        {label && (
          <label className="text-sm font-semibold text-white ml-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconLeft && (
            <div className="absolute left-4 text-gray-400 pointer-events-none">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white rounded-xl px-4 py-3.5 
              focus:outline-none focus:ring-1 focus:bg-[rgba(255,255,255,0.08)] transition-all placeholder:text-gray-500 shadow-inner
              ${iconLeft ? "pl-12" : ""}
              ${iconRight ? "pr-12" : ""}
              ${error ? "border-red-500 focus:ring-red-500" : "focus:border-[var(--focus-color)] focus:ring-[var(--focus-color)]"}
            `}
            style={{ "--focus-color": accentColor } as any}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-4 text-gray-400">
              {iconRight}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <span className={`text-xs ml-1 mt-1 ${error ? "text-red-400" : "text-gray-400"}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";
