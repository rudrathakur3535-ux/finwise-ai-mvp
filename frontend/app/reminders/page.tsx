"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Calendar, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { PageWrapper } from "../../components/ui/premium/PageWrapper";
import { GradientButton } from "../../components/ui/premium/GradientButton";
import { GlowBadge } from "../../components/ui/premium/GlowBadge";
import ThemeProvider from "@/components/ui/ThemeProvider";
import { AdvisorResponse } from "../../lib/types";

export default function RemindersPage() {
  const router = useRouter();
  const [result, setResult] = useState<AdvisorResponse | null>(null);
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderDate, setReminderDate] = useState("1");
  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("finwise_result");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  const handleSetReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if(reminderEmail) setReminderSet(true);
  };

  const handleGoogleCalendar = () => {
    const totalSip = result?.portfolio?.total_sip || 0;
    const title = encodeURIComponent(`FinWise SIP Investment: ₹${totalSip.toLocaleString()}`);
    const details = encodeURIComponent("Reminder to invest your monthly SIP amount based on your FinWise AI recommendation.");
    const recur = encodeURIComponent("RRULE:FREQ=MONTHLY");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&recur=${recur}`;
    window.open(url, "_blank");
  };

  const totalSip = result?.portfolio?.total_sip || 0;

  return (
    <ThemeProvider theme="indigo" className="min-h-screen">
      <div
        className="min-h-screen pt-[64px] pb-24 selection:bg-indigo-500/30 selection:text-white"
        style={{ background: "var(--theme-bg)" }}
      >
        <PageWrapper className="py-12 space-y-12 max-w-4xl mx-auto">

          {/* HEADER */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <GlowBadge
              text="Smart Automation"
              color="blue"
              icon={<Sparkles className="w-3.5 h-3.5" />}
              className="mb-4 mx-auto"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Never Miss an SIP
            </h1>
            <p style={{ color: "var(--text-secondary)" }} className="text-lg">
              Consistency is the secret to wealth creation. Set up automatic reminders for your{" "}
              <span className="font-bold text-white">₹{totalSip.toLocaleString()}</span> monthly investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* EMAIL REMINDER CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden h-full flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10"
                  style={{ background: "rgba(99,102,241,0.15)" }}
                >
                  <Mail className="w-6 h-6" style={{ color: "var(--theme-accent)" }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Email Alerts</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Get notified 3 days before</p>
                </div>
              </div>

              {reminderSet ? (
                <div
                  className="rounded-2xl p-6 text-center relative z-10 flex-grow flex flex-col justify-center items-center border border-white/10"
                  style={{ background: "rgba(34,197,94,0.08)" }}
                >
                  <CheckCircle2 className="w-16 h-16 mb-4" style={{ color: "var(--theme-accent)" }} />
                  <h4 className="text-xl font-bold text-white mb-2">You're All Set!</h4>
                  <p style={{ color: "var(--text-secondary)" }} className="font-medium">
                    We'll email <span className="font-bold text-white">{reminderEmail}</span> on the{" "}
                    <span className="font-bold text-white">{reminderDate}</span> of every month.
                  </p>
                  <button
                    onClick={() => setReminderSet(false)}
                    className="mt-6 text-sm font-bold underline transition-colors"
                    style={{ color: "var(--theme-accent-light)" }}
                  >
                    Edit Settings
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSetReminder} className="space-y-5 relative z-10 flex-grow flex flex-col justify-end">
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email" required value={reminderEmail} onChange={(e) => setReminderEmail(e.target.value)}
                      className="w-full rounded-xl px-4 py-3.5 text-white outline-none transition-all font-medium border border-white/10 focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-bold mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Monthly SIP Date
                    </label>
                    <select
                      value={reminderDate} onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full rounded-xl px-4 py-3.5 text-white outline-none transition-all font-medium appearance-none border border-white/10 focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      {[1,2,5,7,10,15,20,25].map(d => <option key={d} value={d} style={{ background: "#1e1b4b" }}>{d} of every month</option>)}
                    </select>
                  </div>
                  <GradientButton gradient="theme" className="w-full !py-4 shadow-lg mt-2" type="submit">
                    Activate Email Alerts
                  </GradientButton>
                </form>
              )}

              <div
                className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl -z-0 pointer-events-none"
                style={{ background: "var(--theme-accent)", opacity: 0.07 }}
              />
            </motion.div>

            {/* CALENDAR REMINDER CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10"
                    style={{ background: "rgba(251,191,36,0.12)" }}
                  >
                    <Calendar className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Google Calendar</h3>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Auto-recurring event</p>
                  </div>
                </div>

                <div
                  className="rounded-2xl p-6 border border-white/10 mb-8"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <h4 className="font-bold text-white mb-2">Event Preview:</h4>
                  <p className="font-semibold mb-1" style={{ color: "var(--theme-accent-light)" }}>
                    FinWise SIP Investment: ₹{totalSip.toLocaleString()}
                  </p>
                  <div className="flex items-center text-sm mt-3 font-medium" style={{ color: "var(--text-secondary)" }}>
                    <Bell className="w-4 h-4 mr-2" /> Repeats monthly
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoogleCalendar}
                className="w-full flex items-center justify-center space-x-2 font-bold py-4 px-8 rounded-xl border border-white/10 transition-all hover:border-white/20 text-white"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="w-5 h-5" />
                <span>Add to Google Calendar</span>
              </button>
            </motion.div>

          </div>

          {/* PRIVACY BADGE */}
          <div className="flex justify-center mt-8">
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                We never share your email
              </span>
            </div>
          </div>

        </PageWrapper>
      </div>
    </ThemeProvider>
  );
}
