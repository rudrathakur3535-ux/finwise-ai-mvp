import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient?: "theme" | "blue" | "purple" | "green" | "amber" | "indigo" | "teal" | "maroon";
  delay?: number;
}

export function StatCard({ label, value, change, changeType = "neutral", icon: Icon, gradient = "theme", delay = 0 }: StatCardProps) {
  const gradientClass = gradient === "theme" ? "grad-theme" : `grad-${gradient}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 transition-transform duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">{label}</p>
          <h4 className="text-[28px] font-bold text-[var(--text-primary)] tracking-tight">{value}</h4>
        </div>
        <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-white ${gradientClass} shadow-sm`}
             style={{ boxShadow: gradient === "theme" ? "var(--theme-accent-glow)" : undefined }}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          <div className={`flex items-center text-xs font-bold ${
            changeType === 'positive' ? 'text-emerald-400' : 
            changeType === 'negative' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {changeType === 'positive' && <ArrowUpRight className="w-4 h-4 mr-1" />}
            {changeType === 'negative' && <ArrowDownRight className="w-4 h-4 mr-1" />}
            {change}
          </div>
        </div>
      )}
    </motion.div>
  );
}
