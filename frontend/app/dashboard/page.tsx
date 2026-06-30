"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { SectionHeader } from "@/components/ui/premium/SectionHeader";
import { GradientButton } from "@/components/ui/premium/GradientButton";
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const usage = dashboardData?.usage;
  const savedPlans = dashboardData?.saved_plans || [];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-gray-50/50">
      <SectionHeader 
        badge="Dashboard"
        title={`Welcome back, ${user.name.split(" ")[0]}!`}
        subtitle="Manage your AI financial plans and subscription."
      />
      
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 mt-12 space-y-8">
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Current Plan</p>
              <p className="text-xl font-black text-gray-900 capitalize">{usage?.tier || user.subscription_tier}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Plans Used</p>
              <p className="text-xl font-black text-gray-900">
                {usage?.plans_used} / {usage?.is_unlimited ? '∞' : usage?.limit}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-500">Quick Action</p>
              <Link href="/advisor">
                <GradientButton variant="primary" gradient="blue" className="mt-2 !py-2 !px-4 !text-sm">
                  New AI Plan +
                </GradientButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Upgrade Banner (if free) */}
        {usage?.tier === "free" && usage?.plans_used >= usage?.limit && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 p-6 rounded-3xl flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-red-900">You've reached your free limit</h3>
              <p className="text-sm text-red-700 font-medium">Upgrade to Pro to generate unlimited AI financial plans.</p>
            </div>
            <Link href="/pricing">
              <button className="bg-red-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-red-600/20">
                Upgrade Now
              </button>
            </Link>
          </div>
        )}

        {/* Saved Plans */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Saved Plans History
            </h3>
          </div>
          
          {savedPlans.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No plans generated yet.</p>
              <Link href="/advisor">
                <p className="text-blue-600 font-bold mt-2 hover:underline">Create your first plan</p>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedPlans.map((plan: any, i: number) => (
                <div key={i} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                  <div>
                    <h4 className="font-bold text-gray-900">{plan.profile_name}'s Financial Plan</h4>
                    <p className="text-sm text-gray-500">Generated on: {new Date(plan.date).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-4 text-sm font-bold">
                    <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                      Risk: {plan.plan_data.risk_assessment.category}
                    </span>
                    <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                      SIP: ₹{plan.plan_data.portfolio.total_sip.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
