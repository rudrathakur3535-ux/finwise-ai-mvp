"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Home, Bot, PieChart, Landmark, Bell, Cpu, User as UserIcon, LogOut, Settings, CreditCard, FlaskConical } from "lucide-react";
import { GradientButton } from "../ui/premium/GradientButton";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
    { name: "Simulator", path: "/simulator", icon: FlaskConical },
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
          isScrolled ? "glass-nav" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Logo (Left) */}
          <Link href="/" className="flex items-center group relative z-50">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br grad-theme flex items-center justify-center mr-2 shadow-[var(--theme-accent-glow)] transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              FinWise
            </span>
            <span className="text-xl font-extrabold bg-clip-text text-transparent grad-text-theme ml-0.5">
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
                        ? "text-white shadow-[var(--theme-accent-glow)]" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-[var(--theme-accent)] rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center">
                      <item.icon className={`w-4 h-4 mr-1.5 ${isActive ? "text-white" : "text-gray-500"}`} />
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
              className="text-sm font-bold text-gray-400 hover:text-white px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              EN/हिं
            </button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-1 pr-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
                >
                  <div className="w-8 h-8 rounded-full grad-theme flex items-center justify-center text-white font-bold text-sm shadow-[var(--theme-accent-glow)]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-300">{user.name.split(' ')[0]}</span>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#12121A] rounded-2xl shadow-xl border border-white/10 overflow-hidden z-50">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <div className="mt-2 inline-block px-2 py-1 bg-[var(--theme-accent-muted)] text-[var(--theme-accent-light)] text-[10px] font-black uppercase tracking-wider rounded-md border border-[var(--theme-accent)]">
                        {user.subscription_tier} Tier
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <UserIcon className="w-4 h-4 mr-2 text-gray-500" /> Dashboard
                      </Link>
                      <Link href="/pricing" onClick={() => setDropdownOpen(false)} className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <CreditCard className="w-4 h-4 mr-2 text-gray-500" /> Subscription
                      </Link>
                      <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg text-left transition-colors">
                        <LogOut className="w-4 h-4 mr-2 text-red-400" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white px-3 py-2 transition-colors">
                  Log in
                </Link>
                <Link href="/signup">
                  <GradientButton variant="primary" gradient="theme" className="!py-2 !px-5 !text-sm">
                    Sign up Free
                  </GradientButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center relative z-50">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 hover:bg-white/10 hover:text-white rounded-full transition-colors focus:outline-none"
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
            className="fixed inset-x-0 top-[64px] z-40 bg-[#0A0A0F] border-b border-white/10 shadow-xl md:hidden overflow-hidden origin-top"
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
                          ? "bg-[var(--theme-accent-muted)] text-[var(--theme-accent-light)] border border-[var(--theme-accent)]" 
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <item.icon className={`w-6 h-6 mr-4 ${isActive ? "text-[var(--theme-accent)]" : "text-gray-500"}`} />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
              
              <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                <button 
                  onClick={() => { handleTranslate(); setIsOpen(false); }}
                  className="w-full flex items-center justify-center py-4 rounded-xl text-gray-300 font-bold bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Switch Language (EN/हिं)
                </button>
                
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 rounded-xl text-white font-bold border border-white/20 hover:bg-white/5 transition-colors">
                      Go to Dashboard
                    </Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="w-full flex items-center justify-center py-4 rounded-xl text-red-400 font-bold bg-red-500/10 hover:bg-red-500/20 transition-colors">
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-4 rounded-xl text-white font-bold border border-white/20 hover:bg-white/5 transition-colors">
                      Log in
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <GradientButton variant="primary" gradient="theme" className="w-full !py-4 text-lg">
                        Sign up Free
                      </GradientButton>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav (App-like feel) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-white/10 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
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
                  <motion.div layoutId="mobile-nav-indicator" className="absolute top-0 w-8 h-1 bg-[var(--theme-accent)] rounded-b-full shadow-[var(--theme-accent-glow)]" />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? "text-[var(--theme-accent-light)]" : "text-gray-500"}`} />
                <span className={`text-[9px] font-bold ${isActive ? "text-[var(--theme-accent-light)]" : "text-gray-500"}`}>
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
