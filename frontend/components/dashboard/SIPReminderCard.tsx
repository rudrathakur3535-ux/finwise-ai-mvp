"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, CalendarDays, Loader2 } from "lucide-react";

interface Fund {
  fund_name: string;
  monthly_sip: number;
}

interface Props {
  userName: string;
  totalSip: number;
  funds: Fund[];
}

export function SIPReminderCard({ userName, totalSip, funds }: Props) {
  const [email, setEmail] = useState("");
  const [sipDate, setSipDate] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reminderData, setReminderData] = useState<any>(null);
  
  useEffect(() => {
    // Check if reminder is already set for this email
    const storedEmail = localStorage.getItem("finwise_email");
    if (storedEmail) {
      setEmail(storedEmail);
      fetchReminderData(storedEmail);
    }
  }, []);

  const fetchReminderData = async (userEmail: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/api/reminders/next?email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setReminderData(data);
        setStatus("success");
      }
    } catch (err) {
      console.error("Failed to fetch reminder data", err);
    }
  };

  const handleSetReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_BASE_URL}/api/reminders/set`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: userName || "",
          email: email,
          sip_date: sipDate,
          funds: funds
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        localStorage.setItem("finwise_email", email);
        setStatus("success");
        setMessage(result.message);
        fetchReminderData(email);
      } else {
        setStatus("error");
        let errorMsg = "Failed to set reminder.";
        if (result.detail) {
          if (typeof result.detail === "string") {
            errorMsg = result.detail;
          } else if (Array.isArray(result.detail) && result.detail.length > 0) {
            errorMsg = result.detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
          } else {
            errorMsg = JSON.stringify(result.detail);
          }
        }
        setMessage(errorMsg);
      }
    } catch (err) {
      setStatus("error");
      setMessage("Server connection failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (reminderData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-300 flex flex-col md:flex-row items-center justify-between"
      >
        <div className="flex items-start space-x-4 mb-6 md:mb-0">
          <div className="bg-emerald-50 p-4 rounded-full text-[#10B981] border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-1 flex items-center">
              Reminder Active <Bell className="w-4 h-4 ml-2 text-amber-500 animate-bounce" />
            </h3>
            <p className="text-[#64748B] text-sm">
              We'll email you at <span className="font-semibold text-[#0F172A]">{email}</span>
            </p>
            <div className="mt-3 inline-block bg-gray-50 border border-[#E2E8F0] px-4 py-2 rounded-xl">
              <span className="text-[#10B981] font-bold">{reminderData.message}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-[#E2E8F0] px-6 py-4 rounded-2xl text-center w-full md:w-auto shadow-sm">
          <p className="text-xs text-[#64748B] uppercase tracking-wider font-bold mb-1">Total Monthly SIP</p>
          <p className="text-2xl font-bold text-[#0F172A]">₹{reminderData.total_monthly_sip.toLocaleString()}</p>
          <button 
            onClick={() => setReminderData(null)}
            className="text-xs text-[#2563EB] hover:text-[#1D4ED8] underline mt-2"
          >
            Update Details
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-10 bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2E8F0]"
    >
      <div className="flex items-start space-x-4 mb-6">
        <div className="bg-emerald-50 p-4 rounded-full text-[#10B981] border border-emerald-100">
          <Bell className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-1">Set SIP Reminder</h3>
          <p className="text-[#64748B] text-sm leading-relaxed max-w-2xl">
            Consistency is the key to wealth creation. Set an email reminder so you never miss your ₹{totalSip.toLocaleString()} SIP. We'll remind you 3 days before your selected date.
          </p>
        </div>
      </div>

      <form onSubmit={handleSetReminder} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] py-3 px-4 text-[#0F172A] placeholder-[#94A3B8] transition-all outline-none"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Monthly SIP Date *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CalendarDays className="h-5 w-5 text-[#64748B]" />
              </div>
              <select
                value={sipDate}
                onChange={(e) => setSipDate(parseInt(e.target.value))}
                className="pl-11 w-full bg-white border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#10B981]/50 focus:border-[#10B981] py-3 text-[#0F172A] appearance-none transition-all outline-none"
              >
                {[...Array(28)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} of every month</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {status === "error" && (
          <div className="mb-4 text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-200">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-all disabled:opacity-70 flex items-center justify-center"
        >
          {isLoading ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
          ) : (
            <>Turn On Reminders</>
          )}
        </button>
      </form>
    </motion.div>
  );
}
