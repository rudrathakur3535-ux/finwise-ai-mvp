"use client";

import { motion } from "framer-motion";
import { CalendarClock, ArrowRight } from "lucide-react";

interface Props {
  totalSip: number;
}

export function SipReminder({ totalSip }: Props) {
  const handleSetReminder = () => {
    // Open Google Calendar to set a recurring monthly reminder
    const title = encodeURIComponent(`FinWise SIP Investment: ₹${totalSip.toLocaleString()}`);
    const details = encodeURIComponent("Reminder to invest your monthly SIP amount based on your FinWise AI recommendation.");
    // Recurring monthly rule
    const recur = encodeURIComponent("RRULE:FREQ=MONTHLY");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&recur=${recur}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-12 bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border flex flex-col md:flex-row items-center justify-between"
    >
      <div className="flex items-start space-x-4 mb-6 md:mb-0">
        <div className="bg-primary/10 p-4 rounded-full text-primary border border-primary/20">
          <CalendarClock className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Set SIP Reminder</h3>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
            Consistency is the key to wealth creation. Set a monthly calendar reminder so you never miss your ₹{totalSip.toLocaleString()} SIP.
          </p>
        </div>
      </div>

      <button
        onClick={handleSetReminder}
        className="w-full md:w-auto flex items-center justify-center space-x-2 bg-[#00D09C] hover:bg-[#00A37A] text-black font-bold py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(0,208,156,0.3)] transition-all flex-shrink-0"
      >
        <span>Add to Google Calendar</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
