import { motion } from "framer-motion";
import { GlowBadge } from "./GlowBadge";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  accent?: "theme" | "blue" | "purple" | "green" | "amber" | "indigo" | "teal" | "maroon";
  align?: "left" | "center";
}

export function SectionHeader({ title, subtitle, badge, accent = "theme", align = "center" }: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col mb-12 ${alignClass}`}
    >
      {badge && <GlowBadge text={badge} color={accent} className="mb-4" />}
      
      <h2 className="text-[30px] md:text-[36px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
        {title}
      </h2>
      
      {subtitle && (
        <p className="mt-4 text-[16px] md:text-[18px] text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
