"use client";

import React from "react";

export type ThemeName = "purple" | "blue" | "green" | "amber" | "teal" | "maroon" | "indigo" | "slate";

interface ThemeProviderProps {
  theme: ThemeName;
  children: React.ReactNode;
  className?: string;
}

export default function ThemeProvider({ theme, children, className = "" }: ThemeProviderProps) {
  return (
    <div className={`theme-${theme} theme-page-bg relative ${className}`}>
      {children}
    </div>
  );
}
