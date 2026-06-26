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
import { PageWrapper } from "../../components/ui/premium/PageWrapper";
import { GradientButton } from "../../components/ui/premium/GradientButton";
import { GlowBadge } from "../../components/ui/premium/GlowBadge";
import { TaxSavingSection } from "../../components/dashboard/TaxSavingSection";

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

  return <p className="text-gray-700 font-medium leading-relaxed italic">"{displayedText}"</p>;
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
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

  if (!result) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const riskProfileName = result.risk_profile === "aggressive" ? "High Risk" 
    : result.risk_profile === "moderate" ? "Moderate-Aggressive" 
    : "Conservative";
  
  const riskScore = result.risk_profile === "aggressive" ? 9.2 
    : result.risk_profile === "moderate" ? 7.8 
    : 4.5;
  
  const strategyFocus = result.risk_profile === "aggressive" ? "Maximum Growth" 
    : result.risk_profile === "moderate" ? "High Growth" 
    : "Capital Protection";

  const totalInvestment = result.monthly_sip * 12 * result.time_horizon;
  const wealthGained = result.expected_corpus - totalInvestment;

  const pieColors = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
  
  // What-If Simulator Calculation
  const baseMonthlyRate = (result.expected_return_rate / 100) / 12;
  const totalMonths = result.time_horizon * 12;
  
  // Future Value of SIP formula: P × ({[1 + i]^n - 1} / i) × (1 + i)
  const calculateCorpus = (monthlyAmount: number) => {
    return Math.round(monthlyAmount * ((Math.pow(1 + baseMonthlyRate, totalMonths) - 1) / baseMonthlyRate) * (1 + baseMonthlyRate));
  };
  
  const simulatedCorpus = calculateCorpus(result.monthly_sip + extraSip);
  const diffCorpus = simulatedCorpus - result.expected_corpus;

  const chartData = [];
  for(let i=0; i<=result.time_horizon; i++) {
    const yearInvestment = result.monthly_sip * 12 * i;
    // rough approximation for area chart curve
    const yearCorpus = i === 0 ? 0 : calculateCorpus(result.monthly_sip) * Math.pow(i/result.time_horizon, 1.5);
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
    <div className="min-h-screen bg-[#F9FAFB] pt-[64px] selection:bg-purple-100 selection:text-purple-900 pb-24">
      <PageWrapper className="py-12 space-y-12">
        
        {/* HEADER */}
        <div>
          <button onClick={() => router.push("/advisor")} className="text-gray-500 hover:text-gray-900 font-medium text-sm flex items-center mb-6 transition-colors">
            ← Start Over
          </button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Your Investment Plan</h1>
              <p className="text-gray-500 mt-2 text-lg">Custom built for your <span className="font-bold text-emerald-500">{result.risk_profile}</span> profile.</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center">
                <Download className="w-4 h-4 mr-2" /> PDF
              </button>
              <GradientButton 
                gradient="purple" 
                onClick={handleSave} 
                disabled={isSaved}
                className="shadow-[0_8px_30px_rgba(124,58,237,0.25)]"
              >
                {isSaved ? <span className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2" /> Track Portfolio</span> : <span className="flex items-center">Track Portfolio</span>}
              </GradientButton>
            </div>
          </div>
        </div>

        {/* RISK PROFILE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-3">Your Risk Profile</p>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-2xl">🚀</div>
                <h2 className="text-3xl font-extrabold text-gray-900">{riskProfileName}</h2>
              </div>
              <p className="text-gray-600 font-medium ml-16">Growth-Focused Investor</p>
            </div>
            <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Score</span>
              <div className="text-3xl font-black text-amber-600">{riskScore}<span className="text-lg text-amber-600/50">/10</span></div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-100 rounded-2xl p-5 flex items-center gap-4 bg-gray-50/50">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Strategy Focus</p>
                <p className="font-bold text-gray-900">{strategyFocus}</p>
              </div>
            </div>
            <div className="border border-gray-100 rounded-2xl p-5 flex items-center gap-4 bg-gray-50/50">
              <Activity className="w-6 h-6 text-amber-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Volatility Tolerance</p>
                <p className="font-bold text-gray-900">High</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">FinWise AI Insight <Sparkles className="w-4 h-4 inline text-amber-400" /></h3>
            </div>
            <TypewriterText text={result.ai_explanation || `Aapka risk score ${riskScore}/10 hai. Aapke liye best funds select kiye gaye hain with total monthly SIP of ₹${result.monthly_sip.toLocaleString()}. Consistent SIP se long term mein achhe returns milenge. Invest karte raho!`} />
          </div>
        </motion.div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* DONUT CHART */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Allocation</h3>
            <div className="h-[220px] w-full relative mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={result.allocation_percentages}
                    cx="50%" cy="50%" innerRadius={70} outerRadius={100}
                    paddingAngle={3} dataKey="percentage" stroke="none"
                    cornerRadius={5}
                  >
                    {result.allocation_percentages.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value: any) => [`${value}%`, 'Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-gray-400 text-xs font-bold uppercase">Equity</span>
                <span className="text-2xl font-black text-gray-900">
                  {result.allocation_percentages.reduce((acc: number, curr: any) => curr.category.includes('Cap') ? acc + curr.percentage : acc, 0)}%
                </span>
              </div>
            </div>
            
            <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3">
              {result.allocation_percentages.map((alloc: any, i: number) => (
                <div key={i} className="flex items-center text-sm font-medium">
                  <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: pieColors[i % pieColors.length] }}></div>
                  <span className="text-gray-600 truncate mr-auto">{alloc.category}</span>
                  <span className="text-gray-900 font-bold ml-2">{alloc.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AREA CHART */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Wealth Projection</h3>
                <p className="text-sm text-gray-500 mt-1">Expected growth over {result.time_horizon} years</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Expected Corpus</p>
                <p className="text-3xl font-black text-emerald-600">₹{(result.expected_corpus/10000000).toFixed(2)}Cr</p>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="year" tickFormatter={(val) => `Year ${val}`} tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    formatter={(value: any, name: any) => [`₹${value.toLocaleString()}`, name]}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Area type="monotone" dataKey="Expected" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorExpected)" />
                  <Area type="monotone" dataKey="Invested" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center text-sm font-bold text-gray-600"><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div> Expected</div>
              <div className="flex items-center text-sm font-bold text-gray-600"><div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div> Invested</div>
            </div>
          </motion.div>
        </div>

        {/* RECOMMENDED PORTFOLIO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-900">Recommended Portfolio</h2>
            <div className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-full text-sm font-bold border border-emerald-100 flex items-center self-start sm:self-auto">
              Total SIP: ₹{result.monthly_sip.toLocaleString()}/mo
            </div>
          </div>

          <div className="space-y-6">
            {result.recommended_funds.map((fund: any, idx: number) => {
              const isExpanded = expandedFund === fund.name;
              return (
                <div key={idx} className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">{fund.category}</span>
                      <span className="px-3 py-1 border border-gray-200 text-gray-600 text-xs font-bold rounded-full flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Moderate Risk
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{fund.name}</h3>
                    <p className="text-gray-600 mb-8">{fund.ai_reason}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end pb-8 border-b border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Recommended SIP</p>
                        <p className="text-xl font-bold text-gray-900">₹{fund.sip_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Allocation</p>
                        <p className="text-xl font-bold text-gray-900">{Math.round((fund.sip_amount/result.monthly_sip)*100)}%</p>
                      </div>
                      <div className="md:col-span-2 bg-emerald-50 rounded-xl p-4 flex justify-between items-center border border-emerald-100">
                        <span className="text-sm font-bold text-emerald-800 flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> 3Y Return</span>
                        <span className="text-xl font-black text-emerald-600">{fund.historical_return_3yr}% p.a.</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setExpandedFund(isExpanded ? null : fund.name)}
                      className="w-full pt-6 flex items-center justify-between text-gray-700 font-bold hover:text-purple-600 transition-colors"
                    >
                      <span className="flex items-center"><Sparkles className="w-4 h-4 mr-2 text-amber-500" /> Why this fund?</span>
                      <Plus className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-45" : ""}`} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="bg-purple-50/50 px-8 py-6 border-t border-purple-100"
                      >
                        <p className="text-gray-700 font-medium leading-relaxed flex items-start">
                          <Bot className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                          {fund.ai_reason}
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><Calculator className="w-5 h-5 text-emerald-600" /></div>
              <h3 className="text-xl font-bold text-gray-900">What-If Simulator</h3>
            </div>
            <p className="text-gray-500 mb-8">See how small changes impact your wealth</p>

            <div className="mb-6">
              <div className="flex justify-between mb-4">
                <span className="font-bold text-gray-700">What if I save <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">₹{extraSip.toLocaleString()}</span> more every month?</span>
              </div>
              <input 
                type="range" min="0" max="50000" step="1000" value={extraSip} onChange={(e) => setExtraSip(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs font-bold text-gray-400 mt-2">
                <span>+₹0</span>
                <span>+₹50k</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Expected Corpus in {result.time_horizon} Years</p>
              <h4 className="text-4xl font-black text-gray-900">₹{simulatedCorpus.toLocaleString()}</h4>
              
              <div className="mt-4 flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-sm text-gray-600 font-medium">New Total SIP</span>
                <span className="font-bold text-gray-900">₹{(result.monthly_sip + extraSip).toLocaleString()} /mo</span>
              </div>
            </div>
          </motion.div>

          {/* SIP REMINDER */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Bell className="w-5 h-5 text-blue-600" /></div>
              <h3 className="text-xl font-bold text-gray-900">Set SIP Reminder</h3>
            </div>
            <p className="text-gray-500 mb-6 relative z-10">Consistency is key. Set an email reminder so you never miss your ₹{result.monthly_sip.toLocaleString()} SIP.</p>

            {reminderSet ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center relative z-10 h-full flex flex-col justify-center items-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
                <h4 className="text-lg font-bold text-green-900">Reminder Set!</h4>
                <p className="text-green-700 text-sm mt-1">We'll email {reminderEmail} on the {reminderDate} of every month.</p>
              </div>
            ) : (
              <form onSubmit={handleSetReminder} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" required value={reminderEmail} onChange={(e) => setReminderEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Monthly SIP Date *</label>
                  <select value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
                    {[1,2,5,7,10,15,20,25].map(d => <option key={d} value={d}>{d} of every month</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white font-bold rounded-xl py-3.5 hover:bg-gray-800 transition-colors mt-2">
                  Turn On Reminders
                </button>
              </form>
            )}
            
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl -z-0 pointer-events-none"></div>
          </motion.div>
        </div>

        {/* TAX SAVING SECTION */}
        <div className="pt-4">
          <TaxSavingSection monthlyIncome={result.monthly_sip * 3.5} userProfile={result} />
        </div>

        {/* RISK ADVISORY */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-12 flex gap-4 items-start">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 mb-1">Moderate Risk Advisory</h4>
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>Mutual Fund investments are subject to market risks.</strong> Please read all scheme related documents carefully before investing. The projections shown above are based on historical performance and do not guarantee future returns. FinWise AI provides educational advice, not registered financial planning.
            </p>
          </div>
        </div>

      </PageWrapper>
    </div>
  );
}
