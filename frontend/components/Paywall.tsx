import { useAuth } from "@/lib/auth";
import { Lock } from "lucide-react";
import Link from "next/link";
import { GradientButton } from "./ui/premium/GradientButton";

interface PaywallProps {
  children: React.ReactNode;
  featureName: string;
}

export function Paywall({ children, featureName }: PaywallProps) {
  const { user } = useAuth();
  
  if (!user || user.subscription_tier === 'free') {
    return (
      <div className="relative rounded-3xl overflow-hidden">
        <div className="blur-[8px] opacity-40 pointer-events-none select-none">
          {children}
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0F19]/60 backdrop-blur-[2px] z-10 p-6 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full shadow-lg flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">🔒 Pro Feature</h3>
          <p className="text-[var(--text-secondary)] font-medium mb-6 max-w-sm">
            Upgrade to Pro to unlock {featureName} and take full control of your finances.
          </p>
          <Link href="/pricing">
            <GradientButton variant="primary" gradient="blue" className="!px-8 !py-3 shadow-xl shadow-[var(--theme-accent)]/20">
              Upgrade to Pro →
            </GradientButton>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
