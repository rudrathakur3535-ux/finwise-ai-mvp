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
  ({ label, error, helperText, iconLeft, iconRight, accentColor = "#2563EB", className = "", ...props }, ref) => {
    return (
      <div className={`flex flex-col space-y-1.5 ${className}`}>
        {label && (
          <label className="text-sm font-semibold text-[#0F172A]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {iconLeft && (
            <div className="absolute left-3.5 text-[#64748B] pointer-events-none">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-white border border-[#E2E8F0] text-[#0F172A] rounded-xl px-4 py-3 
              focus:outline-none focus:ring-1 transition-all placeholder:text-[#A1A1AA]
              ${iconLeft ? "pl-11" : ""}
              ${iconRight ? "pr-11" : ""}
              ${error ? "border-[#EF4444] focus:ring-[#EF4444]" : "focus:border-[var(--focus-color)] focus:ring-[var(--focus-color)]"}
            `}
            style={{ "--focus-color": accentColor } as any}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3.5 text-[#64748B]">
              {iconRight}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <span className={`text-xs mt-1 ${error ? "text-[#EF4444]" : "text-[#64748B]"}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

PremiumInput.displayName = "PremiumInput";
