import React from "react";

export function LoadingSkeleton({ className = "", type = "card" }: { className?: string, type?: "card" | "line" | "avatar" | "title" }) {
  const baseClass = "animate-pulse bg-[#E2E8F0] rounded-xl";
  
  if (type === "line") {
    return <div className={`${baseClass} h-4 w-full ${className}`}></div>;
  }
  
  if (type === "title") {
    return <div className={`${baseClass} h-8 w-3/4 ${className}`}></div>;
  }
  
  if (type === "avatar") {
    return <div className={`animate-pulse bg-[#E2E8F0] rounded-full h-12 w-12 ${className}`}></div>;
  }
  
  return (
    <div className={`${baseClass} h-32 w-full ${className}`}></div>
  );
}
