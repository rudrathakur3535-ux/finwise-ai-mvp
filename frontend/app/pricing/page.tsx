"use client";

import { useAuth } from "@/lib/auth";
import { CheckCircle2, XCircle } from "lucide-react";
import { GradientButton } from "@/components/ui/premium/GradientButton";
import { SectionHeader } from "@/components/ui/premium/SectionHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeProvider from "@/components/ui/ThemeProvider";

export default function PricingPage() {
  const { user, token, refreshUser } = useAuth();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleUpgrade = async (tier: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoadingTier(tier);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/api/subscription/upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ tier })
      });

      if (res.ok) {
        await refreshUser();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <ThemeProvider theme="maroon" className="min-h-screen">
      <div className="min-h-screen pt-32 pb-24" style={{ background: "var(--theme-bg)" }}>
        <SectionHeader
          badge="Pricing Plans"
          title="Choose the right plan for you"
          subtitle="Upgrade to unlock full AI potential and unlimited plans."
        />

        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

            {/* FREE TIER */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col h-full relative">
              <h3 className="text-2xl font-bold text-white mb-2">FREE</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">₹0</span>
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>/month</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> 3 AI plans per month
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> Basic fund recommendations
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" /> Risk profiling
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} /> Portfolio tracking
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} /> Tax optimization
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} /> SIP reminders
                </li>
              </ul>

              <button
                disabled
                className="w-full py-3 rounded-xl font-bold border border-white/10 cursor-not-allowed"
                style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}
              >
                {user?.subscription_tier === 'free' ? 'Current Plan' : 'Free Plan'}
              </button>
            </div>

            {/* PRO TIER */}
            <div
              className="glass-card rounded-3xl p-8 border-2 flex flex-col h-full relative md:-mt-4"
              style={{ borderColor: "var(--theme-accent)" }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                style={{ background: "linear-gradient(to right, var(--theme-accent), var(--theme-accent-light))" }}
              >
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">PRO</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">₹199</span>
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>/month</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--theme-accent-light)" }} /> Unlimited AI plans
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--theme-accent-light)" }} /> Portfolio tracking
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--theme-accent-light)" }} /> Tax optimization (ELSS)
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--theme-accent-light)" }} /> SIP reminders
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--theme-accent-light)" }} /> Priority AI responses
                </li>
              </ul>

              {user?.subscription_tier === 'pro' ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-bold border border-white/10 cursor-not-allowed"
                  style={{ background: "rgba(255,255,255,0.05)", color: "var(--theme-accent-light)" }}
                >
                  Current Plan
                </button>
              ) : (
                <GradientButton
                  variant="primary"
                  gradient="theme"
                  className="w-full !py-3"
                  onClick={() => handleUpgrade('pro')}
                >
                  {loadingTier === 'pro' ? 'Upgrading...' : 'Upgrade to Pro →'}
                </GradientButton>
              )}
            </div>

            {/* PREMIUM TIER */}
            <div className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col h-full relative">
              <h3 className="text-2xl font-bold text-white mb-2">PREMIUM</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">₹499</span>
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>/month</span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> Everything in Pro
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> Advanced ML insights
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> Quarterly rebalancing alerts
                </li>
                <li className="flex items-center gap-3 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> Dedicated support
                </li>
              </ul>

              {user?.subscription_tier === 'premium' ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-bold border border-white/10 cursor-not-allowed"
                  style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}
                >
                  Current Plan
                </button>
              ) : (
                <GradientButton
                  variant="primary"
                  gradient="theme"
                  className="w-full !py-3"
                  onClick={() => handleUpgrade('premium')}
                >
                  {loadingTier === 'premium' ? 'Upgrading...' : 'Go Premium →'}
                </GradientButton>
              )}
            </div>

          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
