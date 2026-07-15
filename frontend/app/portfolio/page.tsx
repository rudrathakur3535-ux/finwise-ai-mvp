"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Activity, Zap, 
  ShieldCheck, AlertTriangle, ArrowRight
} from "lucide-react";
import { PageWrapper } from "../../components/ui/premium/PageWrapper";
import { GradientButton } from "../../components/ui/premium/GradientButton";
import { StatCard } from "../../components/ui/premium/StatCard";
import { GlowBadge } from "../../components/ui/premium/GlowBadge";
import Link from "next/link";
import { Paywall } from "../../components/Paywall";
import ThemeProvider from "@/components/ui/ThemeProvider";

export default function PortfolioPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fallback Mock Data in case backend is offline
  const mockData = {
    total_invested: 150000,
    current_value: 178500,
    total_returns: 28500,
    returns_percentage: 19.0,
    portfolio_health: 85,
    health_status: "Excellent",
    funds: [
      { name: "Axis Bluechip Fund", category: "Large Cap", invested: 50000, current: 59500, returns: 19.0 },
      { name: "Parag Parikh Flexi Cap", category: "Flexi Cap", invested: 60000, current: 75000, returns: 25.0 },
      { name: "Quant Small Cap", category: "Small Cap", invested: 40000, current: 44000, returns: 10.0 }
    ],
    performance_history: [
      { month: "Jan", value: 150000 },
      { month: "Feb", value: 155000 },
      { month: "Mar", value: 152000 },
      { month: "Apr", value: 161000 },
      { month: "May", value: 168000 },
      { month: "Jun", value: 178500 }
    ]
  };

  useEffect(() => {
    // In a real app, this would fetch from the backend.
    // We use mock data for the static UI demo.
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading || !data) {
    return (
      <ThemeProvider theme="amber" className="min-h-screen">
        <div className="min-h-screen flex flex-col items-center justify-center pt-16" style={{ background: "var(--theme-bg)" }}>
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: "var(--theme-accent)", borderTopColor: "transparent" }}></div>
          <p className="font-bold animate-pulse" style={{ color: "var(--text-secondary)" }}>Syncing your portfolio...</p>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme="amber" className="min-h-screen">
      <div className="min-h-screen pt-[64px] selection:bg-amber-900/40 selection:text-amber-200" style={{ background: "var(--theme-bg)" }}>
        <PageWrapper className="py-12 space-y-12">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <GlowBadge text="Live Sync" color="amber" icon={<Activity className="w-3.5 h-3.5" />} className="mb-4" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Your Portfolio</h1>
              <p className="mt-3 text-lg" style={{ color: "var(--text-secondary)" }}>Track and manage your investments.</p>
            </div>
            <div>
              <Link href="/advisor">
                <GradientButton variant="outline" gradient="theme">
                  <Plus className="w-4 h-4 mr-2" /> Add Investment
                </GradientButton>
              </Link>
            </div>
          </div>

          <Paywall featureName="Portfolio Tracking">
            {/* SUMMARY STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                label="Current Value" 
                value={`\u20b9${data.current_value.toLocaleString()}`} 
                icon={Wallet} 
                gradient="amber" 
                delay={0.1}
              />
              <StatCard 
                label="Total Invested" 
                value={`\u20b9${data.total_invested.toLocaleString()}`} 
                icon={TrendingUp} 
                gradient="blue" 
                delay={0.2} 
              />
              <StatCard 
                label="Total Returns" 
                value={`\u20b9${data.total_returns.toLocaleString()}`} 
                icon={Zap} 
                gradient="green" 
                delay={0.3} 
                change={`+${data.returns_percentage}% All Time`}
                changeType="positive"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              
              {/* PERFORMANCE CHART */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Performance History</h3>
                  <select
                    className="text-sm font-bold rounded-lg px-3 py-1.5 outline-none border border-white/10"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <option>6 Months</option>
                    <option>1 Year</option>
                    <option>3 Years</option>
                  </select>
                </div>
                
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.performance_history}>
                      <defs>
                        <linearGradient id="colorAmber" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(val) => `\u20b9${(val/1000)}k`} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        formatter={(value: any) => [`\u20b9${value.toLocaleString()}`, 'Portfolio Value']}
                        contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,20,5,0.85)', color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorAmber)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* HEALTH & AI INSIGHT */}
              <div className="lg:col-span-1 space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden h-full flex flex-col"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -z-10 translate-x-1/2 -translate-y-1/2" style={{ background: "var(--theme-accent)", opacity: 0.15 }}></div>
                  
                  <h3 className="text-lg font-bold text-white mb-6">Portfolio Health</h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ color: "var(--text-muted)" }}>Overall Score</span>
                    <span className="text-xl font-black" style={{ color: "var(--theme-accent)" }}>{data.portfolio_health}/100</span>
                  </div>
                  
                  <div className="w-full h-3 rounded-full overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${data.portfolio_health}%`, background: "var(--theme-accent)" }}></div>
                  </div>
                  
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-xl mb-6 border border-white/10" style={{ background: "rgba(16,185,129,0.1)" }}>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-300">Status: {data.health_status}</span>
                  </div>

                  <div className="mt-auto rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center" style={{ color: "var(--theme-accent)" }}>
                      <Zap className="w-3 h-3 mr-1" /> AI Recommendation
                    </h4>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      Your portfolio is well diversified. Consider increasing your SIP by 10% next year to beat inflation and hit your goal 2 years early.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* FUND TABLE */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card rounded-3xl border border-white/10 overflow-hidden mt-12"
            >
              <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Your Holdings</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Fund Name</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Category</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Invested</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Current Value</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right" style={{ color: "var(--text-muted)" }}>Returns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.funds.map((fund: any, idx: number) => (
                      <tr key={idx} className="border-b border-white/5 transition-colors hover:bg-white/5">
                        <td className="px-6 py-5">
                          <p className="font-bold text-white">{fund.name}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border border-white/10" style={{ background: "rgba(255,255,255,0.07)", color: "var(--text-secondary)" }}>
                            {fund.category}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>\u20b9{fund.invested.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-white">\u20b9{fund.current.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                            fund.returns > 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}>
                            {fund.returns > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                            {Math.abs(fund.returns)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </Paywall>
        </PageWrapper>
      </div>
    </ThemeProvider>
  );
}

// Add Plus icon component local if not imported
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
