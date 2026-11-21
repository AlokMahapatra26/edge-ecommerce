import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Hero: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white">
      <div className="relative min-h-[75vh] flex items-center justify-center px-6 py-20">
        {/* Subtle Architectural Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Blueprint Framing Corner Markers */}
        <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-white/20" />
        <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-white/20" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-white/20" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-white/20" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-6 border-b border-white/10 pb-2">
            Spring / Summer 2026 Collection
          </p>

          <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-white leading-[1.08]">
            Quiet Luxury. <br />
            <span className="italic font-normal opacity-90">Uncompromising Form.</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto font-light tracking-wide leading-relaxed">
            Architectural silhouettes crafted from bespoke Japanese textiles, French terry, and surgical grade alloys. Designed to outlast trends.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95"
            >
              <span>Shop Collection</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 border border-white/30 text-white font-semibold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
            >
              View Lookbook
            </button>
          </div>
        </div>

        {/* Blueprint Placeholder Dimension Label */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center text-[10px] tracking-widest uppercase opacity-40 font-mono text-neutral-400">
          [ Hero Showcase Wireframe • 1920 × 1080 Aspect ]
        </div>
      </div>
    </section>
  );
};
