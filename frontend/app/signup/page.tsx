"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";
import { GradientButton } from "@/components/ui/premium/GradientButton";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Start your FinWise AI journey</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div className="pt-2">
            <GradientButton type="submit" className="w-full !py-3 text-base font-bold shadow-blue-500/25 shadow-lg">
              Create Account
            </GradientButton>
          </div>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
