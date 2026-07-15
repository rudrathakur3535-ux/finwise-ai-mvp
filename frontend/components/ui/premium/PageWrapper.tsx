import { motion } from "framer-motion";
import { ReactNode } from "react";
import ThemeProvider, { ThemeName } from "../ThemeProvider";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  theme?: ThemeName;
}

export function PageWrapper({ children, className = "", theme }: PageWrapperProps) {
  const content = (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 ${className}`}
    >
      {children}
    </motion.main>
  );

  if (theme) {
    return <ThemeProvider theme={theme}>{content}</ThemeProvider>;
  }

  return content;
}
