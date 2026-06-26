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
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold animate-pulse">Syncing your portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-[64px] selection:bg-amber-100 selection:text-amber-900">
      <PageWrapper className="py-12 space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <GlowBadge text="Live Sync" color="amber" icon={<Activity className="w-3.5 h-3.5" />} className="mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Your Portfolio</h1>
            <p className="text-gray-500 mt-3 text-lg">Track and manage your investments.</p>
          </div>
          <div>
            <Link href="/advisor">
              <GradientButton variant="outline" gradient="amber">
                <Plus className="w-4 h-4 mr-2" /> Add Investment
              </GradientButton>
            </Link>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Current Value" 
            value={`₹${data.current_value.toLocaleString()}`} 
            icon={Wallet} 
            gradient="amber" 
            delay={0.1}
          />
          <StatCard 
            label="Total Invested" 
            value={`₹${data.total_invested.toLocaleString()}`} 
            icon={TrendingUp} 
            gradient="blue" 
            delay={0.2} 
          />
          <StatCard 
            label="Total Returns" 
            value={`₹${data.total_returns.toLocaleString()}`} 
            icon={Zap} 
            gradient="green" 
            delay={0.3} 
            change={`+${data.returns_percentage}% All Time`}
            changeType="positive"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PERFORMANCE CHART */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Performance History</h3>
              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-amber-500/20">
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(val) => `₹${(val/1000)}k`} tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
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
              className="bg-white rounded-3xl p-8 border border-amber-100 shadow-sm relative overflow-hidden h-full flex flex-col"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-[60px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-6">Portfolio Health</h3>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-500">Overall Score</span>
                <span className="text-xl font-black text-amber-600">{data.portfolio_health}/100</span>
              </div>
              
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${data.portfolio_health}%` }}></div>
              </div>
              
              <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-xl mb-6">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800">Status: {data.health_status}</span>
              </div>

              <div className="mt-auto bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center">
                  <Zap className="w-3 h-3 mr-1" /> AI Recommendation
                </h4>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
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
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Your Holdings</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fund Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Invested</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Current Value</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Returns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.funds.map((fund: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-gray-900">{fund.name}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-600">
                        {fund.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-600">₹{fund.invested.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-gray-900">₹{fund.current.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                        fund.returns > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
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

      </PageWrapper>
    </div>
  );
}
// Add Plus icon component local if not imported
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);
