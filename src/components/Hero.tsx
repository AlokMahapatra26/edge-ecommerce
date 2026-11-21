import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Hero: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white">
      {/* Cinematic Full-Bleed Editorial Split / Overlay */}
      <div className="relative min-h-[82vh] flex items-center justify-center">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=85"
            alt="Editorial Collection"
            className="w-full h-full object-cover object-center brightness-[0.45] contrast-105 scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          {/* Subtle Season Tag */}
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-neutral-300 mb-6 border-b border-white/20 pb-2">
            Spring / Summer 2026 Collection
          </p>

          {/* Luxury Editorial Headline */}
          <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-white leading-[1.05] max-w-4xl drop-shadow-md">
            Quiet Luxury. <br />
            <span className="italic font-normal">Uncompromising Form.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto font-light tracking-wide leading-relaxed">
            Architectural silhouettes crafted from bespoke Japanese textiles, French terry, and surgical grade alloys. Designed to outlast trends.
          </p>

          {/* Luxury CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95"
            >
              <span>Shop The Drop</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 border border-white/40 text-white font-semibold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              View Lookbook
            </button>
          </div>
        </div>

        {/* Bottom Floating Stats / Badges */}
        <div className="absolute bottom-6 left-0 right-0 z-10 hidden md:flex justify-between items-center max-w-7xl mx-auto px-8 text-neutral-400 text-[11px] tracking-widest uppercase">
          <span>01 / Handcrafted Limited Batches</span>
          <span>Complimentary Express Shipping Over $150</span>
          <span>02 / Tokyo • London • New York</span>
        </div>
      </div>
    </section>
  );
};
