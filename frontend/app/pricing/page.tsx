"use client";

import { useAuth } from "@/lib/auth";
import { CheckCircle2, XCircle } from "lucide-react";
import { GradientButton } from "@/components/ui/premium/GradientButton";
import { SectionHeader } from "@/components/ui/premium/SectionHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <div className="min-h-screen pt-32 pb-24 bg-gray-50/50">
      <SectionHeader 
        badge="Pricing Plans"
        title="Choose the right plan for you"
        subtitle="Upgrade to unlock full AI potential and unlimited plans."
      />
      
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* FREE TIER */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col h-full relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">FREE</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-gray-900">₹0</span>
              <span className="text-gray-500 font-medium">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> 3 AI plans per month
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Basic fund recommendations
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> Risk profiling
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-400">
                <XCircle className="w-5 h-5 text-gray-300 flex-shrink-0" /> Portfolio tracking
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-400">
                <XCircle className="w-5 h-5 text-gray-300 flex-shrink-0" /> Tax optimization
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-400">
                <XCircle className="w-5 h-5 text-gray-300 flex-shrink-0" /> SIP reminders
              </li>
            </ul>
            
            <button disabled className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-bold border border-gray-200 cursor-not-allowed">
              {user?.subscription_tier === 'free' ? 'Current Plan' : 'Free Plan'}
            </button>
          </div>

          {/* PRO TIER */}
          <div className="bg-white rounded-3xl p-8 border-2 border-blue-500 shadow-xl shadow-blue-500/10 flex flex-col h-full relative md:-mt-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">PRO</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-gray-900">₹199</span>
              <span className="text-gray-500 font-medium">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Unlimited AI plans
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Portfolio tracking
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Tax optimization (ELSS)
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> SIP reminders
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Priority AI responses
              </li>
            </ul>
            
            {user?.subscription_tier === 'pro' ? (
               <button disabled className="w-full py-3 rounded-xl bg-blue-50 text-blue-600 font-bold border border-blue-100">
                 Current Plan
               </button>
            ) : (
              <GradientButton 
                variant="primary" 
                gradient="blue" 
                className="w-full !py-3"
                onClick={() => handleUpgrade('pro')}
              >
                {loadingTier === 'pro' ? 'Upgrading...' : 'Upgrade to Pro →'}
              </GradientButton>
            )}
          </div>

          {/* PREMIUM TIER */}
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl flex flex-col h-full relative">
            <h3 className="text-2xl font-bold text-white mb-2">PREMIUM</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-white">₹499</span>
              <span className="text-gray-400 font-medium">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> Everything in Pro
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> Advanced ML insights
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> Quarterly rebalancing alerts
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" /> Dedicated support
              </li>
            </ul>
            
            {user?.subscription_tier === 'premium' ? (
               <button disabled className="w-full py-3 rounded-xl bg-gray-800 text-gray-300 font-bold border border-gray-700">
                 Current Plan
               </button>
            ) : (
              <button 
                onClick={() => handleUpgrade('premium')}
                className="w-full py-3 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors"
              >
                {loadingTier === 'premium' ? 'Upgrading...' : 'Go Premium →'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
