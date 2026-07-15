"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { SectionHeader } from "@/components/ui/premium/SectionHeader";
import { GradientButton } from "@/components/ui/premium/GradientButton";
import ThemeProvider from "@/components/ui/ThemeProvider";
import Link from "next/link";
import { FileText, Crown, Zap, Activity } from "lucide-react";

export default function DashboardPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  const fetchDashboard = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/api/dashboard/summary`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setDashboardData(await res.json());
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  if (isLoading || !user) {
    return (
      <ThemeProvider theme="blue" className="min-h-screen flex items-center justify-center">
        <div className="text-white font-bold animate-pulse">Loading...</div>
      </ThemeProvider>
    );
  }

  const usage = dashboardData?.usage;
  const savedPlans = dashboardData?.saved_plans || [];

  return (
    <ThemeProvider theme="blue" className="min-h-screen pt-32 pb-24">
      <SectionHeader 
        badge="Dashboard"
        accent="theme"
        title={`Welcome back, ${user.name.split(" ")[0]}!`}
        subtitle="Manage your AI financial plans and subscription."
      />
      
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 mt-12 space-y-8 relative z-10">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 flex items-center space-x-4 border-t-[3px] border-t-[var(--theme-accent)] shadow-[var(--theme-accent-glow)] bg-blue-900/10">
            <div className="w-12 h-12 bg-blue-500/20 text-[var(--theme-accent-light)] rounded-xl flex items-center justify-center border border-[var(--theme-accent)]">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-muted)]">Current Plan</p>
              <p className="text-xl font-black text-white capitalize">{usage?.tier || user.subscription_tier}</p>
            </div>
          </div>
          
          <div className="glass-card p-6 flex items-center space-x-4 border border-white/5">
            <div className="w-12 h-12 bg-emerald-900/40 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-muted)]">Plans Used</p>
              <p className="text-xl font-black text-white">
                {usage?.plans_used} / {usage?.is_unlimited ? '∞' : usage?.limit}
              </p>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center justify-between border border-white/5">
            <div>
              <p className="text-sm font-bold text-[var(--text-muted)] mb-2">Quick Action</p>
              <Link href="/advisor">
                <GradientButton variant="primary" gradient="theme" className="!py-2 !px-4 !text-sm shadow-[var(--theme-accent-glow)]">
                  New AI Plan +
                </GradientButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Upgrade Banner (if free) */}
        {usage?.tier === "free" && usage?.plans_used >= usage?.limit && (
          <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-3xl flex items-center justify-between backdrop-blur-md">
            <div>
              <h3 className="text-lg font-bold text-red-400">You've reached your free limit</h3>
              <p className="text-sm text-red-300 font-medium">Upgrade to Pro to generate unlimited AI financial plans.</p>
            </div>
            <Link href="/pricing">
              <button className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-red-600/30 transition-colors">
                Upgrade Now
              </button>
            </Link>
          </div>
        )}

        {/* Saved Plans */}
        <div className="glass-card p-8 border border-white/10 relative overflow-hidden">
          {/* Subtle noise/glow behind plans */}
          <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--theme-accent)]" />
              Saved Plans History
            </h3>
          </div>
          
          {savedPlans.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 border-dashed relative z-10">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-[var(--text-muted)] font-medium">No plans generated yet.</p>
              <Link href="/advisor">
                <p className="text-[var(--theme-accent-light)] font-bold mt-2 hover:underline">Create your first plan</p>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 relative z-10">
              {savedPlans.map((plan: any, i: number) => (
                <div key={i} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                  <div>
                    <h4 className="font-bold text-white">{plan.profile_name}'s Financial Plan</h4>
                    <p className="text-sm text-[var(--text-secondary)]">Generated on: {new Date(plan.date).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-4 text-sm font-bold">
                    <span className="text-blue-300 bg-blue-900/40 border border-blue-500/30 px-3 py-1 rounded-lg">
                      Risk: {plan.plan_data.risk_assessment.category}
                    </span>
                    <span className="text-emerald-300 bg-emerald-900/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
                      SIP: ₹{plan.plan_data.portfolio.total_sip.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </ThemeProvider>
  );
}
