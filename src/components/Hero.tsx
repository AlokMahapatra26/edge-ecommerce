import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export const Hero: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/40 via-background to-background py-16 sm:py-24 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Collection Drop Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary text-foreground text-xs font-bold uppercase tracking-wider mb-6 border border-border shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>New Season Drop • 2026 Collection</span>
        </div>

        {/* E-Commerce Retail Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
          Refined Essentials. <br />
          <span className="bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-400 bg-clip-text text-transparent">
            Crafted for Daily Living.
          </span>
        </h1>

        {/* E-Commerce Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
          Thoughtfully engineered footwear, apparel, and everyday accessories made from sustainable, premium materials. Designed for timeless form and utility.
        </p>

        {/* CTA Button */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onExplore}
            className="px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Real Customer Trust Badges */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-border/40 text-left">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">Free Shipping</p>
              <p className="text-[11px] text-muted-foreground">On all orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">30-Day Returns</p>
              <p className="text-[11px] text-muted-foreground">Hassle-free exchange</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">Premium Quality</p>
              <p className="text-[11px] text-muted-foreground">Ethically crafted goods</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">Secure Checkout</p>
              <p className="text-[11px] text-muted-foreground">256-bit SSL encryption</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
