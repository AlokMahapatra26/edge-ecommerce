import React from 'react';
import { Zap, Shield, Sparkles, Globe } from 'lucide-react';

export const Hero: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 via-background to-background py-16 sm:py-24 border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Edge Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-6 border border-border/80 shadow-sm animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Next-Gen Edge Commerce • Powered by Cloudflare</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
          Engineered for Speed. <br />
          <span className="bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-400 bg-clip-text text-transparent">
            Crafted for the Minimalist.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
          Zero latency global storefront running 100% on Cloudflare Workers, D1 database, and R2 object storage. Ultra-fast checkout with Stripe.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onExplore}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            Explore The Drop
          </button>
        </div>

        {/* Value Prop Badges */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-border/40 text-left">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-foreground">&lt;50ms Edge Latency</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-xs font-semibold text-foreground">Stripe Verified Pay</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="text-xs font-semibold text-foreground">300+ Edge Nodes</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-foreground">$0 Monthly Hosting</span>
          </div>
        </div>
      </div>
    </section>
  );
};
