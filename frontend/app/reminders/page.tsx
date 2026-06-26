"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Calendar, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { PageWrapper } from "../../components/ui/premium/PageWrapper";
import { GradientButton } from "../../components/ui/premium/GradientButton";
import { GlowBadge } from "../../components/ui/premium/GlowBadge";
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
    <div className="min-h-screen bg-[#F9FAFB] pt-[64px] selection:bg-blue-100 selection:text-blue-900 pb-24">
      <PageWrapper className="py-12 space-y-12 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <GlowBadge 
            text="Smart Automation" 
            color="blue" 
            icon={<Sparkles className="w-3.5 h-3.5" />} 
            className="mb-4 mx-auto"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Never Miss an SIP
          </h1>
          <p className="text-gray-500 text-lg">
            Consistency is the secret to wealth creation. Set up automatic reminders for your <span className="font-bold text-gray-900">₹{totalSip.toLocaleString()}</span> monthly investment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* EMAIL REMINDER CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden h-full flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Email Alerts</h3>
                <p className="text-sm text-gray-500">Get notified 3 days before</p>
              </div>
            </div>

            {reminderSet ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center relative z-10 flex-grow flex flex-col justify-center items-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h4 className="text-xl font-bold text-green-900 mb-2">You're All Set!</h4>
                <p className="text-green-700 font-medium">We'll email <span className="font-bold">{reminderEmail}</span> on the <span className="font-bold">{reminderDate}</span> of every month.</p>
                <button 
                  onClick={() => setReminderSet(false)}
                  className="mt-6 text-sm text-green-700 font-bold hover:text-green-900 underline"
                >
                  Edit Settings
                </button>
              </div>
            ) : (
              <form onSubmit={handleSetReminder} className="space-y-5 relative z-10 flex-grow flex flex-col justify-end">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" required value={reminderEmail} onChange={(e) => setReminderEmail(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium" 
                    placeholder="you@example.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Monthly SIP Date</label>
                  <select 
                    value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-medium appearance-none"
                  >
                    {[1,2,5,7,10,15,20,25].map(d => <option key={d} value={d}>{d} of every month</option>)}
                  </select>
                </div>
                <GradientButton gradient="blue" className="w-full !py-4 shadow-lg shadow-blue-500/25 mt-2" type="submit">
                  Activate Email Alerts
                </GradientButton>
              </form>
            )}
            
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-0 pointer-events-none"></div>
          </motion.div>

          {/* CALENDAR REMINDER CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Google Calendar</h3>
                  <p className="text-sm text-gray-500">Auto-recurring event</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                <h4 className="font-bold text-gray-900 mb-2">Event Preview:</h4>
                <p className="text-blue-600 font-semibold mb-1">FinWise SIP Investment: ₹{totalSip.toLocaleString()}</p>
                <div className="flex items-center text-sm text-gray-500 mt-3 font-medium">
                  <Bell className="w-4 h-4 mr-2" /> Repeats monthly
                </div>
              </div>
            </div>

            <button
              onClick={handleGoogleCalendar}
              className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-xl border-2 border-gray-200 transition-all"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" className="w-5 h-5" />
              <span>Add to Google Calendar</span>
            </button>
          </motion.div>
          
        </div>
        
        {/* PRIVACY BADGE */}
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">We never share your email</span>
          </div>
        </div>

      </PageWrapper>
    </div>
  );
}
