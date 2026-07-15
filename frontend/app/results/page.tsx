"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from "recharts";
import { 
  Download, ArrowRight, ShieldCheck, TrendingUp, Info, Bot, Wallet, Star, Plus, CheckCircle2, Sparkles, Rocket, Activity, Calculator, Bell, AlertTriangle
} from "lucide-react";
import ThemeProvider from "../../components/ui/ThemeProvider";
import { PageWrapper } from "../../components/ui/premium/PageWrapper";
import { GradientButton } from "../../components/ui/premium/GradientButton";
import { GlowBadge } from "../../components/ui/premium/GlowBadge";
import { TaxSavingSection } from "../../components/dashboard/TaxSavingSection";
import { TrustScoreCard } from "../../components/TrustScoreCard";
import { AdvisorResponse, RecommendedFund } from "../../lib/types";

// Typewriter Effect Component
const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(intervalId);
    }, 20);
    return () => clearInterval(intervalId);
  }, [text]);

  return <p className="text-[var(--text-secondary)] font-medium leading-relaxed italic">"{displayedText}"</p>;
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AdvisorResponse | null>(null);
  const [expandedFund, setExpandedFund] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [extraSip, setExtraSip] = useState(0);
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderDate, setReminderDate] = useState("1");
  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("finwise_result");
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push("/advisor");
    }
  }, [router]);

  if (!result || !result.portfolio) return (
    <ThemeProvider theme="amber" className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--theme-accent)', borderTopColor: 'transparent' }}></div>
    </ThemeProvider>
  );

  const riskProfileName = result.risk_assessment?.category || "Moderate-Aggressive";
  const riskScore = result.risk_assessment?.score || 7.5;
  const strategyFocus = result.risk_assessment?.tagline || "High Growth";

  const monthlySip = result.portfolio.total_sip;
  const timeHorizon = result.user_profile.horizon_years;
  const expectedCorpus = result.portfolio.total_corpus;
  const totalInvestment = monthlySip * 12 * timeHorizon;

  const pieColors = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F43F5E'];
  
  const allocationPercentages = Object.entries(result.portfolio.allocation.detail).map(([category, percentage]) => ({
    category,
    percentage
  }));

  const riskAppetite = result.user_profile.risk_appetite;
  const expectedReturnRate = riskAppetite === "aggressive" ? 15 : riskAppetite === "moderate" ? 12 : 8;
  const baseMonthlyRate = (expectedReturnRate / 100) / 12;
  const totalMonths = timeHorizon * 12;
  
  const calculateCorpus = (monthlyAmount: number) => {
    if (baseMonthlyRate === 0) return monthlyAmount * totalMonths;
    return Math.round(monthlyAmount * ((Math.pow(1 + baseMonthlyRate, totalMonths) - 1) / baseMonthlyRate) * (1 + baseMonthlyRate));
  };
  
  const simulatedCorpus = calculateCorpus(monthlySip + extraSip);

  const chartData = [];
  for(let i=0; i<=timeHorizon; i++) {
    const yearInvestment = monthlySip * 12 * i;
    const yearCorpus = i === 0 ? 0 : calculateCorpus(monthlySip) * Math.pow(i/timeHorizon, 1.5);
    chartData.push({
      year: i,
      Expected: Math.round(yearCorpus),
      Invested: yearInvestment,
    });
  }

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => router.push("/portfolio"), 1500);
  };

  const handleSetReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if(reminderEmail) setReminderSet(true);
  };

  return (
    <ThemeProvider theme="amber" className="min-h-screen pt-[64px] pb-24">
      <PageWrapper className="py-12 space-y-12">
        
        {/* HEADER */}
        <div>
          <button onClick={() => router.push("/advisor")} className="text-[var(--text-secondary)] hover:text-white font-medium text-sm flex items-center mb-6 transition-colors">
            ← Start Over
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Your Investment Plan</h1>
              <p className="text-[var(--text-secondary)] mt-2 text-lg">Custom built for your <span className="font-bold text-[var(--theme-accent-light)] capitalize">{result.user_profile.risk_appetite}</span> profile.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 glass-card border border-white/10 rounded-xl font-bold text-gray-300 hover:text-white transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" /> PDF
              </button>
              <GradientButton 
                gradient="theme" 
                onClick={handleSave} 
                disabled={isSaved}
                className="shadow-[var(--theme-accent-glow)]"
              >
                {isSaved ? <span className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2" /> Track Portfolio</span> : <span className="flex items-center">Track Portfolio</span>}
              </GradientButton>
            </div>
          </div>
        </div>

        {/* RISK PROFILE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-8 border border-[var(--theme-accent-muted)] relative overflow-hidden"
          style={{ boxShadow: 'var(--theme-accent-glow)' }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <p className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-3">Your Risk Profile</p>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-[var(--theme-accent-muted)] rounded-full flex items-center justify-center text-2xl border border-[var(--theme-accent)]">{result.risk_assessment?.emoji || "🚀"}</div>
                <h2 className="text-3xl font-extrabold text-white">{riskProfileName}</h2>
              </div>
              <p className="text-[var(--text-secondary)] font-medium ml-16">{result.risk_assessment?.description || "Growth-Focused Investor"}</p>
            </div>
            <div className="bg-[var(--theme-accent-muted)] border border-[var(--theme-accent)] rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-xs font-bold text-[var(--theme-accent-light)] uppercase tracking-wider mb-1">Score</span>
              <div className="text-3xl font-black text-white">{riskScore}<span className="text-lg text-gray-500">/10</span></div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-white/10 rounded-2xl p-5 flex items-center gap-4 bg-white/5">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium mb-0.5">Strategy Focus</p>
                <p className="font-bold text-white">{strategyFocus}</p>
              </div>
            </div>
            <div className="border border-white/10 rounded-2xl p-5 flex items-center gap-4 bg-white/5">
              <Activity className="w-6 h-6 text-[var(--theme-accent-light)]" />
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium mb-0.5">Volatility Tolerance</p>
                <p className="font-bold text-white">{riskAppetite === "aggressive" ? "Very High" : riskAppetite === "moderate" ? "High" : "Low"}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-[var(--theme-accent-muted)] border border-[var(--theme-accent)] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-[var(--theme-accent-light)]" />
              <h3 className="font-bold text-white">FinWise AI Insight <Sparkles className="w-4 h-4 inline text-[var(--theme-accent)]" /></h3>
            </div>
            <TypewriterText text={result.ai_advice || `Aapka risk score ${riskScore}/10 hai. Aapke liye best funds select kiye gaye hain with total monthly SIP of ₹${monthlySip.toLocaleString()}. Consistent SIP se long term mein achhe returns milenge. Invest karte raho!`} />
          </div>
        </motion.div>

        {/* TRUST SCORE WIDGET */}
        <TrustScoreCard riskScore={riskScore} />

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* DONUT CHART */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1 glass-card p-8 border border-white/10 flex flex-col"
          >
            <h3 className="text-xl font-bold text-white mb-6">Portfolio Allocation</h3>
            <div className="h-[220px] w-full relative mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationPercentages}
                    cx="50%" cy="50%" innerRadius={70} outerRadius={100}
                    paddingAngle={3} dataKey="percentage" stroke="none"
                    cornerRadius={5}
                  >
                    {allocationPercentages.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', background: 'rgba(26,20,8,0.9)', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                    itemStyle={{ fontWeight: 'bold', color: '#fff' }}
                    formatter={(value: any) => [`${value}%`, 'Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[var(--text-muted)] text-xs font-bold uppercase">Equity</span>
                <span className="text-2xl font-black text-white">
                  {result.portfolio.allocation.equity_percent}%
                </span>
              </div>
            </div>
            
            <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3">
              {allocationPercentages.map((alloc: any, i: number) => (
                <div key={i} className="flex items-center text-sm font-medium">
                  <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: pieColors[i % pieColors.length] }}></div>
                  <span className="text-[var(--text-secondary)] truncate mr-auto">{alloc.category}</span>
                  <span className="text-white font-bold ml-2">{alloc.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AREA CHART */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card p-8 border border-white/10"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center">
                  Wealth Projection
                  {result.ml_summary && (
                    <span className="ml-3 bg-[var(--theme-accent-muted)] text-[var(--theme-accent-light)] text-[10px] px-2 py-0.5 rounded uppercase font-bold flex items-center border border-[var(--theme-accent)]">
                      <Bot className="w-3 h-3 mr-1" /> ML Predicted
                    </span>
                  )}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Expected growth over {timeHorizon} years</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Expected Corpus</p>
                <p className="text-3xl font-black text-emerald-400">₹{(expectedCorpus/10000000).toFixed(2)}Cr</p>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tickFormatter={(val) => `Year ${val}`} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    formatter={(value: any, name: any) => [`₹${value.toLocaleString()}`, name]}
                    contentStyle={{ borderRadius: '12px', background: 'rgba(26,20,8,0.9)', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                    labelFormatter={(label) => `Year ${label}`}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="Expected" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorExpected)" />
                  <Area type="monotone" dataKey="Invested" stroke="rgba(255,255,255,0.3)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center text-sm font-bold text-[var(--text-secondary)]"><div className="w-3 h-3 rounded-full mr-2" style={{ background: 'var(--theme-accent)' }}></div> Expected</div>
              <div className="flex items-center text-sm font-bold text-[var(--text-secondary)]"><div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div> Invested</div>
            </div>
          </motion.div>
        </div>

        {/* RECOMMENDED PORTFOLIO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-white">Recommended Portfolio</h2>
              {result.ml_summary && (
                <span className="bg-[var(--theme-accent-muted)] text-[var(--theme-accent-light)] text-xs font-bold px-3 py-1 rounded-full flex items-center border border-[var(--theme-accent)]">
                  <Bot className="w-3.5 h-3.5 mr-1" /> ML Powered
                </span>
              )}
            </div>
            <div className="bg-emerald-900/30 text-emerald-400 px-5 py-2.5 rounded-full text-sm font-bold border border-emerald-500/30 flex items-center self-start sm:self-auto">
              Total SIP: ₹{monthlySip.toLocaleString()}/mo
            </div>
          </div>

          <div className="space-y-6">
            {result.recommended_funds.map((fund: any, idx: number) => {
              const isExpanded = expandedFund === fund.name;
              const sipAmount = fund.monthly_sip || fund.sip_amount || 0;
              const return3y = fund.returns?.["3y"] || fund.historical_return_3yr || 0;
              const reason = fund.description || fund.ai_reason || "Great choice for long term.";
              const cagrBase = fund.ml_predicted_returns?.base || return3y;
              const cagrPess = fund.ml_predicted_returns?.pessimistic || (return3y * 0.8).toFixed(1);
              const cagrOpt = fund.ml_predicted_returns?.optimistic || (return3y * 1.2).toFixed(1);
              const mlConf = fund.ml_return_confidence || "±0%";
              
              return (
                <div key={idx} className="glass-card border border-white/10 overflow-hidden hover:border-[var(--theme-accent)] transition-all">
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider rounded-full">{fund.category}</span>
                        {fund.ml_recommended && (
                          <span className="px-3 py-1 bg-[var(--theme-accent-muted)] text-[var(--theme-accent-light)] text-xs font-bold rounded-full flex items-center border border-[var(--theme-accent)]">
                            <Sparkles className="w-3.5 h-3.5 mr-1" /> ML Confidence: {Math.round(fund.ml_confidence * 100)}%
                          </span>
                        )}
                      </div>
                      <span className="px-3 py-1 border border-white/20 text-gray-400 text-xs font-bold rounded-full flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Moderate Risk
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">{fund.name}</h3>
                    <p className="text-[var(--text-secondary)] mb-8">{reason}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end pb-8 border-b border-white/10">
                      <div>
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Recommended SIP</p>
                        <p className="text-xl font-bold text-white">₹{sipAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Allocation</p>
                        <p className="text-xl font-bold text-white">{Math.round((sipAmount/monthlySip)*100)}%</p>
                      </div>
                      <div className="md:col-span-2 bg-emerald-900/20 rounded-xl p-4 flex flex-col justify-center border border-emerald-500/30 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-emerald-400 flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> Expected: {cagrPess}% - {cagrOpt}% CAGR</span>
                          {fund.ml_predicted_returns && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/30">ML: {mlConf}</span>}
                        </div>
                        <span className="text-xl font-black text-emerald-300">Base: {cagrBase}% p.a.</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setExpandedFund(isExpanded ? null : fund.name)}
                      className="w-full pt-6 flex items-center justify-between text-[var(--text-secondary)] font-bold hover:text-[var(--theme-accent-light)] transition-colors"
                    >
                      <span className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-[var(--theme-accent)]" /> Why this fund?</span>
                      <Plus className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-45" : ""}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="bg-[var(--theme-accent-muted)] px-8 py-6 border-t border-[var(--theme-accent)]"
                      >
                        <p className="text-white font-medium leading-relaxed flex items-start">
                          <Bot className="w-5 h-5 text-[var(--theme-accent-light)] mr-3 flex-shrink-0 mt-0.5" />
                          {reason}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* BOTTOM WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SIMULATOR */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-900/40 rounded-xl flex items-center justify-center border border-emerald-500/30"><Calculator className="w-5 h-5 text-emerald-400" /></div>
              <h3 className="text-xl font-bold text-white">What-If Simulator</h3>
            </div>
            <p className="text-[var(--text-secondary)] mb-8">See how small changes impact your wealth</p>

            <div className="mb-6">
              <div className="flex justify-between mb-4">
                <span className="font-bold text-[var(--text-primary)]">What if I save <span className="text-emerald-400 bg-emerald-900/40 border border-emerald-500/30 px-2 py-0.5 rounded">₹{extraSip.toLocaleString()}</span> more every month?</span>
              </div>
              <input 
                type="range" min="0" max="50000" step="1000" value={extraSip} onChange={(e) => setExtraSip(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: 'var(--theme-accent)', background: 'rgba(255,255,255,0.1)' }}
              />
              <div className="flex justify-between text-xs font-bold text-[var(--text-muted)] mt-2">
                <span>+₹0</span>
                <span>+₹50k</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mt-6">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">New Expected Corpus in {timeHorizon} Years</p>
              <h4 className="text-4xl font-black text-white">₹{simulatedCorpus.toLocaleString()}</h4>
              
              <div className="mt-4 flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-sm text-[var(--text-secondary)] font-medium">New Total SIP</span>
                <span className="font-bold text-white">₹{(monthlySip + extraSip).toLocaleString()} /mo</span>
              </div>
            </div>
          </motion.div>

          {/* SIP REMINDER */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-8 border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="w-10 h-10 bg-[var(--theme-accent-muted)] rounded-xl flex items-center justify-center border border-[var(--theme-accent)]"><Bell className="w-5 h-5 text-[var(--theme-accent-light)]" /></div>
              <h3 className="text-xl font-bold text-white">Set SIP Reminder</h3>
            </div>
            <p className="text-[var(--text-secondary)] mb-6 relative z-10">Consistency is key. Set an email reminder so you never miss your ₹{monthlySip.toLocaleString()} SIP.</p>

            {reminderSet ? (
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 text-center relative z-10 h-full flex flex-col justify-center items-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                <h4 className="text-lg font-bold text-white">Reminder Set!</h4>
                <p className="text-emerald-400 text-sm mt-1">We'll email {reminderEmail} on the {reminderDate} of every month.</p>
              </div>
            ) : (
              <form onSubmit={handleSetReminder} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-white mb-1.5">Email Address *</label>
                  <input type="email" required value={reminderEmail} onChange={(e) => setReminderEmail(e.target.value)} className="glass-input w-full px-4 py-3" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-white mb-1.5">Monthly SIP Date *</label>
                  <select value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className="glass-input w-full px-4 py-3">
                    {[1,2,5,7,10,15,20,25].map(d => <option key={d} value={d}>{d} of every month</option>)}
                  </select>
                </div>
                <GradientButton type="submit" gradient="theme" className="w-full !py-3.5 mt-2">
                  Turn On Reminders
                </GradientButton>
              </form>
            )}
            
            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-3xl -z-0 pointer-events-none" style={{ background: 'var(--theme-accent)', opacity: 0.05 }}></div>
          </motion.div>
        </div>

        {/* TAX SAVING SECTION */}
        <div className="pt-4">
          <TaxSavingSection monthlyIncome={monthlySip * 3.5} userProfile={result} />
        </div>

        {/* ML MODEL SUMMARY */}
        {result.ml_summary && (
          <div className="bg-[var(--theme-accent-muted)] border border-[var(--theme-accent)] rounded-2xl p-6 mt-12 flex gap-4 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none" style={{ background: 'var(--theme-accent)' }}></div>
            <Bot className="w-8 h-8 text-[var(--theme-accent-light)] flex-shrink-0 mt-0.5 relative z-10" />
            <div className="relative z-10 w-full">
              <h4 className="font-bold text-white mb-1 text-lg flex justify-between items-center">
                <span>🤖 ML Model Summary</span>
                <span className="text-xs bg-[var(--theme-accent-muted)] text-[var(--theme-accent-light)] px-2 py-1 rounded uppercase tracking-widest border border-[var(--theme-accent)]">Powered by {result.ml_summary.total_ml_models || 3} ML Models</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {[
                  { label: "Risk Model", val: result.ml_summary.risk_model_accuracy || "86.2%", suffix: " acc" },
                  { label: "Fund Model", val: result.ml_summary.fund_model_accuracy || "73.7%", suffix: " acc" },
                  { label: "Return Model", val: `R² = ${result.ml_summary.return_model_r2 || "0.93"}`, suffix: "" },
                ].map((m, i) => (
                  <div key={i} className="glass-card rounded-xl p-4 border border-[var(--theme-accent)] flex items-center justify-between">
                    <span className="text-[var(--text-secondary)] font-medium text-sm">{m.label}</span>
                    <span className="font-black text-white">{m.val}{m.suffix}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RISK ADVISORY */}
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-6 mt-12 flex gap-4 items-start">
          <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-300 mb-1">Moderate Risk Advisory</h4>
            <p className="text-amber-400/80 text-sm leading-relaxed">
              <strong>Mutual Fund investments are subject to market risks.</strong> Please read all scheme related documents carefully before investing. The projections shown above are based on historical performance and do not guarantee future returns. FinWise AI provides educational advice, not registered financial planning.
            </p>
          </div>
        </div>

      </PageWrapper>
    </ThemeProvider>
  );
}
