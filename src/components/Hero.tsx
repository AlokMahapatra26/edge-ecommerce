import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { IndustryTheme } from '../types/theme';

interface HeroProps {
  theme: IndustryTheme;
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ theme, onExplore }) => {
  return (
    <section className={`relative w-full overflow-hidden ${theme.bgHeroClass} transition-colors duration-500`}>
      {/* Visual Blueprint Hero Frame */}
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
        <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-current opacity-30" />
        <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-current opacity-30" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-current opacity-30" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-current opacity-30" />

        {/* Hero Copy */}
        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Industry Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-current/20 text-xs font-semibold tracking-[0.2em] uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{theme.badge}</span>
          </div>

          {/* Dynamic Headline */}
          <h1 className={`${theme.fontClass} text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight leading-[1.08] drop-shadow-sm`}>
            {theme.headlineMain} <br />
            <span className="italic font-normal opacity-90">{theme.headlineItalic}</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-base opacity-80 max-w-xl mx-auto font-light tracking-wide leading-relaxed">
            {theme.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onExplore}
              className={`w-full sm:w-auto px-8 py-4 ${theme.accentClass} text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95`}
            >
              <span>{theme.ctaText}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 border border-current/30 hover:bg-current/10 font-semibold text-xs uppercase tracking-[0.2em] transition-all"
            >
              {theme.secondaryCta}
            </button>
          </div>
        </div>

        {/* Blueprint Placeholder Dimension Label */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center text-[10px] tracking-widest uppercase opacity-40 font-mono">
          [ Hero Showcase Wireframe • 1920 × 1080 Aspect ]
        </div>
      </div>
    </section>
  );
};
