"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, CheckCircle2, PlayCircle, BarChart3, Clock, Wallet,
  ShieldCheck, TrendingUp, Bell, Globe, ArrowRight, User, Bot, Landmark
} from "lucide-react";
import { PageWrapper } from "../components/ui/premium/PageWrapper";
import { GradientButton } from "../components/ui/premium/GradientButton";
import { AnimatedNumber } from "../components/ui/premium/AnimatedNumber";
import { SectionHeader } from "../components/ui/premium/SectionHeader";
import { GradientCard } from "../components/ui/premium/GradientCard";
import { GlowBadge } from "../components/ui/premium/GlowBadge";

export default function LandingPage() {
  const router = useRouter();

  const handleDemoClick = (profile: any) => {
    // Store demo profile in session storage to load in advisor page
    sessionStorage.setItem("demoProfile", JSON.stringify(profile));
    router.push("/advisor");
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[5%] w-[400px] h-[400px] rounded-full bg-blue-600 blur-[120px] animate-blob"></div>
        <div className="absolute top-[40%] -right-[5%] w-[300px] h-[300px] rounded-full bg-cyan-500 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
      </div>

      <PageWrapper className="relative z-10 pt-32 pb-20">
        
        {/* SECTION 1: HERO */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 min-h-[75vh]">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <GlowBadge 
              text="Powered by Google Gemini AI" 
              color="blue" 
              icon={<Sparkles className="w-3.5 h-3.5" />} 
              className="mb-6"
            />
            
            <h1 className="text-[42px] sm:text-[52px] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
              Your Personal <br />
              <span className="grad-text-blue block pb-2">AI Investment</span> 
              Advisor
            </h1>
            
            <p className="text-[18px] text-gray-500 max-w-[480px] mb-8 leading-relaxed">
              Get a personalized mutual fund plan in 2 minutes. Based on real AMFI data. Completely free.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/advisor" className="w-full sm:w-auto">
                <GradientButton gradient="blue" className="w-full text-lg py-4 px-8">
                  Get My Free Plan <ArrowRight className="w-5 h-5 ml-2" />
                </GradientButton>
              </Link>
              <button className="flex items-center justify-center font-bold text-gray-700 hover:text-blue-600 transition-colors w-full sm:w-auto py-4 px-6 border-2 border-gray-200 hover:border-blue-200 rounded-xl bg-white">
                <PlayCircle className="w-5 h-5 mr-2 text-blue-500" /> Watch Demo
              </button>
            </div>
            
            {/* Trust Row */}
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3">
              {["Real AMFI Data", "Google Gemini AI", "100% Free", "No Sign-up Needed"].map((text, i) => (
                <div key={i} className="flex items-center text-sm font-semibold text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end"
          >
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-[420px] bg-white rounded-3xl p-6 shadow-2xl border border-gray-100"
            >
              <div className="absolute -top-4 -right-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-2 rounded-full border border-emerald-200 shadow-sm flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1" /> Verified Data
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Risk Score</p>
                    <div className="flex items-center">
                      <span className="text-3xl font-black text-gray-900">8.5</span>
                      <span className="text-gray-400 font-bold ml-1">/10</span>
                      <span className="ml-2 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">⚡ Aggressive</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 border-gray-50 flex items-center justify-center relative">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <path
                        className="text-gray-100"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-500"
                        strokeDasharray="85, 100"
                        strokeWidth="4"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Monthly SIP</p>
                    <p className="text-xl font-bold text-gray-900">₹9,000</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Expected 5Y</p>
                    <p className="text-xl font-bold text-blue-700">₹24.5L</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="h-12 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl flex items-center px-4 justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm font-bold text-gray-700">Axis Bluechip Fund</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">+18.5%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </PageWrapper>

      {/* SECTION 2: STATS BAR */}
      <div className="w-full bg-blue-50/50 border-y border-blue-100/50 py-12 relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {[
              { label: "Plans Generated", value: 10000, suffix: "+", icon: "📊" },
              { label: "Recommended", value: 50, prefix: "₹", suffix: "Cr+", icon: "💰" },
              { label: "Mutual Funds", value: 200, suffix: "+", icon: "🏦" },
              { label: "Average Time", value: 2, suffix: " Min", icon: "⚡" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center"
              >
                <span className="text-3xl mb-2">{stat.icon}</span>
                <h4 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-1">
                  <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </h4>
                <p className="text-sm font-bold text-blue-600/80 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <PageWrapper className="relative z-10 space-y-32 py-20">
        
        {/* SECTION 3: HOW IT WORKS */}
        <section>
          <SectionHeader 
            badge="How it Works" 
            accent="blue" 
            title="Three simple steps to your financial freedom" 
            subtitle="We handle the complex math and research. You just tell us what you want to achieve." 
          />
          
          <div className="relative mt-16">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-100 via-purple-100 to-emerald-100 z-0 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
              {[
                { step: "Step 1", title: "Enter Profile", desc: "Tell us your income, goals, and risk appetite", color: "blue", icon: User },
                { step: "Step 2", title: "AI Analyzes", desc: "Gemini AI + AMFI data creates your profile", color: "purple", icon: Bot },
                { step: "Step 3", title: "Get Your Plan", desc: "Personalized fund recommendations instantly", color: "green", icon: TrendingUp }
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center text-center bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm"
                  >
                    <div className={`w-24 h-24 rounded-full mb-6 flex items-center justify-center shadow-md grad-${s.color} text-white`}>
                      <Icon className="w-10 h-10" />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider mb-2 text-${s.color}-600`}>{s.step}</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                    <p className="text-gray-500">{s.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: FEATURES GRID */}
        <section>
          <SectionHeader 
            badge="Features" 
            accent="blue" 
            title="Everything You Need" 
            subtitle="Built specifically for first-time Indian investors who want to make smart money decisions." 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "AI Risk Analysis", desc: "Smart scoring based on your complete profile", color: "blue" as const, icon: ShieldCheck },
              { title: "Real Fund Data", desc: "Live AMFI data — 200+ verified mutual funds", color: "green" as const, icon: BarChart3 },
              { title: "Tax Optimization", desc: "Save up to ₹46,800 with ELSS recommendations", color: "indigo" as const, icon: Landmark },
              { title: "SIP Reminders", desc: "Never miss your monthly investment cycle", color: "purple" as const, icon: Bell },
              { title: "Portfolio Tracking", desc: "Monitor your performance in real-time", color: "amber" as const, icon: Wallet },
              { title: "Hindi Support", desc: "Full Hindi language support available", color: "blue" as const, icon: Globe }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <GradientCard key={i} gradient={f.color} delay={i * 0.1} className="flex flex-col">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 grad-${f.color} text-white shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </GradientCard>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: DEMO PROFILES */}
        <section>
          <SectionHeader 
            badge="See It In Action" 
            accent="purple" 
            title="Try with a real investor profile" 
            subtitle="Click on any profile below to instantly generate a mutual fund portfolio tailored to them." 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Profile 1 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm border-t-[4px] border-t-blue-500 p-6 flex flex-col h-full">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-4xl">👨</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Rahul</h3>
                  <p className="text-sm text-gray-500">24 years old</p>
                </div>
              </div>
              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Income</span><span className="font-bold text-gray-900">₹60,000/mo</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Style</span><span className="font-bold text-gray-900">Aggressive</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Risk Score</span><span className="font-bold text-blue-600">9.2/10</span></div>
              </div>
              <GradientButton 
                gradient="blue" 
                variant="outline" 
                className="w-full"
                onClick={() => handleDemoClick({ name: "Rahul", age: 24, monthly_income: 60000, monthly_savings: 15000, existing_amount: 0, risk_appetite: "aggressive", goal: "Wealth Creation", horizon_years: 15, city: "Pune" })}
              >
                Try Rahul's Plan →
              </GradientButton>
            </motion.div>

            {/* Profile 2 (Featured) */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl border border-purple-100 shadow-lg shadow-purple-500/10 border-t-[6px] border-t-purple-500 p-8 flex flex-col h-full relative transform md:scale-105 z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Most Popular
              </div>
              <div className="flex items-center space-x-4 mb-6 mt-2">
                <div className="text-4xl">👩</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Priya</h3>
                  <p className="text-sm text-gray-500">35 years old</p>
                </div>
              </div>
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Income</span><span className="font-bold text-gray-900">₹1,20,000/mo</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Style</span><span className="font-bold text-gray-900">Moderate</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Risk Score</span><span className="font-bold text-purple-600">6.5/10</span></div>
              </div>
              <GradientButton 
                gradient="purple" 
                variant="primary" 
                className="w-full"
                onClick={() => handleDemoClick({ name: "Priya", age: 35, monthly_income: 120000, monthly_savings: 30000, existing_amount: 500000, risk_appetite: "moderate", goal: "Child Education", horizon_years: 10, city: "Mumbai" })}
              >
                Try Priya's Plan →
              </GradientButton>
            </motion.div>

            {/* Profile 3 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm border-t-[4px] border-t-emerald-500 p-6 flex flex-col h-full">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-4xl">👴</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Sharma Ji</h3>
                  <p className="text-sm text-gray-500">52 years old</p>
                </div>
              </div>
              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Income</span><span className="font-bold text-gray-900">₹2,00,000/mo</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Style</span><span className="font-bold text-gray-900">Conservative</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Risk Score</span><span className="font-bold text-emerald-600">3.0/10</span></div>
              </div>
              <GradientButton 
                gradient="green" 
                variant="outline" 
                className="w-full"
                onClick={() => handleDemoClick({ name: "Sharma Ji", age: 52, monthly_income: 200000, monthly_savings: 50000, existing_amount: 2500000, risk_appetite: "conservative", goal: "Retirement", horizon_years: 8, city: "Delhi" })}
              >
                Try Sharma Ji's Plan →
              </GradientButton>
            </motion.div>
          </div>
        </section>

      </PageWrapper>

      {/* SECTION 6: FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 pb-24 md:pb-12 relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-blue-500 to-cyan-400 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">
              FinWise<span className="text-blue-600">AI</span>
            </span>
          </div>
          
          <div className="flex space-x-6 text-sm font-semibold text-gray-500">
            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Disclaimer</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
          </div>
          
          <div className="flex flex-col items-center md:items-end text-xs text-gray-400 space-y-1">
            <p>Built with ❤️ for Indian investors</p>
            <p className="font-semibold text-amber-600 flex items-center">
              <ShieldCheck className="w-3 h-3 mr-1" /> Not SEBI registered advice
            </p>
            <p>© {new Date().getFullYear()} FinWise AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
