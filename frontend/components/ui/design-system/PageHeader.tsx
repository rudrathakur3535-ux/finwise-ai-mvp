import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  accentColor?: string;
}

export function PageHeader({ title, subtitle, actions, accentColor = "#2563EB" }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E2E8F0] pb-6 mb-8 mt-4">
      <div className="relative pl-4">
        {/* Accent left border decoration */}
        <div 
          className="absolute left-0 top-1 bottom-1 w-1 rounded-full" 
          style={{ backgroundColor: accentColor }}
        ></div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-[#64748B] mt-1.5 text-sm md:text-base">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
}
