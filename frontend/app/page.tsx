"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BarChart2, 
  Cpu, 
  Bell, 
  Wallet,
  Globe,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { PremiumButton } from "../components/ui/design-system/PremiumButton";
import { PremiumCard } from "../components/ui/design-system/PremiumCard";

export default function Home() {
  const features = [
    { icon: <Cpu className="w-6 h-6" />, title: "AI Risk Analysis", desc: "Our AI evaluates your financial profile to determine the perfect risk appetite." },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Real Fund Data", desc: "Powered by live AMFI India data to ensure accurate mutual fund selection." },
    { icon: <Wallet className="w-6 h-6" />, title: "Tax Optimization", desc: "Smart ELSS recommendations to save up to ₹46,800 under Section 80C." },
    { icon: <Bell className="w-6 h-6" />, title: "SIP Reminders", desc: "Never miss an investment with automated email reminders." },
    { icon: <BarChart2 className="w-6 h-6" />, title: "Portfolio Tracking", desc: "Monitor your investments with a beautiful dashboard and live NAVs." },
    { icon: <Globe className="w-6 h-6" />, title: "Hindi Support", desc: "Access the entire platform and AI insights in Hindi and English." }
  ];

  const profiles = [
    { name: "Rahul", age: 24, profile: "Aggressive", income: "₹60,000", bg: "bg-blue-50 text-blue-700" },
    { name: "Priya", age: 35, profile: "Moderate", income: "₹1,20,000", bg: "bg-emerald-50 text-emerald-700" },
    { name: "Arvind", age: 50, profile: "Conservative", income: "₹2,00,000", bg: "bg-amber-50 text-amber-700" }
  ];

  const handleDemo = (name: string) => {
    let data;
    if (name === "Rahul") {
      data = { name: "Rahul", age: 24, monthly_income: 60000, monthly_savings: 20000, risk_appetite: "aggressive", goal: "Wealth Creation", horizon_years: 15, existing_amount: 0, city: "Pune" };
    } else if (name === "Priya") {
      data = { name: "Priya", age: 35, monthly_income: 120000, monthly_savings: 40000, risk_appetite: "moderate", goal: "Child Education", horizon_years: 10, existing_amount: 500000, city: "Mumbai" };
    } else {
      data = { name: "Arvind", age: 50, monthly_income: 200000, monthly_savings: 80000, risk_appetite: "conservative", goal: "Retirement", horizon_years: 5, existing_amount: 2500000, city: "Delhi" };
    }
    sessionStorage.setItem("demoProfile", JSON.stringify(data));
    window.location.href = "/advisor";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Section 1 — Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span>FinWise AI 2.0 is Live</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-[1.15] mb-6">
                Your Personal AI <br className="hidden lg:block"/>
                <span className="text-[#2563EB]">Investment Advisor</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#64748B] mb-8 leading-relaxed max-w-xl">
                Get a personalized mutual fund plan tailored to your risk profile in just 2 minutes. Free. No sign-up required.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
                <Link href="/advisor">
                  <PremiumButton accentColor="#2563EB" className="w-full sm:w-auto px-8 py-4 text-base">
                    Get My Free Plan <ArrowRight className="w-4 h-4 ml-2" />
                  </PremiumButton>
                </Link>
                <Link href="#how-it-works">
                  <PremiumButton variant="secondary" accentColor="#2563EB" className="w-full sm:w-auto px-8 py-4 text-base">
                    See How It Works
                  </PremiumButton>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm font-medium text-[#64748B]">
                <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-[#10B981]" /> Real AMFI Data</span>
                <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-[#10B981]" /> Google Gemini AI</span>
                <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-[#10B981]" /> 100% Free</span>
              </div>
            </motion.div>

            {/* Right Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[2.5rem] transform rotate-3 scale-105 -z-10"></div>
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xl relative overflow-hidden">
                {/* Mockup Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">R</div>
                    <div>
                      <div className="text-sm font-bold text-[#0F172A]">Rahul's Portfolio</div>
                      <div className="text-xs text-[#64748B]">Aggressive Growth</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                    Health: 8.5/10
                  </div>
                </div>

                {/* Mockup Body */}
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-[#64748B] mb-1">Current Value</div>
                    <div className="text-3xl font-extrabold text-[#0F172A] flex items-baseline">
                      ₹1,24,500 <span className="ml-3 text-sm font-bold text-[#10B981] flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +18.2%</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <div className="h-2 w-1/2 bg-blue-500 rounded-full"></div>
                    <div className="h-2 w-1/3 bg-indigo-400 rounded-full"></div>
                    <div className="h-2 w-1/6 bg-amber-400 rounded-full"></div>
                  </div>

                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600 mt-0.5"><Cpu className="w-4 h-4"/></div>
                      <div>
                        <div className="text-sm font-bold text-[#0F172A] mb-1">FinWise AI Insight</div>
                        <div className="text-xs text-[#64748B] leading-relaxed">"Tumhara portfolio bahut badhiya perform kar raha hai! Small cap funds ne accha alpha diya hai. Continue your SIPs."</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2 — Stats Bar */}
      <section className="bg-blue-50 border-y border-blue-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-extrabold text-blue-600 mb-1">10,000+</div>
              <div className="text-sm font-medium text-[#64748B]">Plans Generated</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-600 mb-1">₹50Cr+</div>
              <div className="text-sm font-medium text-[#64748B]">Recommended</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-600 mb-1">200+</div>
              <div className="text-sm font-medium text-[#64748B]">Mutual Funds Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-600 mb-1">2 Min</div>
              <div className="text-sm font-medium text-[#64748B]">Average Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-12">How FinWise AI Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4 shadow-sm">1</div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Enter Your Profile</h3>
              <p className="text-[#64748B] text-sm">Tell us about your age, income, and financial goals in a quick form.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4 shadow-sm">2</div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">AI Analyzes Market</h3>
              <p className="text-[#64748B] text-sm">Our algorithm matches your risk appetite with top-performing funds.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-md shadow-blue-200">3</div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Get Your Plan</h3>
              <p className="text-[#64748B] text-sm">Instantly receive a diversified portfolio and start investing smartly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Features Grid */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Everything You Need</h2>
            <p className="text-[#64748B] max-w-2xl mx-auto">A complete suite of tools designed to help you build wealth, optimize taxes, and track your performance effortlessly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <PremiumCard key={i} className="hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">{f.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{f.desc}</p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — Demo Profiles */}
      <section className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Try with a Sample Profile</h2>
          <p className="text-[#64748B] mb-12">Not ready to enter your own details? See how it works instantly.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profiles.map((p, i) => (
              <PremiumCard key={i} className="text-left flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#0F172A] font-bold text-lg">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0F172A]">{p.name}, {p.age}</h3>
                      <p className="text-xs text-[#64748B]">{p.income}/month</p>
                    </div>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-md text-xs font-semibold mb-6 ${p.bg}`}>
                    {p.profile} Investor
                  </div>
                </div>
                <PremiumButton 
                  variant="secondary" 
                  className="w-full text-sm py-2.5" 
                  onClick={() => handleDemo(p.name)}
                >
                  Try {p.name}'s Plan
                </PremiumButton>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to secure your financial future?</h2>
          <p className="text-blue-200 mb-10 text-lg">Join thousands of Indians making smarter investment decisions with AI.</p>
          <Link href="/advisor">
            <PremiumButton accentColor="#2563EB" className="px-10 py-4 text-base shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Build My Portfolio Now
            </PremiumButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
