"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Activity, 
  Sparkles,
  PieChart,
  RefreshCw,
  Plus,
  CheckCircle2
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function PortfolioPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("finwise_email");
    const draftStr = localStorage.getItem("finwise_draft_portfolio");
    
    if (storedEmail) {
      setEmail(storedEmail);
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        localStorage.removeItem("finwise_draft_portfolio");
        trackDraftPortfolio(storedEmail, draft);
      } else {
        fetchPortfolio(storedEmail);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const trackDraftPortfolio = async (userEmail: string, draft: any) => {
    try {
      const formattedFunds = draft.funds.map((f: any) => ({
        scheme_code: f.scheme_code,
        fund_name: f.name || f.scheme_name,
        monthly_sip: f.monthly_sip,
        start_date: new Date().toISOString().split("T")[0], 
        total_invested: f.monthly_sip 
      }));

      const res = await fetch("http://localhost:8000/api/portfolio/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: "", 
          email: userEmail,
          funds: formattedFunds,
          risk_score: draft.risk_score || 5.0
        })
      });
      
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error("Failed to track draft portfolio", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchPortfolio = async (userEmail: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/portfolio/summary?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error("Failed to fetch portfolio", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const refreshInsight = async () => {
    if (!email) return;
    setIsRefreshing(true);
    await fetchPortfolio(email);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!data) {
    const draftStr = typeof window !== "undefined" ? localStorage.getItem("finwise_draft_portfolio") : null;
    
    if (draftStr && !email) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
          <div className="bg-white p-10 rounded-3xl border border-[#E2E8F0] text-center max-w-md w-full shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <Sparkles className="w-16 h-16 text-[#10B981] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Track Your New Portfolio</h2>
            <p className="text-[#64748B] mb-8 text-sm leading-relaxed">
              We've prepared your recommended portfolio! Enter your email to save and start tracking your investments.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as any).elements.email.value;
              if (input) {
                localStorage.setItem("finwise_email", input);
                setEmail(input);
                trackDraftPortfolio(input, JSON.parse(draftStr));
                localStorage.removeItem("finwise_draft_portfolio");
              }
            }} className="flex flex-col space-y-4">
              <input 
                name="email"
                type="email" 
                required
                placeholder="you@example.com" 
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all"
              />
              <button 
                type="submit"
                className="bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3.5 px-8 rounded-xl w-full transition-all shadow-sm"
              >
                Start Tracking Portfolio
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl border border-[#E2E8F0] text-center max-w-md shadow-sm">
          <PieChart className="w-16 h-16 text-[#94A3B8] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">No Portfolio Found</h2>
          <p className="text-[#64748B] mb-8">
            You haven't set up a portfolio yet or we couldn't find your email. Track your investments to get started.
          </p>
          <button 
            onClick={() => router.push("/advisor")}
            className="bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 px-8 rounded-xl w-full transition-all"
          >
            Create Investment Plan
          </button>
        </div>
      </div>
    );
  }

  const chartData = [];
  const totalMonths = 12;
  for (let i = 0; i <= totalMonths; i++) {
    const fraction = i / totalMonths;
    const investedAtI = data.total_invested * fraction;
    const currentAtI = investedAtI + (data.total_gain * Math.pow(fraction, 2));
    
    chartData.push({
      month: `Month ${i}`,
      Invested: Math.round(investedAtI),
      Value: Math.round(currentAtI),
    });
  }

  const isPositive = data.total_gain >= 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center text-sm font-medium text-[#64748B] hover:text-[#0F172A] mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </button>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Portfolio Dashboard
            </h1>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-sm text-[#0F172A] bg-white px-4 py-2 rounded-lg border border-[#E2E8F0] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="font-semibold">Live Sync Active</span>
          </div>
        </div>

        {/* Top Cards - Colorful backgrounds for premium look */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wider">Current Value</p>
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-extrabold text-emerald-950 mb-1 relative z-10">
              ₹{data.current_value.toLocaleString()}
            </h3>
            <p className="text-sm text-emerald-700 relative z-10 font-medium">Total Portfolio Worth</p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <p className="text-sm font-semibold text-blue-800 uppercase tracking-wider">Total Invested</p>
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-3xl font-extrabold text-blue-950 mb-1 relative z-10">
              ₹{data.total_invested.toLocaleString()}
            </h3>
            <p className="text-sm text-blue-700 relative z-10 font-medium">Principal Amount</p>
          </div>

          <div className={`${isPositive ? 'bg-violet-50 border-violet-200' : 'bg-rose-50 border-rose-200'} rounded-2xl p-6 border shadow-sm relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-24 h-24 ${isPositive ? 'bg-violet-100' : 'bg-rose-100'} rounded-full blur-2xl opacity-50 -mr-10 -mt-10 pointer-events-none`}></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <p className={`text-sm font-semibold ${isPositive ? 'text-violet-800' : 'text-rose-800'} uppercase tracking-wider`}>Total Returns</p>
              {isPositive ? <TrendingUp className="w-5 h-5 text-violet-600" /> : <TrendingDown className="w-5 h-5 text-rose-600" />}
            </div>
            <h3 className={`text-3xl font-extrabold mb-1 relative z-10 ${isPositive ? "text-violet-950" : "text-rose-950"}`}>
              {isPositive ? "+" : ""}₹{data.total_gain.toLocaleString()}
            </h3>
            <p className={`text-sm font-bold relative z-10 ${isPositive ? "text-violet-700" : "text-rose-700"}`}>
              {isPositive ? "+" : ""}{data.gain_percentage}% All Time
            </p>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-full blur-2xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <p className="text-sm font-semibold text-amber-800 uppercase tracking-wider">Health Score</p>
              <Activity className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex items-end space-x-2 relative z-10">
              <h3 className="text-3xl font-extrabold text-amber-950 mb-1">{data.health_score}</h3>
              <span className="text-amber-700 font-bold text-lg mb-1.5">/ 10</span>
            </div>
            <div className="w-full bg-amber-200/50 rounded-full h-2 mt-2 relative z-10">
              <div 
                className="bg-amber-500 h-2 rounded-full" 
                style={{ width: `${(data.health_score / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
            <h3 className="text-xl font-bold text-[#0F172A] mb-6">Performance Trajectory</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? "#10B981" : "#ef4444"} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={isPositive ? "#10B981" : "#ef4444"} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#64748B" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#E2E8F0", borderRadius: "12px", color: "#0F172A", boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: "#0F172A", fontWeight: 'bold' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '500', color: '#0F172A' }} />
                  <Area type="monotone" dataKey="Invested" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" />
                  <Area type="monotone" dataKey="Value" stroke={isPositive ? "#10B981" : "#ef4444"} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: AI Insight & Health Details */}
          <div className="space-y-6">
            <div className="bg-teal-50 border border-teal-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-teal-700">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold">FinWise AI Insight</h3>
                </div>
                <button onClick={refreshInsight} disabled={isRefreshing} className="text-teal-600 hover:text-teal-800 transition-colors">
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </button>
              </div>
              <p className="text-teal-900 text-sm leading-relaxed italic font-medium">
                "{data.ai_insight}"
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
              <h3 className="text-xl font-bold text-[#0F172A] mb-5">Portfolio Health Details</h3>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#64748B] font-medium">Diversification</span>
                    <span className="text-[#0F172A] font-bold">Good</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                    <div className="bg-[#10B981] h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#64748B] font-medium">Risk Alignment</span>
                    <span className="text-[#0F172A] font-bold">Excellent</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                    <div className="bg-[#10B981] h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#E2E8F0] mt-5">
                  <p className="text-sm font-bold text-[#0F172A] mb-3">Rebalancing Needed?</p>
                  {data.rebalancing_needed ? (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-sm font-medium flex flex-col space-y-2">
                      <span className="flex items-center font-bold text-rose-700"><TrendingDown className="w-4 h-4 mr-2" /> Yes, Action Required</span>
                      {data.rebalancing_suggestions?.map((s: string, i: number) => (
                        <span key={i} className="text-xs opacity-90">- {s}</span>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm font-bold flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" /> No Action Needed
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Funds Table & Add Form */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-gray-50">
            <h3 className="text-xl font-bold text-[#0F172A]">Fund Performance</h3>
            <button 
              onClick={() => {
                const name = prompt("Enter Fund Name:");
                const sip = prompt("Enter Monthly SIP (₹):");
                if (name && sip) {
                   alert("Fund added locally! In production, this would save to the backend.");
                }
              }}
              className="text-[#10B981] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Manual Fund
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#E2E8F0]">
                  <th className="p-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Fund Name</th>
                  <th className="p-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Invested</th>
                  <th className="p-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Current Value</th>
                  <th className="p-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">Gain/Loss</th>
                  <th className="p-4 text-xs font-bold text-[#64748B] uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {data.funds_performance?.map((fund: any, idx: number) => {
                  const fundIsPositive = fund.gain_percentage >= 0;
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-[#0F172A]">{fund.fund_name}</p>
                        <p className="text-xs text-[#64748B] mt-1 font-medium">₹{fund.monthly_sip.toLocaleString()}/mo SIP</p>
                      </td>
                      <td className="p-4 text-[#0F172A] font-medium">₹{fund.total_invested.toLocaleString()}</td>
                      <td className="p-4 text-[#0F172A] font-bold">₹{fund.current_value.toLocaleString()}</td>
                      <td className={`p-4 font-bold ${fundIsPositive ? "text-[#10B981]" : "text-rose-600"}`}>
                        {fundIsPositive ? "+" : ""}₹{fund.gain_amount.toLocaleString()} <span className="text-xs bg-opacity-10 px-1 py-0.5 rounded ml-1">({fund.gain_percentage}%)</span>
                      </td>
                      <td className="p-4 flex justify-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm ${fundIsPositive ? "bg-emerald-50 border border-emerald-100 text-[#10B981]" : "bg-rose-50 border border-rose-100 text-rose-600"}`}>
                          {fundIsPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
