"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Menu, X, Globe } from "lucide-react";
import { PremiumButton } from "../ui/design-system/PremiumButton";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "AI Advisor", path: "/advisor" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Tax Saving", path: "/tax-saving" }, // Will create later if needed
    { name: "SIP Reminders", path: "/results" } // currently in results page
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-[#2563EB]/10 p-1.5 rounded-lg group-hover:bg-[#2563EB]/20 transition-colors">
                <TrendingUp className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#0F172A]">
                FinWise<span className="text-[#2563EB]">AI</span>
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.name}
                  href={link.path} 
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? "text-[#2563EB] bg-[#2563EB]/5" 
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#2563EB] rounded-t-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center text-[#64748B] hover:text-[#0F172A] text-sm font-medium transition-colors">
              <Globe className="w-4 h-4 mr-1.5" />
              EN | हिं
            </button>
            <Link href="/advisor">
              <PremiumButton accentColor="#2563EB" className="py-2 px-5 text-sm">
                Get Started
              </PremiumButton>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#64748B] hover:text-[#0F172A] p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-[#E2E8F0] shadow-lg py-2 px-4"
          >
            <div className="flex flex-col space-y-2 pb-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium border-b border-gray-50 ${
                    pathname === link.path 
                      ? "text-[#2563EB] bg-[#2563EB]/5" 
                      : "text-[#64748B]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 flex flex-col space-y-4">
                <button className="flex items-center justify-center text-[#64748B] text-sm font-medium w-full py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <Globe className="w-4 h-4 mr-2" />
                  Language: English
                </button>
                <Link href="/advisor" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <PremiumButton accentColor="#2563EB" className="w-full">
                    Get Started
                  </PremiumButton>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
