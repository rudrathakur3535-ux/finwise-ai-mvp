"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";
import { GradientButton } from "@/components/ui/premium/GradientButton";
import ThemeProvider from "@/components/ui/ThemeProvider";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.access_token, data.user);
        router.push("/dashboard");
      } else {
        setError(data.detail || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <ThemeProvider theme="slate" className="min-h-screen">
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "var(--theme-bg)" }}>
        {/* Background Orbs */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" style={{ background: "color-mix(in srgb, var(--theme-accent) 15%, transparent)" }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none" style={{ background: "color-mix(in srgb, var(--theme-accent-light) 10%, transparent)" }} />

        <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-white/10 z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Start your FinWise AI journey</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm mb-6 text-center font-medium border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-white mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="glass-input w-full pl-12 pr-4 py-3 rounded-2xl outline-none font-medium transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-1.5 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--text-muted)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="glass-input w-full pl-12 pr-4 py-3 rounded-2xl outline-none font-medium transition-all"
                  placeholder="john@example.com"
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
            <div className="pt-2">
              <GradientButton type="submit" gradient="theme" className="w-full !py-3 text-base font-bold">
                Create Account
              </GradientButton>
            </div>
          </form>

          <p className="mt-8 text-center text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-bold hover:underline" style={{ color: "var(--theme-accent-light)" }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}
