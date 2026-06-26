import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient: "blue" | "purple" | "green" | "amber" | "indigo";
  delay?: number;
}

export function StatCard({ label, value, change, changeType = "neutral", icon: Icon, gradient, delay = 0 }: StatCardProps) {
  const gradientMap = {
    blue: "grad-blue",
    purple: "grad-purple",
    green: "grad-green",
    amber: "grad-amber",
    indigo: "grad-indigo",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-[16px] p-6 shadow-sm border border-gray-100 transition-transform duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wider mb-2">{label}</p>
          <h4 className="text-[28px] font-bold text-gray-900 tracking-tight">{value}</h4>
        </div>
        <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-white ${gradientMap[gradient]} shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          <div className={`flex items-center text-xs font-bold ${
            changeType === 'positive' ? 'text-emerald-600' : 
            changeType === 'negative' ? 'text-red-500' : 'text-gray-500'
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
