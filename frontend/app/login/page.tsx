"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { GradientButton } from "@/components/ui/premium/GradientButton";
import ThemeProvider from "@/components/ui/ThemeProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.access_token, data.user);
        router.push("/dashboard");
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <ThemeProvider theme="slate" className="min-h-screen">
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "var(--theme-bg)" }}>
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" style={{ background: "color-mix(in srgb, var(--theme-accent) 15%, transparent)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" style={{ background: "color-mix(in srgb, var(--theme-accent-light) 10%, transparent)" }} />

        <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Log in to your FinWise AI account</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-6 text-center font-medium border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-white mb-1.5 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="glass-input w-full pl-12 pr-4 py-3 rounded-2xl outline-none font-medium transition-all"
                  placeholder="judge@finwise.ai"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="glass-input w-full pl-12 pr-4 py-3 rounded-2xl outline-none font-medium transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div className="pt-2 space-y-3">
              <GradientButton type="submit" gradient="theme" className="w-full !py-3 text-base font-bold">
                Sign In
              </GradientButton>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button
                type="button"
                onClick={() => { setEmail("demo@finwise.ai"); setPassword("demo123"); }}
                className="w-full py-3 rounded-xl font-bold border border-white/10 transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              >
                Fill Demo Credentials
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold hover:underline" style={{ color: "var(--theme-accent-light)" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}
