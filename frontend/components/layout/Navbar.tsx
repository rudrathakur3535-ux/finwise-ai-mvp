"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Home, Bot, PieChart, Landmark, Bell, Cpu } from "lucide-react";
import { GradientButton } from "../ui/premium/GradientButton";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "AI Advisor", path: "/advisor", icon: Bot },
    { name: "Portfolio", path: "/portfolio", icon: PieChart },
    { name: "Tax", path: "/tax-saving", icon: Landmark },
    { name: "ML Engine", path: "/ml-status", icon: Cpu },
  ];

  const handleTranslate = () => {
    const element = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (element) {
      element.value = element.value === 'hi' ? 'en' : 'hi';
      element.dispatchEvent(new Event('change'));
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 h-[64px] transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" : "bg-white/50 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Logo (Left) */}
          <Link href="/" className="flex items-center group relative z-50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mr-2 shadow-sm group-hover:shadow-md transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              FinWise
            </span>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 ml-0.5">
              AI
            </span>
          </Link>

          {/* Desktop Nav (Center) */}
          <div className="hidden md:flex items-center justify-center space-x-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item, i) => {
              const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={item.path}
                    className={`relative inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isActive 
                        ? "text-white shadow-[0_0_12px_rgba(37,99,235,0.2)]" 
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center">
                      <item.icon className={`w-4 h-4 mr-1.5 ${isActive ? "text-white" : "text-gray-400"}`} />
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Actions (Right) */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleTranslate}
              className="text-sm font-bold text-gray-600 hover:text-gray-900 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              EN/हिं
            </button>
            <Link href="/advisor">
              <GradientButton variant="primary" gradient="blue" className="!py-2 !px-5 !text-sm">
                Get Started
              </GradientButton>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center relative z-50">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 top-[64px] z-40 bg-white border-b border-gray-100 shadow-xl md:hidden overflow-hidden origin-top"
          >
            <div className="px-4 py-6 space-y-2 max-h-[calc(100vh-64px)] overflow-y-auto">
              {navItems.map((item, i) => {
                const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center w-full px-4 py-4 rounded-xl text-lg font-bold transition-colors ${
                        isActive 
                          ? "bg-blue-50 text-blue-600" 
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className={`w-6 h-6 mr-4 ${isActive ? "text-blue-500" : "text-gray-400"}`} />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
              
              <div className="pt-6 mt-6 border-t border-gray-100 space-y-4">
                <button 
                  onClick={() => { handleTranslate(); setIsOpen(false); }}
                  className="w-full flex items-center justify-center py-4 rounded-xl text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Switch Language (EN/हिं)
                </button>
                <Link href="/advisor" onClick={() => setIsOpen(false)}>
                  <GradientButton variant="primary" gradient="blue" className="w-full !py-4 text-lg">
                    Get Started Free
                  </GradientButton>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav (App-like feel) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name} 
                href={item.path}
                className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
              >
                {isActive && (
                  <motion.div layoutId="mobile-nav-indicator" className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full" />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                <span className={`text-[9px] font-bold ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
